/**
 * Interface of redux store
 */
export interface StateInterface {
  /** State of activated panel */
  mainState: string;
}

export enum Action {
  SAVE_STATE = "SAVE_STATE",
  RESET_STORE = "RESET_STORE",
}

export interface SaveState {
  type: Action.SAVE_STATE;
  name : string
}
export interface ResetStore {
  type: Action.RESET_STORE;
}


export type ActionType =
  | ResetStore
  | SaveState;
