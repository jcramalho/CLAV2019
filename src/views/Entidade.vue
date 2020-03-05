<template>
  <div>
    <v-row>
      <v-col>
        <Operacoes :level="level" />
      </v-col>

      <v-col>
        <Gestao v-if="level > 0" :level="level" />
      </v-col>
      <v-col>
        <Notificacoes :level="level"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Operacoes from "@/components/principal/Operacoes.vue";
import Gestao from "@/components/principal/Gestao.vue";
import Notificacoes from "@/components/principal/Notificacoes.vue";

export default {
  components: {
    Operacoes,
    Gestao,
    Notificacoes
  },

  methods: {
    go: function(url) {
      this.$router.push(url);
    }
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
