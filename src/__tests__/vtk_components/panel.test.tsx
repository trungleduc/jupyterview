import LeftPanel from "../../vtk_components/panel";
import { mount, shallow, render, ShallowWrapper } from "enzyme";

import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"
describe("Test LeftPanel component", () => {
  let component: ShallowWrapper
  beforeAll(() => {
    const  model = new MockModel()
    component = shallow(<LeftPanel selectedId = {0} />);
  })

  it("should render correctly with mock props", () => {
    expect(component).toMatchSnapshot();
  });

  it("should have correct initial state", () => {
    expect(component.state("activePanelOnly")).toEqual(false)
    expect(component.state("animate")).toEqual(true)
    expect(component.state("navbarTabId")).toEqual("Home")
    expect(component.state("vertical")).toEqual(false)
    expect(component.state("selectedId")).toEqual("rx")
  });

});
