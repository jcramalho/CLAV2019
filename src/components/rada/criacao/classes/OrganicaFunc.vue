<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn color="indigo lighten-2" dark class="ma-2" @click="filterSeries" v-on="on">
        <v-icon dark left>add</v-icon>área orgânico-funcional
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text"><b>Adicionar Classe Área Orgânico-Funcional</b></v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" :lazy-validation="false">
          <!-- <h5>Identificação</h5>
          <v-divider></v-divider> -->
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Código</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field v-model="newOrgFunc.codigo" :rules="[v => !!v || 'Campo obrigatório!']" label="Código" solo clearable></v-text-field>
            </v-col>
            <v-col xs="3" sm="3">
              <div class="info-label">Título</div>
            </v-col>
            <v-col sm="3" md="3">
              <v-text-field v-model="newOrgFunc.titulo" :rules="[v => !!v || 'Campo obrigatório!']" label="Título" solo clearable></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-text-field v-model="newOrgFunc.descricao" :rules="[v => !!v || 'Campo obrigatório!']" label="Descrição" solo clearable></v-text-field>
            </v-col>
          </v-row>
          <h5>Hierarquia</h5>
          <v-divider></v-divider>
          
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe Pai</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-autocomplete
                v-model="newOrgFunc.eFilhoDe"
                :items="classesFiltradas"
                item-text="titulo"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
                chips
              >
                <template v-slot:item="{ item }">
                  {{item.codigo}} - {{ item.titulo }}
                </template>
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
        <v-btn color="success" class="mr-4" @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["classes"],
  data: () => ({
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