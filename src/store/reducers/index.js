import { combineReducers } from "redux";

//reducers
import scoreReducer from "./ScoreReducer";
import targetBucketReducer from "./TargetBucketReducer";

export default   combineReducers({
  scoreReducer: scoreReducer,
  targetBucketReducer: targetBucketReducer
});