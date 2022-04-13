# GradeJS
GradeJS (currently in beta) allows you to analyze JavaScript bundles without having access to the source code of the website. GradeJS analyzes the content of the bundles and returns the list of the used packages with detailed packages' information. The tool can detect packages even in minified and tree-shaken bundles.

[//]: # (TODO: Add a gif later)


## How to use
Go to the [https://gradejs.com/](https://gradejs.com/) and enter a site in the `https://example.com` format. An analysis is performed server-side. Once the bundle is analyzed, the package name, version, size, and relative percentage size of the packages are returned.

## Supported bundlers
Right now supported versions of [Webpack](https://webpack.js.org/) are `3`, `4`, and `5`.

## Supported packages GradeJS can detect
TBD

## Local development of the public facing-site
1. `yarn install`
1. `yarn start`

## Contributing
We value your feedback, please use Discussions for questions and comments. If you encounter any suspicious behavior, false or missing results, please file a new issue. At this stage, we don't expect direct code contributions yet.
