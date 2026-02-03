process.env.ESLINT_NO_PATCH ??= 'true';

const next = (await import('eslint-config-next')).default;

export default [
  ...next,
  {
    ignores: ['node_modules', '.next', 'dist'],
  },
];
