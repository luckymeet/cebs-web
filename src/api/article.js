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

export function viewArticle(id) {
  return request({
    url: '/info/article/view',
    method: 'get',
    params: { id }
  })
}

export function deleteArticle(id) {
  return request({
    url: '/info/article',
    method: 'delete',
    params: { id }
  })
}

export function publish(params) {
  return request({
    url: '/info/article/publish',
    method: 'put',
    params: params
  })
}

export function cancelPublish(id) {
  return request({
    url: '/info/article/cancel-publish',
    method: 'put',
    params: { id }
  })
}

export function changeStatus(params) {
  return request({
    url: '/info/article/status/change',
    method: 'put',
    params: params
  })
}

export function changeRecommend(params) {
  return request({
    url: '/info/article/recommend/change',
    method: 'put',
    params: params
  })
}
