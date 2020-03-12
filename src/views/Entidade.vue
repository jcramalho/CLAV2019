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
  props: ["drawN", "drawD"],
  components: {
    Operacoes,
    Gestao,
    Notificacoes,
    Definicoes
  },
  data() {
    return {
      notificacoes: null,
      panelHeaderColor: "indigo darken-4",
      level: 0,
      entidade: "Nome da Entidade"
    };
  },
  methods: {
    removerNotificacao(id) {
      try {
        this.$request("delete", "/notificacoes/" + id);
        this.notificacoes = this.notificacoes.filter(notificacao => {
          return notificacao._id !== id;
        });
        this.$emit("atualizarTamanho", notificacoes.length);
      } catch (error) {
        return error;
      }
    }
  },
  created: async function() {
    try {
      let response = await this.$request("get", "/notificacoes");
      this.notificacoes = response.data;
      this.$emit("atualizarTamanho", this.notificacoes.length);
    } catch (error) {
      return error;
    }
  },
  mounted: async function() {
    this.level = await this.$userLevel(this.$store.state.token);
  }
};
</script>
