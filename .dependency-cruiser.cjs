/**
 * Feature-Sliced Design boundary rules.
 *
 * Layers (top may import bottom, never the reverse):
 *   app → pages → widgets → features → entities → shared
 *
 * Within the pages|widgets|features|entities layers every slice is isolated:
 * cross-slice imports are forbidden, and imports reaching across layers must
 * go through a slice's public `index.ts`. `content/` is only reachable from
 * entity api segments, which validate it with zod before anyone else sees it.
 */
module.exports = {
  forbidden: [
    // --- layer order: a layer may only import from layers strictly below ---
    {
      name: 'fsd-layer-order-pages',
      severity: 'error',
      comment: 'pages must not import the app layer (routes stay thin)',
      from: { path: '^src/pages/' },
      to: { path: '^src/app/' },
    },
    {
      name: 'fsd-layer-order-widgets',
      severity: 'error',
      from: { path: '^src/widgets/' },
      to: { path: '^src/(app|pages)/' },
    },
    {
      name: 'fsd-layer-order-features',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/(app|pages|widgets)/' },
    },
    {
      name: 'fsd-layer-order-entities',
      severity: 'error',
      from: { path: '^src/entities/' },
      to: { path: '^src/(app|pages|widgets|features)/' },
    },
    {
      name: 'fsd-layer-order-shared',
      severity: 'error',
      from: { path: '^src/shared/' },
      to: { path: '^src/(app|pages|widgets|features|entities)/' },
    },

    // --- cross-slice isolation inside a layer ---
    {
      name: 'fsd-no-cross-slice',
      severity: 'error',
      comment: 'slices at the same layer must not import each other',
      from: { path: '^src/(pages|widgets|features|entities)/([^/]+)/' },
      to: { path: '^src/$1/', pathNot: '^src/$1/$2/' },
    },

    // --- public API: cross-layer imports must target a slice's index.ts ---
    {
      name: 'fsd-public-api-pages',
      severity: 'error',
      from: { path: '^src/app/' },
      to: { path: '^src/pages/([^/]+)/.+', pathNot: '(^|/)index\\.tsx?$' },
    },
    {
      name: 'fsd-public-api-widgets',
      severity: 'error',
      from: { path: '^src/(app|pages)/' },
      to: { path: '^src/widgets/([^/]+)/.+', pathNot: '(^|/)index\\.tsx?$' },
    },
    {
      name: 'fsd-public-api-features',
      severity: 'error',
      from: { path: '^src/(app|pages|widgets)/' },
      to: { path: '^src/features/([^/]+)/.+', pathNot: '(^|/)index\\.tsx?$' },
    },
    {
      name: 'fsd-public-api-entities',
      severity: 'error',
      from: { path: '^src/(app|pages|widgets|features)/' },
      to: { path: '^src/entities/([^/]+)/.+', pathNot: '(^|/)index\\.tsx?$' },
    },

    // --- content is only reachable from entity api segments ---
    {
      name: 'content-only-from-entities-api',
      severity: 'error',
      comment: 'content/ files are parsed and validated by entity registries',
      from: { pathNot: '^src/entities/[^/]+/api/' },
      to: { path: '^content/' },
    },

    // --- hygiene ---
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'circular dependencies make modules impossible to reason about',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'files nothing imports are probably dead code',
      // `orphan` on `from` makes depcruise flag modules with no incoming or
      // outgoing dependencies; the `to` clause is ignored for this rule.
      from: {
        orphan: true,
        pathNot: ['\\.test\\.[jt]sx?$', '\\.d\\.ts$'],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: 'routeTree\\.gen\\.ts' },
    tsConfig: { fileName: 'tsconfig.app.json' },
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mdx'],
    },
  },
};
