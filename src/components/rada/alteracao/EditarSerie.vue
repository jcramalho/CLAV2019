<template>
  <v-dialog v-model="dialogSerie" persistent fullscreen>
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
      <b v-if="treeview_object.eFilhoDe == ''" style="color:red">(POR COMPLETAR)</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ "Alterar a série: " + treeview_object.titulo }}</b>
      </v-card-title>
      <br />
      <v-card-text>
        <v-form ref="formSerie" :lazy-validation="false">
          <Identificacao :newSerie="serie" />

          <v-expansion-panels v-model="panels" accordion :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="serie" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="serie"
                  :classes="classesNomes"
                  :legislacao="legislacao"
                  :RE="RE"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao :newSerie="serie" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <br />

          <h5>Hierarquia</h5>
          <v-divider></v-divider>
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe Pai</div>
            </v-col>
            <v-col sm="9" md="9">
              <v-autocomplete
                v-model="serie.eFilhoDe"
                :items="classesFiltradas"
                :rules="[v => !!v || 'Campo obrigatório!']"
                item-value="codigo"
                dense
                solo
                clearable
                placeholder="Classe Pai"
              >
                <template v-slot:item="{ item }">{{ item.codigo }} - {{ item.titulo }}</template>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ item.codigo }} - {{ item.titulo }}</v-chip>
                </template>
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
        <v-btn color="indigo darken-4" outlined text @click="dialogSerie = false">Voltar</v-btn>

        <v-btn color="success" class="mr-4" @click="save">Atualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "../criacao/classes/partes/ZonaDescritiva";
import ZonaContexto from "../criacao/classes/partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "../criacao/classes/partes/ZonaDecisoesAvaliacao";

export default {
  props: ["treeview_object", "classes", "legislacao", "RE"],
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  data: () => ({
    panels: [0, 0, 0],
    isMultiple: false,
    dialogSerie: false,
    serie: {},
    classesFiltradas: [],
    classesNomes: []
  }),
  methods: {
    filterSeries: async function() {
      // ir buscar o verdadeiro objeto
      let serie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // DEEP CLONE do objetos
      this.serie = Object.assign({}, serie_real);
      if (this.serie.eFilhoDe != "") {
        this.serie.tipologiasProdutoras = [...serie_real.tipologiasProdutoras];
        this.serie.entProdutoras = [...serie_real.entProdutoras];
        this.serie.legislacao = [...serie_real.legislacao];
        this.serie.localizacao = [...serie_real.localizacao];
      } else {
        this.serie.tipologiasProdutoras = [];
        this.serie.entProdutoras = [];
        this.serie.legislacao = [];
        this.serie.localizacao = [];
      }

      this.serie.relacoes = [...serie_real.relacoes];

      // Classes para definir a hierarquia
      this.classesFiltradas = this.classes.filter(
        classe => classe.tipo != "Série" && classe.tipo != "Subsérie"
      );

      // Classes para as relações
      this.classesNomes = this.classes.filter(
        e => e.tipo == "Série" || e.tipo == "Subsérie"
      );
    },
    save: async function() {
      this.isMultiple = true;
      this.panels = [0, 1];
      setTimeout(() => {
        if (this.$refs.formSerie.validate()) {
          this.$emit("atualizacao", this.serie);
          this.dialogSerie = false;
        }
      }, 1);
    }
  }
};
</script>
