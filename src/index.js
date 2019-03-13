// @flow

import wabt from 'wabt';
import WasmModule from './WasmModule';

const { parseWat } = wabt();

let moduleNumber = 0;

const watpl = (strings: Array<string>, ...values: Array<string>) => (
  options: any
) =>
  new WasmModule(
    parseWat(
      // eslint-disable-next-line
      `module-${moduleNumber++}.wat`,
      values.length > 0
        ? [
            ...values.reduce(
              (code, expr, index) => [
                ...code,
                strings[index],
                typeof expr === 'function' ? expr(options) : expr
              ],
              []
            ),
            strings[strings.length - 1]
          ].join('')
        : strings[0]
    )
  );

export default watpl;
