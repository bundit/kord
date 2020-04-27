export const loadCachedValue = key => {
  try {
    const serializedCache = sessionStorage.getItem(key);

    if (serializedCache === null || serializedCache === "null") {
      return undefined;
    }

    return JSON.parse(serializedCache);
  } catch (err) {
    return undefined;
  }
};

export const cacheValue = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (err) {
    console.err(err);
  }
};
