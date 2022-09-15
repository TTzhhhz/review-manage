import request from '@/utils/request'
// 登陆api
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
// 获取用户资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST',
  })
}
// 获取用户基本信息,为了显示头像，也包含用户密码
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

// 保存用户基本信息
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}



export function logout() {

}
