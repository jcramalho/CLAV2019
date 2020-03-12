<template>
  <div>
    <v-row>
      <v-col>
        <Operacoes :level="level" />
      </v-col>
      <v-col>
        <Gestao v-if="level > 0" :level="level" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
/* eslint-disable */
import Operacoes from "@/components/principal/Operacoes.vue";
import Gestao from "@/components/principal/Gestao.vue";

export default {
  components: {
    Operacoes,
    Gestao
  },
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      level: 0,
      entidade: "Nome da Entidade"
    };
  },
  created: async function() {
    try {
      let response = await this.$request("get", "/notificacoes");
      this.$emit("userNotificacoes", response.data);
    } catch (error) {
      return error;
    }
  },
  mounted: async function() {
    this.level = await this.$userLevel(this.$store.state.token);
  }
};
</script>
