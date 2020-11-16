<template>
  <v-dialog v-model="dialog" persistent max-width="60%">
    <v-card dark class="info-card">
      <v-card-title class="headline mb-2">Validação sem erros</v-card-title>
      <div class="info-content px-3 mx-6 mb-2">
        <v-card-text class="pa-2 px-4 font-weight-medium">
          <p>
            A informação introduzida não apresenta erros.
          </p>
        </v-card-text>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-4"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="
            dialog = false;
            $emit('continuar');
          "
        >
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['pendente'],

  data: function() {
    return {
      dialog: false,
    };
  },

  mounted: function() {
    this.dialog = true;
  },
};
</script>
<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
