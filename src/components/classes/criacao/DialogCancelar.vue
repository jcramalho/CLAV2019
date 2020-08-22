<template>
    <!-- Cancelamento da criação duma classe: confirmação ........... -->
      <v-dialog v-model="dialog" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Cancelamento e eliminação do pedido de criação de classe
          </v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento da criação da classe.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" text @click="$emit('continuar');dialog = false">
                    Não, enganei-me, pretendo continuar.
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="$emit('sair'); dialog = false;"
                >
                    Sim, confirmo.
                </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    
</template>

<script>
export default {
  
  data: function() {
    return {
      dialog: false
    }
  },

  mounted: function(){
    this.dialog = true;
  }
}

</script>