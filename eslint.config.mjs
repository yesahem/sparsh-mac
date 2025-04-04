import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
// import eslintPluginReact from 'eslint-plugin-react'
// import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
// import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  // eslintPluginReact.configs.flat.recommended,
  // eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      // 'react-hooks': eslintPluginReactHooks,
      // 'react-refresh': eslintPluginReactRefresh
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off", 
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "off"
    }
  },
  eslintConfigPrettier
)
