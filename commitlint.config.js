module.exports = {
  extends: ["@commitlint/config-conventional"],
  plugins: ["commitlint-plugin-function-rules"],
  helpUrl: "https://github.com/saftox-com/saftox-ui/blob/main/CONTRIBUTING.md#commit-convention",
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "feature", "fix", "refactor", "docs", "build", "test", "ci", "chore"],
    ],
    "function-rules/header-max-length": [0],
  },
};