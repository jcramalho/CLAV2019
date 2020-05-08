<template>
  <v-dialog v-model="dialog" persistent>
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
          <Identificacao :newSerie="newSerie" :classes="classes" />

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="newSerie" :UIs="UIs" :RE="RE" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto
                  :newSerie="newSerie"
                  :classes="classes"
                  :legislacao="legislacao"
                  :RE="RE"
                  :legislacaoProcessada="legislacaoProcessada"
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
                  :rules="false"
                  :newSerie="newSerie"
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
                v-model="newSerie.eFilhoDe"
                :items="classesHierarquia"
                :rules="[v => !!v || 'Campo obrigatório!']"
                item-value="codigo"
                item-text="searchField"
                solo
                clearable
                label="Classe Pai"
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
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="close">Voltar</v-btn>
        <v-btn color="success" class="mr-4" @click="save(newSerie)">Criar</v-btn>
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
    "legislacao",
    "RE",
    "UIs",
    "formaContagem",
    "legislacaoProcessada"
  ],
  data: () => ({
    newSerie: {
      codigo: "",
      titulo: "",
      descricao: "",
      dataInicial: null,
      dataFinal: null,
      tUA: null,
      tSerie: null,
      suporte: null,
      UIs: [],
      medicao: null,
      localizacao: [],
      entProdutoras: [],
      tipologiasProdutoras: [],
      legislacao: [],
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
      tipo: "Série"
    }
  }),
  methods: {
    apagar: function() {
      this.isMultiple = false;
      this.panels = [0, 0, 0];
      this.existe_erros = false;
      this.erros = [];

      this.newSerie = {
        codigo: "",
        titulo: "",
        descricao: "",
        dataInicial: null,
        dataFinal: null,
        tUA: null,
        tSerie: null,
        UIs: [],
        suporte: null,
        medicao: null,
        notaPCA: null,
        notaDF: null,
        localizacao: [],
        entProdutoras: [],
        tipologiasProdutoras: [],
        legislacao: [],
        relacoes: [],
        pca: null,
        formaContagem: {
          forma: null
        },
        justificacaoPCA: [],
        df: null,
        justificacaoDF: [],
        eFilhoDe: null,
        tipo: "Série"
      };
      this.$refs.form.resetValidation();
    },
    recolherErros() {
      this.existe_erros = true;

      if (!this.newSerie.codigo) {
        this.erros.push("Código;");
      }

      if (!this.newSerie.titulo) {
        this.erros.push("Título;");
      }

      if (!this.newSerie.descricao) {
        this.erros.push("Descrição;");
      }

      if (
        !!this.newSerie.UIs[0] == false &&
        (!this.newSerie.dataInicial || !this.newSerie.dataFinal)
      ) {
        this.erros.push("Datas ou Unidades de Instalação;");
      }

      if (!this.newSerie.tUA) {
        this.erros.push("Tipo de Unidade Arquivistica;");
      }

      if (!this.newSerie.suporte) {
        this.erros.push("Suporte;");
      }

      if (!this.newSerie.medicao) {
        this.erros.push("Medição;");
      }

      if (!!this.newSerie.localizacao[0] == false) {
        this.erros.push("Localização;");
      }

      if (
        !!this.newSerie.entProdutoras[0] == false &&
        !!this.newSerie.tipologiasProdutoras[0] == false
      ) {
        this.erros.push("Produtoras da Série;");
      }

      if (!!this.newSerie.legislacao[0] == false) {
        this.erros.push("Legislação;");
      }

      if (!this.newSerie.eFilhoDe) {
        this.erros.push("Relação de Hierarquia;");
      }

      if (
        this.newSerie.formaContagem.forma ==
          "vc_pcaFormaContagem_disposicaoLegal" &&
        !this.newSerie.formaContagem.subforma
      ) {
        this.erros.push("Subforma de Contagem;");
      }

      if (!Boolean(this.erros[0])) {
        this.erros.push("Datas Inválidas;");
      }
    },
    filterSeries: function() {
      this.isMultiple = false;
      this.panels = [0, 0, 0];

      // Se o utilizador voltar atrás as relações de sintese de e sintetizado que são verificadas na inserção são removidas.
      this.validar_relacoes_sintese(this.newSerie, this.classes);

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
  }
};
</script>
