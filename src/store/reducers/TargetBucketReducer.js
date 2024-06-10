//types
import { UPDATE_TARGET_BUCKET } from "../actions/types";

const initialState = {
  targetBucket: 8,
};

const targetBucketReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TARGET_BUCKET:
      return {
        ...state,
        targetBucket: action.payload,
      };
    default:
      return state;
  }
};

export default targetBucketReducer;

