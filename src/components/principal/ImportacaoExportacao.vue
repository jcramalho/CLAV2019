<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      Importação/Exportação de Dados
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card>
        <v-card-text v-for="colecao in this.colecoes" :key="colecao.nome">
          <p>{{ colecao.nome }}</p>
          <div v-if="level >= min">
            <v-btn
              color="indigo accent-4"
              dark
              small
              class="ma-2"
              @click="go(`${colecao.importar}`)"
              >Importar</v-btn
            >
            <v-btn
              color="indigo accent-4"
              dark
              small
              class="ma-2"
              @click="exportarFicheiro(`${colecao.exportar}`)"
              >Exportar</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";
const lhost = require("@/config/global").host;

export default {
  props: ["level"],
  data() {
    return {
      colecoes: [
        {
          nome: "Colaborações",
          importar: "/colaboracoes/importar",
          exportar: "/colaboracoes"
        },
        {
          nome: "Documentação de Apoio",
          importar: "/documentacaoApoio/importar/documentacao_apoio",
          exportar: "/documentacaoApoio"
        },
        {
          nome: "Documentação Técnica/Científica",
          importar: "/documentacaoApoio/importar/tecnico_cientifico",
          exportar: "/documentacaoCientifica"
        },
        {
          nome: "Notícias",
          importar: "/noticias/importar",
          exportar: "/noticias"
        }
      ],
      min: NIVEL_MINIMO_ALTERAR
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
      var token = await this.$getAuthToken();
      token = token.replace(" ", "=");

      var path = `/${colecao}/exportar`;
      path = lhost + path + "?" + token;
      this.download(path, "");
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    }
  }
};
</script>
