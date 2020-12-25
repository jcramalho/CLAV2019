<template>
  <v-main class="px-12">
    <p class="content-title-1">Entidades</p>
    <p class="content-text px-8 py-2">
      Catálogo de entidades públicas que intervêm nos processos de negócio (classes de 3º
      nível da Lista Consolidada). Podem integrar uma ou mais tipologias de entidades.
    </p>
    <p class="content-text px-8 py-2">
      Para aceder ao catálogo de entidades, selecione a opção <b>CONSULTAR</b>.
    </p>
    <p class="content-text px-8 py-2">
      Para adicionar entidades, selecione a opção
      <b>ADICIONAR. Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>
    <p class="content-text px-8 py-2">
      Para editar entidades, selecione a opção
      <b>EDITAR. Deve estar registado na CLAV para aceder a esta funcionalidade.</b>
    </p>
    <v-container fluid style="text-align: center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            @click="$router.push('/entidades/consultar')"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            id="default-button"
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
            @click="$router.push('/entidades/criar')"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            id="default-button"
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
            @click="entidadesDialog = true"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            id="default-button"
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
      :ativo="entidadesDialog"
      :items="entidades.entidades"
      tipo="Entidade"
      @fechar="entidadesDialog = !entidadesDialog"
    />
  </v-main>
</template>

<script>
import CaixaDeDialogo from "@/components/generic/CaixaDeDialogo";
export default {
  name: "Entidades",
  components: {
    CaixaDeDialogo,
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      entidadesDialog: false,
      entidades: {
        entidades: [],
        ready: false,
      },
      dadosEditar: null,
    };
  },
  methods: {
    preparaEntidades(dados) {
      let dadosTratados = dados.filter((dado) => dado.estado === "Ativa");
      dadosTratados = dadosTratados.map((dado) => `${dado.sigla} - ${dado.designacao}`);
      this.entidades.entidades = dadosTratados;
      this.entidades.ready = true;
    },
    go: function (url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
  },
  async created() {
    let responseEntidades = await this.$request("get", "/entidades?processos=sem");
    this.preparaEntidades(responseEntidades.data);
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
