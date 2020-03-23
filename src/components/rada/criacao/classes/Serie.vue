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
        <v-form ref="formSerie" :lazy-validation="false">
          <!-- <h5>Identificação</h5>
          <v-divider></v-divider>-->
          <Identificacao :newSerie="newSerie" :classes="classes" />

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="newSerie" :UIs="UIs" />
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
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao :newSerie="newSerie" :classes="classes" />
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
                dense
                solo
                clearable
                placeholder="Classe Pai"
              >
                <template v-slot:item="{ item }">{{ item.codigo + ' - ' + item.titulo}}</template>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ item.codigo + ' - ' + item.titulo}}</v-chip>
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
        <v-btn color="indigo darken-4" text @click="apagar">
          <v-icon>delete_sweep</v-icon>
        </v-btn>
        <v-btn color="indigo darken-4" outlined text @click="close">Voltar</v-btn>
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
  props: ["classes", "legislacao", "RE", "UIs"],
  data: () => ({
    panels: [0, 0, 0],
    isMultiple: false,
    dialog: false,
    classesHierarquia: [],
    newSerie: {
      // codigo: "02.02",
      // titulo: "SERIE",
      // descricao: "DESC SERIE",
      // dataInicial: "2020-02-13",
      // dataFinal: "2020-02-16",
      codigo: "",
      titulo: "",
      descricao: "",
      dataInicial: null,
      dataFinal: null,
      tUA: "",
      tSerie: "",
      suporte: "",
      UIs: [],
      medicao: "",
      localizacao: [],
      entProdutoras: [],
      tipologiasProdutoras: [],
      legislacao: [],
      relacoes: [],
      pca: "",
      formaContagem: "",
      justificacaoPCA: [],
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
      this.isMultiple = false;
      this.panels = [0, 0, 0];

      this.newSerie = {
        codigo: "",
        titulo: "",
        descricao: "",
        dataInicial: null,
        dataFinal: null,
        tUA: "",
        tSerie: "",
        UIs: [],
        suporte: "",
        medicao: "",
        localizacao: [],
        entProdutoras: [],
        tipologiasProdutoras: [],
        legislacao: [],
        relacoes: [],
        pca: "",
        formaContagem: "",
        justificacaoPCA: [],
        df: "",
        justificacaoDF: "",
        notas: "",
        eFilhoDe: "",
        tipo: "Série"
      };
      this.$refs.formSerie.resetValidation();
    },
    close: function() {
      this.dialog = false;
    },
    save: function() {
      this.isMultiple = true;
      this.panels = [0, 1];
      setTimeout(() => {
        if (this.$refs.formSerie.validate()) {
          let clone_newSerie = Object.assign({}, this.newSerie);

          this.relacoes_simetricas(clone_newSerie);
          this.adicionarUIs(clone_newSerie);

          this.classes.push(clone_newSerie);
          this.dialog = false;
          this.apagar();
        }
      }, 1);
    },
    filterSeries: function() {
      this.isMultiple = false;
      this.panels = [0, 0, 0];

      this.classesHierarquia = this.classes.filter(
        classe => classe.tipo != "Série" && classe.tipo != "Subsérie"
      );
    },
    adicionarUIs: function(clone_newSerie) {
      for (let i = 0; i < clone_newSerie.UIs.length; i++) {
        let UI = this.UIs.find(e => e.codigo == clone_newSerie.UIs[i].codigo);

        if (UI != undefined) {
          UI.classesAssociadas.push({
            codigo: clone_newSerie.codigo,
            tipo: clone_newSerie.tipo
          });
        } else {
          this.UIs.push({
            codigo: clone_newSerie.UIs[i].codigo,
            codCota: "",
            titulo: "",
            dataInicial: null,
            dataFinal: null,
            produtor: {
              tipologiasProdutoras: [],
              entProdutoras: []
            },
            classesAssociadas: [
              {
                codigo: clone_newSerie.codigo,
                tipo: clone_newSerie.tipo
              }
            ],
            descricao: "",
            notas: "",
            localizacao: ""
          });
        }
      }
    },
    adiciona_crit_utilidade_adminstrativa(classe_relacionada, codigoClasse) {
      let criterio = classe_relacionada.justificacaoPCA.find(
        crit => crit.tipo == "Critério de Utilidade Administrativa"
      );

      if (criterio == undefined) {
        classe_relacionada.justificacaoPCA.push({
          tipo: "Critério de Utilidade Administrativa",
          nota:
            "Prazo decorrente da necessidade de consulta para apuramento da responsabilidade em sede de:",
          relacoes: [codigoClasse]
        });
      } else {
        criterio.relacoes.push(codigoClasse);
      }
    },
    relacoes_simetricas: function(clone_newSerie) {
      for (let i = 0; i < clone_newSerie.relacoes.length; i++) {
        let classe_relacionada = this.classes.find(
          e => e.codigo == clone_newSerie.relacoes[i].serieRelacionada.codigo
        );

        if (classe_relacionada == undefined) {
          if (clone_newSerie.relacoes[i].serieRelacionada.tipo == "Série") {
            classe_relacionada = {
              codigo: clone_newSerie.relacoes[i].serieRelacionada.codigo,
              titulo: "",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              tUA: "",
              tSerie: "",
              suporte: "",
              medicao: "",
              UIs: [],
              localizacao: [],
              entProdutoras: [],
              tipologiasProdutoras: [],
              legislacao: [],
              relacoes: [],
              pca: "",
              formaContagem: "",
              justificacaoPCA: [],
              df: "",
              justificacaoDF: "",
              notas: "",
              eFilhoDe: "",
              tipo: "Série"
            };
          } else {
            classe_relacionada = {
              codigo: clone_newSerie.relacoes[i].serieRelacionada.codigo,
              titulo: "",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              relacoes: [],
              UIs: [],
              pca: "",
              formaContagem: "",
              justificacaoPCA: [],
              df: "",
              justificacaoDF: "",
              notas: "",
              eFilhoDe: "",
              tipo: "Subsérie"
            };
          }

          this.classes.push(classe_relacionada);
        }

        let relacao_inversa = "";

        switch (clone_newSerie.relacoes[i].relacao) {
          case "Antecessora de":
            relacao_inversa = "Sucessora de";
            break;
          case "Sucessora de":
            relacao_inversa = "Antecessora de";
            break;
          case "Complementar de":
            relacao_inversa = "Complementar de";
            break;
          case "Sintetizado por":
            relacao_inversa = "Síntese de";
            break;
          case "Síntese de":
            relacao_inversa = "Sintetizado por";
            break;
          case "Suplemento de":
            relacao_inversa = "Suplemento para";
            this.adiciona_crit_utilidade_adminstrativa(
              classe_relacionada,
              clone_newSerie.codigo
            );
            break;
          case "Suplemento para":
            relacao_inversa = "Suplemento de";
            break;
        }

        classe_relacionada.relacoes.push({
          relacao: relacao_inversa,
          serieRelacionada: {
            codigo: clone_newSerie.codigo,
            tipo: clone_newSerie.tipo
          }
        });
      }
    }
  }
};
</script>
