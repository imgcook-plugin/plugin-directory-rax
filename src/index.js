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
    const newItem = item.import.replace('./', replacement);
    panelValue = panelValue.replace(item.import, newItem);
  });
  return panelValue;
}

function replaceCssImport(panelValue, fileName) {
  panelValue = panelValue.replace(
    `import styles from './${fileName}.css';`,
    `import styles from './index.css';`
  );
  panelValue = panelValue.replace(
    `import './${fileName}.css';`,
    `import './index.css';`
  );
  return panelValue;
}

function collectImports(imports, panelImports) {
  return panelImports
    .filter(item => {
      return item.import.indexOf('./') === -1 && item.import.indexOf('../') === -1;
    })
    .concat(imports);
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
 * @param {*} packageJSONPath
 * @param {*} imports
 */
function calcuPackageJSONPanel(packageJSONPath, imports) {
  if (!fs.pathExistsSync(packageJSONPath)) {
    return null;
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
    imports.forEach(item => {
      const name = item.package;
      const version = item.version || '*';
      if (!json.dependencies[name] && !json.devDependencies[name]) {
        flag = true;
        json.dependencies[name] = version;
      }
    });
    if (flag) {
      return {
        panelPath: packageJSONPath,
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
 * @param {*} appJSONPath
 * @param {*} pageName
 */
function calcuAppJSONPanel(appJSONPath, pageName) {
  if (!fs.pathExistsSync(appJSONPath)) {
    return null;
  }
  try {
    const json = JSON.parse(fs.readFileSync(appJSONPath).toString());
    if (!json.routes) {
      json.routes = [];
    }
    const routesPath = json.routes.map(i => i.path);
    if (routesPath.indexOf(`/${pageName}`) === -1) {
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
    }
    return null;
  } catch (e) {
    return null;
  }
}

const pluginHandler = async options => {
  let { filePath, workspaceFolders, data } = options;
  let pageName = getPageName(data);
  filePath = path.resolve(filePath);
  options.filePath = filePath;
  // workspaceFolders 是一个数组，vscode 支持同时打开多个工作空间
  const workspaceInfo = util.calcuWorkspaceInfo(workspaceFolders, filePath);
  const { workspaceFolder, workspaceName } = workspaceInfo;
  const projectType = util.calcuProjectType(workspaceFolder);
  const exportDirs = util.calcuExportDirectory(workspaceFolder, filePath, pageName, projectType);

  const panelDisplay = data.code.panelDisplay;
  let imports = [];
  data.code.panelDisplay = panelDisplay.map(item => {
    try {
      let { panelName, panelValue, panelImports = [] } = item;
      let panelPath = '';
      const fileName = panelName.split('.')[0];
      const fileType = util.optiFileType(workspaceFolder, panelName.split('.')[1], projectType);
      panelName = `${fileName}.${fileType}`;
      if (fileName !== 'index' && fileName !== 'context') {
        panelPath = path.resolve(exportDirs.code, 'components', fileName, `index.${fileType}`);
      } else {
        panelPath = path.resolve(exportDirs.code, `${fileName}.${fileType}`);
      }
      panelValue = replaceCssImport(panelValue, fileName);
      panelValue = replaceLocalImports(panelValue, panelImports, fileName);
      imports = collectImports(imports, panelImports);
      return {
        ...item,
        panelName,
        panelValue,
        panelPath
      };
    } catch (error) {}
  });

  // 解析是否要写入 package.json
  if (exportDirs.packagejson) {
    const pkgPanel = calcuPackageJSONPanel(exportDirs.packagejson, imports);
    if (pkgPanel) {
      data.code.panelDisplay.push(pkgPanel);
    }
  }

  // 解析是否要写入 app.json
  if (exportDirs.appjson) {
    const appPanel = calcuAppJSONPanel(exportDirs.appjson, pageName);
    if (appPanel) {
      data.code.panelDisplay.push(appPanel);
    }
  }

  // 如需要开启 codediff 功能，需要返回如下两个字段
  data.code.codeDiff = true;
  options.workspaceFolder = workspaceFolder;
  console.log('[@imgcook/plugin-directory-rax] options:');
  console.log(JSON.stringify(options));
  return options;
};

module.exports = (...args) => {
  return pluginHandler(...args).catch(err => {
    console.log(err);
  });
};
