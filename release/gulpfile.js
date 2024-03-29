/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const path = require('path');

build.tslintCmd.enabled = false;

build.configureWebpack.mergeConfig({
   additionalConfiguration: (generatedConfiguration) => {
      if (!generatedConfiguration.resolve.allias) {
         generatedConfiguration.resolve.alias = {};
      }

      generatedConfiguration.resolve.alias['@src'] = path.resolve(__dirname, 'lib')

      return generatedConfiguration;
   }
});

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

/* TailwindCSS */
const postcss = require("gulp-postcss");
const atimport = require("postcss-import");
const tailwind = require("tailwindcss");

const tailwindcss = build.subTask(
   "tailwindcss",
   function (gulp, buildOptions, done) {
      gulp
         .src("assets/tailwind.css")
         .pipe(
            postcss([
               atimport(),
               tailwind("./tailwind.config.js"),
            ])
         )
         .pipe(gulp.dest("assets/dist"));
      done();
   }
);
build.rig.addPreBuildTask(tailwindcss);

// wnd TailwindCSS

/* Fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* End of fast-serve */

build.initialize(require('gulp'));
