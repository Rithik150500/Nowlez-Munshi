/**
 * Nowlez DOCX Runner
 * =====================
 * Executes docx-js JavaScript code in a sandboxed VM to produce DOCX files.
 *
 * Usage: node runner.js <input.js> <output.docx>
 *
 * The input JS file must export a docx Document object via module.exports.
 * The runner packs it into a DOCX buffer and writes it to the output path.
 *
 * Security: Code runs in vm.runInNewContext with a restricted sandbox.
 * Only require("docx") is allowed; process, fs, child_process, etc. are blocked.
 */

const { Packer } = require("docx");
const fs = require("fs");
const vm = require("vm");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error("Usage: node runner.js <input.js> <output.docx>");
  process.exit(1);
}

/**
 * Restricted require: only allows the "docx" module.
 * Blocks fs, child_process, net, http, os, path, and all other modules.
 */
function restrictedRequire(name) {
  if (name === "docx") {
    return require("docx");
  }
  throw new Error(
    "require('" + name + "') is not allowed. Only require('docx') is permitted."
  );
}

/**
 * Strip file system paths from error messages to prevent information leakage.
 */
function sanitizeError(msg) {
  return (msg || "Unknown error")
    .replace(
      /(?:[A-Za-z]:)?[/\\](?:[\w.\-]+[/\\])*[\w.\-]+\.(?:js|ts|mjs|cjs)/g,
      "<file>"
    )
    .substring(0, 200);
}

try {
  const code = fs.readFileSync(inputFile, "utf-8");

  // Sandboxed module pattern
  const sandboxModule = { exports: {} };

  const sandbox = {
    module: sandboxModule,
    exports: sandboxModule.exports,
    require: restrictedRequire,
    console: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
    // Explicitly block dangerous globals
    process: undefined,
    global: undefined,
    globalThis: undefined,
    __filename: undefined,
    __dirname: undefined,
  };

  vm.runInNewContext(code, sandbox, {
    filename: "generated-docx-code.js",
    timeout: 30000,
    displayErrors: true,
  });

  const doc = sandboxModule.exports;

  if (!doc || typeof doc !== "object") {
    console.error(
      "Error: Code must export a Document object via module.exports"
    );
    process.exit(1);
  }

  Packer.toBuffer(doc)
    .then((buffer) => {
      fs.writeFileSync(outputFile, buffer);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Packer error: " + sanitizeError(err.message));
      process.exit(1);
    });
} catch (err) {
  console.error("Execution error: " + sanitizeError(err.message));
  process.exit(1);
}
