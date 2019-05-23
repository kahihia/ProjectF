import {objKeySort} from './sort'
import 'js-base64';
import md5 from 'js-md5'
// 签名验证
export function signFn(params) {
  var new_params = objKeySort(params);
  var str = '';
  for(var key in new_params) {
    str+=new_params[key]
  }
  //加密字符串
  return Base64.encode(md5(str + 'NDQ0NTlmMDk4MTU3NTg3NzFiZTFlZmQwNDFjNzA0ZGMyYWY0NzU5ZQ=='));
}
