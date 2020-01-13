export const loadState = () => {
  try {
    // Get the state
    const serializedState = localStorage.getItem("state");

    // If null, no persisted state exists
    if (serializedState === null || serializedState === "null") {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    // Make state into a json string
    const serializedState = JSON.stringify(state);
    // Set to localStorage with keyword "state"
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.err(err);
  }
};
