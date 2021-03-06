var path = require('path');
const gitc = require('git-config').sync();
var licenses = require('generator-license').licenses;

module.exports = [
  {
    message: 'What is the project name?',
    name: 'name',
    type: 'input',
    when: true,
    default: process.cwd().split(path.sep).pop()
  },
  {
    message: 'Describe your project:',
    name: 'description',
    type: 'input',
    when: true,
    default(results) {
      return results.name;
    }
  },
  {
    message: 'Author\'s Name?',
    name: 'authorName',
    type: 'input',
    when: !gitc.user || !gitc.user.name,
    default: gitc.user ? gitc.user.name : undefined
  },
  {
    message: 'Author\'s Email?',
    name: 'authorEmail',
    type: 'input',
    when: !gitc.user || !gitc.user.email,
    default: gitc.user ? gitc.user.email : undefined
  },
  {
    message: 'Author\'s Homepage?',
    name: 'authorUrl',
    type: 'input',
    when: true,
    default(results) {
      let email = results.authorEmail || gitc.user.email;
      return email ? `https://github.com/${email.replace(/@.*/, '')}` : undefined;
    }
  },
  {
    message: 'What is the url to your project\'s repository:',
    name: 'repository',
    type: 'input',
    when: true,
    default(results) {
      let email = results.authorEmail || gitc.user.email;
      return email ? `https://github.com/${email.replace(/@.*/, '')}/${results.name}` : undefined;
    }
  },
  // {
  //     message: 'Where is the project entry file?',
  //     help: `Your bundle is generated from the entry file – all its dependencies will be included, along with their dependencies, and so on. The entry file's exports become the bundle's exports.`,
  //     name: 'entry',
  //     type: 'input',
  //     when: true,
  //     default: 'src/index.js'
  // },
  // {
  //     message: `Place to write ES module file`,
  //     name: 'esFile',
  //     type: 'input',
  //     when: true,
  //     default (results) {
  //         return `dist/${results.name}.es.js`;
  //     }
  // },
  {
    type: 'list',
    name: 'license',
    message: 'Which license do you want to use?',
    choices: licenses,
    when: true,
    default: 'MIT'
  },
  {
    message: 'Additional format generated bundle (optional)?',
    name: 'format',
    type: 'list',
    when: true,
    default: 'umd',
    choices: [
      {name: 'umd – Universal Module Definition, works as amd, cjs and iife all in one', value: 'umd', short: 'umd'},
      {name: 'amd – Asynchronous Module Definition, used with module loaders like RequireJS', value: 'amd', short: 'amd'},
      {name: 'cjs – CommonJS, suitable for Node and Browserify/Webpack', value: 'cjs', short: 'cjs'},
      {name: 'iife – A self-executing function, suitable for inclusion as a <script> tag', value: 'iife', short: 'iife'}
      // { name: 'only ES', value: '' }
    ]
  },
  {
    when(results) {
      return results.format;
    },
    message(results) {
      return `Place to write ${results.format} module file`;
    },
    name: 'bundleFile',
    type: 'input',
    default(results) {
      return `dist/${results.name}.${results.format}.js`;
    }
  },
  {
    message: 'What\'s the max size (in kilobytes) of your bundle?',
    name: 'bundlesizeThreshold',
    type: 'input',
    when: true,
    default: 50,
    validate: value => isFinite(value),
    filter: value => parseFloat(value)
  }
];
