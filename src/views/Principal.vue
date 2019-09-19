<template>
    <v-row>
      <v-col>
        <Info />
        <Operacoes />
      </v-col>

      <v-col>
        <DocumentacaoApoio />
        <IdentificacaoRepresentantes />
        <Gestao v-if="this.$store.state.name != ''"/>
      </v-col>
    </v-row>
</template>

<script>
import Info from "@/components/principal/Info.vue";
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";
import IdentificacaoRepresentantes from "@/components/principal/IdentificacaoRepresentantes.vue";
import Operacoes from "@/components/principal/Operacoes.vue";
//import Entidades from "@/components/principal/Entidades.vue";
import Gestao from "@/components/principal/Gestao.vue";

export default {
  components: {
    Info,
    DocumentacaoApoio,
    IdentificacaoRepresentantes,
    Operacoes,
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
