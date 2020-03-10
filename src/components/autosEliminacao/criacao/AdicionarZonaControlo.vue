<template>
  <div>
    <v-row justify="end" class="mx-2">
      <v-btn
        @click="addZC = true"
        style="color: #1a237e; background-color: #dee2f8;"
        >Adicionar Zona de Controlo</v-btn
      >
    </v-row>
    <v-dialog v-model="addZC">
      <DialogZonaControlo
        v-bind:auto="auto"
        v-bind:classes="classes"
        v-bind:entidades="entidades"
        v-bind:closeZC="closeZC"
        v-bind:classesCompletas="classesCompletas"
      />
    </v-dialog>
    <v-snackbar v-model="snackbar" color="success">
      Zona de Controlo adicionada com sucesso!
      <v-btn dark text @click="snackbar = false">
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import DialogZonaControlo from "@/components/autosEliminacao/criacao/DialogZonaControlo.vue";

export default {
  props: ["classes", "entidades", "auto", "classesCompletas"],
  components: {
    DialogZonaControlo
  },
  data: () => ({
    snackbar: false,
    addZC: false
  }),
  methods: {
    closeZC: function() {
      this.addZC = false;
      this.snackbar = true;
    }
  }
};
</script>
