<template>
  <v-dialog v-model="dialog" width="80%" persistent>
    <v-card dark class="info-card">
      <v-card-title class="headline mb-4">
        Erros detetados na validação: {{ erros.length }}
      </v-card-title>
      <v-card-text class="font-weight-medium">
        <v-row v-for="(e, i) in erros" :key="i">
          <v-col cols="3">
            <div class="info-label px-3">{{ e.sobre }}</div>
          </v-col>
          <v-col>
            <div class="info-content px-3">{{ e.mensagem }}</div>
          </v-col>
        </v-row>
      </v-card-text>
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
  props: ['erros'],

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
.info-label {
  color: #1a237e !important;
  padding: 8px;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
</style>
