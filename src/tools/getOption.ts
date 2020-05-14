// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import minimist from "minimist";

export namespace PageConfig {
  export function getOption(name: string): string {
    if (configData) {
      return configData[name];
    }
    configData = Object.create(null);
    let found = false;

    // Use script tag if available.
    if (typeof document !== "undefined" && document) {
      const el = document.getElementById("jupyter-config-data");

      if (el) {
        configData = JSON.parse(el.textContent || "") as {
          [key: string]: string;
        };
        found = true;
      }
    }
    // Otherwise use CLI if given.
    if (!found && typeof process !== "undefined") {
      try {
        const cli = minimist(process.argv.slice(2));
        const path: any = require("path");
        let fullPath = "";
        if ("jupyter-config-data" in cli) {
          fullPath = path.resolve(cli["jupyter-config-data"]);
        } else if ("JUPYTER_CONFIG_DATA" in process.env) {
          fullPath = path.resolve(process.env["JUPYTER_CONFIG_DATA"]);
        }
        if (fullPath) {
          configData = eval("require")(fullPath) as { [key: string]: string };
        }
      } catch (e) {
        console.error(e);
      }
    }

    for (const key in configData) {
      // PageConfig expects strings
      if (typeof configData[key] !== "string") {
        configData[key] = JSON.stringify(configData[key]);
      }
    }
    return configData![name];
  }

  let configData: { [key: string]: string } | null = null;
}
