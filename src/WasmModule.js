export default class WasmModule {
  constructor(source) {
    source.validate();
    this.source = source;
    this.string = this.source.toText({});
    this.buffer = this.source.toBinary({}).buffer;
    this.module = WebAssembly.compile(this.buffer);
  }

  instantiate = async (importObject = {}) =>
    WebAssembly.instantiate(await this.module, importObject);

  destroy = () => {
    this.source.destroy();
  };

  toString = () => this.string;
}
