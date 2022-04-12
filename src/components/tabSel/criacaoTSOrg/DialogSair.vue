<template>
    <v-dialog v-model="dialog" persistent max-width="60%">
        <v-card>
            <v-card-title class="headline">Gravar e Sair</v-card-title>
            <v-card-text>
                <p>O seu trabalho foi gravado na lista de trabalhos pendentes.
                </p>
            </v-card-text>
            <v-card-actions>
                 <v-spacer></v-spacer>
                <v-btn color="red" text @click="$emit('fechar');dialog = false">
                    Fechar
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