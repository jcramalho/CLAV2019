<template>
  <div>
    <v-row class="mx-4">
      <v-btn @click="addZC=true" style="color: #1a237e; background-color: #dee2f8;">Adicionar Classe</v-btn>
    </v-row>
    <v-dialog v-model="addZC">
      <DialogZonaControlo 
        v-bind:auto="auto"
        v-bind:classes="classes"
        v-bind:entidades="entidades"
        v-bind:closeZC="closeZC"
        v-bind:classesCompletas="classesCompletas"
        v-bind:donos="donos"
      />
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      Classe adicionada com sucesso!
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
import DialogZonaControlo from "@/components/autosEliminacao/criacao/DialogZonaControlo.vue"

export default {
  props: ["classes", "entidades", "auto", "classesCompletas","donos"],
  components: {
    DialogZonaControlo
  },
  data: () => ({
    snackbar: false,
    addZC: false,
  }),
  methods: {
    closeZC: function () {
      this.addZC = false
      this.snackbar = true
    }
  }
};
</script>