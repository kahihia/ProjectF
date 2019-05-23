export function setLocalData (item,data) {
  localStorage.setItem(item, JSON.stringify(data))
}
export function getIsData (item) {
  return !!localStorage.getItem(item)
}
export function getLocalData (item) {
  return localStorage.getItem(item) ? JSON.parse(localStorage.getItem(item)) : ''
}
export function clearLocalData (item) {
  localStorage.removeItem(item)
}
export function getLocalPosition (position) {
  return localStorage.getItem(position) ? JSON.parse(localStorage.getItem(position)).position : ''
}
export function setSessionData (item,data) {
  sessionStorage.setItem(item, JSON.stringify(data))
}
export function getSessionData (item) {
  sessionStorage.getItem(item)
}
