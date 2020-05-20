<template>
  <v-dialog v-model="dialogState" persistent>
    <v-card>
      <v-card-title class="indigo darken-1 white--text">Adicionar Classe Subsérie</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" :lazy-validation="false">
          <Identificacao :newSerie="newSubserie" :classes="classes" />
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe Pai</div>
            </v-col>
            <v-col cols="12" sm="9" md="0">
              <v-autocomplete
                :disabled="temCriterioLegal"
                v-model="newSubserie.eFilhoDe"
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

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="newSubserie" :UIs="UIs" :RE="RE" :classes="classes" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="newSubserie"
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
                  :newSerie="newSubserie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-alert width="100%" :value="existe_erros" outlined type="error" prominent border="left">
          É necessário preencher os campos seguintes:
          <ul>
            <li v-for="(erro, i) in erros" :key="i">{{ erro }}</li>
          </ul>
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="save(newSubserie)">Criar</v-btn>
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
  props: [
    "classes",
    "UIs",
    "formaContagem",
    "RE",
    "dialog",
    "classe_para_copiar"
  ],
  computed: {
    temCriterioLegal() {
      return (
        this.newSubserie.justificacaoDF.some(e => e.tipo == "Critério Legal") ||
        this.newSubserie.justificacaoPCA.some(e => e.tipo == "Critério Legal")
      );
    }
  },
  data: () => ({
    newSubserie: null
  }),
  methods: {
    apagar: function() {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = false;
      this.panels = [0, 0, 0];

      this.newSubserie = {
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

      if (
        !this.newSubserie.codigo ||
        this.classes.some(e => e.codigo == this.newSubserie.codigo)
      ) {
        this.erros.push("Código;");
      }

      if (!this.newSubserie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.newSubserie.descricao) {
        this.erros.push("Descrição;");
      }

      if (!this.newSubserie.dataInicial || !this.newSubserie.dataFinal) {
        this.erros.push("Datas extremas;");
      }

      if (!this.newSubserie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }
      if (!Boolean(this.newSubserie.pca)) {
        if (!Boolean(this.newSubserie.notaPCA)) {
          this.erros.push(
            "Prazo de Conservação Administrativa ou nota sobre o PCA;"
          );
        }
      }

      if (!Boolean(this.newSubserie.df)) {
        if (!Boolean(this.newSubserie.notaDF)) {
          this.erros.push("Destino Final ou nota sobre o DF;");
        }
      }

      if (!this.newSubserie.formaContagem.forma) {
        this.erros.push("Forma de Contagem;");
      } else {
        if (
          this.newSubserie.formaContagem.forma ==
            "vc_pcaFormaContagem_disposicaoLegal" &&
          !this.newSubserie.formaContagem.subforma
        ) {
          this.erros.push("Subforma de Contagem;");
        }
      }

      if (!Boolean(this.erros[0])) {
        this.erros.push("Datas Inválidas;");
      }
    }
  },
  created() {
    if (this.classe_para_copiar) {
      this.buscarTitulosClasses(this.classe_para_copiar);
    }

    this.newSubserie =
      this.classe_para_copiar != null
        ? this.classe_para_copiar
        : {
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
          };

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
};
</script>
