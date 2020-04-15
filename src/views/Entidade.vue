<template>
  <div>
    <v-row>
      <v-col>
        <Info v-if="this.$store.state.name === ''"/>
        <Operacoes :level="level" />
        <Noticias :level="level" />
      </v-col>
      <v-col>
        <DocumentacaoApoio />
        <Registo v-if="this.$store.state.name === ''"/>
        <Gestao v-if="level > 0" :level="level" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
/* eslint-disable */
import Operacoes from "@/components/principal/Operacoes.vue";
import Gestao from "@/components/principal/Gestao.vue";
import Noticias from "@/components/principal/Noticias.vue";
import Info from "@/components/principal/Info.vue";
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";
import Registo from "@/components/principal/Registo.vue";

export default {
  components: {
    Info,
    DocumentacaoApoio,
    Registo,
    Operacoes,
    Noticias,
    Gestao
  },
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      level: 0,
      entidade: "Nome da Entidade"
    };
  },
  mounted: async function() {
    this.level = await this.$userLevel(this.$store.state.token);
  }
};
</script>
