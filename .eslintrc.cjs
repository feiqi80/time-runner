module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "react-hooks"
  ],
  extends: [
    "plugin:react/recommended",
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/react-in-jsx-scope": "off",
  }
};
  