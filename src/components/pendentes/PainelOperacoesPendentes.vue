<template>
  <div>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="$emit('continuar')"
              color="indigo darken-2"
              v-on="on"
              >edit</v-icon>
          </template>
          <span>Continuar trabalho</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              @click="$emit('show')"
              color="indigo darken-2"
              v-on="on"
              >visibility</v-icon>
          </template>
          <span>Ver pedido...</span>
        </v-tooltip>
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-icon
                    @click="pendenteEliminado=true"
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
            <v-btn color="indigo darken-1" text @click="$emit('apagar'); pendenteEliminado = false"
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
