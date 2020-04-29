const mockData = require('./mockData');

const index = require('../index.js');
const options = {
  data: mockData,
  filePath:
    '/Users/beizhu/Documents/work-files/project-code/imgcook-group/dsl/plugin-directory-rax/demo',
  workspaceFolders: [
    {
      uri: {
        $mid: 1,
        fsPath:
          '/Users/beizhu/Documents/work-files/project-code/imgcook-group/dsl/plugin-directory-rax',
        external:
          'file:///Users/beizhu/Documents/work-files/project-code/imgcook-group/dsl/plugin-directory-rax',
        path:
          '/Users/beizhu/Documents/work-files/project-code/imgcook-group/dsl/plugin-directory-rax',
        scheme: 'file',
      },
      name: 'demo',
      index: 0,
    },
  ],
  config: {
    accessId: 'xx',
    dslId: 41,
    generator: ['@imgcook/generator-react'],
    plugin: ['@imgcook/plugin-images'],
    uploadUrl: '',
    value: '17679',
  },
};

index(options);
