let gPath = require('path');

let rules = undefined; // 插件规则配置
let ruleExtend = undefined; // 插件规则扩展

let ImportTypeEnum = { // 导入类型枚举
  ImportSpecifier: "ImportSpecifier",
  ImportDefaultSpecifier: "ImportDefaultSpecifier",
  ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
};
let Type2Property = { // 类型枚举对应的属性名称
  ImportSpecifier: "importSpecifier",
  ImportDefaultSpecifier: "importDefaultSpecifier",
  ImportNamespaceSpecifier: "importNamespaceSpecifier",
};

module.exports = (babel) => {
  let bTypes = babel.types;

  return {
    visitor: {
      ImportDeclaration: (path, state) => {
        // 新 importDeclaration 数组
        let newImportDeclarations = [];
        // 模块名称
        let moduleName = path.node.source.value;

        // 规则配置
        if (!rules && state.opts) {
          rules = state.opts.rules;
        }

        // 规则扩展
        if (!ruleExtend && state.opts && typeof (state.opts.ruleExtend) === 'string') {
          let uri = gPath.join(process.cwd(), state.opts.ruleExtend);
          ruleExtend = require(uri);
        }

        // 主业务逻辑
        let appendNewImportDeclarations = (ruleData, testModuleName, getTransforms) => {
          // 测试模块名称
          if (testModuleName(moduleName)) {
            // 遍历导入类型枚举
            for (let typeKey in ImportTypeEnum) {
              let importType = ImportTypeEnum[typeKey]; // 导入类型
              let typePropName = Type2Property[importType]; // 导入类型对应的属性名称

              // 过滤导入类型
              let specifiers = path.node.specifiers.filter((specifier) => {
                return specifier.type === importType;
              });

              // 遍历导入类型
              specifiers.forEach((specifier) => {
                var importedName = specifier.imported ? specifier.imported.name : ''; // 导入名称
                var localName = specifier.local ? specifier.local.name : ''; // 本地名称

                // 拿到转换规则
                let transforms = getTransforms(importType, typePropName, moduleName, importedName, localName);
                if (transforms && Array.isArray(transforms)) {
                  // 遍历转换规则
                  transforms.forEach((transform) => {
                    if (transform && typeof (transform) === 'object') {
                      let newTransform = {};

                      // 遍历规则对象
                      for (let key in transform) {
                        let val = transform[key];

                        // 替换规则对象属性值
                        if (typeof (val) === 'string') {
                          let newVal = val.replace(/\[importType\]/g, importType)
                            .replace(/\[moduleName\]/g, moduleName)
                            .replace(/\[importedName\]/g, importedName)
                            .replace(/\[localName\]/g, localName);
                          newTransform[key] = newVal;
                        }
                      }

                      // 整合新规则对象属性值
                      let newImportType = newTransform.newImportType ? newTransform.newImportType : importType; // 新导入类型
                      let newTypePropName = Type2Property[newImportType]; // 新导入类型对应的属性名称
                      let newModuleName = newTransform.newModuleName ? newTransform.newModuleName : moduleName; // 新模块名称
                      let newImportedName = newTransform.newImportedName ? newTransform.newImportedName : importedName; // 新导入名称
                      let newLocalName = newTransform.newLocalName ? newTransform.newLocalName : localName; // 新本地名称

                      // 检查新导入类型
                      if (!ImportTypeEnum[newImportType]) {
                        throw new Error(`newImportType must is "${ImportTypeEnum.ImportSpecifier}" or "${ImportTypeEnum.ImportDefaultSpecifier}" or "${ImportTypeEnum.ImportNamespaceSpecifier}"`);
                      }
                      // 检查新模块名称
                      if (!ruleData.ignoreCheckNewModuleName && testModuleName(newModuleName)) {
                        throw new Error('newModuleName must not match moduleName');
                      }

                      // 新 importDeclaration 对象
                      let newSpecifier;
                      let typesSpecifier = bTypes[newTypePropName];
                      if (newImportType === ImportTypeEnum.ImportSpecifier) {
                        newSpecifier = typesSpecifier(bTypes.identifier(newLocalName), bTypes.identifier(newImportedName));
                      }
                      else {
                        newSpecifier = typesSpecifier(bTypes.identifier(newLocalName));
                      }
                      let newDeclaration = bTypes.importDeclaration([newSpecifier], bTypes.stringLiteral(newModuleName));

                      // 追加进新 importDeclaration 数组
                      newImportDeclarations.push(newDeclaration);
                    }
                  });
                }

              });
            }
          }
        };

        // 存在规则配置
        if (rules && Array.isArray(rules)) {
          // 遍历规则配置
          rules.forEach((rule) => {
            if (rule && rule.moduleName && rule.importType) {
              appendNewImportDeclarations({
                ignoreCheckNewModuleName: rule.ignoreCheckNewModuleName // 忽略检查新模块名称
              }, (moduleName) => {
                // 测试模块名称
                return (new RegExp(rule.moduleName)).test(moduleName);
              }, (importType, typePropName, moduleName, importedName, localName) => {
                // 拿到转换规则
                let transforms = (rule.importType[typePropName] && rule.importType[typePropName].transforms)
                  ? rule.importType[typePropName].transforms : undefined;
                return transforms;
              });
            }
          });
        }

        // 存在规则扩展
        if (ruleExtend && typeof (ruleExtend.moduleName) === 'function' && ruleExtend.importType) {
          appendNewImportDeclarations({
            ignoreCheckNewModuleName: typeof (ruleExtend.ignoreCheckNewModuleName) === 'function'
              ? ruleExtend.ignoreCheckNewModuleName(moduleName) : false // 忽略检查新模块名称
          }, (moduleName) => {
            // 测试模块名称
            return ruleExtend.moduleName(moduleName);
          }, (importType, typePropName, moduleName, importedName, localName) => {
            // 拿到转换规则
            let transformsFun = (ruleExtend.importType[typePropName] && ruleExtend.importType[typePropName].transforms)
              ? ruleExtend.importType[typePropName].transforms : undefined;
            if (transformsFun && typeof (transformsFun) === 'function') {
              let transforms = transformsFun(importType, moduleName, importedName, localName);
              return transforms;
            }
          });
        }

        // 替换为新 importDeclaration 数组
        if (newImportDeclarations.length > 0) {
          path.replaceWithMultiple(newImportDeclarations);
        }
      }
    }
  }
};