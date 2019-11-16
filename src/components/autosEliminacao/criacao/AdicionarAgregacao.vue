<template>
  <div>
    <DialogAgregacao 
      v-bind:auto="auto"
      v-bind:index="index"
      v-bind:closeAg="closeAg"
    />
    
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