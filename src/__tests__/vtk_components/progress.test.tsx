import ProgressNotification from "../../vtk_components/progress";
import { mount, shallow, render, ShallowWrapper } from "enzyme";

import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"
describe("Test ProgressNotification component", () => {
  let component: ShallowWrapper
  beforeAll(() => {
    const  model = new MockModel()
    component = shallow(<ProgressNotification open = {true} value = {0} />);
  })

  it("should render correctly with mock props", () => {
    expect(component).toMatchSnapshot();
  });

  it("should have correct initial state", () => {
    expect(component.state("autoFocus")).toEqual(false)
    expect(component.state("canEscapeKeyClear")).toEqual(true)
    expect(component.state("position")).toEqual("top-right")
  });

});
