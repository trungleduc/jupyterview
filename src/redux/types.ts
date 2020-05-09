export interface Dict {
  [key:string]:  any
}

/**
 * Interface of redux store
 */
export interface ReduxStateInterface {
  /** State of activated panel */
  mainState: string;
  pipelines: Array<Dict>
  selectedData : Array<Dict>
}

export enum Action {
  SAVE_STATE = "SAVE_STATE",
  RESET_STORE = "RESET_STORE",
  UPDATE_PIPELINE = "UPDATE_PIPELINE",
  ADD_SELECTED_DATA = "ADD_SELECTED_DATA",
  REMOVE_SELECTED_DATA = "REMOVE_SELECTED_DATA"
}

export interface SaveState {
  type: Action.SAVE_STATE;
  name : string
}
export interface ResetStore {
  type: Action.RESET_STORE;
}

export interface UpdatePipeline {
  type: Action.UPDATE_PIPELINE;
  data: Array<Dict>
}

export interface AddSelectedData{
  type: Action.ADD_SELECTED_DATA
  data: Dict
}

export interface RemoveSelectedData{
  type: Action.ADD_SELECTED_DATA
  data: Dict
}

export type ActionType =
  | ResetStore
  | UpdatePipeline
  | AddSelectedData
  | RemoveSelectedData
  | SaveState;
