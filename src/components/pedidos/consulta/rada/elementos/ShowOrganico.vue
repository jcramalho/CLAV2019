<template>
  <v-dialog v-model="dialogState">
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ "Área orgânico-funcional: " + treeview_object.titulo }}</b>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Código</div>
          </v-col>
          <v-col sm="3" md="3">
            <v-text-field readonly v-model="organico.codigo" solo></v-text-field>
          </v-col>
          <v-col xs="3" sm="3">
            <div class="info-label">Título</div>
          </v-col>
          <v-col sm="3" md="3">
            <v-text-field readonly v-model="organico.titulo" solo></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Descrição</div>
          </v-col>
          <v-col sm="9" md="9">
            <v-text-field readonly v-model="organico.descricao" solo></v-text-field>
          </v-col>
        </v-row>
        <h5>Hierarquia</h5>
        <v-divider></v-divider>

        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Classe Pai</div>
          </v-col>
          <v-col sm="9" md="9">
            <v-combobox
              readonly
              v-model="treeview_object.eFilhoDe"
              :items="[]"
              item-text="searchField"
              item-value="codigo"
              solo
              chips
              placeholder="Não tem classe pai"
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["treeview_object", "classes", "dialog"],
  data: () => ({
    organico: {}
  }),

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