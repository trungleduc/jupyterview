import Main from "../../vtk_components/main";
import { mount, shallow, render, ShallowWrapper } from "enzyme";

import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"
import { VtkModel } from "../../widget";
describe("Test Main component", () => {
  let component: ShallowWrapper
  beforeAll(() => {
    const  model = new MockModel()
    component = shallow(<Main send_msg = {mock_send_msg} model = {model as any} />);
  })

  it("should render correctly with mock props", () => {
    expect(component).toMatchSnapshot();
  });

  it("should have correct initial state", () => {
    expect(component.state("isOpen")).toEqual(false)
    expect(component.state("openProgressBar")).toEqual(false)
    expect(component.state("progressValue")).toEqual(0)
    expect(component.state("leftPanelId")).toEqual(0)
  });

});
