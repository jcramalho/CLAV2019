<template>
    <v-dialog v-model="dialog" width="60%">
        <v-card>
            <v-card-title>Trabalho pendente guardado</v-card-title>
            <v-card-text>
                <p>
                    Os seus dados foram guardados para que possa retomar o
                    trabalho mais tarde.
                </p>
                <p>Registado com os seguintes dados:</p>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Identificador</v-list-item-title>
                        <v-list-item-subtitle>{{ pendente._id }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Criador</v-list-item-title>
                        <v-list-item-subtitle>{{ pendente.criadoPor }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Data de criação</v-list-item-title>
                        <v-list-item-subtitle>{{ pendente.dataCriacao }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Data da última atualização</v-list-item-title>
                        <v-list-item-subtitle>{{ pendente.dataAtualizacao }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" dark @click="dialog=false; $emit('continuar');">Fechar</v-btn>
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