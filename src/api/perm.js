import request from '@/utils/request'

export function queryCurUserOneLevelPermList(id) {
  return request({
    url: '/sys/perm/one-level/list',
    method: 'get',
    params: { id }
  })
}

export function queryLowerLevelPermList(parentId) {
  return request({
    url: '/sys/perm/lower-level/list',
    method: 'get',
    params: { parentId }
  })
}

export function queryCurUserPermTree() {
  return request({
    url: '/sys/perm/tree',
    method: 'get',
    params: {}
  })
}