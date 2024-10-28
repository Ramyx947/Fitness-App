import globals from "globals"; 
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    ignores: [
      "coverage/**"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { js: pluginJs, react: pluginReact },
    rules: {
      "no-unused-vars": "error", // Catch unused variables
    },
  },
  // Node.js environment
  {
    files: ["**/models/**/*.js", "**/routes/**/*.js", "**/server.js"],
    languageOptions: { globals: globals.node },
  },
  // Jest test files environment 
  {
    files: ["**/__tests__/**/*.js"],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  // Cypress test files
  {
    files: ["**/cypress/**/*.js"],
    languageOptions: { globals: { ...globals.cypress, ...globals.node } },
  },
];