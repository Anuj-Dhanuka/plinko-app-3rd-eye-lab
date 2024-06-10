//types
import { UPDATE_TARGET_BUCKET } from "./types";

export const updateTargetBucket = (randomNumber) => ({
    type: UPDATE_TARGET_BUCKET,
    payload: randomNumber,
  });
  