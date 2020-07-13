<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Comparação de duas etapas
    </v-card-title>

    <v-card-text class="ma-0">
      <v-stepper v-model="etapa" alt-labels>
        <v-stepper-header>
          <!-- Step 1 -->
          <v-stepper-step :complete="etapa > 1" step="1" editable>
            Etapas a comparar
          </v-stepper-step>

          <v-divider />

          <!-- Step 2 -->
          <v-stepper-step :complete="etapa > 2" step="2">
            Comparação
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-autocomplete
              v-model="etapasSelecionadas"
              :items="etapasHistorico"
              filled
              multiple
              chips
              hide-selected
              deletable-chips
              class="m-2 mt-4"
            >
            </v-autocomplete>

            <v-btn
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="gerarTabela()"
            >
              Continuar
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-data-table :items="dadosTabela" class="elevation-1">
            </v-data-table>

            <v-btn
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="etapa = 1"
            >
              Voltar
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="fechar()">
        Fechar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["historico", "distribuicao", "tipoPedido"],

  data() {
    return {
      dadosTabela: [],
      etapa: 1,
      etapasHistorico: [],
      etapasSelecionadas: [],
      defaultHeaders: [],
    };
  },

  created() {
    const index = this.distribuicao.findIndex(
      (dist) => dist.estado === "Distribuído"
    );

    this.distribuicao.splice(index, 1);

    switch (this.tipoPedido) {
      case "Criação":
        this.preparaHistoricoCriacao();
        break;
      case "Alteração":
      case "Extinção":
        this.preparaHistoricoAlteracao();
        break;

      default:
        break;
    }

    this.preparaDadosTabela();
  },

  methods: {
    gerarTabela() {
      let indexA;
      let indexB;

      if (
        this.etapasSelecionadas[0] === "Pedido Submetido" ||
        this.etapasSelecionadas[0] === "Alteração Submetida"
      )
        indexA = 0;
      else
        indexA = this.distribuicao.findIndex(
          (dist) => dist.estado === this.etapasSelecionadas[0]
        );

      if (
        this.etapasSelecionadas[1] === "Pedido Submetido" ||
        this.etapasSelecionadas[1] === "Alteração Submetida"
      )
        indexB = 0;
      else
        indexB = this.distribuicao.findIndex(
          (dist) => dist.estado === this.etapasSelecionadas[1]
        );

      // if (this.etapasSelecionadas[0] ===)
      this.etapa = 2;
    },

    preparaHistoricoCriacao() {
      this.distribuicao.forEach((dist) => {
        if (dist.estado === "Submetido")
          this.etapasHistorico.push("Pedido Submetido");
        else this.etapasHistorico.push(dist.estado);
      });
    },

    preparaHistoricoAlteracao() {
      this.distribuicao.forEach((dist) => {
        if (dist.estado === "Submetido")
          this.etapasHistorico.push("Alteração Submetida");
        else this.etapasHistorico.push(dist.estado);
      });
    },

    preparaDadosTabela() {
      this.historico.forEach((h) => this.dadosTabela.push(h));
    },

    cancelar() {
      this.$emit("fecharDialog");
    },
  },
};
</script>
