<template>
  <v-dialog v-model="dialogState" persistent max-width="90%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        <b>{{ "Alterar a subsérie: " + treeview_object.titulo }}</b>
      </v-card-title>
      <br />
      <v-card-text>
        <v-row>
          <v-dialog v-model="toDelete" width="50%">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>
                Pretende mesmo eliminar a classe
                {{ treeview_object.titulo }} ?
              </v-card-title>

              <v-card-text align="center">
                <br />
                <v-btn class="ma-3 pa-3" dark color="indigo darken-4" @click="toDelete = false">Voltar</v-btn>
                <v-btn class="ma-3 pa-5" dark color="red darken-4" @click="eliminarClasse">Sim</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
        <v-form ref="form" :lazy-validation="false">
          <Identificacao :newSerie="subserie" />
          <v-row>
            <v-col md="3" sm="3">
              <div class="info-label">Classe pai</div>
            </v-col>
            <v-col cols="12" sm="9" md="0">
              <v-autocomplete
                :disabled="temCriterioLegal"
                v-model="subserie.eFilhoDe"
                :items="classesHierarquia"
                :rules="[v => !!v || 'Este campo é obrigatório.']"
                item-value="codigo"
                item-text="searchField"
                solo
                clearable
                placeholder="Classe pai"
                chips
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
            <v-expansion-panel class="ma-1" popout focusable>
              <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="subserie" :UIs="UIs" :RE="RE" :classes="classes" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="ma-1" popout focusable>
              <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="subserie"
                  :classes="classes"
                  :formaContagem="formaContagem"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="ma-1" popout focusable>
              <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao
                  :rules="true"
                  :newSerie="subserie"
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
        <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
        <v-btn color="indigo darken-4" dark @click="atualizar(subserie)">Atualizar</v-btn>
        <v-btn @click="toDelete = true" dark color="red darken-4">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "../criacao/classes/partes/ZonaDescritiva";
import ZonaContexto from "../criacao/classes/partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "../criacao/classes/partes/ZonaDecisoesAvaliacao";

import mixin_edicao_serie_subserie from "@/mixins/rada/mixin_edicao_serie_subserie";

export default {
  props: ["treeview_object", "classes", "UIs", "formaContagem", "RE", "dialog"],
  data: () => ({
    subserie: {
      justificacaoDF: [],
      justificacaoPCA: []
    }
  }),
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  mixins: [mixin_edicao_serie_subserie],
  computed: {
    temCriterioLegal() {
      return (
        this.subserie.justificacaoDF.some(e => e.tipo == "Critério Legal") ||
        this.subserie.justificacaoPCA.some(e => e.tipo == "Critério Legal")
      );
    }
  },
  methods: {
    recolherErros() {
      this.existe_erros = true;

      if (!this.subserie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.subserie.descricao) {
        this.erros.push("Descrição;");
      }

      if (!this.subserie.dataInicial || !this.subserie.dataFinal) {
        this.erros.push("Datas extremas;");
      }

      if (!this.subserie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }

      if (!Boolean(this.subserie.pca)) {
        if (!Boolean(this.subserie.notaPCA)) {
          this.erros.push(
            "Prazo de conservação administrativa ou nota sobre o PCA;"
          );
        }
      }

      if (!Boolean(this.subserie.df)) {
        if (!Boolean(this.subserie.notaDF)) {
          this.erros.push("Destino final ou nota sobre o DF;");
        }
      }

      if (!this.subserie.formaContagem.forma) {
        this.erros.push("Forma de Contagem;");
      } else {
        if (
          this.subserie.formaContagem.forma ==
            "vc_pcaFormaContagem_disposicaoLegal" &&
          !this.subserie.formaContagem.subforma
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
    // ir buscar o verdadeiro objeto
    let subserie_real = this.classes.find(
      e => e.codigo == this.treeview_object.codigo
    );

    // DEEP CLONE do objeto
    this.subserie = JSON.parse(JSON.stringify(subserie_real));

    this.buscarTitulosClasses(this.subserie);

    // Classes para definir a hierarquia
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
