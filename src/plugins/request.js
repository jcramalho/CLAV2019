var axios = require("axios");
const lhost = require("@/config/global").host;

async function getAuthToken(store) {
  var auth = "";
  if (store.state.token != "") {
    auth = "token " + store.state.token;
  } else {
    var apikey;
    var response;
    try {
      if (store.state.clavToken != "") {
        var expDate = new Date(store.state.expClavToken * 1000);
        var atualDate = new Date();

        //verifica se o token ainda não expirou
        if (expDate.getTime() >= atualDate.getTime()) {
          apikey = store.state.clavToken;
        } else {
          response = await axios.get(lhost + "/api/chaves/clavToken");
          apikey = response.data.token;
          store.commit("guardaTokenCLAV", apikey);
          store.commit("guardaExpTokenCLAV", response.data.exp);
        }
      } else {
        response = await axios.get(lhost + "/api/chaves/clavToken");
        apikey = response.data.token;
        store.commit("guardaTokenCLAV", apikey);
        store.commit("guardaExpTokenCLAV", response.data.exp);
      }
    } catch (erro) {
      apikey = "";
    }
    auth = "apikey " + apikey;
  }

  return auth;
}

async function exec(type, path, data, config, store, router) {
  config = config || null;
  data = data || null;
  var authToken = await getAuthToken(store);
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
    var httpStatus = erro.response.status;

    if (httpStatus == 401) {
      store.commit("guardaTokenUtilizador", "");
      store.commit("guardaNomeUtilizador", "");

      router.push(
        "/users/autenticacao?erro=" +
          encodeURIComponent(
            "A sua sessão expirou! Por favor faça login novamente."
          )
      );
    } else if (httpStatus == 403) {
      router.push(
        "/?erro=" +
          encodeURIComponent(
            "Não tem permissões suficientes para realizar o seu pedido!"
          )
      );
    } else {
      throw erro;
    }
  }
}

const request = {
  install(Vue, options) {
    Vue.prototype.$request = function(type, path, data, config) {
      return exec(type, path, data, config, this.$store, this.$router);
    };
  }
};

export default request;
