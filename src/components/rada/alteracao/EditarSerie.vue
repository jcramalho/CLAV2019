<template>
  <v-dialog v-model="dialogState" persistent>
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
        <v-form ref="form" :lazy-validation="false">
          <Identificacao :newSerie="serie" />

          <v-expansion-panels v-model="panels" accordion :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="serie" :UIs="UIs" :RE="RE" />
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
                  :legislacaoProcessada="legislacaoProcessada"
                  :formaContagem="formaContagem"
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
                item-text="searchField"
                solo
                clearable
                placeholder="Classe Pai"
                chips
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      <strong>Classe Área Orgânico-Funcional</strong> em questão não existe!
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
        <v-btn color="indigo darken-4" outlined text @click="dialogState = false">Voltar</v-btn>

        <v-btn color="success" class="mr-4" @click="atualizar(serie)">Atualizar</v-btn>
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
  props: [
    "treeview_object",
    "classes",
    "legislacao",
    "RE",
    "UIs",
    "formaContagem",
    "legislacaoProcessada",
    "dialog"
  ],
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  data: () => ({
    serie: {}
  }),
  mixins: [mixin_edicao_serie_subserie],
  methods: {
    recolherErros() {
      this.existe_erros = true;

      if (!this.serie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.serie.descricao) {
        this.erros.push("Descrição;");
      }

      if (
        !!this.serie.UIs[0] == false &&
        (!this.serie.dataInicial || !this.serie.dataFinal)
      ) {
        this.erros.push("Datas ou Unidades de Instalação;");
      }

      if (!this.serie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }

      if (!this.serie.tUA) {
        this.erros.push("Tipo de Unidade Arquivistica;");
      }

      if (!this.serie.suporte) {
        this.erros.push("Suporte;");
      }

      if (!this.serie.medicao) {
        this.erros.push("Medição;");
      }

      if (!!this.serie.localizacao[0] == false) {
        this.erros.push("Localização;");
      }

      if (
        !!this.serie.entProdutoras[0] == false &&
        !!this.serie.tipologiasProdutoras[0] == false
      ) {
        this.erros.push("Produtoras;");
      }

      if (!!this.serie.legislacao[0] == false) {
        this.erros.push("Legislação;");
      }
      if (!!this.treeview_object.children[0] == 0) {
        if (!Boolean(this.serie.pca)) {
          if (!Boolean(this.serie.notaPCA)) {
            this.erros.push(
              "Prazo de Conservação Administrativa ou nota sobre o PCA;"
            );
          }
        }

        if (!Boolean(this.serie.df)) {
          if (!Boolean(this.serie.notaDF)) {
            this.erros.push("Destino Final ou nota sobre o DF;");
          }
        }

        if (!this.serie.formaContagem.forma) {
          this.erros.push("Forma de Contagem;");
        } else {
          if (
            this.serie.formaContagem.forma ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            !this.serie.formaContagem.subforma
          ) {
            this.erros.push("Subforma de Contagem;");
          }
        }
      }

      if (!Boolean(this.erros[0])) {
        this.erros.push("Datas Inválidas;");
      }
    }
  },
  created() {
    // ir buscar o verdadeiro objeto
    let serie_real = this.classes.find(
      e => e.codigo == this.treeview_object.codigo
    );

    // DEEP CLONE do objetos
    this.serie = JSON.parse(JSON.stringify(serie_real));

    this.buscarTitulosClasses(this.serie);

    // Classes para definir a hierarquia
    this.classesHierarquia = this.classes
      .filter(classe => classe.tipo != "Série" && classe.tipo != "Subsérie")
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
