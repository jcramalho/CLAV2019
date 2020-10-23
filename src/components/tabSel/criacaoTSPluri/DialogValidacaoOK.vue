<template>
    <v-dialog v-model="dialog" width="60%">
        <v-card>
            <v-card-title>Tabela de Seleção validada</v-card-title>
            <v-card-text>
                <p>
                    A validação da Tabela de Seleção não detetou erros.
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="success" dark @click="dialog=false; $emit('continuar');">Continuar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: ["pendente"],

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