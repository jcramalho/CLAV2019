<template>
  <v-dialog v-model="dialogSerie" persistent fullscreen>
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
      <b
        v-show="treeview_object.eFilhoDe == '' || !treeview_object.temUIs_ou_datas"
        style="color:red"
      >*</b>
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
                <ZonaDescritiva :newSerie="serie" :UIs="UIs" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="serie"
                  :classes="classes"
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
                <ZonaDecisoesAvaliacao
                  :newSerie="serie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
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
                :items="classesHierarquia"
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
  props: [
    "treeview_object",
    "classes",
    "legislacao",
    "RE",
    "UIs",
    "formaContagem"
  ],
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
    classesHierarquia: []
  }),
  methods: {
    filterSeries: function() {
      this.panels = [0, 0, 0];
      this.isMultiple = false;
      // ir buscar o verdadeiro objeto
      let serie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      // DEEP CLONE do objetos
      this.serie = Object.assign({}, serie_real);
      this.serie.tipologiasProdutoras = [...serie_real.tipologiasProdutoras];
      this.serie.entProdutoras = [...serie_real.entProdutoras];
      this.serie.legislacao = [...serie_real.legislacao];
      this.serie.localizacao = [...serie_real.localizacao];
      this.serie.relacoes = [...serie_real.relacoes];
      this.serie.formaContagem = Object.assign({}, serie_real.formaContagem);
      this.serie.justificacaoPCA = [...serie_real.justificacaoPCA];
      this.serie.justificacaoDF = [...serie_real.justificacaoDF];
      this.serie.UIs = [...serie_real.UIs];

      // Classes para definir a hierarquia
      this.classesHierarquia = this.classes.filter(
        classe => classe.tipo != "Série" && classe.tipo != "Subsérie"
      );
    },
    save: function() {
      this.isMultiple = true;
      this.panels = [0, 1, 2];
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
