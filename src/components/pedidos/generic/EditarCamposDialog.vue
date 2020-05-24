<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      <v-icon color="white" class="ma-1">create</v-icon>
      Editar o campo:
      {{ campo.campo }}
    </v-card-title>
    <v-card-text>
      <p>Teste</p>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="fechar()">
        Cancelar
      </v-btn>

      <v-btn color="indigo accent-4 white--text" rounded @click="editar()">
        Editar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["campo"],

  data() {
    return {
      campos: {
        sigla: "teste",
      },
    };
  },

  methods: {
    fechar() {
      this.$emit("fechar");
    },

    editar() {
      const dados = this.campos[this.campo.key];
      this.$emit("editarCampo", dados);
    },
  },
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
