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
    url: '/info/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/info/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/info/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/info/article/update',
    method: 'post',
    data
  })
}
