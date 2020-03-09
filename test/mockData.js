module.exports = {
  moduleData: {
    id: 17679,
    name: 'hook',
    cover: 'https://img.alicdn.com/tfs/TB1mkjeqlr0gK0jSZFnXXbRRXXa-1404-1292.png'
  },
  code: {
    panelDisplay: [
      {
        panelName: 'index.jsx',
        panelValue: 'var a = 1;',
        panelType: 'js',
        panelImports: [
          {
            import: "import View from 'rax-view'",
            package: 'rax-view',
            version: '1.1.0'
          },
          {
            import: "import PuiTab from '@ali/puicom-rax-tab'",
            package: '@ali/puicom-rax-tab',
            version: '1.0.2'
          },
          {
            import: "import Image from 'rax-image'",
            package: 'rax-image',
            version: '2.0.4'
          },
          {
            import: "import Text from 'rax-text'",
            package: 'rax-text',
            version: '1.1.6'
          },
          {
            import: "import {fetch} from 'whatwg-fetch'",
            package: 'whatwg-fetch',
            version: '3.0.0'
          },
          {
            import: "import jsonp from 'fetch-jsonp'",
            package: 'fetch-jsonp',
            version: '1.1.3'
          },
        ]
      },
      {
        panelName: 'index.css',
        panelValue:
          '.box {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n  align-items: flex-start;\n  height: 534rpx;\n}',
        panelType: 'css'
      }
    ],
    noTemplate: true,
    codeDiff: true
  }
};
