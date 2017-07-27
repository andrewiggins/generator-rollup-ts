import nodeResolve from "rollup-plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

let pkg = require('./package.json');

export default {
    entry: "<%= entry %>",

    targets: [{
        dest: pkg.main,
        format: '<%= format %>',
        moduleName: pkg.name,
        sourceMap: true
    }],

    plugins: [
        // Resolves npm packages from node_modules
        nodeResolve({
            module: true,
            jsnext: true,
        }),

        // Parses existing sourcemaps (e.g. sourcemaps produced by TypeScript)
        sourcemaps(),
    ]
};
