import axios from "axios";
import { host } from "@/config/global";

const userLevel = {
  install(Vue) {
    Vue.prototype.$userLevel = async function(token) {
      let userInfo = await axios.get(`${host}/api/users/listarToken/${token}`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      return userInfo.data.level;
    };
  }
};

export default userLevel;
