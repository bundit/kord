export function fetchGeneric(endpoint, opts) {
  return fetch(endpoint, { mode: "cors", ...opts }).then(res => {
    if (res.status < 200 || res.status >= 300) {
      return Promise.reject(res);
    }

    return res.json();
  });
}
