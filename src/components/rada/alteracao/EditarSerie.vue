<template>
  <v-dialog v-model="dialogSerie" persistent>
    <template v-slot:activator="{ on }">
      <b text depressed @click="filterSeries" v-on="on">
        {{
        treeview_object.titulo
        }}
      </b>
      <b
        v-show="treeview_object.eFilhoDe == null || !treeview_object.temUIs_ou_datas || (treeview_object.temDF && !(!!(treeview_object.children[0])))"
        style="color:red"
      >*</b>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">
        <b>{{ "Alterar a série: " + treeview_object.titulo }}</b>
        <v-spacer />
        <v-icon @click="toDelete = true" dark color="red" right>delete_sweep</v-icon>
      </v-card-title>
      <br />
      <v-card-text>
        <v-row>
          <v-dialog v-model="toDelete" width="50%">
            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >Pretende mesmo eliminar a classe {{ treeview_object.titulo }} ?</v-card-title>

              <v-card-text align="center">
                <br />
                <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
                <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarClasse">Sim</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
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
            <v-expansion-panel popout focusable v-if="!(!!(treeview_object.children[0]))">
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao
                  :rules="true"
                  :newSerie="serie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-row v-else>
              <v-col md="3" sm="3">
                <div class="info-label">Notas</div>
              </v-col>
              <v-col sm="9" md="9">
                <v-text-field solo clearable v-model="serie.notas" label="Notas"></v-text-field>
              </v-col>
            </v-row>
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
    toDelete: false,
    panels: [0, 0, 0],
    isMultiple: false,
    dialogSerie: false,
    serie: {},
    classesHierarquia: []
  }),
  methods: {
    clonePCA(serie_real) {
      // DEEP CLONE DOS CRITÉRIOS JUSTIFICACAO PCA
      let newJustificacaoPCA = [];

      for (let i = 0; i < serie_real.justificacaoPCA.length; i++) {
        let criterio = Object.assign({}, serie_real.justificacaoPCA[i]);

        if (serie_real.justificacaoPCA[i].tipo != "Critério Gestionário") {
          criterio.relacoes = [...serie_real.justificacaoPCA[i].relacoes];
        }

        newJustificacaoPCA.push(criterio);
      }

      return newJustificacaoPCA;
    },
    cloneDF(serie_real) {
      // DEEP CLONE DOS CRITÉRIOS JUSTIFICACAO DF
      let newJustificacaoDF = [];

      for (let i = 0; i < serie_real.justificacaoDF.length; i++) {
        let criterio = Object.assign({}, serie_real.justificacaoDF[i]);
        criterio.relacoes = [...serie_real.justificacaoDF[i].relacoes];

        newJustificacaoDF.push(criterio);
      }

      return newJustificacaoDF;
    },
    eliminarClasse() {
      // Buscar a classe original pois é a que temos que eliminar, o clone pode estar desatualizado
      let serie_real = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );
      this.$emit("remover", serie_real);
      this.dialogSerie = false;
    },
    async filterSeries() {
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
      this.serie.justificacaoPCA = await this.clonePCA(serie_real);
      this.serie.justificacaoDF = await this.cloneDF(serie_real);
      this.serie.UIs = [...serie_real.UIs];

      // Classes para definir a hierarquia
      this.classesHierarquia = this.classes
        .filter(classe => classe.tipo != "Série" && classe.tipo != "Subsérie")
        .sort((a, b) => a.codigo.localeCompare(b.codigo));
    },
    save() {
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
