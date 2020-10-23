const userLevel = {
  install(Vue) {
    Vue.prototype.$userLevel = function() {
      var level;
      if (this.$store.state.token != "") {
        let userInfo = this.$verifyTokenUser();
        level = userInfo.level;
      } else {
        level = 0;
      }
      return level;
    };
  }
};

export default userLevel;
