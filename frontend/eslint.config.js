// I'm pretty sure literally none of these work aside from tseslint
import eslint from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import tailwind from "eslint-plugin-tailwindcss";

// Legacy compatibility
// https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended
});

export default tseslint.config(
  ...compat.config(reactHooks.configs.recommended),
  { ignores: ['dist'] },
  {
    settings: {
      react: {
        version: '18.3'
      }
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      prettier,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      ...tailwind.configs['flat/recommended']
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        }
      },
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
    },
    plugins: {
      tailwind,
      react,
      prettier,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
