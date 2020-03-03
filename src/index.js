/**
 * @name plugin directory
 * @param option: { data, filePath, config }
 * - data: module and generate code Data
 * - filePath: Pull file storage directory
 * - config: cli config
 */

const fs = require('fs-extra');
const path = require('path');
const util = require('./util');

function replaceLocalImports(panelValue, imports, fileName) {
  let replacement = '../';
  if (fileName === 'index') {
    replacement = './components/';
  }
  imports.forEach(item => {
    const newItem = item.replace('./', replacement);
    panelValue = panelValue.replace(item, newItem);
  });
  return panelValue;
}

function replaceCssImport(panelValue, fileName) {
  panelValue = panelValue.replace(
    `import styles from './${fileName}.css';`,
    `import styles from './index.css';`
  );
  return panelValue;
}

function collectImports(imports, panelImports) {
  const realImports = panelImports
    .filter(item => {
      return item.indexOf('./') === -1;
    })
    .concat(imports);
  return Array.from(new Set(realImports));
}

function getPageName(data) {
  if (data && data.moduleData) {
    if (data.moduleData.name) {
      return data.moduleData.name;
    } else if (data.moduleData.id) {
      return 'page' + data.moduleData.id;
    }
  }
  return 'page';
}

/**
 * 源码生成后，将依赖的 npm 包写入 package.json
 * @param {*} projectPath
 * @param {*} imports
 */
function getPackageJSONPanel(projectPath, imports) {
  const packages = imports.map(item => {
    return item.match(/\'(.*)?\'/g)[0].slice(1, -1);
  });
  const packageJSONPath = util.findClosestFilePath(projectPath, 'package.json');
  if (!fs.pathExistsSync(packageJSONPath)) {
    return false;
  }
  let flag = false;
  try {
    const json = JSON.parse(fs.readFileSync(packageJSONPath).toString());
    if (!json.dependencies) {
      json.dependencies = {};
    }
    if (!json.devDependencies) {
      json.devDependencies = {};
    }
    packages.forEach(name => {
      if (!json.dependencies[name] && !json.devDependencies[name]) {
        flag = true;
        json.dependencies[name] = '*';
      }
    });
    if (flag) {
      return {
        panelPath: path.resolve(packageJSONPath),
        panelName: 'package.json',
        panelValue: `${JSON.stringify(json, null, 2)}\n`,
        panelType: 'json'
      };
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

/**
 * Rax 1.0 多页应用 && 单页应用源码生成更新路由信息 app.json
 * @param {*} projectPath
 * @param {*} pageName
 */
function getAppJSONPanel(projectPath, pageName, projectType) {
  if (
    projectType.type === util.PROJECT_TYPE.Rax1MultiApp.type ||
    projectType.type === util.PROJECT_TYPE.Rax1SPAApp.type
  ) {
    const appJSONPath = path.join(projectPath, 'src/app.json');
    if (!fs.pathExistsSync(appJSONPath)) {
      return false;
    }
    try {
      const json = JSON.parse(fs.readFileSync(appJSONPath).toString());
      if (!json.routes) {
        json.routes = [];
      }
      json.routes.push({
        path: `/${pageName}`,
        source: `pages/${pageName}/index`
      });
      return {
        panelPath: appJSONPath,
        panelName: 'app.json',
        panelValue: `${JSON.stringify(json, null, 2)}\n`,
        panelType: 'json'
      };
    } catch (e) {
      return null;
    }
  }
}

const pluginHandler = async options => {
  let { filePath: projectPath, data } = options;
  let imports = [];
  const isTSProject = fs.pathExistsSync(path.join(projectPath, 'tsconfig.json'));
  const projectType = util.getProjectType(projectPath);
  let codeDirectory = '';
  let pageName = getPageName(data);
  try {
    codeDirectory = util.getCodeDirectory(projectType, projectPath, pageName);
    fs.ensureDirSync(codeDirectory);
  } catch (error) {
    codeDirectory = projectPath;
  }

  const panelDisplay = data.code.panelDisplay;
  data.code.panelDisplay = panelDisplay.map(item => {
    try {
      let { panelName, panelValue, panelImports = [] } = item;
      let filePath = '';
      const fileName = panelName.split('.')[0];
      const fileType = util.optiFileType(panelName.split('.')[1], isTSProject, projectType);
      panelName = `${fileName}.${fileType}`
      if (fileName !== 'index' && fileName !== 'context') {
        filePath = path.resolve(codeDirectory, 'components', fileName, `index.${fileType}`);
      } else {
        filePath = path.resolve(codeDirectory, `${fileName}.${fileType}`);
      }
      panelValue = replaceCssImport(panelValue, fileName);
      panelValue = replaceLocalImports(panelValue, panelImports, fileName);
      imports = collectImports(imports, panelImports);
      return {
        ...item,
        panelName,
        panelValue,
        panelPath: filePath
      };
    } catch (error) {}
  });

  console.log('data.code.panelDisplay', data.code.panelDisplay);
  // 解析 package.json
  const pkgPanel = getPackageJSONPanel(projectPath, imports);
  if (pkgPanel) {
    data.code.panelDisplay.push(pkgPanel);
  }
  // 解析 app.json
  const appPanel = getAppJSONPanel(projectPath, pageName, projectType);
  if (appPanel) {
    data.code.panelDisplay.push(appPanel);
  }
  // codeDiff 标识插件做代码 diff
  data.code.codeDiff = true;
  return options;
};

module.exports = (...args) => {
  return pluginHandler(...args).catch(err => {
    console.log(err);
  });
};
