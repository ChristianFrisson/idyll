const { join } = require('path')
const slash = require('slash');
const fs = require('fs');

const parse = require('csv-parse/lib/sync')

const errors = require('../errors.js');
var debug = require('debug')('idyll:cli');

class DataResolver {
  constructor(options, paths) {
    this.paths = paths
  }

  resolve(name, source) {
    debug(`Resolving data with name ${name} and source ${source}`);

    if (name[0] !== 'value') {
      throw new errors.UnsupportedDataTypeError(name[0]);
    }
    if (source[0] !== 'value') {
      throw new errors.UnsupportedDataTypeError(source[0]);
    }

    name = name[1];
    source = source[1];

    var data = null;

    if (source.endsWith('.csv')) {
      debug(`Loading ${source} as a CSV into data variable ${name}`);
      debug(slash(join(this.paths.DATA_DIR, source)));
      const inputString = fs.readFileSync(slash(join(this.paths.DATA_DIR, source)));
      debug(inputString);
      debug(parse(inputString, { cast: true }));
      data = parse(inputString, { cast: true });
      debug(`${JSON.stringify(data)}`);
    } else if (source.endsWith('.json')) {
      debug(`Loading ${source} as a JSON document into data variable ${name}`);
      data = require(slash(join(this.paths.DATA_DIR, source)));
    } else {
      throw new errors.UnknownDataError(source);
    }

    return {
      resolvedName: name,
      data
    };
  }

  getDirectories() {
    return [this.paths.DATA_DIR];
  }
}

module.exports.DataResolver = DataResolver;