<template>
  <Loading v-if="!noticiasReady" :message="'notícias'" />
  <div v-else class="noticias ma-12">
    <div class="separador">
      <v-icon class="icon">mdi-newspaper</v-icon>
      <span class="noticias">Notícias</span>
      <div class="btns">
        <v-btn
          v-for="item in this.fops"
          rounded
          class="panelbtn"
          @click="go(item.url)"
          :key="item.url"
          >{{ item.label }}</v-btn
        >
      </div>
    </div>
    <v-carousel
      @mouseover.native="hover = false"
      @mouseleave.native="hover = true"
      :cycle="hover"
      progress
      progress-color="secondary"
      height="200"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item v-for="(n, index) in this.noticias" :key="index">
        <v-sheet class="conteudo" color="white" height="100%" tile>
          <span class="titulopainel">{{ n.titulo }}</span>
          <data class="data">{{ n.data }}</data>
          <div class="info">
            <p v-html="compiledMarkdown(n.desc)" />
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import marked from "marked";
import Loading from "@/components/generic/Loading";

export default {
  props: ["level"],
  data: () => ({
    hover: true,
    noticias: [],
    noticiasReady: false,
    publicPath: process.env.BASE_URL,
    operacoes: [
      {
        label: "Ver Mais",
        url: "/noticias",
        level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
      },
      {
        label: "Adicionar",
        url: "/noticias/criar",
        level: [3.5, 4, 5, 6, 7],
      },
    ],
  }),
  components: {
    Loading,
  },
  methods: {
    go: function (url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    filtraOps: function (operacoes) {
      var filtered = [];
      for (var i = 0; i < operacoes.length; i++) {
        var levelsSet = new Set();
        operacoes[i].level.forEach((l) => levelsSet.add(l));
        var levels = Array.from(levelsSet);
        if (levels.includes(this.level)) {
          filtered.push({
            label: operacoes[i].label,
            url: operacoes[i].url,
            level: operacoes[i].level,
          });
        }
      }
      return filtered;
    },
    compiledMarkdown: function (d) {
      //return marked(d || "", { sanitize: true });
      return marked(d || "");
    },
  },
  computed: {
    fops: function () {
      return this.filtraOps(this.operacoes);
    },
  },

  created: async function () {
    try {
      let response = await this.$request("get", "/noticias?recentes=sim");

      this.noticias = response.data;

      this.noticiasReady = true;
    } catch (e) {
      return e;
    }
  },
};
</script>

<style scoped>
.separador {
  display: grid;
  grid-template-columns: 0.05fr 0.15fr 0.5fr 0.3fr;
  grid-template-rows: 1fr;
  grid-template-areas: "icon titulo . btns";
  color: white;
  align-items: center;
  padding: 5px;
  font-weight: 400;
  min-height: 50px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
.icon {
  grid-area: icon;
  color: white;
}
.titulo {
  grid-area: titulo;
}

.btns {
  grid-area: btns;
}
.panelbtn {
  color: rgb(18, 18, 172);
  margin: 0px 5px;
}

.conteudo {
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
  grid-template-rows: 0.05fr 0.95fr;
  grid-template-areas:
    "titulopainel data"
    "info info";
}

.titulopainel {
  color: black;
  grid-area: titulopainel;
  padding: 1%;
  align-self: center;
  justify-self: center;
  font-weight: bold;
}
.data {
  align-self: center;
  justify-self: center;
  color: black;
  grid-area: data;
}
.info {
  border-top: 1px solid black !important;
  padding: 0% 5%;
  background-color: white !important;
  color: black;
  grid-area: info;
  overflow-y: scroll;
}
</style>
