import got from 'got'
import {FETCH_URL, COOKIE, XSRF} from './config/index.js'
import {download} from './lib/index.js'
import {getTargetDestination, randomDelay} from './util/index.js'
import {
  getWeiboFetchHeaders,
  getWeiboUrlByStatus,
  normalizeWeiboUrl
} from './util/weibo.js'
import {dirname as pathDirname, resolve as pathResolve} from 'path'
import {fileURLToPath} from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = pathDirname(__filename)
;(async function () {
  const headers = getWeiboFetchHeaders(COOKIE, XSRF)
  let hasDownloadUrls = []
  let index = 0
  while (true) {
    try {
      await run()
      await randomDelay()
    } catch (e) {
      console.log(e)
    }
    if (process.env.NODE_ENV == 'debug') {
      break
    }
  }
  async function run() {
    let urls = []
    const {
      data: {statuses}
    } = await got(FETCH_URL, {
      headers
    }).json()
    for (const status of statuses) {
      await getWeiboUrlByStatus(status, urls)
    }
    console.log(++index, urls.length)
    try {
      for (let url of urls) {
        if (hasDownloadUrls.indexOf(normalizeWeiboUrl(url)) == -1) {
          await download(url, pathResolve(__dirname, getTargetDestination()))
          hasDownloadUrls.push(normalizeWeiboUrl(url))
        }
      }
    } catch (e) {
      console.log(e)
    }
    console.log(hasDownloadUrls.length)
  }
})()
