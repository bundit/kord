import puppeteer = require("puppeteer");
import db = require("../config/database-setup");
import { Source } from "../types/common/kord";
import { KeyDao } from "../types/models";

async function fetchKey(source: Source, type: KeyDao["type"]) {
  const query = {
    text: `SELECT *
               FROM keys
               WHERE source=$1 AND type=$2`,
    values: [source, type],
  };

  try {
    const res = await db.query<KeyDao>(query);
    const {
      rows: [result],
    } = res;
    return result && result.key;
  } catch (e) {
    console.error(e);

    return;
  }
}

async function storeKey(source: Source, type: KeyDao["type"], newKey: string) {
  const query = {
    text: `INSERT INTO keys(source, type, key, last_updated)
           VALUES($1, $2, $3, now())
           ON CONFLICT (source, type) DO UPDATE
              SET key=$3,
                  last_updated=now();`,
    values: [source, type, newKey],
  };

  const result = await db.query(query);

  return result;
}

function setSoundcloudClientId(clientId: string) {
  module.exports.soundcloudClientId = clientId;
}

async function fetchNewSoundcloudClientId(): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  let newClientId = "";

  function requestListener(req: puppeteer.HTTPRequest) {
    const requestUrl = req.url();

    const soundcloudApiV2Regex = /api-v2.soundcloud.com\/.*client_id.*/;
    if (soundcloudApiV2Regex.test(requestUrl)) {
      const match = requestUrl.match(/(client_id=([0-9A-Za-z])+)/g);

      if (match) {
        const newKey = match[0].slice(10);

        newClientId = newKey;
        page.off("request", requestListener);
        browser.close();
      }
    }

    req.continue();
  }

  page.on("request", requestListener);

  page.on("error", (err) => {
    console.error("error at: ", err);
  });

  page.on("pageerror", (pageerr) => {
    console.error("pageerror at: ", pageerr);
  });

  try {
    await page.goto("https://soundcloud.com/discover", {
      waitUntil: "networkidle0",
    });
  } catch (e) {
    // We will expect a navigation error since we will early abort once key is found
    console.error("Caught page error: ", e);
  } finally {
    await browser.close();
  }

  return newClientId;
}

(async () => {
  const soundcloudClientId = await fetchKey("soundcloud", "client_id");

  if (soundcloudClientId) {
    setSoundcloudClientId(soundcloudClientId);
  }
})();

export = {
  async refreshSoundcloudClientId() {
    const newClientId = await fetchNewSoundcloudClientId();

    storeKey("soundcloud", "client_id", newClientId);

    module.exports.soundcloudClientId = newClientId;
  },
};
