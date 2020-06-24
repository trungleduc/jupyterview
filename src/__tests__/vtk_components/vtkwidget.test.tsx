import {VtkWidget} from "../../vtk_components/vtkwidget";
import { mount, shallow, render, ShallowWrapper } from "enzyme";

import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"
describe("Test VtkWidget component", () => {
  let component: ShallowWrapper
  beforeAll(() => {
    const model = new MockModel()
      component = shallow(<VtkWidget inputOpenFileRef={null} send_msg = {mock_send_msg} model = {model as any} updateProgress = {jest.fn()} updatePipeline = {jest.fn()} pipelineList = {[]} />);
  })

  it("should render correctly with mock props", () => {
    expect(component).toMatchSnapshot();
  });

  it("should have correct initial state", () => {
    expect(component.state("colorOption")).toEqual([])
    expect(component.state("fileList")).toEqual([])
    expect(component.state("dataRangeOption")).toEqual({})
    expect(component.state("selectedFile")).toEqual("")
  });

});
