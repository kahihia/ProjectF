const state = {
  showBottomNav:true,//显示底部导航
  tab_index:null,//切换底部导航
  is_merchant:false,//是否为商户端或是用户端
};
const mutations = {
  updateBottomNav (state, payload) {
    state.showBottomNav = payload.showBottomNav;
  },
  selectedTab (state, payload) {
    state.tab_index = payload.tab_index;
  },
  userOrMerchant (state, payload) {
    state.is_merchant = payload.is_merchant;
  }
};
export default {
  state,
  mutations
}
