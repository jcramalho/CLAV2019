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
    }
    //     redirecionar() {
    //   this.$router.push(`${this.uri ? this.uri : "/"}`);
    // },
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
