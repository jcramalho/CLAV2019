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
          <!-- <h5>Identificação</h5>
          <v-divider></v-divider>-->
          <Identificacao :newSerie="newSubSerie" :classes="classes" />

          <v-expansion-panels accordion v-model="panels" :multiple="isMultiple">
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona Descritiva</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDescritiva :newSerie="newSubSerie" :UIs="UIs" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Contexto de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaContexto :newSerie="newSubSerie" :classes="classesRelacoes" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <b>Zona de Decisões de Avaliação</b>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ZonaDecisoesAvaliacao :newSerie="newSubSerie" />
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
                v-model="newSubSerie.eFilhoDe"
                :items="classesHierarquia"
                :rules="[v => !!v || 'Este campo é obrigatório.']"
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
                    >Sem classes Série! Adicione primeiro.</v-alert>
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
  props: ["classes", "UIs"],
  data: () => ({
    panels: [0, 0, 0],
    isMultiple: false,
    dialog: false,
    classesHierarquia: [],
    classesRelacoes: [],
    newSubSerie: {
      // codigo: "",
      // titulo: "",
      // descricao: "",
      // dataInicial: null,
      // dataFinal: null,
      codigo: "02.01.02",
      titulo: "SUBSERIESERIE",
      descricao: "DESC SERIE",
      dataInicial: "2020-02-13",
      dataFinal: "2020-02-16",
      UIs: [],
      relacoes: [],
      pca: "",
      formaContagem: "",
      justicacaoPCA: "",
      df: "",
      justificacaoDF: "",
      notas: "",
      eFilhoDe: "",
      tipo: "Subsérie"
    }
  }),
  methods: {
    apagar: function() {
      this.isMultiple = false;
      this.panels = [0, 0, 0];
      this.newSubSerie.relacoes = [];
      this.$refs.form.reset();
    },
    close: function() {
      this.dialog = false;
    },
    save: async function() {
      this.isMultiple = true;
      this.panels = [0, 1, 2];
      setTimeout(async () => {
        if (this.$refs.form.validate()) {
          let clone_newSubserie = Object.assign({}, this.newSubSerie);

          await this.adicionarUIs(clone_newSubserie);
          await this.relacoes_simetricas(clone_newSubserie);

          this.classes.push(clone_newSubserie);
          this.dialog = false;
          this.apagar();
        }
      }, 1);
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
    filterSeries: function() {
      this.classesHierarquia = this.classes.filter(
        classe => classe.tipo == "Série"
      );

      this.classesRelacoes = this.classes.filter(
        e => e.tipo == "Série" || e.tipo == "Subsérie"
      );
      // .map(e => e.codigo + " - " + e.titulo);
    },
    relacoes_simetricas: async function(clone_newSubserie) {
      for (let i = 0; i < clone_newSubserie.relacoes.length; i++) {
        /*
        
          Ver qual é a série relacionada, ir encontrar e adicionar a relação oposta;

        */

        let classe_relacionada = await this.classes.find(
          e => e.codigo == clone_newSubserie.relacoes[i].serieRelacionada.codigo
        );

        if (classe_relacionada == undefined) {
          if (clone_newSubserie.relacoes[i].serieRelacionada.tipo == "Série") {
            classe_relacionada = {
              codigo: clone_newSubserie.relacoes[i].serieRelacionada.codigo,
              titulo: "",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              tUA: "",
              tSerie: "",
              suporte: "",
              medicao: "",
              localizacao: [],
              entProdutoras: [],
              tipologiasProdutoras: [],
              legislacao: [],
              relacoes: [],
              UIs: [],
              pca: "",
              formaContagem: "",
              justicacaoPCA: "",
              df: "",
              justificacaoDF: "",
              notas: "",
              eFilhoDe: "",
              tipo: "Série"
            };
          } else {
            classe_relacionada = {
              codigo: clone_newSubserie.relacoes[i].serieRelacionada.codigo,
              titulo: "",
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              relacoes: [],
              UIs: [],
              pca: "",
              formaContagem: "",
              justicacaoPCA: "",
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

        switch (clone_newSubserie.relacoes[i].relacao) {
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
            break;
          case "Suplemento para":
            relacao_inversa = "Suplemento de";
            break;
        }

        /*
        
        Adicionar as relações simétricas verificando se essa relação já existe
        
        */

        let existe_repetida = await classe_relacionada.relacoes.find(
          e =>
            e.relacao == relacao_inversa &&
            e.serieRelacionada.codigo == clone_newSubserie.codigo
        );

        if (existe_repetida == undefined) {
          classe_relacionada.relacoes.push({
            relacao: relacao_inversa,
            serieRelacionada: {
              codigo: clone_newSubserie.codigo
            }
          });
        }
      }
    }
  }
};
</script>