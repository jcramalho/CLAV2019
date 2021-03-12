<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Importação/Exportação de Dados</p>
    <p class="content-text px-8 py-2">
      Área reservada à importação e/ou exportação de informação relativa a
      colaborações/equipas de trabalho, de documentação de apoio e técnica/científica e
      também de notícias sobre a plataforma.
    </p>
    <v-row justify="center" align="center">
      <v-col cols="12" justify="center" align="center">
        <div class="clav-info-content">
          <v-select
            class="mt-n1 mb-2 px-8"
            v-model="opcao"
            :items="selectDados"
            item-text="label"
            item-value="links"
            label="Selecione o tipo de dados pretendido"
            hide-details
            single-line
          />
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbarError" :timeout="2000" color="error" top="true">
      Nenhuma opção se encontra selecionada.
      <v-btn icon color="white" @click="fecharSnackbar">
        <unicon
          name="remove-icon"
          width="15"
          height="15"
          viewBox="0 0 20.71 20.697"
          fill="#ffffff"
        />
      </v-btn>
    </v-snackbar>
    <v-row justify="center" align="center">
      <v-col cols="12" md="3">
        <v-btn
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="go(`${opcao.importar}`)"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="importar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 18.121"
            fill="#ffffff"
          />
          <p class="ml-2">Importar</p>
        </v-btn>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn
          v-if="
            this.$userLevel() === 7 &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
          @click="exportarFicheiro(`${opcao.exportar}`)"
          rounded
          class="white--text clav-linear-background"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
        >
          <unicon
            name="exportar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 18.001"
            fill="#ffffff"
          />
          <p class="ml-2">Exportar</p>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
const lhost = require("@/config/global").host;
export default {
  name: "ImportacaoExportacaoInfo",
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      selectDados: [
        {
          label: "Colaborações",
          links: {
            importar: "/colaboracoes/importar",
            exportar: "/colaboracoes",
          },
        },
        {
          label: "Documentação de Apoio",
          links: {
            importar: "/documentacaoApoio/importar/documentacao_apoio",
            exportar: "/documentacaoApoio",
          },
        },
        {
          label: "Documentação Técnica/Científica",
          links: {
            importar: "/documentacaoApoio/importar/tecnico_cientifico",
            exportar: "/documentacaoCientifica",
          },
        },
        {
          label: "Notícias",
          links: {
            importar: "/noticias/importar",
            exportar: "/noticias",
          },
        },
      ],
      opcao: "",
      snackbarError: false,
    };
  },
  methods: {
    download(path, filename) {
      var element = document.createElement("a");

      element.setAttribute("href", path);
      element.setAttribute("download", filename);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    async exportarFicheiro(colecao) {
      if (!this.opcao) {
        this.snackbarError = !this.snackbarError;
      } else {
        var token = await this.$getAuthToken();
        token = token.replace(" ", "=");

        var path = `/${colecao}/exportar`;
        path = lhost + path + "?" + token;
        this.download(path, "");
      }
    },
    go: function (url) {
      if (!this.opcao) {
        this.snackbarError = !this.snackbarError;
      } else {
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          this.$router.push(url);
        }
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
  },
};
</script>
<style scoped></style>
