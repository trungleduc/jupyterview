import Main from "../../vtk_components/main";
import { mount, shallow, render } from "enzyme";
import React from "react";
import {mock_send_msg, MockModel} from "../../test_setup/utils"
import { VtkModel } from "../../widget";
describe("Test Main component", () => {
  it("should render correctly with no props", () => {
    const  model = new MockModel()
    const component = shallow(<Main send_msg = {mock_send_msg} model = {model as any} />);
    expect(component).toMatchSnapshot();
  });
});
