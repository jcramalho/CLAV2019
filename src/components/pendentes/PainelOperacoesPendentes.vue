<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon @click="$emit('continuar')" color="indigo darken-2" v-on="on"
          >edit</v-icon
        >
      </template>
      <span>Continuar trabalho</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon @click="$emit('show')" color="indigo darken-2" v-on="on"
          >visibility</v-icon
        >
      </template>
      <span>Ver pedido...</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-icon
          @click="pendenteEliminado = true"
          color="indigo darken-2"
          v-on="on"
          >delete</v-icon
        >
      </template>
      <span>Cancelar/apagar trabalho pendente</span>
    </v-tooltip>

    <!-- Cancelamento do trabalho pendente: confirmação -->
    <v-dialog v-model="pendenteEliminado" width="50%">
      <v-card>
        <v-card-title>Cancelamento do pedido.</v-card-title>
        <v-card-text>
          <p>Selecionou o cancelamento deste trabalho.</p>
          <p>Toda a informação introduzida será eliminada.</p>
          <p>
            Confirme a decisão para ser reencaminhado para a página principal.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="indigo darken-1"
            text
            @click="
              $emit('apagar');
              pendenteEliminado = false;
            "
            >Confirmo</v-btn
          >
          <v-btn color="red darken-1" dark @click="pendenteEliminado = false"
            >Enganei-me, desejo continuar o trabalho</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pendenteEliminado: false
    };
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
