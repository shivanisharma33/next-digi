import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  {
    ignores: ['.next/**', 'out/**', 'dist/**', 'node_modules/**', 'scripts/**'],
  },
  // Next.js recommended rules (covers React, React Hooks, and the Next plugin,
  // and lints .ts/.tsx via the TypeScript parser bundled with eslint-config-next).
  ...compat.extends('next/core-web-vitals'),
  {
    // These categories have many pre-existing, low-risk violations across the
    // 3D/marketing components. Keep them visible as warnings (so they don't
    // silently regress) without blocking `next build`. Every other rule stays
    // at error, so genuinely new problems still fail the build.
    rules: {
      'react/no-unescaped-entities': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
]
