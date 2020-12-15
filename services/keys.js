const puppeteer = require("puppeteer");
const db = require("../config/database-setup");

async function fetchKey(source, type) {
  const query = {
    text: `SELECT *
               FROM keys
               WHERE source=$1 AND type=$2`,
    values: [source, type]
  };
  const res = await db.query(query);

  const {
    rows: [result]
  } = res;

  return result && result.key;
}

async function storeKey(source, type, newKey) {
  const query = {
    text: `INSERT INTO keys(source, type, key, last_updated)
           VALUES($1, $2, $3, now())
           ON CONFLICT (source, type) DO UPDATE
              SET key=$3,
                  last_updated=now();`,
    values: [source, type, newKey]
  };

  const result = await db.query(query);

  return result;
}

function setSoundcloudClientId(clientId) {
  module.exports.soundcloudClientId = clientId;
}

async function fetchNewSoundcloudClientId() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  let newClientId;

  function requestListener(req) {
    const requestUrl = req.url();

    if (requestUrl.includes("client_id")) {
      const newKey = requestUrl
        .match(/(client_id=([0-9A-Za-z])+&)/g)[0]
        .slice(10, -1);

      newClientId = newKey;
      page.removeListener("request", requestListener);
    }

    req.continue();
  }

  page.on("request", requestListener);

  page.on("error", err => {
    console.log("error at: ", err);
  });

  page.on("pageerror", pageerr => {
    console.log("pageerror at: ", pageerr);
  });

  try {
    await page.goto("https://soundcloud.com/");
  } catch (e) {
    console.log("Caught page error: ", e);
  } finally {
    await browser.close();
  }

  return newClientId;
}

(async () => {
  const soundcloudClientId = await fetchKey("soundcloud", "client_id");

  setSoundcloudClientId(soundcloudClientId);
})();

module.exports = {
  async refreshSoundcloudClientId() {
    const newClientId = await fetchNewSoundcloudClientId();

    storeKey("soundcloud", "client_id", newClientId);

    module.exports.soundcloudClientId = newClientId;
  }
};
