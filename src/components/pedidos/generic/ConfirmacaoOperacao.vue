<template>
  <v-card>
    <v-card-title class="orange title white--text" dark>
      <v-icon color="white" class="ma-1">warning</v-icon>
      Atenção!
    </v-card-title>
    <v-card-text>
      <v-alert
        icon="warning"
        color="orange"
        text
        class="mt-8 mb-0"
        border="left"
      >
        <p>{{ mensagem }}</p>
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" dark rounded text @click="confirma()">
        Sim
      </v-btn>

      <v-btn color="indigo accent-4" rounded dark @click="fechar()">
        Não
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["mensagem"],

  methods: {
    fechar() {
      this.$emit("fechar");
    },

    confirma() {
      this.$emit("confirma");
    },
  },
};
</script>

<style scoped>
.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}
</style>
