<template>
  <v-dialog v-model="dialogState">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>{{ "Área orgânico-funcional: " + treeview_object.titulo }}</b>
      </v-card-title>
      <v-card-text>
        <RADAEntry label="Código" :value="organico.codigo" /> 
        <RADAEntry label="Título" :value="organico.titulo" />
        <RADAEntry label="Descrição" :value="organico.descricao" />
        <RADAEntry v-if="organico.eFilhoDe" label="Classe Pai" :value="organico.eFilhoDe" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";

export default {
  props: ["treeview_object", "classes", "dialog"],
  data: () => ({
    organico: {}
  }),
  components: {
    RADAEntry
  },
  created() {
    this.organico = this.classes.find(
      e => e.codigo == this.treeview_object.codigo
    );
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