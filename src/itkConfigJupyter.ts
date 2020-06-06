// Copyright (c) InsightSoftwareConsortium
// Distributed under the terms of the Apache License 2.0.
import { PageConfig } from "./tools/getOption";
let basePath = PageConfig.getOption("baseUrl");
if (!basePath) {
  basePath = "/"
}
let _public_path__ = basePath + "nbextensions/jupyterview/";
const itkConfig = {
  itkModulesPath: _public_path__ + "itk",
};

module.exports = itkConfig;
