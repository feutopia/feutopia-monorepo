if (process.env.NODE_ENV === "production") {
	module.exports = require("./cjs/index.js");
} else {
	module.exports = require("./esm/index.js");
}
