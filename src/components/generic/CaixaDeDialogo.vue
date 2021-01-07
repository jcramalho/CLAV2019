<template>
  <v-dialog v-model="ativo">
    <v-card dark class="info-card">
      <v-card-title>Selecione a {{ tipo }} a alterar</v-card-title>
      <div class="info-content">
        <v-tooltip top color="info" open-delay="500">
          <template v-slot:activator="{ on }">
            <v-autocomplete
              v-model="dadosEditar"
              :items="items"
              :label="tipo"
              light
              clearable
              v-on="on"
            />
          </template>
          <span v-if="dadosEditar">{{ dadosEditar }}</span>
          <span v-else>Selecionar {{ tipo }}</span>
        </v-tooltip>
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success darken-1"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="editar(tipo)"
        >
          Alterar
        </v-btn>
        <v-btn
          color="error darken-4"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="
            dadosEditar = null;
            fechar();
          "
          >Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CaixaDeDialogo",
  props: ["ativo", "tipo"],
  data() {
    return {
      dadosEditar: null,
      ativar: false,
      items: [],
      ready: false,
      legislacao: {
        legislacao: [],
        legislacaoItems: [],
      },
    };
  },
  methods: {
    editar(caso) {
      switch (caso) {
        case "Tipologia":
          this.$router.push(`/tipologias/editar/tip_${this.dadosEditar.split(" ")[0]}`);
          break;
        case "Entidade":
          this.$router.push(`/entidades/editar/ent_${this.dadosEditar.split(" ")[0]}`);
          break;
        case "Legislação":
          let leg = null;
          leg = this.legislacao.legislacao.find(
            (legislacao) => legislacao.numero === this.dadosEditar.split(" ")[0]
          );
          this.$router.push(`/legislacao/editar/${leg.id}`);
          break;
        default:
          break;
      }
      this.fechar();
    },

    // para os dialogs
    preparaEntidades(dados) {
      let dadosTratados = dados.filter((dado) => dado.estado === "Ativa");
      dadosTratados = dadosTratados.map((dado) => `${dado.sigla} - ${dado.designacao}`);
      this.items = dadosTratados;
      this.ready = true;
    },
    preparaTipEntidades(dados) {
      let dadosTratados = dados.filter((dado) => dado.estado === "Ativa");
      dadosTratados = dadosTratados.map((dado) => `${dado.sigla} - ${dado.designacao}`);
      this.items = dadosTratados;
      this.ready = true;
    },
    preparaLegislacoes(legislacoes) {
      this.legislacao.legislacao = JSON.parse(JSON.stringify(legislacoes));
      let dadosTratados = legislacoes.filter((leg) => leg.estado === "Ativo");

      dadosTratados = dadosTratados.map(
        (legislacao) =>
          `${legislacao.numero} - ${legislacao.sumario} - ${legislacao.tipo}`
      );

      this.legislacao.legislacaoItems = dadosTratados;
      this.items = dadosTratados;
      this.ready = true;
    },
    fechar() {
      this.$emit("fechar");
    },
  },
  async created() {
    switch (this.tipo) {
      case "Tipologia":
        let responseTipologias = await this.$request("get", "/tipologias");
        this.preparaTipEntidades(responseTipologias.data);
        break;
      case "Entidade":
        let responseEntidades = await this.$request("get", "/entidades?processos=sem");
        this.preparaEntidades(responseEntidades.data);
        break;
      case "Legislação":
        let responseLegislacoes = await this.$request("get", "/legislacao");
        this.preparaLegislacoes(responseLegislacoes.data);
        break;
      default:
        break;
    }
  },
};
</script>

<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.info-content {
  padding: 8px;
  margin: 15px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
