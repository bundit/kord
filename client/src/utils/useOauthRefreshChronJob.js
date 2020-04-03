import { useEffect } from "react";

export const useOauthRefreshChronJob = function(source, setter, ms) {
  useEffect(() => {
    let timer;
    const makeRequest = function() {
      fetch(`/auth/${source}/refresh`)
        .then(res => res.json())
        .then(obj => {
          setter(obj.accessToken);
        });
      timer = setTimeout(makeRequest, ms);
    };
    makeRequest();
    return () => clearTimeout(timer);
  }, []);
};
