import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/sys/login',
    method: 'post',
    params: params
  })
}

export function logout() {
	return request({
		url: 'sys/logout',
		method: 'get'
	})
}

export function fetchUserList(params) {
	return request({
		url: '/sys/user/list',
		method: 'get',
		params: params
	})
}

export function getUser(id) {
  return request({
    url: '/sys/user',
    method: 'get',
    params: { id }
  })
}

export function addUser(params) {
  return request({
    url: '/sys/user',
    method: 'post',
    params: params
  })
}

export function editUser(params) {
  return request({
    url: '/sys/user',
    method: 'put',
    params: params
  })
}

export function viewUser(id) {
  return request({
    url: '/sys/user/view',
    method: 'get',
    params: { id }
  })
}

export function deleteUser(id) {
  return request({
    url: '/sys/user/',
    method: 'delete',
    params: { id }
  })
}

export function resetPassword(id) {
  return request({
    url: '/sys/user/password/reset',
    method: 'put',
    params: { id }
  })
}

export function updatePassword(params) {
  return request({
    url: '/sys/user/password/update',
    method: 'put',
    params: params
  })
}

export function changeStatus(params) {
  return request({
    url: '/sys/user/status/change',
    method: 'put',
    params: params
  })
}

