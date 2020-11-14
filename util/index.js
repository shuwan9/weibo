import {
  readFile as fsReadFile,
  rename as fsRename,
  unlink as fsUnLink
} from 'fs/promises'
import md5 from 'md5'
export async function exist(path) {
  try {
    await fsReadFile(path)
    return true
  } catch (e) {
    return false
  }
}
export async function rename(oldPath, newPath) {
  return fsRename(oldPath, newPath)
}
export async function isSameFile(path, anotherPath) {
  return md5(await fsReadFile(path)) == md5(await fsReadFile(anotherPath))
}
export async function unlink(path) {
  return fsUnLink(path)
}
export async function randomDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 1000)
  })
}
export function getTargetDestination() {
  const now = new Date()
  return (
    'weibo/' +
    [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map(addZero)
      .join('_')
  )
}
export function addZero(s) {
  return ('0' + s).slice(-2)
}
