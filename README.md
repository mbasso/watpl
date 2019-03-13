# watpl

[![Build Status](https://travis-ci.org/mbasso/watpl.svg?branch=master)](https://travis-ci.org/mbasso/watpl)
[![npm version](https://img.shields.io/npm/v/watpl.svg)](https://www.npmjs.com/package/watpl)
[![npm downloads](https://img.shields.io/npm/dm/watpl.svg?maxAge=2592000)](https://www.npmjs.com/package/watpl)
[![Coverage Status](https://coveralls.io/repos/github/mbasso/watpl/badge.svg?branch=master)](https://coveralls.io/github/mbasso/watpl?branch=master)
[![MIT](https://img.shields.io/npm/l/watpl.svg)](https://github.com/mbasso/watpl/blob/master/LICENSE.md)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/BassoMatteo)

> Create WebAssembly modules using template strings

## Installation

You can install watpl using [npm](https://www.npmjs.com/package/watpl):

```bash
npm install --save watpl
```

If you aren't using npm in your project, you can include watpl using UMD build in the dist folder with `<script>` tag.

## Usage

Once you have installed watpl, supposing a CommonJS environment, you can import and use it in this way:

```js
import watpl from "watpl";

(async () => {
  // create a template
  const createAddModule = watpl`
    (module
      (func (param $lhs i32) (param $rhs i32) (result i32)
        get_local $lhs
        i32.const ${options => options.number}
        i32.add)
      (export "run" (func 0))
    )
  `;

  // create a module that adds 2
  const add2 = createAddModule({
    number: 2
  });

  // instantiate and run the module
  const instance = await add2.instantiate();
  instance.exports.run(3); // 5 = 3 + 2
})();
```

## API

```js
type WasmModule = {
  // created module as string
  string: string,
  // created module as buffer
  buffer: ArrayBuffer,
  // created WebAssembly module
  module: Promise<WebAssembly.Module>,
  // instantiate the module with the given importObject
  instantiate: (importObject: Object) => Promise<WebAssembly.Instance>,
  // cleanup the module
  destroy: () => void,
  toString: () => string
};

watpl`
  wat code
`: (options: any) => WasmModule
```

## Browser support

`watpl` uses [WebAssembly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) APIs, they are broadly supported by major browser engines but you would like to polyfill them to support old versions.

```js
if (typeof WebAssembly === 'undefined') {
  ...
} else {
  ...
}
```

## Inspiration

This project is inspired by [this tweet](https://twitter.com/rhmoller/status/1103026152984203265) of [@rhmoller](https://twitter.com/rhmoller).

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/mbasso/watpl/releases) page.

## Authors

**Matteo Basso**

- [github/mbasso](https://github.com/mbasso)
- [@teo_basso](https://twitter.com/teo_basso)

## Copyright and License

Copyright (c) 2019, Matteo Basso.

watpl source code is licensed under the [MIT License](https://github.com/mbasso/watpl/blob/master/LICENSE.md).
