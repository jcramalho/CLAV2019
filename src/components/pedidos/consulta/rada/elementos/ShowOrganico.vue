<template>
<<<<<<< HEAD
  <v-dialog v-model="dialogOrganico">
    <template v-slot:activator="{ on }">
      <b text depressed @click="getSerie" v-on="on">
        {{ treeview_object.titulo }}
      </b>
    </template>
=======
  <v-dialog v-model="dialogState" max-width="90%">
>>>>>>> 19aa347ffbebc7de3f58077a61af422fc80a45a0
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>{{ "Área orgânico-funcional: " + treeview_object.titulo }}</b>
      </v-card-title>
      <v-card-text>
<<<<<<< HEAD
        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Código</div>
          </v-col>
          <v-col sm="3" md="3">
            <v-text-field
              readonly
              v-model="organico.codigo"
              solo
            ></v-text-field>
          </v-col>
          <v-col xs="3" sm="3">
            <div class="info-label">Título</div>
          </v-col>
          <v-col sm="3" md="3">
            <v-text-field
              readonly
              v-model="organico.titulo"
              solo
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="3" sm="3">
            <div class="info-label">Descrição</div>
          </v-col>
          <v-col sm="9" md="9">
            <v-text-field
              readonly
              v-model="organico.descricao"
              solo
            ></v-text-field>
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
        <v-btn
          color="indigo darken-4"
          outlined
          text
          @click="dialogOrganico = false"
          >Voltar</v-btn
        >
=======
        <RADAEntry label="Código" :value="organico.codigo" /> 
        <RADAEntry label="Título" :value="organico.titulo" />
        <RADAEntry label="Descrição" :value="organico.descricao" />
        <RADAEntry v-if="organico.eFilhoDe" label="Classe Pai" :value="organico.eFilhoDe" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
>>>>>>> 19aa347ffbebc7de3f58077a61af422fc80a45a0
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
