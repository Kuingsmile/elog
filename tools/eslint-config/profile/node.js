const rules = require("@rushstack/eslint-config/profile/node");

rules.overrides[0].rules["@rushstack/typedef-var"] = "off";

module.exports = rules;
