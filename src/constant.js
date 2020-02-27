/**
 * 项目类型定义
 */
const PROJECT_TYPE = {
  // rax 多页应用
  Rax1MultiApp: {
    type: 'rax1.multiapp',
    jsType: 'jsx',
    cssType: 'css'
  },
  // rax 单页应用
  Rax1SPAApp: {
    type: 'rax1.spaapp',
    jsType: 'jsx',
    cssType: 'css'
  },
  // rax 组件
  Rax1Comp: {
    type: 'rax1.component',
    jsType: 'jsx',
    cssType: 'css'
  },
  // rax UI组件
  Rax1CompUI: {
    type: 'rax1.componentui',
    jsType: 'jsx',
    cssType: 'css'
  },
  // rax 天马模块
  Rax1TBEMod: {
    type: 'rax1.tbemod',
    jsType: 'js',
    cssType: 'css'
  },
  //  其他
  Other: {
    type: 'other',
    jsType: 'js',
    cssType: 'css'
  }
};

module.exports = {
  PROJECT_TYPE
};
