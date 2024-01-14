import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions"

const applyGlobalPolyfills = () => {
  const { TextEncoder, TextDecoder } = require("text-encoding")
  const {Buffer} = require("buffer")
  // const {readFile} = require("react-native-fs")

  polyfillGlobal("TextEncoder", () => TextEncoder)
  polyfillGlobal("TextDecoder", () => TextDecoder)
  polyfillGlobal("Buffer", () => Buffer)
  // polyfillGlobal("readFile", () => readFile)
}

export default applyGlobalPolyfills