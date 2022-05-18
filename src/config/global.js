// const dominioDefault = "http://clav-test.di.uminho.pt";
const dominioDefault = "http://localhost:7779";
//const dominioDefault = "http://192.168.1.130:7779";
//const dominioDefault = "http://localhost:8080"; //para o nginx proxy quando a interface é local e está em localhost:8080
// const dominioDefault = "http://clav.dglab.gov.pt"; //para o nginx proxy quando a interface não é local
//const dominioDefault = "http://clav.di.uminho.pt"; //para o nginx proxy quando a interface não é local
//const dominioDefault = "http://epl.di.uminho.pt:7781";
//const dominioDefault = "https://clav-api-https.di.uminho.pt";

const dominio = process.env.VUE_APP_API_URL || dominioDefault;
const apiVersion = process.env.VUE_APP_API_VERSION || "v2";

module.exports.interfaceVersion = process.env.VUE_APP_INTERFACE_VERSION || "2022-05-05";

module.exports.host = dominio + "/" + apiVersion;
