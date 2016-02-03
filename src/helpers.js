'use babel'

import Path from 'path'

export function requireDependency(name, rootDirectory) {
  try {
    return require(Path.join(rootDirectory, 'node_modules', name))
  } catch (_) {}
  try {
    require(name)
  } catch (_) {}

  throw new Error(`Rollup plugin '${name}' not found in '${rootDirectory}'`)
}
