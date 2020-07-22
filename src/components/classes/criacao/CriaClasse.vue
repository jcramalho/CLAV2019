<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
      <v-row>
        <v-col class="pt-0">
          <!-- HEADER -->
          <v-card flat style="border-radius: 10px !important;">
            <p
              class="content-title-1 py-5"
              style="color: #4da0d0 !important;  text-align:center;"
            >
              Criar Classe
            </p>

            <v-card-text>
              <v-row>
                <v-col cols="12" lg="2">
                  <div class="info-label">Nível</div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div
                    class="info-content info-content pa-4 pb-4"
                    style="min-height: 50px;"
                  >
                    <v-radio-group
                      v-model="classe.nivel"
                      row
                      hide-details
                      :class="{
                        'px-0': $vuetify.breakpoint.smAndDown,
                        'px-3': $vuetify.breakpoint.mdAndUp
                      }"
                      class="mt-1"
                    >
                      <v-radio
                        v-for="(n, i) in classeNiveis"
                        :key="i"
                        :label="n.label"
                        :value="n.value"
                        color="blue"
                        :class="{
                          'mx-auto': $vuetify.breakpoint.smAndDown
                        }"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>
              </v-row>

              <!-- CLASSE PAI -->
              <v-row
                v-if="classe.nivel > 1"
                :class="{
                  'mt-7': $vuetify.breakpoint.smAndDown,
                  'mt-6': $vuetify.breakpoint.mdAndUp
                }"
              >
                <v-col cols="12" lg="2">
                  <div class="info-label">
                    Classe Pai
                    <InfoBox
                      header="Classe Pai"
                      :text="myhelp.Classe.Campos.Pai"
                      helpColor="info"
                    />
                  </div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div
                    class="info-content pa-4 px-5 pb-6"
                    style="min-height: 50px;"
                  >
                    <v-select
                      class="mt-n5 px-3"
                      item-text="label"
                      item-value="value"
                      v-model="classe.pai.codigo"
                      :items="classesPai"
                      label="Selecione uma classe de nível superior"
                      clearable
                      hide-details
                      single-line
                    />
                  </div>
                </v-col>
              </v-row>

              <!-- CÓDIGO DA NOVA CLASSE -->
              <v-row
                v-if="classe.nivel == 1 || classe.pai.codigo"
                :class="{
                  'mt-7': $vuetify.breakpoint.smAndDown,
                  'mt-6': $vuetify.breakpoint.mdAndUp
                }"
              >
                <v-col cols="12" lg="2">
                  <div class="info-label">
                    Código
                    <InfoBox
                      header="Código da Classe"
                      :text="myhelp.Classe.Campos.Codigo"
                      helpColor="info"
                    />
                  </div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div
                    class="info-content pa-4 px-5 pb-0"
                    style="min-height: 50px;"
                  >
                    <v-text-field
                      class="mt-n3 px-3"
                      v-model="classe.codigo"
                      label="Código"
                      text
                      hide-details
                      single-line
                      clearable
                      color="blue darken-3"
                    ></v-text-field>
                    <span style="color: red" class="px-3">{{
                      mensValCodigo
                    }}</span>
                  </div>
                </v-col>
              </v-row>

              <!-- TÍTULO -->
              <v-row
                v-if="classe.nivel == 1 || classe.pai.codigo"
                :class="{
                  'mt-7': $vuetify.breakpoint.smAndDown,
                  'mt-6': $vuetify.breakpoint.mdAndUp
                }"
              >
                <v-col cols="12" lg="2">
                  <div class="info-label">
                    Título
                    <InfoBox
                      header="Título da Classe"
                      :text="myhelp.Classe.Campos.Titulo"
                      helpColor="info"
                    />
                  </div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div
                    class="info-content pa-4 px-5 pb-6"
                    style="min-height: 50px;"
                  >
                    <v-text-field
                      class="mt-n4 px-3"
                      v-model="classe.titulo"
                      label="Título"
                      text
                      hide-details
                      single-line
                      clearable
                      color="blue darken-3"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>

              <v-expansion-panels flat class="mt-6">
                <!-- DESCRITIVO DA CLASSE -->
                <BlocoDescritivo :c="classe" class="mt-6" />

                <!-- CONTEXTO DE AVALIAÇÂO DA CLASSE -->
                <BlocoContexto
                  class="mt-6"
                  :c="classe"
                  :semaforos="semaforos"
                  :donos="entidadesD"
                  :participantes="entidadesP"
                  :procRel="listaProcessos"
                  :legs="listaLegislacao"
                  v-if="classe.nivel == 3"
                />

                <!-- DECISÕES DE AVALIAÇÂO -->
                <v-expansion-panel v-if="classe.nivel == 3" popout class="mt-6">
                  <v-expansion-panel-header
                    style="outline: none;"
                    :class="{
                      'text-center': $vuetify.breakpoint.smAndDown,
                      'text-left': $vuetify.breakpoint.mdAndUp
                    }"
                    class="pa-0"
                  >
                    <div
                      :class="{
                        'px-3': $vuetify.breakpoint.mdAndUp
                      }"
                      class="separador"
                    >
                      <unicon
                        class="mt-3"
                        name="decisao-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 23.668"
                        fill="#ffffff"
                      />
                      <span class="ml-3 mr-1">Decisões de Avaliação</span>

                      <InfoBox
                        header="Decisões de Avaliação"
                        :text="myhelp.Classe.BlocoDecisoes"
                        helpColor="info"
                      />
                    </div>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content id="expanded-content">
                    <!-- HÁ SUBDIVISÃO? -->
                    <Subdivisao3Nivel :c="classe" />

                    <!--<hr style="border: 2px dashed #dee2f8;" /> -->

                    <!-- DECISÃO SEM SUBDIVISÃO -->
                    <DecisaoSemSubPCA
                      :c="classe"
                      :semaforos="semaforos"
                      :pcaFormasContagem="pcaFormasContagem"
                      :pcaSubFormasContagem="pcaSubFormasContagem"
                    />

                    <!--<hr style="border-top: 3px dashed #1A237E; border-radius: 2px;"/> -->

                    <DecisaoSemSubDF :c="classe" :semaforos="semaforos" />

                    <!-- DECISÃO COM SUBDIVISÃO -->
                    <Subclasses4Nivel
                      :c="classe"
                      :semaforos="semaforos"
                      :pcaFormasContagem="pcaFormasContagem"
                      :pcaSubFormasContagem="pcaSubFormasContagem"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>

            <v-snackbar
              v-model="loginErrorSnackbar"
              :timeout="8000"
              color="error"
              :top="true"
            >
              {{ loginErrorMessage }}
              <v-btn icon color="white" @click="loginErrorSnackbar = false">
                <unicon
                  name="remove-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 20.71 20.697"
                  fill="#ffffff"
                />
              </v-btn>
            </v-snackbar>

            <PainelOperacoes :c="classe" :pendenteId="''" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import InfoBox from "@/components/generic/infoBox.vue";

import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import BlocoContexto from "@/components/classes/criacao/BlocoContexto.vue";

import Subdivisao3Nivel from "@/components/classes/criacao/Subdivisao3Nivel.vue";
import DecisaoSemSubPCA from "@/components/classes/criacao/DecisaoSemSubPCA.vue";
import DecisaoSemSubDF from "@/components/classes/criacao/DecisaoSemSubDF.vue";
import Subclasses4Nivel from "@/components/classes/criacao/Subclasses4Nivel.vue";
import PainelOperacoes from "@/components/classes/criacao/PainelOperacoes.vue";

export default {
  components: {
    BlocoDescritivo,
    BlocoContexto,
    Subdivisao3Nivel,
    DecisaoSemSubPCA,
    DecisaoSemSubDF,
    Subclasses4Nivel,
    InfoBox,
    PainelOperacoes
  },

  data: () => ({
    // Objeto que guarda uma classe

    classe: {
      // Metainformação e campos da área de Descrição

      nivel: 0,
      pai: {
        codigo: "",
        titulo: ""
      },
      codigo: "",
      titulo: "",
      descricao: "",
      notasAp: [],
      exemplosNotasAp: [],
      notasEx: [],
      termosInd: [],

      temSubclasses4Nivel: false,
      temSubclasses4NivelPCA: false,
      temSubclasses4NivelDF: false,
      subdivisao4Nivel01Sintetiza02: true,

      // Campos da área do Contexto de Avaliação
      // Tipo de processo

      tipoProc: "PC",
      procTrans: "N",

      // Donos do processo: lista de entidades

      donos: [],

      // Participantes no processo: lista de entidades

      participantes: [],

      // Processos Relacionados

      processosRelacionados: [],

      // Legislação Associada

      legislacao: [],

      // Bloco de decisão de avaliação: PCA e DF

      pca: {
        valor: null,
        notas: "",
        formaContagem: "",
        subFormaContagem: "",
        justificacao: [] // j = [criterio]
      }, // criterio = {tipo, notas, [proc], [leg]}

      df: {
        valor: "NE",
        notas: "",
        justificacao: []
      },

      // Bloco de subclasses de nível 4, caso haja desdobramento

      subclasses: [],

      user: {
        token: ""
      }
    },

    // Estruturas auxiliares

    myhelp: help,

    codeFormats: {
      1: /^[0-9]{3}$/,
      2: /^[0-9]{3}\.[0-9]{2}$/,
      3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
      4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/
    },

    formatoCodigo: {
      1: "ddd (d - digito)",
      2: "ddd.dd (d - digito)",
      3: "ddd.dd.ddd (d - digito)",
      4: "ddd.dd.ddd.dd (d - digito)"
    },

    classeNiveis: [
      { label: "Nível 1", value: "1" },
      { label: "Nível 2", value: "2" },
      { label: "Nível 3", value: "3" }
    ],

    classesPai: [],
    entidadesD: [],
    entidadesP: [],
    listaProcessos: [],
    listaLegislacao: [],

    pcaFormasContagem: [],
    pcaSubFormasContagem: [],

    semaforos: {
      paisReady: false,
      classesReady: false,
      entidadesReady: false,
      legislacaoReady: false,
      pcaFormasContagemReady: false,
      pcaSubFormasContagemReady: false,
      critLegalAdicionadoPCA: false,
      critLegalAdicionadoDF: false,
      critGestionarioAdicionado: false
    },

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar a Classe!",
    mensValCodigo: ""
  }),

  watch: {
    "classe.pai.codigo": function() {
      // O código da classe depende da classe pai
      this.classe.codigo = "";
      if (this.classe.pai.codigo)
        this.classe.codigo = this.classe.pai.codigo + ".";
    },
    "classe.nivel": function() {
      // A classe pai depende do nível
      this.classe.pai.codigo = "";

      if (this.classe.nivel > 1) {
        this.loadPais();
      }
      if (this.classe.nivel >= 3 && !this.semaforos.entidadesReady) {
        this.loadEntidades();
      }
      if (this.classe.nivel >= 3 && !this.semaforos.classesReady) {
        this.loadProcessos();
      }
      if (this.classe.nivel >= 3 && !this.semaforos.legislacaoReady) {
        this.loadLegislacao();
      }
      if (this.classe.nivel >= 3) {
        this.loadPCA();
      }
    },

    "classe.codigo": async function() {
      try {
        this.mensValCodigo = "";
        if (!this.codeFormats[this.classe.nivel].test(this.classe.codigo)) {
          this.mensValCodigo =
            "Formato de código inválido! Deve ser: " +
            this.formatoCodigo[this.classe.nivel];
        } else if (!this.classe.codigo.includes(this.classe.pai.codigo)) {
          this.mensValCodigo =
            "Não pode alterar o código do pai selecionado em cima...";
        } else {
          var existe = await this.verificaExistenciaCodigo(this.classe.codigo);
          if (existe) {
            this.mensValCodigo = "Código já existente na base de dados...";
          }
        }
      } catch (erro) {
        return erro;
      }
    },

    "classe.temSubclasses4Nivel": function() {
      // Se passou a verdade vamos criar um par de subclasses
      // Informação base:
      if (this.classe.temSubclasses4Nivel) {
        var novaSubclasse1 = {
          nivel: 4,
          pai: this.classe.codigo,
          codigo: this.classe.codigo + ".01",
          titulo: this.classe.titulo + ": ",
          descricao: null,
          termosInd: JSON.parse(JSON.stringify(this.classe.termosInd)),

          // Bloco de contexto de avaliação

          processosRelacionados: JSON.parse(
            JSON.stringify(this.classe.processosRelacionados)
          ),
          legislacao: JSON.parse(JSON.stringify(this.classe.legislacao)),

          // Bloco de decisão de avaliação: PCA e DF

          pca: {
            valor: "",
            notas: "",
            formaContagem: "",
            subFormaContagem: "",
            justificacao: [] // j = [criterio]
          }, // criterio = {tipo, notas, [proc], [leg]}

          df: {
            valor: "NE",
            notas: "",
            justificacao: []
          },

          // Contexto para controlar a interface de cada subclasse
          semaforos: {
            critLegalAdicionadoPCA: false,
            critLegalAdicionadoDF: false,
            critGestionarioAdicionado: false
          }
        };
        var novaSubclasse2 = {
          nivel: 4,
          pai: this.classe.codigo,
          codigo: this.classe.codigo + ".02",
          titulo: this.classe.titulo + ": ",
          descricao: "",
          termosInd: JSON.parse(JSON.stringify(this.classe.termosInd)),

          // Bloco de contexto de avaliação

          processosRelacionados: JSON.parse(
            JSON.stringify(this.classe.processosRelacionados)
          ),
          legislacao: JSON.parse(JSON.stringify(this.classe.legislacao)),

          // Bloco de decisão de avaliação: PCA e DF

          pca: {
            valor: "",
            notas: "",
            formaContagem: "",
            subFormaContagem: "",
            justificacao: []
          },

          df: {
            valor: "NE",
            notas: "",
            justificacao: []
          },

          // Contexto para controlar a interface de cada subclasse
          semaforos: {
            critLegalAdicionadoPCA: false,
            critLegalAdicionadoDF: false,
            critGestionarioAdicionado: false
          }
        };

        this.procHeranca(this.classe.processosRelacionados, novaSubclasse1);
        this.procHeranca(this.classe.processosRelacionados, novaSubclasse2);

        this.classe.subclasses.push(novaSubclasse1);
        this.classe.subclasses.push(novaSubclasse2);
      }

      // Se passou a falso vamos eliminar as subclasses
      else {
        for (var j = 0; j < this.classe.subclasses.length; j++) {
          this.classe.subclasses[j].processosRelacionados.splice(
            0,
            this.classe.subclasses[j].processosRelacionados.length
          );
        }
        this.classe.subclasses.splice(0, this.classe.subclasses.length);
        this.classe.temSubclasses4NivelPCA = false;
        this.classe.temSubclasses4NivelDF = false;
        // E recalculamos o DF do nível 3
        this.classe.df.valor = this.calcDF(this.classe.processosRelacionados);
      }
    },
    "classe.temSubclasses4NivelDF": function() {
      if (this.classe.temSubclasses4NivelDF) this.calcSinteseDF4Nivel();
    },
    "classe.subdivisao4Nivel01Sintetiza02": function() {
      this.remSintese4Nivel(this.classe.subclasses);
      this.calcSinteseDF4Nivel();
    }
  },

  methods: {
    // Carrega os potenciais pais da BD, quando alguém muda o nível para >1....................

    loadPais: async function() {
      try {
        var response = await this.$request(
          "get",
          "/classes?nivel=" + (this.classe.nivel - 1)
        );
        this.classesPai = response.data
          .map(function(item) {
            return {
              label: item.codigo + " - " + item.titulo,
              value: item.id.split("#c")[1]
            };
          })
          .sort(function(a, b) {
            return a.label.localeCompare(b.label);
          });
      } catch (erro) {
        return erro;
      }
    },

    // Carrega as entidades da BD....................

    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidadesD = response.data.map(function(item) {
          return {
            selected: false,
            id: item.id,
            sigla: item.sigla,
            designacao: item.designacao,
            tipo: "Entidade",
            intervencao: "Indefinido",
            estado: item.estado
          };
        });
        response = await this.$request("get", "/tipologias");
        this.entidadesD = await this.entidadesD.concat(
          response.data.map(function(item) {
            return {
              selected: false,
              id: item.id,
              sigla: item.sigla,
              designacao: item.designacao,
              tipo: "Tipologia",
              intervencao: "Indefinido"
            };
          })
        );
        await this.entidadesD.sort(function(a, b) {
          return a.sigla.localeCompare(b.sigla);
        });

        this.entidadesP = JSON.parse(JSON.stringify(this.entidadesD));
        this.semaforos.entidadesReady = true;
      } catch (erro) {
        return erro;
      }
    },

    // Carrega os Processos da BD....................

    loadProcessos: async function() {
      try {
        var response = await this.$request("get", "/classes?nivel=3");
        this.listaProcessos = response.data
          .map(function(item) {
            return {
              selected: false,
              id: item.id.split("#")[1],
              codigo: item.codigo,
              titulo: item.titulo,
              idRel: "Indefinido"
            };
          })
          .sort(function(a, b) {
            return a.codigo.localeCompare(b.codigo);
          });

        this.semaforos.classesReady = true;
      } catch (error) {
        return error;
      }
    },

    // Carrega a legislação da BD....................

    loadLegislacao: async function() {
      try {
        var response = await this.$request("get", "/legislacao?estado=Ativo");
        this.listaLegislacao = response.data
          .map(function(item) {
            return {
              tipo: item.tipo,
              numero: item.numero,
              sumario: item.sumario,
              data: item.data,
              selected: false,
              id: item.id
            };
          })
          .sort(function(a, b) {
            return -1 * a.data.localeCompare(b.data);
          });
        this.semaforos.legislacaoReady = true;
      } catch (error) {
        return error;
      }
    },

    // Carrega a informação contextual relativa ao PCA: formas de contagem, etc....................

    loadPCA: function() {
      this.loadPCAFormasContagem();
      this.loadPCASubFormasContagem();
    },

    // Carrega as possíveis formas de contagem do PCA....................

    loadPCAFormasContagem: async function() {
      try {
        var response = await this.$request(
          "get",
          "/vocabularios/vc_pcaFormaContagem"
        );
        this.pcaFormasContagem = this.pcaFormasContagem.concat(
          response.data
            .map(function(item) {
              return {
                label: item.termo,
                value: item.idtermo.split("#")[1]
              };
            })
            .sort(function(a, b) {
              return a.label.localeCompare(b.label);
            })
        );
        this.semaforos.pcaFormasContagemReady = true;
      } catch (error) {
        return error;
      }
    },

    // Carrega as possíveis subformas de contagem do PCA....................

    loadPCASubFormasContagem: async function() {
      try {
        var response = await this.$request(
          "get",
          "/vocabularios/vc_pcaSubformaContagem"
        );
        this.pcaSubFormasContagem = this.pcaSubFormasContagem.concat(
          response.data
            .map(function(item) {
              var formaID = item.termo.substring(item.termo.length - 6);
              return {
                label: formaID + ": " + item.desc,
                value: item.idtermo.split("#")[1]
              };
            })
            .sort(function(a, b) {
              return a.label.localeCompare(b.label);
            })
        );
        this.semaforos.pcaSubFormasContagemReady = true;
      } catch (error) {
        return error;
      }
    },

    // Calcula o destino final para o contexto do momento
    calcDF: function(listaProc) {
      var res = "NE";

      if (!this.classe.temSubclasses4NivelDF) {
        var complementar = listaProc.findIndex(
          p => p.relacao == "eComplementarDe"
        );
        if (complementar != -1) {
          res = "C";
        } else {
          var sinteseDe = listaProc.findIndex(p => p.relacao == "eSinteseDe");
          if (sinteseDe != -1) {
            res = "C";
          } else {
            var sintetizado = listaProc.findIndex(
              p => p.relacao == "eSintetizadoPor"
            );
            if (sintetizado != -1) {
              res = "E";
            } else {
              res = "NE";
            }
          }
        }
      }
      return res;
    },

    // Adiciona um critério à lista de critérios do PCA ou do DF....................

    adicionarCriterio: function(
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      let myProcRel = JSON.parse(JSON.stringify(procRel));
      let myLeg = JSON.parse(JSON.stringify(legislacao));

      var indice = justificacao.findIndex(crit => crit.tipo === tipo);
      if (indice == -1) {
        justificacao.push({
          tipo: tipo,
          label: label,
          notas: notas,
          procRel: myProcRel,
          legislacao: myLeg
        });
      } else {
        justificacao[indice].procRel = justificacao[indice].procRel.concat(
          myProcRel
        );
        justificacao[indice].legislacao = justificacao[
          indice
        ].legislacao.concat(myLeg);
      }
    },

    adicionarCriterioLegalDF: function(
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(
        justificacao,
        tipo,
        label,
        notas,
        procRel,
        legislacao
      );
      this.semaforos.critLegalAdicionadoDF = true;
    },

    // No ato de um desdobramento em 4ºs níveis, trata a herança das relações

    procHeranca: function(procRel, novaClasse) {
      for (var i = 0; i < procRel.length; i++) {
        // Tratamento do invariante: se é Suplemento Para então cria-se um critério de Utilidade Administrativa
        if (procRel[i].relacao == "eSuplementoPara") {
          this.adicionarCriterio(
            novaClasse.pca.justificacao,
            "CriterioJustificacaoUtilidadeAdministrativa",
            "Critério de Utilidade Administrativa",
            criteriosLabels.textoCriterioUtilidadeAdministrativa,
            [procRel[i]],
            []
          );
        }
        // Tratamento do invariante: se é Suplemento De então cria-se um critério Legal com toda a legislação selecionada associada
        else if (procRel[i].relacao == "eSuplementoDe") {
          this.adicionarCriterio(
            novaClasse.pca.justificacao,
            "CriterioJustificacaoLegal",
            "Critério Legal",
            criteriosLabels.textoCriterioLegal,
            [procRel[i]],
            this.classe.legislacao
          );
          this.critLegalAdicionadoPCA = true;
        }
        // Tratamento do invariante: se é Síntese De então cria-se um critério de Densidade Informacional
        else if (procRel[i].relacao == "eSinteseDe") {
          this.adicionarCriterio(
            novaClasse.df.justificacao,
            "CriterioJustificacaoDensidadeInfo",
            "Critério de Densidade Informacional",
            criteriosLabels.textoCriterioDensidadeSinDe,
            [procRel[i]],
            []
          );
        }
        // Tratamento do invariante: se é Síntetizado Por então cria-se um critério de Densidade Informacional
        else if (procRel[i].relacao == "eSintetizadoPor") {
          this.adicionarCriterio(
            novaClasse.df.justificacao,
            "CriterioJustificacaoDensidadeInfo",
            "Critério de Densidade Informacional",
            criteriosLabels.textoCriterioDensidadeSinPor,
            [procRel[i]],
            []
          );
        }
        // Tratamento do invariante: se é Complementar De então cria-se um critério de Complementaridade Informacional
        else if (procRel[i].relacao == "eComplementarDe") {
          this.adicionarCriterio(
            novaClasse.df.justificacao,
            "CriterioJustificacaoComplementaridadeInfo",
            "Critério de Complementaridade Informacional",
            criteriosLabels.textoCriterioComplementaridade,
            [procRel[i]],
            []
          );
        }
      }
      if (!this.classe.temSubclasses4NivelDF) {
        novaClasse.df.valor = this.calcDF(novaClasse.processosRelacionados);
      }
    },

    // Quando o desdobramento é por DF distinto cria-se a relação de síntese entre as subclasses
    calcSinteseDF4Nivel: function() {
      if (this.classe.subdivisao4Nivel01Sintetiza02) {
        this.classe.subclasses[0].df.valor = "C";
        this.classe.subclasses[0].processosRelacionados.push({
          codigo: this.classe.subclasses[1].codigo,
          titulo: this.classe.subclasses[1].titulo,
          relacao: "eSinteseDe",
          relLabel: "é Síntese de"
        });
        this.adicionarCriterio(
          this.classe.subclasses[0].df.justificacao,
          "CriterioJustificacaoDensidadeInfo",
          "Critério de Densidade Informacional",
          criteriosLabels.textoCriterioDensidadeSinDe,
          [
            {
              codigo: this.classe.subclasses[1].codigo,
              titulo: this.classe.subclasses[1].titulo
            }
          ],
          []
        );

        this.classe.subclasses[1].df.valor = "E";
        this.classe.subclasses[1].processosRelacionados.push({
          codigo: this.classe.subclasses[0].codigo,
          titulo: this.classe.subclasses[0].titulo,
          relacao: "eSintetizadoPor",
          relLabel: "é Sintetizado por"
        });
        this.adicionarCriterio(
          this.classe.subclasses[1].df.justificacao,
          "CriterioJustificacaoDensidadeInfo",
          "Critério de Densidade Informacional",
          criteriosLabels.textoCriterioDensidadeSinPor,
          [
            {
              codigo: this.classe.subclasses[0].codigo,
              titulo: this.classe.subclasses[0].titulo
            }
          ],
          []
        );
      } else {
        this.classe.subclasses[0].df.valor = "E";
        this.classe.subclasses[0].processosRelacionados.push({
          codigo: this.classe.subclasses[1].codigo,
          titulo: this.classe.subclasses[1].titulo,
          relacao: "eSintetizadoPor",
          relLabel: "é Sintetizado por"
        });
        this.adicionarCriterio(
          this.classe.subclasses[0].df.justificacao,
          "CriterioJustificacaoDensidadeInfo",
          "Critério de Densidade Informacional",
          criteriosLabels.textoCriterioDensidadeSinPor,
          [
            {
              codigo: this.classe.subclasses[1].codigo,
              titulo: this.classe.subclasses[1].titulo
            }
          ],
          []
        );

        this.classe.subclasses[1].df.valor = "C";
        this.classe.subclasses[1].processosRelacionados.push({
          codigo: this.classe.subclasses[0].codigo,
          titulo: this.classe.subclasses[0].titulo,
          relacao: "eSinteseDe",
          relLabel: "é Síntese de"
        });
        this.adicionarCriterio(
          this.classe.subclasses[1].df.justificacao,
          "CriterioJustificacaoDensidadeInfo",
          "Critério de Densidade Informacional",
          criteriosLabels.textoCriterioDensidadeSinDe,
          [
            {
              codigo: this.classe.subclasses[0].codigo,
              titulo: this.classe.subclasses[0].titulo
            }
          ],
          []
        );
      }
    },

    remSintese4Nivel: function(subclasses) {
      var index = -1;
      var cindex = -1;
      for (var i = 0; i < subclasses.length; i++) {
        if (subclasses[i].processosRelacionados.length > 0) {
          // Remover as relações das subclasses
          index = subclasses[i].processosRelacionados.findIndex(
            p => p.relacao == "eSintetizadoPor" || p.relacao == "eSinteseDe"
          );
          if (index != -1) subclasses[i].processosRelacionados.splice(index, 1);
        }
        // Remover o critério de densidade das subclasses
        if (subclasses[i].df.justificacao.length > 0) {
          cindex = subclasses[i].df.justificacao.findIndex(
            c => c.tipo == "CriterioJustificacaoDensidadeInfo"
          );
          if (cindex != -1) subclasses[i].df.justificacao.splice(cindex, 1);
        }
      }
    }
  }
};
</script>

<style scoped>
.separador {
  color: white;
  font-weight: 400;
  padding: 5px;
  margin: 5px;
  width: 100%;
  min-height: 55px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
#expanded-content {
  margin-left: 5px;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
