<template>
  <v-card flat class="mb-12">
    <v-form ref="form" :lazy-validation="false">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Título</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo obrigatório!']"
            placeholder="Título da Tabela"
            v-model="TS.titulo"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" xs="12" sm="12">
          <AddOrgFunc :classes="TS.classes" />
          <Serie :classes="TS.classes" />
          <SubSerie :classes="TS.classes" />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" xs="12" sm="12">
          <v-data-table
            :headers="headers"
            :items="TS.classes"
            hide-default-footer
            @update:items-per-page="TS.classes.length || 1"
          >
            <template v-slot:item.action="{ item }">
              <!-- <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon> -->
              <v-icon small @click="deleteItem(item)">delete</v-icon>
            </template>
            <template v-slot:no-data>
              <br />
              <v-alert :value="true" color="orange lighten-2" icon="warning">Sem Classes! É obrigatório adicionar.</v-alert>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-form>
    <v-btn dark color="indigo darken-1" @click="sendToFather()">Concluir</v-btn>
    <v-btn @click="$emit('voltar', 2)">Voltar</v-btn>
    <v-btn color="indigo darken-4" text @click="apagar">
      <v-icon>delete_sweep</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
import AddOrgFunc from "@/components/rada/criacao/classes/OrganicaFunc";
import Serie from "@/components/rada/criacao/classes/Serie";
import SubSerie from "@/components/rada/criacao/classes/Subserie";

export default {
  props: ['TS'],
  components: {
    AddOrgFunc,
    Serie,
    SubSerie
  },
  data: () => ({
    headers: [
      {
        text: "Código",
        value: "codigo",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Titulo",
        value: "titulo",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Descrição",
        value: "descricao",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "PCA",
        value: "pca",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Destino Final",
        value: "df",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Notas",
        value: "notas",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo",
        value: "tipo",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Pai",
        value: "eFilhoDe",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Ações",
        value: "action",
        sortable: false,
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  methods: {
    apagar: function() {
      this.$refs.form.reset();
    },
    sendToFather: function() {
      if (this.$refs.form.validate() && this.TS.classes[0]) {
        this.$emit("done");
      }
    },
    editItem(item) {
      this.editedIndex = this.TS.classes.indexOf(item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.TS.classes.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.TS.classes.splice(index, 1);
    }
  }
};
</script>

<style>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>