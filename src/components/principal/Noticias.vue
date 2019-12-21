<template>
  <v-card class="ma-4 pa-2">
    <v-toolbar color="indigo darken-4" dark>
      <v-toolbar-title>Notícias</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="(n, index) in myNoticias" :key="index">
          <v-expansion-panel-header class="blue lighten-5">
            {{ n.titulo }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p>{{ n.data }}</p>
            <p v-html="n.desc"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
const nlista = require('@/data/noticias').noticias
export default {
  data() {
    return {
      myNoticias: nlista,
      publicPath: process.env.BASE_URL
    };
  }
};
</script>