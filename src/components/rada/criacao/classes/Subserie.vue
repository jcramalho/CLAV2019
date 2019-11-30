<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn color="indigo lighten-2" dark class="ma-2" @click="filterSeries" v-on="on">
        <v-icon dark left>add</v-icon>Subsérie
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">Adicionar Classe Subsérie</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" :lazy-validation="false">
          <h5>Identificação</h5>
          <v-divider></v-divider>
          <Identificacao :newSerie="newSubSerie" />

          <h5>Zona Descritiva</h5>
          <v-divider></v-divider>
          <ZonaDescritiva :newSerie="newSubSerie" />

          <h5>Zona de Contexto de Avaliação</h5>
          <v-divider></v-divider>
          <ZonaContexto :newSerie="newSubSerie" />

          <h5>Zona de Decisões de Avaliação</h5>
          <v-divider></v-divider>
          <ZonaDecisoesAvaliacao :newSerie="newSubSerie" />

          <h5>Hierarquia</h5>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                v-model="newSubSerie.eFilhoDe"
                :items="classesFiltradas"
                :rules="[v => !!v || 'Este campo é obrigatório.']"
                item-text="codigo"
                item-value="codigo"
                outlined
                dense
                placeholder="Classe Pai"
                chips
              >
                <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert
                      :value="true"
                      color="red lighten-3"
                      icon="warning"
                    >Sem classes Série! Adicione primeiro.</v-alert>
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
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "./partes/ZonaDescritiva";
import ZonaContexto from "./partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "./partes/ZonaDecisoesAvaliacao";

export default {
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  props: ["classes"],
  data: () => ({
    dialog: false,
    classesFiltradas: [],
    newSubSerie: {
      codigo: "",
      titulo: "",
      descricao: "",
      dataInicial: "",
      dataFinal: "",
      relacoes: "",
      pca: "",
      formaContagem: "",
      justicacaoPCA: "",
      df: "",
      justificacaoDF: "",
      notas: "",
      eFilhoDe: "",
      tipo: "Subsérie"
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
        this.classes.push(Object.assign({}, this.newSubSerie));
        this.dialog = false;
        this.apagar();
      }
    },
    filterSeries: function() {
      this.classesFiltradas = this.classes.filter(
        classe => classe.tipo == "Série"
      );
    }
  }
};
</script>