'use babel'

import Path from 'path'
import {rollup} from 'rollup'
import {requireDependency} from './helpers'

export const preprocessor = true
export const compiler = false
export const minifier = false

export function process(contents, {rootDirectory, filePath, config, state}) {
  const plugins = []

  plugins.push(requireDependency('memory', rootDirectory)({
    contents: contents,
    path: filePath
  }))

  const rollupConfig = config.rollup || {}
  if (typeof config.rollup === 'object' && config.rollup) {
    if (rollupConfig.npm === true) {
      plugins.push(requireDependency('npm', rootDirectory)({
        jsnext: true,
        main: true,
        builtins: false,
        extensions: [ '.js', '.json' ]
      }))
    }
    if (rollupConfig.commonjs === true) {
      plugins.push(requireDependency('commonjs', rootDirectory)())
    }

    if (typeof rollupConfig.plugins === 'object' && rollupConfig.plugins) {
      for (const name in rollupConfig.plugins) {
        const value = rollupConfig[name]
        if (typeof value === 'object' && value) {
          plugins.push(requireDependency(name, rootDirectory)(value))
        }
      }
    }
  }

  return rollup({
    entry: '__file__',
    plugins: plugins
  }).then(function(results) {
    const generated = results.generate({
      format: rollupConfig.format || 'cjs',
      sourceMap: true
    })
    generated.map.sources = generated.map.sources.map(function(mapPath) {
      return Path.relative(rootDirectory, mapPath)
    })
    results.modules.forEach(function(module) {
      const modulePath = module.id
      if (modulePath !== filePath) {
        state.imports.push(modulePath)
      }
    })
    return {
      contents: generated.code,
      sourceMap: generated.map
    }
  })
}
