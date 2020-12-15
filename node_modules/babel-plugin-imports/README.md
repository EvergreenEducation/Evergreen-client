# babel-plugin-imports

[![npm version](https://badge.fury.io/js/babel-plugin-imports.svg)](http://badge.fury.io/js/babel-plugin-imports) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

ES6 模块导入规则转换，支持“命名导入”、“默认导入”和“命名空间导入”三种规则，并支持一对多转换。  
如：  
import { importedName as localName } from 'moduleName'; => import { newImportedName as newLocalName } from 'newModuleName';  
import localName from 'moduleName'; => import { default as newLocalName } from 'newModuleName';  
import * as localName from 'moduleName'; => import newLocalName from 'newModuleName';

## Installation

``` bash
npm install --save-dev babel-plugin-imports
```

## Usage

转换规则可以直接在 .babelrc 文件中配置，也可以在 ruleExtend.js 文件中配置。  

Rules:  
[.babelrc 配置示例](.babelrc)  
[ruleExtend.js 配置示例](ruleExtend.js)  

Before:  
``` javascript
// ImportSpecifier
import { importedName_1 as localName_1, importedName_2 } from 'moduleName';

// ImportDefaultSpecifier
import localName_3 from 'moduleName';

// ImportNamespaceSpecifier
import * as localName_4 from 'moduleName';
```

After:  
``` javascript
// ImportSpecifier
import localName_1 from 'moduleName/path/importedName_1';
import importedName_2 from 'moduleName/path/importedName_2';

// ImportDefaultSpecifier

import { default as localName_3 } from 'moduleName/path/';

// ImportNamespaceSpecifier

import localName_4 from 'moduleName/path/';
```

## License

This project is licensed under MIT.