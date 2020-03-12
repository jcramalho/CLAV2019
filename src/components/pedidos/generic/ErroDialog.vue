<template>
  <v-card>
    <v-card-title class="error title white--text" dark>
      <v-icon color="white" class="ma-1">error</v-icon>
      Erro
    </v-card-title>
    <v-card-text>
      <v-container>
        <h4>Erro ao finalizar o pedido.</h4>
        <br />
        <h6>
          Por favor tente novamente mais tarde.
        </h6>
      </v-container>
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
  methods: {
    voltar() {
      this.$router.push("/pedidos");
    }
  }
};
</script>
