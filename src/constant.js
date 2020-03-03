/**
 * 项目类型定义
 */
const PROJECT_TYPE = {
  // rax 多页应用
  Rax1MultiApp: {
    type: 'rax1.multiapp',
    jsType: 'jsx'
  },
  // rax 单页应用
  Rax1SPAApp: {
    type: 'rax1.spaapp',
    jsType: 'jsx'
  },
  // rax 组件
  Rax1Comp: {
    type: 'rax1.component',
    jsType: 'jsx'
  },
  // rax UI组件
  Rax1CompUI: {
    type: 'rax1.componentui',
    jsType: 'jsx'
  },
  // rax 天马模块
  Rax1TBEMod: {
    type: 'rax1.tbemod',
    jsType: 'js'
  },
  //  其他
  Other: {
    type: 'other',
    jsType: 'jsx'
  }
};

module.exports = {
  PROJECT_TYPE
};
