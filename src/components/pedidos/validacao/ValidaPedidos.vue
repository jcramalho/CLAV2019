<template>
  <v-row class="ma-1">
    <Loading v-if="loading" :message="'pedido'" />
    <v-row v-else class="ma-1">
      <v-col>
        <v-card>
          <v-card-title class="indigo darken-4 title white--text" dark>
            Validação do pedido: {{ pedido.codigo }} -
            {{ pedido.objeto.acao }} de
            {{ pedido.objeto.tipo }}
          </v-card-title>
          <v-card-text>
            <ValidaEntidade
              v-if="pedido.objeto.tipo === 'Entidade'"
              :p="pedido"
            />
            <!-- <AnalisaLeg
              v-if="pedido.objeto.tipo === 'Legislação'"
              :p="pedido"
            />
            <AnalisaTipologiaEntidade
              v-if="pedido.objeto.tipo === 'Tipologia'"
              :p="pedido"
            /> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
// import AnalisaLeg from "@/components/pedidos/analise/AnalisaLegislacao";
import ValidaEntidade from "@/components/pedidos/validacao/ValidaEntidade";
// import AnalisaTipologiaEntidade from "@/components/pedidos/analise/AnalisaTipologiaEntidade";

import Loading from "@/components/generic/Loading";

export default {
  props: ["idp"],

  components: {
    ValidaEntidade,
    // AnalisaLeg,
    Loading
    // AnalisaTipologiaEntidade
  },

  data() {
    return {
      loading: true,
      pedido: {},
      pedidoLoaded: false,
      headers: [
        { text: "Estado", align: "left", sortable: false, value: "estado" },
        { text: "Data", value: "data" },
        { text: "Responsável", value: "responsavel" },
        { text: "Despacho", value: "despacho" }
      ],
      etapas: []
    };
  },

  async created() {
    try {
      const { data } = await this.$request("get", "/pedidos/" + this.idp);
      this.pedido = data;
      this.pedidoLoaded = true;
      this.loading = false;
    } catch (err) {
      this.snackbar.visivel = true;
      this.snackbar.texto = "Erro ao carregar dados da base de dados";
    }
  }
};
</script>
