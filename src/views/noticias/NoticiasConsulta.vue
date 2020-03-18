<template>
  <v-card class="ma-4">
    <Loading v-if="!noticiaReady" :message="'a notícia'" />
    <!--Consulta
      v-else
      tipo="Notícias"
      v-bind:objeto="noticia"
      v-bind:titulo="titulo"
      v-bind:data="data"
      v-bind:desc="desc"
    /-->

    <v-card-title v-else class="indigo darken-4 white--text">{{
      this.titulo
    }}</v-card-title>
    <v-card-text>
      <p>{{ this.noticia.data.text }}</p>
      <p class="text-justify" v-html="compiledMarkdown" />
      <v-spacer />

      <v-row>
        <v-col>
          <v-btn
            class="indigo accent-4 white--text mr-4"
            @click="$router.go(-1)"
            >Voltar</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import marked from "marked";
import Consulta from "@/components/generic/Consulta.vue";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    //Consulta,
    Loading
  },
  data: () => ({
    idNoticia: "",
    noticia: {},
    titulo: ""
  }),
  computed: {
    compiledMarkdown: function() {
      return marked(this.noticia.desc.text, { sanitize: true });
    }
  },
  methods: {
    preparaNoticia: async function(not) {
      try {
        var myNoticia = {
          titulo: {
            campo: "Titulo",
            text: not.titulo
          },
          data: {
            campo: "Data",
            text: not.data
          },
          desc: {
            campo: "Desc",
            text: not.desc
          }
        };
        return myNoticia;
      } catch (e) {
        return {};
      }
    }
  },
  created: async function() {
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
  }
};
</script>
