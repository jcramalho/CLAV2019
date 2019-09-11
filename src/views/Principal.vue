<template>
  <v-container fluid>
    <v-row class="mb-6" justify="center">
      <v-col cols="6">
        <Info />
        <DocumentacaoApoio />
      </v-col>

      <v-col>
        <Entidades />
        <Gestao v-if="this.$store.state.name != ''"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Info from "@/components/principal/Info.vue";
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";
import Operacoes from "@/components/principal/Operacoes.vue";
import Entidades from "@/components/principal/Entidades.vue";
import Gestao from "@/components/principal/Gestao.vue";

export default {
  components: {
    Info,
    DocumentacaoApoio,
    Operacoes,
    Entidades,
    Gestao
  },

  methods: {
    go: function(url) {
      this.$router.push(url);
    }
  },
  data() {
    return {
      panelHeaderColor: "indigo accent-4"
    };
  }
};
</script>
