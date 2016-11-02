/*!
 * gh-download <https://github.com/tunnckoCore/gh-download>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

const fs = require('fs')
const utils = require('./utils')

module.exports = (src, dest, callback) => {
  const args = utils.parse(src)
  const url = `https://github.com/${args.repository}/archive/${args.branch}.zip`
  const stream = utils.request(url)
  const name = `${args.repository.replace('/', '-')}-${args.branch}.zip`

  stream.once('error', callback)
  stream.pipe(fs.createWriteStream(name))
  .once('close', () => {
    fs.readFile(name, (err, buf) => {
      if (err) return callback(err)
      utils.unzip()(buf).then((files) => {
        callback(null, files)
      }, callback)
    })
  })
}
