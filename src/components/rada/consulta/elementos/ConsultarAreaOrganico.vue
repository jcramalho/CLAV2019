<template>
  <v-dialog v-model="dialogState">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">Consultar Classe Área Orgânico Funcional</v-card-title>

      <v-card-text>
        <RADAEntry label="Código" :value="classe.codigo"/>
        <RADAEntry label="Título" :value="classe.titulo"/>
        <RADAEntry label="Descrição" :value="classe.descricao"/>
        <RADAEntry v-if="!!classe.pai" label="Classe Pai" :value="classe.pai"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialogState = false">Voltar</v-btn>
      </v-card-actions> 
    </v-card>
  </v-dialog>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["dialog", "classe"],
  components: {
    RADAEntry
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