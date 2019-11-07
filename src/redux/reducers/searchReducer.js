import { SEARCH, ADD_TO_SEARCH_HISTORY } from "../actions/types";

const initialState = {
  query: "",
  results: [],
  history: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
