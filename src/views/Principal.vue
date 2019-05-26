<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap justify-center>
      <Info />
      <DocumentacaoApoio />
    </v-layout>

    <v-layout row wrap justify-center>
      <Operacoes />
      <Entidades />
    </v-layout>
  </v-container>
</template>

<script>
import Info from "@/components/principal/Info.vue";
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";
import Operacoes from "@/components/principal/Operacoes.vue";
import Entidades from "@/components/principal/Entidades.vue";

export default {
  components: {
    Info, DocumentacaoApoio, Operacoes, Entidades
  },

  methods: {
    go: function(url) {
      this.$router.push(url);
    }
  },
  data() {
    return {
      panelHeaderColor: "indigo accent-4",
    };
  }
};
</script>
