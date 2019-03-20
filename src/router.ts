import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => 
        import("./views/Principal.vue")
    },
    // Routes das classes
    {
      path: "/classes",
      name: "classes",
      component: () => 
        import("./views/classes/Classes.vue")
    },
    {
      path: "/classes/:idClasse",
      name: "consultaClasse",
      component: () => 
        import("./views/classes/ClassesConsulta.vue")
    },
    // Routes dos pedidos
    {
      path: "/consulta/:idPedido",
      name: "consultaPedido",
      component: () => 
        import("./views/Consulta.vue")
    },
    {
      path: "/pedidos",
      name: "pedidos",
      component: () => 
        import("./views/Pedidos.vue")
    }
  ]
});
