import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    params: data
  })
}

export function logout() {
	return request({
		url: 'sys/logout',
		method: 'get'
	})
}

export function getInfo(token) {
  return request({
    url: '/sys/user/info',
    method: 'get',
    params: { token }
  })
}


export function fetchList(query) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: query
  })
}
