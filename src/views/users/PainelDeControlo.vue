<template>
  <v-card flat class="ma-3">
    <p class="clav-content-title-1">Painel de controlo</p>
    <Loading v-if="loading" :message="'pedidos'" />
    <GestaoPedidos v-else :pedidos="pedidos" />

    <ListaPendentes @pendenteSelected="consultaPendente($event)" />
  </v-card>
</template>
<script>
import Loading from "@/components/generic/Loading";
import GestaoPedidos from "@/components/users/GestaoPedidos";
import ListaPendentes from "@/components/pendentes/ListaPendentes.vue"; // @ is an alias to /src

export default {
  components: {
    Loading,
    GestaoPedidos,
    ListaPendentes,
  },

  data() {
    return {
      loading: true,
      pedidos: [],
    };
  },

  async created() {
    try {
      let { email } = this.$verifyTokenUser();

      const { data } = await this.$request("get", `/pedidos?criadoPor=${email}`);

      this.pedidos = this.atualizaPedidos(data);

      this.loading = false;
    } catch (e) {
      console.log("e", e);
    }
  },

  methods: {
    consultaPendente: function (item) {
      this.$router.push("/pendentes/" + item.codigo);
    },
    atualizaPedidos(pedido) {
      return pedido.map((p) => {
        const dados = {};
        dados.codigo = p.codigo;
        dados.tipo = `${p.objeto.tipo} - ${p.objeto.acao}`;
        dados.data = this.converteData(p.data);
        dados.estado = p.estado;

        return dados;
      });
    },

    converteData(data) {
      let novaData = new Date(data);

      let ano = novaData.getFullYear();
      let mes = novaData.getMonth() + 1;
      let dia = novaData.getDate();

      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      return `${dia}-${mes}-${ano}`;
    },
  },
};
</script>
