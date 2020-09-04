<template>
  <v-dialog :value="dialog" persistent width="70%">
    <v-card>
      <v-card-title
        class="indigo darken-4 title white--text mb-4"
        dark
      >Nota relativa ao campo: {{ campoText }}</v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="2">
            <div class="info-label">Nota</div>
          </v-col>

          <v-col>
            <v-textarea clearable filled auto-grow color="indigo" v-model="nota" label="Nota" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="red darken-4" text rounded dark @click="$emit('fechar')">Cancelar</v-btn>

        <v-btn
          color="indigo accent-4 white--text"
          rounded
          @click="$emit('adicionar', nota)"
        >Adicionar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["dialog", "campoText", "notaAtual"],

  data() {
    return {
      nota: null,
    };
  },

  created() {
    this.nota = this.notaAtual;
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
</style>
