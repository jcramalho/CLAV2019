<template>
  <v-row>
    <v-col>
      <Info />
      <Operacoes :level="level" />
      <Noticias :level="level" />
    </v-col>

    <v-col>
      <DocumentacaoApoio />
      <Registo />
      <Gestao v-if="level > 0" :level="level" />
    </v-col>
  </v-row>
</template>

<script>
import Info from "@/components/principal/Info.vue";
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";
import Registo from "@/components/principal/Registo.vue";
import Operacoes from "@/components/principal/Operacoes.vue";
import Noticias from "@/components/principal/Noticias.vue";
import Gestao from "@/components/principal/Gestao.vue";

export default {
  components: {
    Info,
    DocumentacaoApoio,
    Registo,
    Operacoes,
    Noticias,
    Gestao
  },

  methods: {
    go: function(url) {
      this.$router.push(url);
    }
  },
  data() {
    return {
      panelHeaderColor: "indigo accent-4",
      level: 0
    };
  },
  mounted: async function() {
    this.level = await this.$userLevel(this.$store.state.token);
  }
};
</script>
