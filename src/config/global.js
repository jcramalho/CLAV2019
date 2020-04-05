//const dominioDefault = "http://clav-test.di.uminho.pt";
//const dominioDefault = "http://localhost:7779";
//const dominioDefault = "http://localhost:8080"; //para o nginx proxy quando a interface é local e está em localhost:8080
const dominioDefault = "http://clav.dglab.gov.pt"; //para o nginx proxy quando a interface não é local
//const dominioDefault = "http://epl.di.uminho.pt:7781";

const dominio = process.env.VUE_APP_API_URL || dominioDefault;
const apiVersion = process.env.VUE_APP_API_VERSION || "v2";

module.exports.host = dominio + "/" + apiVersion;
 