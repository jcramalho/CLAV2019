<template>
  <v-card flat class="mb-12">
    <v-form ref="form" :lazy-validation="false">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Título</div>
        </v-col>
        <v-col xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="TS.titulo"
            label="Título da TS"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" xs="12" sm="12">
          <AddOrgFunc :classes="TS.classes" />
          <Serie :classes="TS.classes" :entidades="entidades" />
          <SubSerie :classes="TS.classes" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="12">
          <v-treeview color="amber" v-if="TS.classes.length > 0" hoverable :items="preparaTree" item-key="titulo">
            <template slot="label" slot-scope="{ item }">
              <b>{{ item.titulo }}</b>
            </template>
          </v-treeview>
          <v-alert
            class="text-center"
            v-else
            :value="true"
            color="amber accent-3"
            icon="warning"
          >Sem Classes! É obrigatório adicionar.</v-alert>
          <br />
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
  props: ["TS", "entidades"],
  components: {
    AddOrgFunc,
    Serie,
    SubSerie
  },
  computed: {
    preparaTree() {
      //Tem que retornar
      var myTree = [];

      for (var i = 0; i < this.TS.classes.length; i++) {
        if (
          this.TS.classes[i].eFilhoDe == null ||
          this.TS.classes[i].eFilhoDe == ""
        ) {
          myTree.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            children: this.preparaTreeFilhos(this.TS.classes[i].codigo)
          });
        }
      }
      return myTree;
    }
  },
  methods: {
    preparaTreeFilhos: function(pai) {
      let children = [];

      for (let i = 0; i < this.TS.classes.length; i++) {
        if (this.TS.classes[i].eFilhoDe == pai) {
          children.push({
            codigo: this.TS.classes[i].codigo,
            titulo:
              this.TS.classes[i].codigo + " - " + this.TS.classes[i].titulo,
            children: this.preparaTreeFilhos(this.TS.classes[i].codigo)
          });
        }
      }

      return children;
    },
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