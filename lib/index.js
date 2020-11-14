import {resolve as pathResolve, parse as pathParse} from 'path'
import Download from 'download'
import {exist, rename, unlink, isSameFile} from '../util/index.js'

export async function download(url, dir, options = {}) {
  const {name, ext} = pathParse(url)
  const newName = name + Date.now()
  const path = pathResolve(dir, `./${name}${ext}`)
  const newPath = pathResolve(dir, `./${newName}${ext}`)
  const hasExist = await exist(path)
  if (hasExist) {
    await rename(path, newPath)
  }
  await Download(url, dir, options)
  if (hasExist) {
    if (await isSameFile(path, newPath)) {
      await unlink(newPath)
    }
  }
}
