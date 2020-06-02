<template>
  <v-app-bar
    color="indigo darken-4"
    dark
    dense
    height="80px"
    style="max-height:80px"
  >
    <v-toolbar-title>
      DGLAB - Direção-Geral do Livro, dos Arquivos e das Bibliotecas
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <div class="body-2">Versão: 2020-06-02</div>

    <v-spacer></v-spacer>

    <div v-if="ontoReady" class="body-2">Ontologia: {{ ontologia }}</div>

    <v-spacer></v-spacer>

    <v-toolbar-title>
      <v-btn text depressed href="mailto:clav@dglab.gov.pt">Contactos</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-img :src="require('./../assets/feder.png')" aspect-ratio="4.8600" />
  </v-app-bar>
</template>

<script>
export default {
  data: function() {
    return {
      ontoReady: false,
      ontologia: ""
    };
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/ontologia/data");
      this.ontologia = response.data;
      this.ontoReady = true;
    } catch (error) {
      return error;
    }
  }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>
