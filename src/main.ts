import Vue from "vue";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "bootstrap";
import verifyToken from "./plugins/verifyToken";
import request from "./plugins/request";
import userLevel from "./plugins/userLevel";
import { VueMaskDirective } from "v-mask";
import JsonCSV from "vue-json-csv";
import Unicon from "vue-unicons";
import {
  homeIcon,
  registoIcon,
  gestaoIcon,
  operacoesIcon,
  documentacaoIcon,
  estatisticasIcon,
  noticiasIcon,
  loginIcon,
  menuIcon,
  arrowDownIcon,
  perfilIcon,
  contactoIcon,
  alterarPasswordIcon,
  terminarSessaoIcon,
  consultarIcon,
  criarIcon,
  alterarIcon,
  importarIcon,
  exportarIcon,
  apiIcon,
  analiseIcon,
  usersIcon,
  adminIcon,
  zoomIcon,
  removeIcon,
  eliminarIcon,
  limparIcon,
  adicionarIcon,
  arrowBackIcon,
  continuarIcon,
  descricaoIcon,
  folderIcon,
  decisaoIcon,
  validarIcon,
  guardarIcon,
  relogioIcon,
  passwordIcon,
  emailIcon,
  ccIcon,
  entidadeIcon,
  recuperarPasswordIcon,
  cmdIcon,
  renovarApiIcon
} from "./custom-icons";

//import BootstrapVue from "bootstrap-vue";

//Vue.use(BootstrapVue);

import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(verifyToken);
Vue.use(request);
Vue.use(userLevel);
Vue.directive("mask", VueMaskDirective);
Vue.component("downloadCsv", JsonCSV);

Unicon.add([
  homeIcon,
  registoIcon,
  gestaoIcon,
  operacoesIcon,
  documentacaoIcon,
  estatisticasIcon,
  noticiasIcon,
  loginIcon,
  menuIcon,
  arrowDownIcon,
  perfilIcon,
  contactoIcon,
  alterarPasswordIcon,
  terminarSessaoIcon,
  consultarIcon,
  criarIcon,
  alterarIcon,
  importarIcon,
  exportarIcon,
  apiIcon,
  analiseIcon,
  usersIcon,
  adminIcon,
  zoomIcon,
  removeIcon,
  eliminarIcon,
  limparIcon,
  adicionarIcon,
  arrowBackIcon,
  continuarIcon,
  descricaoIcon,
  folderIcon,
  decisaoIcon,
  validarIcon,
  guardarIcon,
  relogioIcon,
  passwordIcon,
  emailIcon,
  ccIcon,
  entidadeIcon,
  recuperarPasswordIcon,
  cmdIcon,
  renovarApiIcon
]);
Vue.use(Unicon);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
