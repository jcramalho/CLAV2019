<template>
  <v-app-bar
    color="indigo darken-4"
    dark
    dense
    height="80px"
    style="max-height:80px"
  >
    <v-toolbar-title
      >DGLAB - Direção-Geral do Livro, dos Arquivos e das
      Bibliotecas</v-toolbar-title
    >
    <v-spacer></v-spacer>

    <div class="body-2">Versão: 20200207</div>

    <v-spacer></v-spacer>

    <v-toolbar-title>
      <v-btn text depressed href="mailto:clav@dglab.gov.pt">Contactos</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-img :src="require('./../assets/feder.png')" aspect-ratio="4.8600" />
  </v-app-bar>
</template>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>
