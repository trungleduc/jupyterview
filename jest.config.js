module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(vtk.js|itk|@jupyter-widgets)/)"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleNameMapper: {
    // "^react-dnd-html5-backend$": "react-dnd-html5-backend/dist/cjs",
    // "^react-dnd-touch-backend$": "react-dnd-touch-backend/dist/cjs",
    // "^react-dnd-test-backend$": "react-dnd-test-backend/dist/cjs",
    // "^react-dnd-test-utils$": "react-dnd-test-utils/dist/cjs",
    // "^react-dnd$": "react-dnd/dist/ReactDnD.js",

    "\\.(css|less|sass|scss)$": "<rootDir>/src/tests/style_mock.js",
    "\\.(gif|ttf|eot|svg|glsl)$": "<rootDir>/src/tests/file_mock.js"
  },
  setupFiles: ["<rootDir>/src/tests/test_env.ts"],
  verbose : true
};
