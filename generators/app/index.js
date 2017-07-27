'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const extend = require('deep-extend');
const prompts = require('./prompts');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the priceless ' + chalk.red('generator-rollup-ts') + ' generator!'
    ));

    let options = {};
    prompts.forEach(p => {
      options[p.name] = p.default;
    });

    return this.prompt(prompts).then(props => {
      props.entry = 'lib/index.js';
      props.esFile = props.entry;
      let entry = path.parse(props.entry);

      let bundleFile = props.bundleFile || '';

      let outputDir = 'dist/';
      let bundleName = path.basename(props.bundleFile);
      let minifyFile = path.join(outputDir, bundleName.replace(path.extname(bundleName), '.min.js'));

      this.props = Object.assign({
        entryPath: entry.dir,
        entryTest: path.resolve(entry.dir, entry.name + '.spec' + entry.ext),
        bundleFile,
        minifyFile
      }, options, props);
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('src/index.ts'),
      this.destinationPath('src/index.ts'),
    );

    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
    );

    this.fs.copyTpl(
      this.templatePath('rollup.config.js'),
      this.destinationPath('rollup.config.js'),
      this.props
    );

    this.fs.copy(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );

    this.fs.copy(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json'),
    );

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    let newPkg = extend({
      name: this.props.name,
      main: this.props.bundleFile || this.props.esFile,
      module: this.props.esFile,
      version: '0.0.1',
      license: this.props.license,
      description: this.props.description,
      homepage: this.props.homepage,
      repository: this.props.repository,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      scripts: {
        build: 'run-s compile lint package minify nsp',
        compile: 'tsc -p tsconfig.json',
        lint: 'tslint -c tslint.json -p tsconfig.json',
        minify: `uglifyjs ${this.props.bundleFile} --compress --mangle --source-map -o ${this.props.minifyFile}`,
        nsp: 'nsp check',
        package: 'rollup -c rollup.config.js',
        prestart: 'run-s build',
        start: 'run-p watch:*',
        'watch:compile': 'npm run compile -- --watch',
        'watch:lint': `chokidar "src/**/*.ts" -c "npm run lint"`,
        'watch:package': 'npm run package -- --watch',
        'watch:minify': `chokidar "${this.props.bundleFile}" -c "npm run minify"`
      }
    }, pkg);

    this.fs.writeJSON(this.destinationPath('package.json'), newPkg);
  }

  install() {
    this.npmInstall([
      'tslib'
    ], {
      save: true
    });

    this.npmInstall([
      'chokidar-cli',
      'npm-run-all',
      'nsp',
      'rollup',
      'rollup-plugin-node-resolve',
      'rollup-plugin-sourcemaps',
      'rollup-watch',
      'tslint',
      'typescript',
      'uglify-js'
    ], {
      'save-dev': true
    });

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
