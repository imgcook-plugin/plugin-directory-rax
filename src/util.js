const fs = require('fs-extra');
const path = require('path');
const { PROJECT_TYPE } = require('./constant');

/**
 * 计算项目类型
 * @param {*} projectPath
 */
function calcuProjectType(projectPath) {
  const projectBuildPath = path.join(projectPath, 'build.json');
  const projectABCPath = path.join(projectPath, 'abc.json');
  if (fs.existsSync(projectBuildPath)) {
    try {
      const jsonString = fs.readFileSync(projectBuildPath).toString();
      if (jsonString.indexOf('build-plugin-rax-app') > -1) {
        if (jsonString.indexOf('build-plugin-rax-multi-pages') > -1) {
          return PROJECT_TYPE.Rax1MultiApp;
        } else {
          return PROJECT_TYPE.Rax1SPAApp;
        }
      } else if (jsonString.indexOf('@ali/build-plugin-pegasus-base') > -1) {
        return PROJECT_TYPE.Rax1TBEMod;
      } else if (jsonString.indexOf('build-plugin-rax-component') > -1) {
        if (jsonString.indexOf('build-plugin-multi-demo-portal') > -1) {
          return PROJECT_TYPE.Rax1CompUI;
        } else {
          return PROJECT_TYPE.Rax1Comp;
        }
      }
    } catch (e) {
      console.error('解析 build.json 出错');
    }
  } else if (fs.existsSync(projectABCPath)) {
    try {
      const json = JSON.parse(fs.readFileSync(projectABCPath).toString());
      if (json.builder && typeof json.builder === 'string') {
        if (json.type === 'tbe-mod') {
          return PROJECT_TYPE.Rax1TBEMod;
        }
      }
    } catch (e) {
      console.error('解析 abc.json 出错');
    }
  }
  return PROJECT_TYPE.Other;
}

/**
 * 计算要导出的 code、package.json、app.json 文件路径
 * @param {*} workspaceFolder
 * @param {*} filePath
 * @param {*} pageName
 * @param {*} projectType
 */
function calcuExportDirectory(workspaceFolder, filePath, pageName, projectType) {
  let exportDirs = {
    code: path.resolve(filePath, pageName),
    packagejson: path.resolve(workspaceFolder, 'package.json'),
    appjson: ''
  };
  switch (projectType.type) {
    case PROJECT_TYPE.Rax1MultiApp.type:
    case PROJECT_TYPE.Rax1SPAApp.type: {
      let pageDir = path.resolve(workspaceFolder, 'src/pages');
      if (workspaceFolder === filePath || pageDir === filePath) {
        exportDirs.code = path.resolve(workspaceFolder, `src/pages/${pageName}`);
        exportDirs.appjson = path.resolve(workspaceFolder, 'src/app.json');
      } else {
        exportDirs.code = path.resolve(filePath, pageName);
      }
      break;
    }
    case PROJECT_TYPE.Rax1Comp.type:
    case PROJECT_TYPE.Rax1CompUI.type: {
      let pageDir = path.resolve(workspaceFolder, 'src');
      if (workspaceFolder === filePath || pageDir === filePath) {
        exportDirs.code = pageDir;
      } else {
        exportDirs.code = path.resolve(filePath, pageName);
      }
      break;
    }
    case PROJECT_TYPE.Rax1TBEMod.type: {
      // 天马模块目录
      let pageDir = path.resolve(workspaceFolder, 'src/mobile');
      if (!fs.pathExistsSync(pageDir)) {
        // 天马组件目录
        pageDir = path.resolve(workspaceFolder, 'src');
      }
      if (workspaceFolder === filePath || pageDir === filePath) {
        exportDirs.code = pageDir;
      } else {
        exportDirs.code = path.resolve(filePath, pageName);
      }
      break;
    }
    default: {
      // 默认当成模块导出
      exportDirs.code = path.resolve(filePath, pageName);
      break;
    }
  }
  return exportDirs;
}

/**
 * 根据项目类型来优化导出文件格式
 * @param {*} fileType
 * @param {*} isTS
 * @param {*} projectType
 */
function optiFileType(workspaceFolder, fileType, projectType) {
  const isTSProject = fs.pathExistsSync(path.join(workspaceFolder, 'tsconfig.json'));
  if (isTSProject) {
    if (fileType === 'js') {
      return 'ts';
    }
    if (fileType === 'jsx') {
      return 'tsx';
    }
  } else if (['js', 'jsx'].indexOf(fileType) > -1 && projectType.type !== 'other') {
    return projectType.jsType;
  }
  return fileType;
}

/**
 * 计算工程目录信息
 * @param {*} workspaceFolders
 * @param {*} filePath
 */
function calcuWorkspaceInfo(workspaceFolders, filePath) {
  let result = null;
  if (Array.isArray(workspaceFolders)) {
    try {
      for (let workspace of workspaceFolders) {
        const { uri = {}, name } = workspace;
        const { fsPath } = uri;
        if (filePath.indexOf(fsPath) > -1) {
          result = {};
          result.workspaceFolder = path.resolve(fsPath);
          result.workspaceName = name;
          result.filePath = filePath;
          break;
        }
      }
    } catch (e) {}
  }
  if (!result) {
    result = {};
    result.workspaceFolder = filePath;
    result.workspaceName = filePath.substr(filePath.lastIndexOf('/') + 1);
    result.filePath = filePath;
  }
  return result;
}

module.exports = {
  PROJECT_TYPE,
  calcuProjectType,
  calcuWorkspaceInfo,
  calcuExportDirectory,
  optiFileType
};
