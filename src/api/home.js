import request from '@/utils/request'

export function getMenuPerms() {
  return request({
    url: '/sys/perm/menu',
    method: 'get',
  })
}

export function getButtonPerms() {
  return request({
    url: '/sys/perm/menu',
    method: 'get',
  })
}