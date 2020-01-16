<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn color="indigo lighten-2" dark class="ma-2" @click="filterSeries" v-on="on">
        <v-icon dark left>add</v-icon>Série
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">Adicionar Classe Série</v-card-title>
      <br />

      <v-card-text>
        <v-form ref="form" :lazy-validation="false">
          <h5>Identificação</h5>
          <v-divider></v-divider>
          <Identificacao :newSerie="newSerie" />

          <v-expansion-panels accordion>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="newSerie" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto :newSerie="newSerie" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao :newSerie="newSerie" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <br/>

          <h5>Hierarquia</h5>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                v-model="newSerie.eFilhoDe"
                :items="classesFiltradas"
                :rules="RegrasHierarquia"
                item-text="codigo"
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
                    >Sem classes Área Orgânico-Funcional! Adicione primeiro.</v-alert>
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
    RegrasHierarquia: [v => !!v || "Este campo é obrigatório."],
    newSerie: {
      codigo: "",
      titulo: "",
      descricao: "",
      dataInicial: "",
      dataFinal: "",
      tUA: "",
      tSerie: "",
      suporte: "",
      medicao: "",
      localizacao: [],
      produtores: "",
      legislacao: "",
      relacoes: "",
      pca: "",
      formaContagem: "",
      justicacaoPCA: "",
      df: "",
      justificacaoDF: "",
      notas: "",
      eFilhoDe: "",
      tipo: "Série",
      children: []
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
        this.classes.push(Object.assign({}, this.newSerie));
        this.dialog = false;
        this.apagar();
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