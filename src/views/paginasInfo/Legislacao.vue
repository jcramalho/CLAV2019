<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Legislação</p>
    <p class="clav-content-text px-8 py-2">
      Catálogo de legislação que regula os processos de negócio (classes de 3º nível da
      Lista Consolidada) e enquadra os respetivos prazos de conservação administrativa
      (PCA) e destino final (DF). Do catálogo constam ainda as fontes de legitimação, isto
      é, a portaria ou despacho que integra as tabelas de seleção, onde estão
      estabelecidas as decisões de avaliação que fundamentam a ação de eliminação.
    </p>
    <p class="clav-content-text px-8 py-2">
      Para aceder à legislação, selecione a opção <b>CONSULTAR</b>.
    </p>
    <p class="clav-content-text px-8 py-2">
      Para adicionar legislação, selecione a opção
      <b>ADICIONAR. Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>
    <p class="clav-content-text px-8 py-2">
      Para editar legislação, selecione a opção
      <b>EDITAR. Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>
    <v-container fluid style="text-align: center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            @click="$router.push('/legislacao/consultar')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="consultar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.697"
              fill="#ffffff"
            />
            <p class="ml-2">Consultar</p>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="4"
          v-if="
            [1, 3, 3.5, 4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
        >
          <v-btn
            @click="$router.push('/legislacao/criar')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="criar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.721"
              fill="#ffffff"
            />
            <p class="ml-2">Adicionar</p>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="4"
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
        >
          <v-btn
            @click="legislacaoDialog = true"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="alterar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.727"
              fill="#ffffff"
            />
            <p class="ml-2">Editar</p>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <CaixaDeDialogo
      :ativo="legislacaoDialog"
      :items="legislacao.legislacaoItems"
      tipo="Legislação"
      @fechar="legislacaoDialog = !legislacaoDialog"
      @editar="editar($event)"
    />
  </v-card>
</template>

<script>
import CaixaDeDialogo from "@/components/generic/CaixaDeDialogo";
export default {
  name: "LegislacaoInfo",
  components: {
    CaixaDeDialogo,
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      legislacaoDialog: false,
      legislacao: {
        legislacao: [],
        legislacaoItems: [],
        ready: false,
      },
      dadosEditar: null,
    };
  },
  methods: {
    preparaLegislacoes(legislacoes) {
      this.legislacao.legislacao = JSON.parse(JSON.stringify(legislacoes));
      let dadosTratados = legislacoes.filter((leg) => leg.estado === "Ativo");

      dadosTratados = dadosTratados.map(
        (legislacao) =>
          `${legislacao.numero} - ${legislacao.sumario} - ${legislacao.tipo}`
      );

      this.legislacao.legislacaoItems = dadosTratados;
      this.legislacao.ready = true;
    },
    go: function (url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    editar(dadosEditar) {
      let leg = null;
      leg = this.legislacao.legislacao.find(
        (legislacao) => legislacao.numero === dadosEditar.split(" ")[0]
      );
      this.go(`/legislacao/editar/${leg.id}`);
    },
  },
  async created() {
    let responseLegislacoes = await this.$request("get", "/legislacao");
    this.preparaLegislacoes(responseLegislacoes.data);
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
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
