/*
 * Copyright © 2026 Gavin William Sawyer. All rights reserved.
 */

const { configs: { all: allConfig, recommended: recommendedConfig } } = require("@eslint/js");
const { FlatCompat }                                                  = require("@eslint/eslintrc");

const angularEslintPlugin = require("@angular-eslint/eslint-plugin");
const nxEslintPlugin      = require("@nx/eslint-plugin");


const flatCompat = new FlatCompat(
  {
    baseDirectory: __dirname,
    recommendedConfig,
    allConfig,
  },
);

module.exports = [
  {
    ignores: [
      "dist",
      "gha-creds-*.json",
      "node_modules",
      "temp",
      "tmp",
      "**/*-debug.log",
      "**/.DS_Store",
      ".angular",
      ".firebase",
      ".idea/runConfigurations",
      ".idea",
      ".runtimeconfig.json",
      ".service-account.json",
    ],
  },
  {
    plugins: {
      "@angular-eslint": angularEslintPlugin,
      "@nx":             nxEslintPlugin,
    },
  },
  ...flatCompat.extends(
    "plugin:@angular-eslint/template/accessibility",
    "plugin:@angular-eslint/template/recommended",
    "plugin:@nx/angular-template",
  ).map(
    (config) => ({
      ...config,
      files: [ "**/*.html" ],
    }),
  ),
  ...flatCompat.extends(
    "plugin:@nx/angular",
    "plugin:@nx/typescript",
  ).map(
    (config) => ({
      ...config,
      files: [ "**/*.ts" ],
    }),
  ),
  {
    files: [ "**/*.ts" ],
    rules: {
      "@angular-eslint/no-input-rename":  [ "off" ],
      "@angular-eslint/no-output-rename": [ "off" ],
      "@nx/enforce-module-boundaries":    [
        "error",
        {
          allow:                         [],
          depConstraints:                [
            {
              onlyDependOnLibsWithTags: [ "*" ],
              sourceTag:                "*",
            },
          ],
          enforceBuildableLibDependency: true,
        },
      ],
    },
  },
  {
    files: [ "apps/**/src/app/components/lib/**/*.ts" ],
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        {
          prefix: "bowstring-app-",
          style:  "kebab-case",
          type:   "element",
        },
      ],
    },
  },
  {
    files: [ "apps/**/src/app/directives/lib/**/*.ts" ],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          prefix: "bowstringApp",
          style:  "camelCase",
          type:   "attribute",
        },
      ],
    },
  },
  {
    files: [ "apps/**/src/app/pipes/src/lib/**/*.ts" ],
    rules: {
      "@angular-eslint/pipe-prefix": [
        "error",
        { prefixes: [ "bowstringApp" ] },
      ],
    },
  },
  {
    files: [ "libs/components/src/lib/**/*.ts" ],
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        {
          prefix: "bowstring-",
          style:  "kebab-case",
          type:   "element",
        },
      ],
    },
  },
  {
    files: [ "libs/directives/src/lib/**/*.ts" ],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          prefix: "bowstring",
          style:  "camelCase",
          type:   "attribute",
        },
      ],
    },
  },
  {
    files: [ "libs/pipes/src/lib/**/*.ts" ],
    rules: {
      "@angular-eslint/pipe-prefix": [
        "error",
        { prefixes: [ "bowstring" ] },
      ],
    },
  },
];
