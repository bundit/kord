import {
  SEARCH,
  LOAD_MORE_RESULTS,
  SET_SEARCH_QUERY,
  SET_NEXT_HREF,
  ADD_TO_SEARCH_HISTORY
} from "../actions/types";

const initialState = {
  query: "",
  results: [],
  history: [],
  nextHref: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH: {
      return {
        ...state,
        results: action.payload
      };
    }
    case LOAD_MORE_RESULTS: {
      return {
        ...state,
        results: [...state.results, ...action.payload]
      };
    }
    case SET_SEARCH_QUERY: {
      return {
        ...state,
        query: action.query
      };
    }
    case SET_NEXT_HREF: {
      return {
        ...state,
        nextHref: action.payload
      };
    }
    case ADD_TO_SEARCH_HISTORY: {
      return {
        ...state,
        history: [action.payload, ...state.history]
      };
    }
    default:
      return state;
  }
}
