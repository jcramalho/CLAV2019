<template>
  <v-dialog v-model="dialog" persistent max-width="60%">
    <v-card dark class="info-card">
      <v-card-title class="headline mb-2">
        Abandonar a criação da Tabela de Seleção</v-card-title
      >
      <div class="info-content px-3 mx-6 mb-2">
        <v-card-text class="pa-2 px-4 font-weight-medium">
          <p>Pretende abandonar a tarefa?</p>
          <p>
            Caso não tenha gravado os dados, volte atrás, grave-os, e selecione
            "Continuar Depois" novamente.
          </p>
        </v-card-text>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success darken-1"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="
            $emit('sair');
            dialog = false;
          "
        >
          Confirmo
        </v-btn>
        <v-btn
          color="red darken-4"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="
            $emit('continuar');
            dialog = false;
          "
        >
          Enganei-me, desejo continuar o trabalho
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
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
