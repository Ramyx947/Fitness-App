import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
// import jest from 'eslint-plugin-jest'

export default [
    { files: ['**/*.{js,mjs,cjs,jsx}'] },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
            },
        },
    },
    pluginJs.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect', // Automatically detect React version
            },
        },
    },
]
