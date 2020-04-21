import {
  Action,
  ActionType,
  StateInterface,
} from "./types";

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
export function saveState_(state: StateInterface) {
  let newState: StateInterface = { ...state};
  return newState;
}

