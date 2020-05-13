<template>
  <v-dialog v-model="dialog" persistent>
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
          <Identificacao :newSerie="newSubSerie" :classes="classes" />

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="newSubSerie" :UIs="UIs" :RE="RE" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="newSubSerie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao
                  :rules="true"
                  :newSerie="newSubSerie"
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
            <v-col cols="12" sm="9" md="0">
              <v-autocomplete
                :disabled="temCriterioLegal"
                v-model="newSubSerie.eFilhoDe"
                :items="classesHierarquia"
                :rules="[v => !!v || 'Este campo é obrigatório.']"
                item-value="codigo"
                item-text="searchField"
                solo
                clearable
                label="Classe Pai"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      <strong>Classe Série</strong> em questão não existe!
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-alert width="100%" :value="existe_erros" outlined type="error" prominent border="left">
          É necessário preencher os campos seguintes:
          <ul>
            <li v-for="(erro, i) in erros" :key="i">{{erro}}</li>
          </ul>
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="close">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="save(newSubSerie)">Criar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "./partes/ZonaDescritiva";
import ZonaContexto from "./partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "./partes/ZonaDecisoesAvaliacao";

import mixin_criacao_serie_subserie from "@/mixins/rada/mixin_criacao_serie_subserie";

const labels = require("@/config/labels").criterios;

export default {
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  mixins: [mixin_criacao_serie_subserie],
  props: ["classes", "UIs", "formaContagem", "RE"],
  computed: {
    temCriterioLegal() {
      return (
        this.newSubSerie.justificacaoDF.some(e => e.tipo == "Critério Legal") ||
        this.newSubSerie.justificacaoPCA.some(e => e.tipo == "Critério Legal")
      );
    }
  },
  data: () => ({
    newSubSerie: {
      codigo: "",
      titulo: "",
      descricao: "",
      dataInicial: null,
      dataFinal: null,
      UIs: [],
      relacoes: [],
      pca: null,
      notaPCA: null,
      notaDF: null,
      formaContagem: {
        forma: null
      },
      justificacaoPCA: [],
      df: null,
      justificacaoDF: [],
      eFilhoDe: null,
      tipo: "Subsérie"
    }
  }),
  methods: {
    apagar: function() {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = false;
      this.panels = [0, 0, 0];

      this.newSubSerie = {
        codigo: "",
        titulo: "",
        descricao: "",
        dataInicial: null,
        dataFinal: null,
        UIs: [],
        relacoes: [],
        pca: null,
        notaPCA: null,
        formaContagem: {
          forma: null
        },
        justificacaoPCA: [],
        df: null,
        notaDF: null,
        justificacaoDF: [],
        eFilhoDe: null,
        tipo: "Subsérie"
      };
      this.$refs.form.resetValidation();
    },

    recolherErros() {
      this.existe_erros = true;

      if (!this.newSubSerie.codigo) {
        this.erros.push("Código;");
      }

      if (!this.newSubSerie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.newSubSerie.descricao) {
        this.erros.push("Descrição;");
      }

      if (!this.newSubSerie.dataInicial || !this.newSubSerie.dataFinal) {
        this.erros.push("Datas Extremas;");
      }

      if (!this.newSubSerie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }
      if (!Boolean(this.newSubSerie.pca)) {
        if (!Boolean(this.newSubSerie.notaPCA)) {
          this.erros.push(
            "Prazo de Conservação Administrativa ou nota sobre o PCA;"
          );
        }
      }

      if (!Boolean(this.newSubSerie.df)) {
        if (!Boolean(this.newSubSerie.notaDF)) {
          this.erros.push("Destino Final ou nota sobre o DF;");
        }
      }

      if (!this.newSubSerie.formaContagem.forma) {
        this.erros.push("Forma de Contagem;");
      } else {
        if (
          this.newSubSerie.formaContagem.forma ==
            "vc_pcaFormaContagem_disposicaoLegal" &&
          !this.newSubSerie.formaContagem.subforma
        ) {
          this.erros.push("Subforma de Contagem;");
        }
      }

      if (!Boolean(this.erros[0])) {
        this.erros.push("Datas Inválidas;");
      }
    },
    filterSeries: function() {
      this.panels = [0, 0, 0];
      this.isMultiple = false;

      // Se o utilizador voltar atrás as relações de sintese de e sintetizado que são verificadas na inserção são removidas.
      this.validar_relacoes_sintese(this.newSubSerie, this.classes);

      this.classesHierarquia = this.classes
        .filter(classe => classe.tipo == "Série")
        .sort((a, b) => a.codigo.localeCompare(b.codigo))
        .map(classe => {
          return {
            searchField: classe.codigo + " - " + classe.titulo,
            codigo: classe.codigo
          };
        });
    }
  }
};
</script>