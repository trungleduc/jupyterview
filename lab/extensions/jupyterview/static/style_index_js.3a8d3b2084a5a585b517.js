"use strict";
(self["webpackChunkjupyterview"] = self["webpackChunkjupyterview"] || []).push([["style_index_js"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./style/base.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/base.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.jpview-Spinner {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  outline: none;
  background: #00000075;
}

.jpview-SpinnerContent {
  border: solid #27b9f39e;
  margin: 50px auto;
  text-indent: -9999em;
  width: 6em;
  height: 6em;
  border-radius: 50%;
  position: relative;
  animation: load3 1s infinite linear, fadeIn 1s;
}

.jpview-SpinnerContent:before {
  width: 50%;
  height: 50%;
  background: #f3762605;
  border-radius: 100% 0 100% 0;
  box-shadow: inset 6px 5px 0 1px #27b9f3;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
}

.jpview-SpinnerContent:after {
  width: 75%;
  height: 75%;
  border-radius: 50%;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.jpview-view-toolbar {
  position: absolute;
  z-index: 1;
  left: 10px;
  top: 10px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: row;
}
.jpview-button {
  border: none;
  background-color: var(--jp-layout-color2);
  color: var(--jp-content-font-color1);
  min-width: 60px;
}
.jpview-button:hover {
  background-color: var(--jp-layout-color3);
}
.jpview-toolbar-button {
  background: none;
  color: rgb(187, 187, 187);
  border-radius: var(--jp-border-radius);
  font-size: var(--jp-ui-font-size1);
  display: inline-flex;
  flex-direction: row;
  border: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  text-align: left;
  vertical-align: middle;
  min-height: 24px;
  min-width: 12px;
  font-size: 12px;
  padding: 0 4px;
}

.jpview-toolbar-button.dark:hover {
  background-color: #424242;
}

.jpview-toolbar-button:active {
  border: none;
  box-shadow: none;
  background-color: var(--jp-warn-color-active, rgba(153, 153, 153, 0.2));
}
.jpview-control-panel-title {
  border-bottom: solid var(--jp-border-width) var(--jp-border-color1);
  box-shadow: var(--jp-toolbar-box-shadow);
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 24px;
  height: var(--jp-debugger-header-height);
  background-color: var(--jp-layout-color2);
}

.jpview-control-panel-title h2 {
  text-transform: uppercase;
  font-weight: 600;
  font-size: var(--jp-ui-font-size0);
  color: var(--jp-ui-font-color1);
  padding-left: 8px;
  padding-right: 4px;
}

.jpview-control-panel {
  color: var(--jp-ui-font-color1);
  background: var(--jp-layout-color1);
  height: 100%;
}
.jpview-control-panel * {
  font-family: var(--jp-ui-font-family);
}

.jpview-control-panel-component {
  font-size: var(--jp-ui-font-size1);
}
.jpview-control-panel .MuiAccordion-root.Mui-expanded {
  margin: 0px 0px !important;
}
.jpview-control-panel .MuiAccordionSummary-contentGutters {
  margin: 10px 0 !important;
}
.jpview-control-panel .Mui-expanded .MuiAccordionSummary-gutters {
  min-height: 38px !important;
}
.jpview-control-panel .MuiAccordionSummary-root.MuiAccordionSummary-gutters {
  min-height: 38px !important;
}

.jpview-control-panel
  .MuiAccordionSummary-content.MuiAccordionSummary-contentGutters
  > span {
  text-transform: uppercase;
}

.jpview-input-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--jp-layout-color1);
  margin: 3px;
  font-size: var(--jp-ui-font-size1);
}

.jpview-input {
  background: transparent;
  color: var(--jp-ui-font-color0);
  background: var(--jp-input-background);
  outline: none;
  font-size: var(--jp-ui-font-size1);
  border: var(--jp-border-width) solid var(--jp-border-color0);
  width: 95%;
}

.jpview-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: var(--jp-layout-color3);
  outline: none;
}

.jpview-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--jp-ui-font-color2);
  cursor: pointer;
}

.jpview-slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--jp-ui-font-color2);
  cursor: pointer;
}

.jpcad-camera-client {
  width: 15px;
  height: 15px;
  position: absolute;
  z-index: 10;
  background-color: var(--jp-private-notebook-active-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
`, "",{"version":3,"sources":["webpack://./style/base.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,WAAW;EACX,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,aAAa;EACb,qBAAqB;AACvB;;AAEA;EACE,uBAAuB;EACvB,iBAAiB;EACjB,oBAAoB;EACpB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,kBAAkB;EAClB,8CAA8C;AAChD;;AAEA;EACE,UAAU;EACV,WAAW;EACX,qBAAqB;EACrB,4BAA4B;EAC5B,uCAAuC;EACvC,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,WAAW;AACb;;AAEA;EACE,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,MAAM;EACN,OAAO;EACP,SAAS;EACT,QAAQ;AACV;;AAEA;EACE,kBAAkB;EAClB,UAAU;EACV,UAAU;EACV,SAAS;EACT,oCAAoC;EACpC,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,yCAAyC;EACzC,oCAAoC;EACpC,eAAe;AACjB;AACA;EACE,yCAAyC;AAC3C;AACA;EACE,gBAAgB;EAChB,yBAAyB;EACzB,sCAAsC;EACtC,kCAAkC;EAClC,oBAAoB;EACpB,mBAAmB;EACnB,YAAY;EACZ,eAAe;EACf,mBAAmB;EACnB,uBAAuB;EACvB,gBAAgB;EAChB,sBAAsB;EACtB,gBAAgB;EAChB,eAAe;EACf,eAAe;EACf,cAAc;AAChB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,YAAY;EACZ,gBAAgB;EAChB,uEAAuE;AACzE;AACA;EACE,mEAAmE;EACnE,wCAAwC;EACxC,aAAa;EACb,mBAAmB;EACnB,mBAAmB;EACnB,gBAAgB;EAChB,wCAAwC;EACxC,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,gBAAgB;EAChB,kCAAkC;EAClC,+BAA+B;EAC/B,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,+BAA+B;EAC/B,mCAAmC;EACnC,YAAY;AACd;AACA;EACE,qCAAqC;AACvC;;AAEA;EACE,kCAAkC;AACpC;AACA;EACE,0BAA0B;AAC5B;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;AAC7B;;AAEA;;;EAGE,yBAAyB;AAC3B;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,8BAA8B;EAC9B,yCAAyC;EACzC,WAAW;EACX,kCAAkC;AACpC;;AAEA;EACE,uBAAuB;EACvB,+BAA+B;EAC/B,sCAAsC;EACtC,aAAa;EACb,kCAAkC;EAClC,4DAA4D;EAC5D,UAAU;AACZ;;AAEA;EACE,wBAAwB;EACxB,gBAAgB;EAChB,WAAW;EACX,WAAW;EACX,kBAAkB;EAClB,mCAAmC;EACnC,aAAa;AACf;;AAEA;EACE,wBAAwB;EACxB,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,oCAAoC;EACpC,eAAe;AACjB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,oCAAoC;EACpC,eAAe;AACjB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,WAAW;EACX,yDAAyD;EACzD,kBAAkB;EAClB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;AACrB","sourcesContent":[".jpview-Spinner {\n  position: absolute;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 10;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  outline: none;\n  background: #00000075;\n}\n\n.jpview-SpinnerContent {\n  border: solid #27b9f39e;\n  margin: 50px auto;\n  text-indent: -9999em;\n  width: 6em;\n  height: 6em;\n  border-radius: 50%;\n  position: relative;\n  animation: load3 1s infinite linear, fadeIn 1s;\n}\n\n.jpview-SpinnerContent:before {\n  width: 50%;\n  height: 50%;\n  background: #f3762605;\n  border-radius: 100% 0 100% 0;\n  box-shadow: inset 6px 5px 0 1px #27b9f3;\n  position: absolute;\n  top: 0;\n  left: 0;\n  content: '';\n}\n\n.jpview-SpinnerContent:after {\n  width: 75%;\n  height: 75%;\n  border-radius: 50%;\n  content: '';\n  margin: auto;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.jpview-view-toolbar {\n  position: absolute;\n  z-index: 1;\n  left: 10px;\n  top: 10px;\n  background-color: rgba(0, 0, 0, 0.4);\n  display: flex;\n  flex-direction: row;\n}\n.jpview-button {\n  border: none;\n  background-color: var(--jp-layout-color2);\n  color: var(--jp-content-font-color1);\n  min-width: 60px;\n}\n.jpview-button:hover {\n  background-color: var(--jp-layout-color3);\n}\n.jpview-toolbar-button {\n  background: none;\n  color: rgb(187, 187, 187);\n  border-radius: var(--jp-border-radius);\n  font-size: var(--jp-ui-font-size1);\n  display: inline-flex;\n  flex-direction: row;\n  border: none;\n  cursor: pointer;\n  align-items: center;\n  justify-content: center;\n  text-align: left;\n  vertical-align: middle;\n  min-height: 24px;\n  min-width: 12px;\n  font-size: 12px;\n  padding: 0 4px;\n}\n\n.jpview-toolbar-button.dark:hover {\n  background-color: #424242;\n}\n\n.jpview-toolbar-button:active {\n  border: none;\n  box-shadow: none;\n  background-color: var(--jp-warn-color-active, rgba(153, 153, 153, 0.2));\n}\n.jpview-control-panel-title {\n  border-bottom: solid var(--jp-border-width) var(--jp-border-color1);\n  box-shadow: var(--jp-toolbar-box-shadow);\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  min-height: 24px;\n  height: var(--jp-debugger-header-height);\n  background-color: var(--jp-layout-color2);\n}\n\n.jpview-control-panel-title h2 {\n  text-transform: uppercase;\n  font-weight: 600;\n  font-size: var(--jp-ui-font-size0);\n  color: var(--jp-ui-font-color1);\n  padding-left: 8px;\n  padding-right: 4px;\n}\n\n.jpview-control-panel {\n  color: var(--jp-ui-font-color1);\n  background: var(--jp-layout-color1);\n  height: 100%;\n}\n.jpview-control-panel * {\n  font-family: var(--jp-ui-font-family);\n}\n\n.jpview-control-panel-component {\n  font-size: var(--jp-ui-font-size1);\n}\n.jpview-control-panel .MuiAccordion-root.Mui-expanded {\n  margin: 0px 0px !important;\n}\n.jpview-control-panel .MuiAccordionSummary-contentGutters {\n  margin: 10px 0 !important;\n}\n.jpview-control-panel .Mui-expanded .MuiAccordionSummary-gutters {\n  min-height: 38px !important;\n}\n.jpview-control-panel .MuiAccordionSummary-root.MuiAccordionSummary-gutters {\n  min-height: 38px !important;\n}\n\n.jpview-control-panel\n  .MuiAccordionSummary-content.MuiAccordionSummary-contentGutters\n  > span {\n  text-transform: uppercase;\n}\n\n.jpview-input-wrapper {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  background-color: var(--jp-layout-color1);\n  margin: 3px;\n  font-size: var(--jp-ui-font-size1);\n}\n\n.jpview-input {\n  background: transparent;\n  color: var(--jp-ui-font-color0);\n  background: var(--jp-input-background);\n  outline: none;\n  font-size: var(--jp-ui-font-size1);\n  border: var(--jp-border-width) solid var(--jp-border-color0);\n  width: 95%;\n}\n\n.jpview-slider {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 100%;\n  height: 5px;\n  border-radius: 5px;\n  background: var(--jp-layout-color3);\n  outline: none;\n}\n\n.jpview-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: var(--jp-ui-font-color2);\n  cursor: pointer;\n}\n\n.jpview-slider::-moz-range-thumb {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: var(--jp-ui-font-color2);\n  cursor: pointer;\n}\n\n.jpcad-camera-client {\n  width: 15px;\n  height: 15px;\n  position: absolute;\n  z-index: 10;\n  background-color: var(--jp-private-notebook-active-color);\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./style/base.css":
/*!************************!*\
  !*** ./style/base.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./base.css */ "./node_modules/css-loader/dist/cjs.js!./style/base.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_base_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./style/index.js":
/*!************************!*\
  !*** ./style/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.css */ "./style/base.css");



/***/ })

}]);
//# sourceMappingURL=style_index_js.3a8d3b2084a5a585b517.js.map