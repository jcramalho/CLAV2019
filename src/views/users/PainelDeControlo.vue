<template>
  <v-card flat class="ma-3 pa-2">
    <p class="clav-content-title-1">Painel de controlo</p>
    <v-row>
      <v-col cols="9">
        <Loading v-if="loading" :message="'pedidos'" />
        <v-expansion-panels v-else>
          <GestaoPedidos :pedidos="pedidos" />
          <ListaPendentes @pendenteSelected="consultaPendente($event)" />
        </v-expansion-panels>
      </v-col>
      <v-col cols="3" align="center">
        <v-card class="fill-height">
          <v-card-title class="clav-content-title-2 justify-center">
            Notificações
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
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
