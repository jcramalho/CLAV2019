<template>
  <v-dialog :value="dialogState">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">Importar Classes</v-card-title>
      <v-card-text>
        <ImportarFicheiro label="Ficheiro Classes" @ficheiro="novoFicheiroClasses" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogState = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ImportarFicheiro from "@/components/rada/importacao/importarFicheiro";

export default {
  props: ["dialog"],
  data: () => ({
    ficheiroClasses: null,
    ficheiroUIs: null
  }),
  methods: {
    novoFicheiroClasses(novoFicheiro) {
      console.log(novoFicheiro);
      this.ficheiroClasses = novoFicheiro;
      console.log(this.ficheiroClasses);
    }
  },
  components: {
    ImportarFicheiro
  },
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  }
};
</script>

<style>
</style>