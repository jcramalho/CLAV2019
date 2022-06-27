<template>
  <v-card class="pa-3" flat>
    <Loading v-if="!noticiaReady" :message="'a notícia'" />
    <div v-else>
      <v-row align="center" class="mb-5">
        <v-col>
          <span class="clav-content-title-2">
            {{ this.titulo }}
          </span>
        </v-col>
        <v-col cols="2" align="center" justify="center">
          {{ this.noticia.data }}
        </v-col>
      </v-row>
      <p class="text-justify" v-html="compiledMarkdown" />

      <Voltar class="mt-5" />
    </div>
  </v-card>
</template>

<script>
import { marked } from "marked";
import Loading from "@/components/generic/Loading";
import Voltar from "@/components/generic/Voltar";

export default {
  components: {
    Loading,
    Voltar,
  },
  data: () => ({
    idNoticia: "",
    noticia: {
      titulo: "",
      data: "",
      desc: "",
    },
    titulo: "",
    noticiaReady: false,
  }),
  computed: {
    compiledMarkdown: function () {
      //return marked(this.noticia.desc, { sanitize: true });
      return marked(this.noticia.desc);
    },
  },
  methods: {
    preparaNoticia: async function (not) {
      try {
        var myNoticia = {
          titulo: not.titulo,
          data: not.data,
          desc: not.desc,
        };
        return myNoticia;
      } catch (e) {
        return {};
      }
    },
  },
  created: async function () {
    try {
      this.idNoticia = window.location.pathname.split("/")[2];

      // Informações sobre a noticia
      var response = await this.$request("get", "/noticias/" + this.idNoticia);
      this.titulo = response.data.titulo;
      this.noticia = await this.preparaNoticia(response.data);

      this.noticiaReady = true;
    } catch (e) {
      return e;
    }
  },
};
</script>
