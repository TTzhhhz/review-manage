
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validMobile(num) {
  // 校验手机号
  return /^1[3-9]\d{9}$/.test(num)
}
