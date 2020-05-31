import * as jQuery from "jquery";
import React from "react";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
declare var window: any;
declare var global: any;
window.$ = window.jQuery = jQuery;
global.$ = global.jQuery = jQuery;
jest.mock(
  "jquery-ui/ui/widgets/slider.js",
  () => "jquery-ui/ui/widgets/slider.js"
);
// jest.mock("@jupyterlab/apputils", () => "@jupyterlab/apputils");
React.useLayoutEffect = React.useEffect;
configure({ adapter: new Adapter() });

require('jest-fetch-mock').enableMocks()