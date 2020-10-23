<template>
  <v-card>
    <v-card-title class="error white--text">
      <v-icon class="mr-2" color="white">error</v-icon>
      Erros encontrados
    </v-card-title>

    <v-card-text>
      <v-alert
        v-for="(erro, index) in erros"
        :key="index"
        icon="error"
        color="red"
        text
        class="mt-8 mb-0"
        border="left"
      >
        <h5>{{ erro.parametro }}</h5>
        <p>{{ erro.mensagem }}</p>
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn text rounded color="red" dark @click="redirecionar()"> -->
      <v-btn text rounded color="red" dark @click="fechar()">
        Fechar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["erros"],

  methods: {
    fechar() {
      this.$emit("fecharErro");
    },
    //     redirecionar() {
    //   this.$router.push(`${this.uri ? this.uri : "/"}`);
    // },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
