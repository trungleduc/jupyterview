import {
  Action,
  ActionType,
  ReduxStateInterface,
  Dict
} from "./types";

import * as Types from "./types";

/**
 * Reset store to initial state
 */
export function resetStore(): ActionType {
  return { type: Action.RESET_STORE };
}

/**
 *
 *
 * Send save state signal to all component
 * @returns {ActionType}
 */
export function saveState(name: string): ActionType {
  return { type: Action.SAVE_STATE, name };
}

/**
 *
 *
 * Action to update saveSignal of state
 * @param {StateInterface} state
 */
export function saveState_(state: ReduxStateInterface) {
  let newState: ReduxStateInterface = { ...state};
  return newState;
}


/**
 *Action to update pipeline
 *
 * @export
 * @param {{ [key: string]: any }} data
 * @returns {ActionType}
 */
export function updatePipeline(data: Array<Dict>): ActionType {
  return {type : Action.UPDATE_PIPELINE, data}
}


/**
 * Update pipeline data of state, this function is called when
 * `updatePipeline` is dispatched.
 *
 * @export
 * @param {StateInterface} state
 * @param {Types.UpdatePipeline} action
 * @returns {StateInterface}
 */
export function _updatePipeline(state: ReduxStateInterface, action: Types.UpdatePipeline): ReduxStateInterface {
  const newState: ReduxStateInterface = {...state, pipelines : action.data }
  return { ...newState }  
}
