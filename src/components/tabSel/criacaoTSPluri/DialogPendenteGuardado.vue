<template>
  <v-dialog v-model="dialog" persistent max-width="60%">
    <v-card dark class="info-card">
      <v-card-title class="headline mb-2"
        >Trabalho pendente guardado</v-card-title
      >
      <v-card-text class="pa-2 px-6 font-weight-medium">
        <div class="info-content mb-3">
          <p>
            Os seus dados foram guardados para que possa retomar o trabalho mais
            tarde.
          </p>
          <p>Registado com os seguintes dados:</p>
        </div>
        <v-row>
          <v-col cols="3">
            <div class="info-label px-3">Identificador</div>
          </v-col>
          <v-col>
            <div class="info-content px-3">{{ pendente._id }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <div class="info-label px-3">Criador</div>
          </v-col>
          <v-col>
            <div class="info-content px-3">{{ pendente.criadoPor }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <div class="info-label px-3">Data de criação</div>
          </v-col>
          <v-col>
            <div class="info-content px-3">{{ pendente.dataCriacao }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <div class="info-label px-3">Data da última atualização</div>
          </v-col>
          <v-col>
            <div class="info-content px-3">{{ pendente.dataAtualizacao }}</div>
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
