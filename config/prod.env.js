'use strict';
let baseUrl = 'https://www.findif.cn/';//正式环境
// let baseUrl = 'https://webapp.hiwan.net.cn/';//测试环境
module.exports = {
  NODE_ENV: '"production"',
  BACKEND_SERVER: JSON.stringify(process.env.BACKEND_SERVER || baseUrl)
};
