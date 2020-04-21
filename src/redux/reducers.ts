import { Action, ActionType, StateInterface } from "./types";
import * as ActionFunc from "./actions";

export const initialState: StateInterface = {
  mainState: "",
};

export function rootReducer (
  state: StateInterface = initialState,
  action: ActionType
): StateInterface {
  switch (action.type) {
    case Action.RESET_STORE: {
      return initialState;
    }

    case Action.SAVE_STATE: {
      return ActionFunc.saveState_(state);
    }
    default:
      return state;
  }
}
