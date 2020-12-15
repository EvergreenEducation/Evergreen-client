let ruleExtend = {
  ignoreCheckNewModuleName: (moduleName) => { // 忽略检查新模块名称 ！！警告：规则配置不当可能会造成死循环！！
    return false;
  },
  moduleName: (moduleName) => { // 模块名称
    return (new RegExp('^moduleName$')).test(moduleName);
  },
  importType: {
    importSpecifier: { // 原导入类型（小驼峰） <importSpecifier|importDefaultSpecifier|importNamespaceSpecifier>
      transforms: (importType, moduleName, importedName, localName) => {
        return [
          {
            newImportType: 'ImportDefaultSpecifier', // 新导入类型（大驼峰） <ImportSpecifier|ImportDefaultSpecifier|ImportNamespaceSpecifier>
            newModuleName: `${moduleName}/path/${importedName}`, // 新模块名称
            newImportedName: importedName, // 新导入名称
            newLocalName: localName // 新本地名称
          }
        ];
      }
    },
    importDefaultSpecifier: {
      transforms: (importType, moduleName, importedName, localName) => {
        return [
          {
            newImportType: 'ImportSpecifier',
            newModuleName: `${moduleName}/path/${importedName}`,
            newImportedName: 'default',
            newLocalName: localName
          }
        ];
      }
    },
    importNamespaceSpecifier: {
      transforms: (importType, moduleName, importedName, localName) => {
        return [
          {
            newImportType: 'ImportDefaultSpecifier',
            newModuleName: `${moduleName}/path/${importedName}`,
            newImportedName: importedName,
            newLocalName: localName
          }
        ];
      }
    }
  }
}

module.exports = ruleExtend;