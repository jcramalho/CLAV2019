<template>
  <div>
    <v-row justify="end" class="ma-4">
      <v-btn @click="addAG=true" style="color: #1a237e; background-color: #dee2f8;">Adicionar Agregação</v-btn>
    </v-row>
    <v-dialog v-model="addAG" max-width="80%">
      <DialogAgregacao 
        v-bind:auto="auto"
        v-bind:index="index"
        v-bind:closeAg="closeAg"
      />
    </v-dialog>
    
    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      Agregação adicionada com sucesso!
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import DialogAgregacao from "@/components/autosEliminacao/criacao/DialogAgregacao.vue"

export default {
  props: ["auto","index"],

  components: {
    DialogAgregacao
  },

  data: () => ({

    snackbar: false,
    addAG: false,
  }),
  methods: {
    closeAg: function() {
      this.addAG = false
      this.snackbar = true
    }
  }
};
</script>