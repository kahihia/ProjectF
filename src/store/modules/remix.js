const state = {
  isLoading: true,//加载中……
  errorImg: 'this.src="' + require('@/assets/images/default_img.png') + '"',//默认图片
  errorHeadImg: 'this.src="' + require('@/assets/images/head_init.png') + '"',//默认图片
  is_init:false,//是否初始化极光IM
  is_current_path:false,
  source:''
};
// mutations
const mutations = {
  updateLoadingStatus (state, payload) {
    state.isLoading = payload.isLoading;
  },
  updateJgInit(state, payload){
    state.is_init = payload.is_init
  },
  updateCurrentPath(state, payload){
    state.is_current_path = payload.is_current_path
  },
  updateSource(state, payload){
    state.source = payload.source
  }
};
export default {
  state,
  mutations
}
