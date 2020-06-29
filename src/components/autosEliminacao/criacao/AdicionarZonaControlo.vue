<template>
  <div>
    <v-row class="mx-4">
      <v-btn @click="addZC=true" dark color="indigo darken-4">Adicionar Classe</v-btn>
    </v-row>
    <v-dialog v-model="addZC">
      <DialogZonaControlo
        v-bind:auto="auto"
        v-bind:classes="classes"
        v-bind:entidades="entidades"
        v-bind:closeZC="closeZC"
        v-bind:classesCompletas="classesCompletas"
        v-bind:donos="donos"
        v-bind:tipo="tipo"
      />
    </v-dialog>
  </div>
</template>
<script>
import DialogZonaControlo from "@/components/autosEliminacao/criacao/DialogZonaControlo.vue";

export default {
  props: ["classes", "entidades", "auto", "classesCompletas","donos","tipo"],
  components: {
    DialogZonaControlo
  },
  data: () => ({
    addZC: false,
  }),
  methods: {
    closeZC: function () {
      this.addZC = false
    }
  }
};
</script>
