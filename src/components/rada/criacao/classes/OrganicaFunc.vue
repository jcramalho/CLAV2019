<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn color="indigo lighten-2" dark class="ma-2" @click="filterSeries" v-on="on">
        <v-icon dark left>add</v-icon>área orgânico-funcional
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">Adicionar Classe Área Orgânico-Funcional</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" :lazy-validation="false" v-model="valid">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field outlined v-model="newOrgFunc.codigo" label="Código"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field outlined v-model="newOrgFunc.titulo" label="Título"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field outlined v-model="newOrgFunc.descricao" label="Descrição"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                v-model="newOrgFunc.eFilhoDe"
                :items="classesFiltradas"
                item-text="codigo"
                item-value="codigo"
                outlined
                dense
                placeholder="Classe Pai"
                chips
              >
              <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert :value="true" color="red lighten-3" icon="warning">Sem classes mais Área Orgânico-Funcional!</v-alert>
                  </v-container>
                </template>
              </v-autocomplete>
              
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="close">Cancelar</v-btn>
        <!-- <v-btn color="indigo darken-4" outlined text @click="save">Guardar</v-btn> -->
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["classes"],
  data: () => ({
    valid: true,
    dialog: false,
    classesFiltradas: [],
    newOrgFunc: {
      codigo: "",
      titulo: "",
      descricao: "",
      eFilhoDe: "",
      tipo: ""
    }
  }),
  methods: {
    apagar: function() {
      this.$refs.form.reset();
    },
    close: function() {
      this.dialog = false;
    },
    save: function() {
      if (this.$refs.form.validate()) {
        if (this.newOrgFunc.eFilhoDe) {
          this.newOrgFunc.tipo =
            "N" + (this.newOrgFunc.eFilhoDe.split(".").length + 1);
        } else {
          this.newOrgFunc.tipo = "N1";
        }
        // this.classes.push(JSON.parse(JSON.stringify(this.newOrgFunc)));
        this.classes.push(Object.assign({}, this.newOrgFunc));
        this.dialog = false;
        this.$refs.form.reset();
      }
    },
    filterSeries: function() {
      this.classesFiltradas = this.classes.filter(
        classe => classe.tipo != "Série" && classe.tipo != "Subsérie"
      );
    }
  }
};
</script>