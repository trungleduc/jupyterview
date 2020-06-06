// Copyright (c) Trung Le
// Distributed under the terms of the Modified BSD License.

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
  const pipelinesList :Array<string> = state.pipelines.map(val => val.name)
  const newPipelines = [...state.pipelines]
  action.data.forEach(element => {
    if (pipelinesList.includes(element.name)) {
      let count = 0
      pipelinesList.forEach(name => {
        if (name.includes(element.name)) {
          ++count
        }
      })
      newPipelines.push({...element, name : element.name + `(${count})`})
    } else {
      newPipelines.push(element)
    }
  })
  
  const newState: ReduxStateInterface = {...state, pipelines : newPipelines }
  return { ...newState }  
}


/**
 * Action to add selected data to store, this key is observed in
 * vtkwidget in order to plot the corresponding vtk file
 *
 * @export
 * @param {Dict} data
 * @returns {ActionType}
 */
export function addSelectedData(data: Dict): ActionType {
  return {type: Action.ADD_SELECTED_DATA, data}
}

/**
 *  This function is called when `addSelectedData` is dispatched
 *
 * @export
 * @param {ReduxStateInterface} state
 * @param {Types.UpdatePipeline} action
 * @returns {ReduxStateInterface}
 */
export function _addSelectedData(state: ReduxStateInterface, action: Types.AddSelectedData): ReduxStateInterface {
  const newData = [...state.selectedData, action.data]
  const newState: ReduxStateInterface = {...state, selectedData : newData }
  return { ...newState }  
}