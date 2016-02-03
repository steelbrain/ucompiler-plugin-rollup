'use babel'

import Path from 'path'

export function requireDependency(name, rootDirectory) {
  if (name.indexOf('rollup-plugin-') === -1) {
    name = 'rollup-plugin-' + name
  }

  try {
    return require(Path.join(rootDirectory, 'node_modules', name))
  } catch (_) {}
  try {
    return require(name)
  } catch (_) {}

  throw new Error(`Rollup plugin '${name}' not found in '${rootDirectory}'`)
}
