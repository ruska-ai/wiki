import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'afb'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '16d'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '445'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '56e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/assistants',
                component: ComponentCreator('/docs/assistants', 'dd7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '565'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/storage',
                component: ComponentCreator('/docs/storage', '95f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/threads',
                component: ComponentCreator('/docs/threads', 'c16'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/tools',
                component: ComponentCreator('/docs/tools', '309'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/tools/a2a',
                component: ComponentCreator('/docs/tools/a2a', '4c0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/tools/mcp',
                component: ComponentCreator('/docs/tools/mcp', '05b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/tools/search',
                component: ComponentCreator('/docs/tools/search', '319'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
