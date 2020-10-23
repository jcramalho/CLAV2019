<template>
  <v-card>
    <v-card-title class="error title white--text" dark>
      <v-icon color="white" class="ma-1">error</v-icon>
      Erros detetados na validação:
      {{ erros.length }}
    </v-card-title>
    <v-card-text>
      <v-row v-for="(m, i) in erros" :key="i">
        <v-col cols="3">
          <div class="info-label">{{ m.sobre }}</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ m.mensagem }}</div>
        </v-col>
      </v-row>

      <v-row class="ma-1">
        <p>Por favor devolva o pedido ou tente novamenete mais tarde.</p>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn class="indigo accent-4" rounded dark @click="voltar()">
        Voltar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["erros"],

  methods: {
    voltar() {
      this.$emit("fecharErro");
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
