import {Pipelines} from "../../vtk_components/pipelines";
import { mount, shallow, render, ShallowWrapper } from "enzyme";

import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"
describe("Test Pipelines component", () => {
  let component: ShallowWrapper
  beforeAll(() => {
    const  model = new MockModel()
    component = shallow(<Pipelines send_msg = {mock_send_msg} model = {model as any} pipelines ={[]} />);
  })

  it("should render correctly with mock props", () => {
    expect(component).toMatchSnapshot();
  });

  it("should have correct initial state", () => {

    expect(component.state("nodes")).toEqual([])
    expect(component.state("pipelines")).toEqual([])
  });

});
