import store from "../store";

export function setQuery(query) {
  return {
    type: "SET_QUERY",
    payload: query
  };
}

export const searchMusic = query => dispatch => {
  const user = store.getState().user;
  // TODO query music here
};
