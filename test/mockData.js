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
          "import {fetch} from 'whatwg-fetch'",
          "import jsonp from 'fetch-jsonp'",
          "import View from 'rax-view'",
          "import Image from 'rax-image'",
          "import Text from 'rax-text'",
          "import Button from 'Button'"
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
