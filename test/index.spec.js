import watpl from '../src';
import WasmModule from '../src/WasmModule';

const source = `
  (module
    (func (param $lhs i32) (param $rhs i32) (result i32)
      get_local $lhs
      get_local $rhs
      i32.add)
    (export "add" (func 0))
  )
`;

describe('watpl', () => {
  it('should export wasm', () => {
    expect(watpl).toBeTruthy();
    expect(typeof watpl).toEqual('function');
  });

  it('should throw if an invalid module is provided', () => {
    expect(() =>
      watpl`
          (module
            (fun (param $lhs i32) (param $rhs i32) (result i32)
              get_local $lhs
              get_local $rhs
              i32.add)
            (export "add" (func 0))
          )
        `()
    ).toThrow();
  });

  it('should return module from string', () => {
    const module = watpl`${source}`();

    expect(module).toBeInstanceOf(WasmModule);
    expect(module.toString()).toMatchSnapshot();
  });

  it('should return a WasmModule', () => {
    const module = watpl`${source}`();

    expect(module).toBeInstanceOf(WasmModule);
  });

  it('should have an instantiate method', async () => {
    const spy = jest.spyOn(WebAssembly, 'instantiate');
    const importObject = { foo: () => null };
    const module = watpl`${source}`();
    const instance1 = await module.instantiate();
    const instance2 = await module.instantiate(importObject);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, await module.module, {});
    expect(spy).toHaveBeenNthCalledWith(2, await module.module, importObject);

    expect(instance1).toMatchSnapshot();
    expect(instance2).toMatchSnapshot();
    expect(typeof instance1.exports.add).toEqual('function');
    expect(typeof instance2.exports.add).toEqual('function');
    expect(instance1).toBeInstanceOf(WebAssembly.Instance);
    expect(instance2).toBeInstanceOf(WebAssembly.Instance);
    spy.mockRestore();
  });

  it('should have a destroy method', () => {
    const module = watpl`${source}`();
    expect(() => {
      module.destroy();
    }).not.toThrow();
  });

  it('should have a toString method', () => {
    const module = watpl`${source}`();
    const stringSource = module.toString();

    expect(typeof stringSource).toEqual('string');
    expect(stringSource).toMatchSnapshot();
  });

  it('should have a string property', () => {
    const module = watpl`${source}`();
    const { string } = module;

    expect(typeof string).toEqual('string');
    expect(string).toMatchSnapshot();
  });

  it('should have a buffer property', () => {
    const module = watpl`${source}`();
    const { buffer } = module;

    expect(buffer).toMatchSnapshot();
  });

  it('should have a module property', async () => {
    const module = watpl`${source}`();
    const wasmModule = await module.module;

    expect(wasmModule).toBeInstanceOf(WebAssembly.Module);
    expect(wasmModule).toMatchSnapshot();
    expect(WebAssembly.Module.exports(wasmModule)).toMatchSnapshot();
    expect(WebAssembly.Module.imports(wasmModule)).toMatchSnapshot();
  });

  it('should compile module only once', async () => {
    const spy = jest.spyOn(WebAssembly, 'compile');
    const module = watpl`${source}`();
    await module.module;
    await module.module;

    expect(spy).toHaveBeenCalledWith(module.buffer);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('should interpolate strings', () => {
    const paramType = 'i32';
    const module = watpl`
      (module
        (func (param $lhs ${paramType}) (param $rhs ${paramType}) (result ${paramType})
          get_local $lhs
          get_local $rhs
          ${paramType}.add)
        (export "add" (func 0))
      )
    `();

    expect(module).toBeInstanceOf(WasmModule);
    expect(module.toString()).toMatchSnapshot();
  });

  it('should interpolate numbers', () => {
    const funcNumber = '0';
    const module = watpl`
      (module
        (func (param $lhs i32) (param $rhs i32) (result i32)
          get_local $lhs
          get_local $rhs
          i32.add)
        (export "add" (func ${funcNumber}))
      )
    `();

    expect(module).toBeInstanceOf(WasmModule);
    expect(module.toString()).toMatchSnapshot();
  });

  it('should interpolate functions', () => {
    const module = watpl`
      (module
        (func (param $lhs i32) (param $rhs i32) (result i32)
          get_local $lhs
          get_local $rhs
          i32.add)
        (export "${options => options.exportName}" (func 0))
      )
    `({
      exportName: 'add'
    });

    expect(module).toBeInstanceOf(WasmModule);
    expect(module.toString()).toMatchSnapshot();
  });
});
