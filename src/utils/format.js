// 数据格式化
import format from 'dateformat'
var now = new Date();
export function formatDateTime (timestamp) {
  return timestamp && format(timestamp, 'yyyy-mm-dd HH:MM:ss')
}
export function formatDate (timestamp) {
  return timestamp && format(timestamp, 'yyyy-mm-dd')
}
export function nowTime() {
  format.masks.hammerTime = 'HH:MM';
  return format(now);
}
export function now_time(timestamp) {
  return timestamp && format(timestamp, 'HH:MM')
}
export function formatDate2 (timestamp) {
  let day = timestamp.getDay();
  let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let week = weeks[day];
  let md = format(timestamp, 'mm-dd');
  let date =week + '，' + md;
  return date
}
