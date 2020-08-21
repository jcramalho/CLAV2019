<template>
  <v-dialog v-model="dialog" persistent max-width="60%">
    <v-card>
      <v-card-title class="headline"
        >Abandonar a criação da Tabela de Seleção</v-card-title
      >
      <v-card-text>
        <p>Pretende abandonar a tarefa?</p>
        <p>
          Gravou os dados antes de sair? Caso não o tenha feito, volte atrás,
          grave os dados, e selecione "Sair" novamente.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red"
          text
          @click="
            $emit('continuar');
            dialog = false;
          "
        >
          Não, enganei-me, pretendo continuar.
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="
            $emit('sair');
            dialog = false;
          "
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
    };
  },

  mounted: function() {
    this.dialog = true;
  }
};
</script>
