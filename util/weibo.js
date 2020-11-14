import {parse as urlParse} from 'url'
import got from 'got'
export function normalizeWeiboUrl(url) {
  const {hostname, pathname} = urlParse(url)
  return hostname + pathname
}
export function getWeiboFetchHeaders(cookie, xsrf) {
  return {
    accept: `application/json, text/plain, */*`,
    'accept-encoding': `gzip, deflate, br`,
    'accept-language': `zh-CN,zh;q=0.9`,
    'cache-control': `no-cache`,
    cookie,
    'mweibo-pwa': 1,
    pragma: `no-cache`,
    referer: ` https://m.weibo.cn/`,
    'sec-fetch-mode': `cors`,
    'sec-fetch-site': `same-origin`,
    'user-agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1`,
    'x-requested-with': `XMLHttpRequest`,
    'x-xsrf-token': xsrf
  }
}
export function getWeiboStoryHeaders(url) {
  return {
    Accept: 'application/json, text/plain, */*',
    Referer: `${encodeURIComponent(url)}`,
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    'X-Requested-With': 'XMLHttpRequest'
  }
}
export function getWeiboStoryUrl(url) {
  return url.replace(/(\/index)/, '/object')
}

export async function getWeiboUrlByStatus(status, urls) {
  const {pics, page_info} = status
  if (page_info && page_info.media_info) {
    urls.push(
      page_info.media_info.stream_url_hd || page_info.media_info.stream_url
    )
  } else if (pics && pics.length > 0) {
    pics.map((pic) => {
      urls.push((pic.large && pic.large.url) || pic.url)
    })
  } else if (page_info && page_info.type === 'story') {
    let {page_url} = page_info
    let storyUrl = getWeiboStoryUrl(page_url)
    let response = await got(storyUrl, {
      headers: getWeiboStoryHeaders(storyUrl)
    }).json()
    if (
      response &&
      response.data &&
      response.data.object &&
      response.data.object.stream &&
      response.data.object.stream.url
    ) {
      urls.push(response.data.object.stream.url)
    }
  }
}
