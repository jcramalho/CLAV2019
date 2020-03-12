<template>
  <div>
    <v-row>
      <v-col>
        <Operacoes :level="level" />
      </v-col>

      <v-col>
        <v-row align="center">
          <v-col class="text-center">
            <Gestao 
              v-if="level > 0" 
              :level="level" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <Notificacoes 
      :level="level" 
      :drawer="drawN" 
      :notificacoes="notificacoes"
      @removerNotificacao="removerNotificacao($event)"/> 
    <Definicoes 
      :level="level" 
      :drawer="drawD"/> 
  </div>
</template>

<script>
import Operacoes from "@/components/principal/Operacoes.vue";
import Gestao from "@/components/principal/Gestao.vue";
import Notificacoes from "@/components/principal/Notificacoes.vue";
import Definicoes from "@/components/principal/Definicoes.vue";

export default {
  props: ["drawN", "drawD", "notificacoes"],
  components: {
    Operacoes,
    Gestao,
    Notificacoes,
    Definicoes
  },
  data() {
    return {
      panelHeaderColor: "indigo darken-4",
      level: 0,
      entidade: "Nome da Entidade"
    };
  },
  methods: {
    removerNotificacao(id) {
      this.$emit('removerNotificacao', id)
    }
  },
  mounted: async function() {
    this.level = await this.$userLevel(this.$store.state.token);
  }
};
</script>
