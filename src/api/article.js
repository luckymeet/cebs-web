import request from '@/utils/request'

export function fetchArticleList(query) {
  return request({
    url: '/info/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/info/article',
    method: 'get',
    params: { id }
  })
}

export function createArticle(data) {
  return request({
    url: '/info/article',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/info/article',
    method: 'put',
    data
  })
}
