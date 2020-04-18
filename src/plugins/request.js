var axios = require("axios");
const lhost = require("@/config/global").host;

function redirectUser(objThis) {
  objThis.$store.commit("guardaTokenUtilizador", "");
  objThis.$store.commit("guardaNomeUtilizador", "");
  objThis.$store.commit("guardaEntidade", "");

  objThis.$router.push(
    "/users/autenticacao?erro=" +
      encodeURIComponent(
        "A sua sessão expirou! Por favor faça login novamente."
      )
  );
}

function redirectKey(objThis) {
  objThis.$store.commit("guardaTokenCLAV", "");

  objThis.$router.push(
    "/?erro=" +
      encodeURIComponent("Ocorreu um erro com o pedido. Tente de novo.")
  );
}

function parseError(erro, path, objThis) {
  if (erro.response && erro.response.status) {
    var httpStatus = erro.response.status;

    if (httpStatus == 401 && path != "/users/login") {
      if (objThis.$store.state.token != "") {
        redirectUser(objThis);
      } else {
        redirectKey(objThis);
      }
    } else if (httpStatus == 403) {
      objThis.$router.push(
        "/?erro=" +
          encodeURIComponent(
            "Não tem permissões suficientes para realizar o seu pedido!"
          )
      );
    } else {
      throw erro;
    }
  } else {
    throw erro;
  }
}

async function exec(type, path, data, config, objThis) {
  config = config || null;
  data = data || null;
  var authToken = await objThis.$getAuthToken();
  var url = lhost + path;

  if (config == null) {
    config = { headers: { Authorization: authToken } };
  } else {
    if (config.headers) {
      config.headers.Authorization = authToken;
    } else {
      config.headers = { Authorization: authToken };
    }
  }

  try {
    switch (type) {
      case "get":
        return await axios.get(url, config);
      case "post":
        return await axios.post(url, data, config);
      case "put":
        return await axios.put(url, data, config);
      case "delete":
        return await axios.delete(url, config);
      default:
        throw "Wrong REST method or not supported!";
    }
  } catch (erro) {
    parseError(erro, path, objThis);
  }
}

const request = {
  install(Vue) {
    Vue.prototype.$request = async function(type, path, data, config) {
      return await exec(type, path, data, config, this);
    };
    Vue.prototype.$getAuthToken = async function() {
      var auth = "";

      if (this.$store.state.token != "") {
        //verifica se o token ainda não expirou
        //se expirou o user será redirecionado
        this.$verifyTokenUser();
        auth = "token " + this.$store.state.token;
      } else {
        var apikey = this.$store.state.clavToken;

        //verifica se o token ainda não expirou
        var isValid = this.$verifyTokenKey();
        if (!isValid) {
          try {
            var response = await axios.get(lhost + "/chaves/clavToken");
            apikey = response.data.apikey;

            this.$store.commit("guardaTokenCLAV", apikey);
          } catch (erro) {
            redirectKey(this);
          }
        }
        auth = "apikey " + apikey;
      }

      return auth;
    };
  }
};

export default request;
