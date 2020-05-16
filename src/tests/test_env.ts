import * as jQuery from 'jquery';
declare var window: any;
declare var global: any;
window.$ = window.jQuery = jQuery;
global.$ = global.jQuery = jQuery;
jest.mock("jquery-ui/ui/widgets/slider.js", () => 'jquery-ui/ui/widgets/slider.js')
jest.mock("@jupyterlab/apputils", () => '@jupyterlab/apputils')
import React from "react" 
React.useLayoutEffect = React.useEffect 