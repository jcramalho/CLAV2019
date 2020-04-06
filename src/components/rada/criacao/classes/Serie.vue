<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on }">
      <v-btn
        color="indigo lighten-2"
        dark
        class="ma-2"
        @click="filterSeries"
        v-on="on"
      >
        <v-icon dark left>add</v-icon>Série
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text"
        >Adicionar Classe Série</v-card-title
      >
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
                dense
                solo
                clearable
                placeholder="Classe Pai"
              >
                <template v-slot:item="{ item }">{{
                  item.codigo + " - " + item.titulo
                }}</template>
                <template v-slot:selection="{ item }">
                  <v-chip>{{ item.codigo + " - " + item.titulo }}</v-chip>
                </template>

                <template v-slot:no-data>
                  <v-container fluid>
                    <v-alert :value="true" color="red lighten-3" icon="warning"
                      >Sem classes Área Orgânico-Funcional! Adicione
                      primeiro.</v-alert
                    >
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
        <v-btn color="indigo darken-4" outlined text @click="close"
          >Voltar</v-btn
        >
        <!-- <v-btn color="indigo darken-4" outlined text @click="save">Guardar</v-btn> -->
        <v-btn color="success" class="mr-4" @click="save">Criar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Identificacao from "./partes/Identificacao";
import ZonaDescritiva from "./partes/ZonaDescritiva";
import ZonaContexto from "./partes/ZonaContextoAvaliacao";
import ZonaDecisoesAvaliacao from "./partes/ZonaDecisoesAvaliacao";

const labels = require("@/config/labels").criterios;

export default {
  components: {
    Identificacao,
    ZonaDescritiva,
    ZonaContexto,
    ZonaDecisoesAvaliacao
  },
  props: ["classes", "legislacao", "RE", "UIs", "formaContagem"],
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
      pca: null,
      formaContagem: {
        forma: null
      },
      justificacaoPCA: [],
      df: null,
      justificacaoDF: [],
      notas: "",
      eFilhoDe: null,
      tipo: "Série"
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
        pca: null,
        formaContagem: {
          forma: null
        },
        justificacaoPCA: [],
        df: null,
        justificacaoDF: [],
        notas: "",
        eFilhoDe: null,
        tipo: "Série"
      };
      this.$refs.formSerie.resetValidation();
    },
    close: function() {
      this.dialog = false;
    },
    save: function() {
      this.isMultiple = true;
      this.panels = [0, 1, 2];
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

      // Se o utilizador voltar atrás as relações de sintese de e sintetizado que são verificadas na inserção são removidas. 
      this.validar_Relacoes_Sintese();

      this.classesHierarquia = this.classes
        .filter(classe => classe.tipo != "Série" && classe.tipo != "Subsérie")
        .sort((a, b) => a.codigo.localeCompare(b.codigo));
    },
    validar_Relacoes_Sintese() {
      let relacoes_sintese = this.newSerie.relacoes.filter(
        e => e.relacao == "Síntese de" || e.relacao == "Sintetizado por"
      );

      for (let i = 0; i < relacoes_sintese.length; i++) {
        let existe_classe = this.classes.some(
          cl =>
            cl.codigo == relacoes_sintese[i].serieRelacionada.codigo &&
            cl.relacoes.some(rel => rel.relacao == relacoes_sintese[i].relacao)
        );

        if (existe_classe) {
          // Verificar esta expressão
          this.newSerie.relacoes = this.newSerie.relacoes.filter(
            rel =>
              rel.relacao != relacoes_sintese[i].relacao ||
              rel.serieRelacionada.codigo !=
                relacoes_sintese[i].serieRelacionada.codigo
          );

          this.remove_criterio_densidade_informacional(
            relacoes_sintese[i].serieRelacionada.codigo
          );
        }
      }
    },
    remove_criterio_densidade_informacional(codigoClasse) {
      let criterio = this.newSerie.justificacaoDF.find(
        crit => crit.tipo == "Critério de Densidade Informacional"
      );

      if (criterio != undefined) {
        criterio.relacoes = criterio.relacoes.filter(e => e != codigoClasse);

        if (criterio.relacoes.length == 0) {
          this.alteraDF();

          this.newSerie.justificacaoDF = this.newSerie.justificacaoDF.filter(
            e => e.tipo != "Critério de Densidade Informacional"
          );
        }
      }
    },
    alteraDF() {
      if (
        this.newSerie.justificacaoDF.some(
          e => e.tipo == "Critério de Complementaridade Informacional"
        )
      ) {
        this.newSerie.df = "Conservação";
      } else {
        this.newSerie.df = null;
      }
    },
    adicionarUIs: function(clone_newSerie) {
      for (let i = 0; i < clone_newSerie.UIs.length; i++) {
        let UI = this.UIs.find(e => e.codigo == clone_newSerie.UIs[i]);

        if (UI != undefined) {
          UI.classesAssociadas.push({
            codigo: clone_newSerie.codigo,
            tipo: clone_newSerie.tipo
          });
        } else {
          this.UIs.push({
            codigo: clone_newSerie.UIs[i],
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
    adicionarDF(classe_relacionada, relacao) {
      if (
        relacao == "Sintetizado por" &&
        !classe_relacionada.relacoes.some(e => e.relacao == "Complementar de")
      ) {
        classe_relacionada.df = "Eliminação";
      } else {
        classe_relacionada.df = "Conservação";
      }
    },
    adiciona_criterio_a_relacionada(
      classe_relacionada,
      codigoClasse,
      tipo_criterio,
      relacao
    ) {
      if (tipo_criterio == "Critério de Utilidade Administrativa") {
        let criterio = classe_relacionada.justificacaoPCA.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          classe_relacionada.justificacaoPCA.push({
            tipo: tipo_criterio,
            nota: labels.textoCriterioUtilidadeAdministrativa,
            relacoes: [codigoClasse]
          });
        } else {
          criterio.relacoes.push(codigoClasse);
        }
      } else {
        let criterio = classe_relacionada.justificacaoDF.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          let nota = "";

          switch (relacao) {
            case "Sintetizado por":
              nota = labels.textoCriterioDensidadeSinPor;
              break;
            case "Complementar de":
              nota = labels.textoCriterioComplementaridade;
              break;
            case "Síntese de":
              nota = labels.textoCriterioDensidadeSinDe;
              break;
          }

          this.adicionarDF(classe_relacionada, relacao);

          classe_relacionada.justificacaoDF.push({
            tipo: tipo_criterio,
            nota: nota,
            relacoes: [codigoClasse]
          });
        } else {
          criterio.relacoes.push(codigoClasse);
        }
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
              pca: null,
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: null,
              justificacaoDF: [],
              notas: "",
              eFilhoDe: null,
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
              pca: null,
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: null,
              justificacaoDF: [],
              notas: "",
              eFilhoDe: null,
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
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSerie.codigo,
              "Critério de Complementaridade Informacional",
              relacao_inversa
            );
            break;
          case "Sintetizado por":
            relacao_inversa = "Síntese de";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSerie.codigo,
              "Critério de Densidade Informacional",
              relacao_inversa
            );
            break;
          case "Síntese de":
            relacao_inversa = "Sintetizado por";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSerie.codigo,
              "Critério de Densidade Informacional",
              relacao_inversa
            );
            break;
          case "Suplemento de":
            relacao_inversa = "Suplemento para";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSerie.codigo,
              "Critério de Utilidade Administrativa",
              relacao_inversa
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
