<template>
  <v-dialog v-model="dialog" width="60%">
    <v-card>
      <v-card-title>Tabela de Seleção com erros</v-card-title>
      <v-card-text>
        <p>
          Na validação foram detetados {{ erros.length }} erros na sua Tabela de
          Seleção:
        </p>
        <v-list-item v-for="(e, i) in erros" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ e.sobre }}</v-list-item-title>
            <v-list-item-subtitle>{{ e.mensagem }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="error"
          dark
          @click="
            dialog = false;
            $emit('continuar');
          "
          >Fechar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["erros"],

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
