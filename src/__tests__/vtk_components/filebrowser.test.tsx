import RemoteFileBrowser from "../../vtk_components/filebrowser";
import { mount, shallow, render, ShallowWrapper } from "enzyme";

import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"

describe("Test RemoteFileBrowser component", () => {
  let component: ShallowWrapper
  let model : MockModel
  beforeAll(() => {
    model = new MockModel()
    model.set("root_data", [])
    component = shallow(<RemoteFileBrowser send_msg = {mock_send_msg} model = {model as any} browserRef = {null} />);
  })

  it("should render correctly with mock props", () => {
    expect(component).toMatchSnapshot();
  });

  it("should have correct initial state", () => {  
    expect(component.state("files")).toEqual([])
  });

});
