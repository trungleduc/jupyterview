import { Action, ActionType, ReduxStateInterface } from "./types";
import * as ActionFunc from "./actions";

export const initialState: ReduxStateInterface = {
  mainState: "",
  pipelines: [],
  selectedData: []
};

export function rootReducer(
  state: ReduxStateInterface = initialState,
  action: ActionType
): ReduxStateInterface {
  switch (action.type) {
    case Action.RESET_STORE: {
      return initialState;
    }

    case Action.SAVE_STATE: {
      return ActionFunc.saveState_(state);
    }
      
    case Action.UPDATE_PIPELINE: {
      return ActionFunc._updatePipeline(state, action)
    }
      
    case Action.ADD_SELECTED_DATA: {
      return ActionFunc._addSelectedData(state, action)
    }
    default:
      return state;
  }
}
