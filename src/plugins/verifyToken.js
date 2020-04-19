var jwt = require("jsonwebtoken");
import apiKey from "!raw-loader!./keys/apiKey.pub";
import userKey from "!raw-loader!./keys/userKey.pub";

var axios = require("axios");
const lhost = require("@/config/global").host;

const verifyToken = {
  install(Vue) {
    Vue.prototype.$verifyTokenUser = function(tokenP) {
      var token = tokenP || this.$store.state.token;
      try {
        var decoded = jwt.verify(token, userKey, {
          algorithms: ["RS256"]
        });
        return decoded;
      } catch (err) {
        this.$store.commit("guardaTokenUtilizador", "");
        this.$store.commit("guardaNomeUtilizador", "");
        this.$store.commit("guardaEntidade", "");

        this.$router.push(
          "/users/autenticacao?erro=" +
            encodeURIComponent(
              "A sua sessão expirou! Por favor faça login novamente."
            )
        );
      }
    };
    Vue.prototype.$verifyTokenKey = function() {
      try {
        var decoded = jwt.verify(this.$store.state.clavToken, apiKey, {
          algorithms: ["RS256"]
        });
        return decoded;
      } catch (err) {
        return null;
      }
    };
  }
};

export default verifyToken;
