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
        <v-icon dark left>add</v-icon>Subsérie
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo darken-1 white--text"
        >Adicionar Classe Subsérie</v-card-title
      >
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
    existe_erros: false,
    erros: [],
    panels: [0, 0, 0],
    isMultiple: false,
    dialog: false,
    classesHierarquia: [],
    newSubSerie: {
      codigo: "",
      titulo: "",
      descricao: "",
      dataInicial: null,
      dataFinal: null,
      // codigo: "02.01.02",
      // titulo: "SUBSERIESERIE",
      // descricao: "DESC SERIE",
      // dataInicial: "2020-02-13",
      // dataFinal: "2020-02-16",
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
    close: function() {
      this.dialog = false;
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

      if (
        !!this.newSubSerie.UIs[0] == false &&
        (!this.newSubSerie.dataInicial || !this.newSubSerie.dataFinal)
      ) {
        this.erros.push("Datas ou Unidades de Instalação;");
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
    save() {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(() => {
        //  && this.validar_justificacoes()
        if (this.$refs.form.validate()) {
          let clone_newSubserie = Object.assign({}, this.newSubSerie);

          clone_newSubserie.justificacaoPCA.forEach(criterio => {
            if (criterio.tipo == "Critério de Utilidade Administrativa") {
              criterio.relacoes.map(rel => delete rel.titulo);
            }
          });

          clone_newSubserie.justificacaoDF.forEach(criterio => {
            if (
              criterio.tipo == "Critério de Complementaridade Informacional" ||
              criterio.tipo == "Critério de Densidade Informacional"
            ) {
              criterio.relacoes.map(rel => delete rel.titulo);
            }
          });

          this.adicionarUIs(clone_newSubserie);
          this.relacoes_simetricas(clone_newSubserie);

          clone_newSubserie.relacoes.map(
            item => delete item.serieRelacionada.titulo
          );

          this.classes.push(clone_newSubserie);

          this.dialog = false;
          this.apagar();
        } else {
          this.isMultiple = false;
          this.panels = [0, 0, 0];
          this.recolherErros();
        }
      }, 1);
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
    filterSeries: function() {
      this.panels = [0, 0, 0];
      this.isMultiple = false;

      // Se o utilizador voltar atrás as relações de sintese de e sintetizado que são verificadas na inserção são removidas.
      this.validar_Relacoes_Sintese();

      this.classesHierarquia = this.classes
        .filter(classe => classe.tipo == "Série")
        .sort((a, b) => a.codigo.localeCompare(b.codigo))
        .map(classe => {
          return {
            searchField: classe.codigo + " - " + classe.titulo,
            codigo: classe.codigo
          };
        });
    },
    validar_Relacoes_Sintese() {
      let relacoes_sintese = this.newSubSerie.relacoes.filter(
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
          this.newSubSerie.relacoes = this.newSubSerie.relacoes.filter(
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
      let criterio = this.newSubSerie.justificacaoDF.find(
        crit => crit.tipo == "Critério de Densidade Informacional"
      );

      if (criterio != undefined) {
        criterio.relacoes = criterio.relacoes.filter(
          e => e.codigo != codigoClasse
        );

        if (criterio.relacoes.length == 0) {
          this.alteraDF();

          this.newSubSerie.justificacaoDF = this.newSubSerie.justificacaoDF.filter(
            e => e.tipo != "Critério de Densidade Informacional"
          );
        }
      }
    },
    alteraDF() {
      if (
        this.newSubSerie.justificacaoDF.some(
          e => e.tipo == "Critério de Complementaridade Informacional"
        )
      ) {
        this.newSubSerie.df = "Conservação";
      } else {
        this.newSubSerie.df = null;
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
            relacoes: [{ codigo: codigoClasse }]
          });
        } else {
          criterio.relacoes.push({ codigo: codigoClasse });
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
            relacoes: [{ codigo: codigoClasse }]
          });
        } else {
          criterio.relacoes.push({ codigo: codigoClasse });
        }
      }
    },
    relacoes_simetricas: function(clone_newSubserie) {
      for (let i = 0; i < clone_newSubserie.relacoes.length; i++) {
        let classe_relacionada = this.classes.find(
          e => e.codigo == clone_newSubserie.relacoes[i].serieRelacionada.codigo
        );

        if (classe_relacionada == undefined) {
          if (clone_newSubserie.relacoes[i].serieRelacionada.tipo == "Série") {
            classe_relacionada = {
              codigo: clone_newSubserie.relacoes[i].serieRelacionada.codigo,
              titulo: clone_newSubserie.relacoes[i].serieRelacionada.titulo,
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              tUA: null,
              tSerie: null,
              suporte: null,
              medicao: null,
              localizacao: [],
              entProdutoras: [],
              tipologiasProdutoras: [],
              legislacao: [],
              relacoes: [],
              UIs: [],
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
            };
          } else {
            classe_relacionada = {
              codigo: clone_newSubserie.relacoes[i].serieRelacionada.codigo,
              titulo: clone_newSubserie.relacoes[i].serieRelacionada.titulo,
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              relacoes: [],
              UIs: [],
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
          }

          this.classes.push(classe_relacionada);
        }

        let relacao_inversa = "";

        switch (clone_newSubserie.relacoes[i].relacao) {
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
              clone_newSubserie.codigo,
              "Critério de Complementaridade Informacional",
              relacao_inversa
            );
            break;
          case "Sintetizado por":
            relacao_inversa = "Síntese de";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSubserie.codigo,
              "Critério de Densidade Informacional",
              relacao_inversa
            );
            break;
          case "Síntese de":
            relacao_inversa = "Sintetizado por";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSubserie.codigo,
              "Critério de Densidade Informacional",
              relacao_inversa
            );
            break;
          case "Suplemento de":
            relacao_inversa = "Suplemento para";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_newSubserie.codigo,
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
            codigo: clone_newSubserie.codigo,
            tipo: clone_newSubserie.tipo
          }
        });
      }
    }
  }
};
</script>
