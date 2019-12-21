<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn text depressed @click="filterSeries" v-on="on">{{ titulo }}</v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>Alterar Classe Área Orgânico-Funcional: {{ titulo }}</b>
      </v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" :lazy-validation="false">
          <h5>Identificação</h5>
          <v-divider></v-divider>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código:</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                v-model="OrgFunc.codigo"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Código"
                solo
                clearable
              ></v-text-field>
            </v-col>
            <v-col xs="3" sm="3">
              <div class="info-label">Título:</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field
                v-model="OrgFunc.titulo"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Descrição:</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-text-field
                v-model="OrgFunc.descricao"
                :rules="[v => !!v || 'Campo obrigatório!']"
                label="Descrição"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- <h5>Hierarquia</h5>
          <v-divider></v-divider>

          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe Pai:</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-autocomplete
                v-model="OrgFunc.eFilhoDe"
                :items="classesFiltradas"
                item-text="titulo"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
                chips
              >
                <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert
                      :value="true"
                      color="red lighten-3"
                      icon="warning"
                    >Sem classes mais Área Orgânico-Funcional!</v-alert>
                  </v-container>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>-->
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" outlined text @click="close">Cancelar</v-btn>
        <!-- <v-btn color="indigo darken-4" outlined text @click="save">Guardar</v-btn> -->
        <v-btn color="success" class="mr-4" @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["classes", "titulo", "itemCodigo"],
  data: () => ({
    dialog: false,
    classesFiltradas: [],
    OrgFunc: {
      codigo: "",
      titulo: "",
      descricao: "",
      eFilhoDe: "",
      tipo: "",
      children: []
    }
  }),
  methods: {
    close: function() {
      this.dialog = false;
    },
    save: function() {
      if (this.$refs.form.validate()) {

        let position = this.classes.findIndex( e => e.codigo == this.itemCodigo)
        // Continuar Aqui
      }
    },
    filterSeries: function() {
      this.OrgFunc = Object.assign({}, this.classes.find(e => e.codigo == this.itemCodigo));
      this.classesFiltradas = this.classes.filter(
        classe => classe.tipo != "Série" && classe.tipo != "Subsérie"
      );
    },
  }
};
</script>