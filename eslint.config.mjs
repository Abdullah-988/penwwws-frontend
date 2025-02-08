import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import unusedImports from "eslint-plugin-unused-imports";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      quotes: [2, "double", "avoid-escape"],
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "unused-imports/no-unused-imports": "warn",
    },
  },
];

export default eslintConfig;
