<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12>
        <!-- HEADER -->
        <v-card>
          <v-toolbar color="teal darken-4" dark>
            <v-toolbar-title>Nova Classe</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-container fluid>
              <v-layout wrap>
                <v-flex xs2>
                  <div class="info-label">Nível</div>
                </v-flex>
                <v-flex xs6>
                  <v-select
                    item-text="label"
                    item-value="value"
                    v-model="classe.nivel"
                    :items="classeNiveis"
                    label="Selecione o nível da classe:"
                    solo
                    dense
                  />
                </v-flex>
              </v-layout>
              <!-- CLASSE PAI -->
              <v-layout wrap v-if="classe.nivel > 1">
                <v-flex xs2>
                  <div class="info-label">
                    Classe Pai
                    <InfoBox
                      header="Classe Pai"
                      :text="myhelp.Classe.Campos.Pai"
                    />
                  </div>
                </v-flex>
                <v-flex xs10>
                  <v-select
                    item-text="label"
                    item-value="value"
                    v-model="classe.pai.codigo"
                    :items="classesPai"
                    label="Selecione uma classe de nível superior"
                    solo
                    dense
                  />
                </v-flex>
              </v-layout>
              <!-- CÓDIGO DA NOVA CLASSE -->
              <v-layout wrap v-if="classe.nivel == 1 || classe.pai.codigo">
                <v-flex xs2>
                  <div class="info-label">
                    Código
                    <InfoBox
                      header="Código da Classe"
                      :text="myhelp.Classe.Campos.Codigo"
                    />
                  </div>
                </v-flex>
                <v-flex xs10>
                  <v-text-field
                    v-model="classe.codigo"
                    label="Código"
                    solo
                    clearable
                  ></v-text-field>
                  <span style="color: red"> {{ mensValCodigo }} </span>
                </v-flex>
              </v-layout>
              <!-- TÍTULO -->
              <v-layout wrap v-if="classe.nivel == 1 || classe.pai.codigo">
                <v-flex xs2>
                  <div class="info-label">
                    Título
                    <InfoBox
                      header="Título da Classe"
                      :text="myhelp.Classe.Campos.Titulo"
                    />
                  </div>
                </v-flex>
                <v-flex xs10>
                  <v-text-field
                    v-model="classe.titulo"
                    label="Título"
                    solo
                    clearable
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-expansion-panel popout>
                <!-- DESCRITIVO DA CLASSE -->
                <BlocoDescritivo :c="classe" />

                <!-- CONTEXTO DE AVALIAÇÂO DA CLASSE -->
                <BlocoContexto
                  :c="classe"
                  :semaforos="semaforos"
                  :donos="entidadesD"
                  :participantes="entidadesP"
                  :procRel="listaProcessos"
                  :legs="listaLegislacao"
                />

                <!-- DECISÕES DE AVALIAÇÂO -->
                <v-expansion-panel-content v-if="classe.nivel == 3">
                  <template v-slot:header>
                    <v-toolbar
                      color="teal darken-4 body-2 font-weight-bold"
                      dark
                    >
                      <v-toolbar-title>Decisões de Avaliação</v-toolbar-title>
                    </v-toolbar>
                  </template>
                  <!-- HÁ SUBDIVISÃO? -->
                  <Subdivisao3Nivel :c="classe" />

                  <hr style="border: 3px solid green; border-radius: 2px;" />

                  <!-- DECISÃO SEM SUBDIVISÃO -->
                  <DecisaoSemSubPCA
                    :c="classe"
                    :semaforos="semaforos"
                    :pcaFormasContagem="pcaFormasContagem"
                    :pcaSubFormasContagem="pcaSubFormasContagem"
                  />

                  <hr
                    style="border-top: 3px dashed green; border-radius: 2px;"
                  />

                  <DecisaoSemSubDF :c="classe" :semaforos="semaforos" />
                </v-expansion-panel-content>

                <!-- DECISÃO COM SUBDIVISÃO -->
                <Subclasses4Nivel
                  :c="classe"
                  :semaforos="semaforos"
                  :pcaFormasContagem="pcaFormasContagem"
                  :pcaSubFormasContagem="pcaSubFormasContagem"
                />
              </v-expansion-panel>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <div>
          <v-btn
            dark
            round
            color="teal darken-4"
            @click="guardarTrabalho"
            v-bind:disabled="classe.codigo == ''"
            >Guardar trabalho</v-btn>
            
          <valida-classe-info-box :c="classe"/>
          
          <v-btn dark round color="teal darken-4" @click="criarClasse">Criar classe</v-btn>
          <v-btn dark round color="red darken-4" @click="eliminarClasse">Cancelar criação</v-btn>
        </div>
      </v-flex>

      <v-snackbar v-model="pedidoCriado" :color="'success'" :timeout="60000">
        {{ mensagemPedidoCriadoOK }}
        <v-btn dark flat @click="pedidoCriadoOK">
          Fechar
        </v-btn>
      </v-snackbar>

      <v-snackbar
        v-model="pendenteGuardado"
        :color="'teal darken-1'"
        :timeout="60000"
      >
        {{ mensagemPendenteGuardadoOK }}
        <v-btn dark flat @click="pendenteGuardadoOK">
          Fechar
        </v-btn>
      </v-snackbar>

      <v-snackbar
        v-model="loginErrorSnackbar"
        :timeout="8000"
        color="error"
        :top="true"
      >
        {{ loginErrorMessage }}
        <v-btn flat @click="loginErrorSnackbar = false">Fechar</v-btn>
      </v-snackbar>

      <v-snackbar v-model="pedidoEliminado" :timeout="8000" color="error">
        {{ mensagemPedidoEliminado }}
        <v-btn flat @click="pedidoEliminado = false">Fechar</v-btn>
      </v-snackbar>

      <v-dialog v-model="errosValidacao" width="60%" >
        <v-card>
          <v-card-title class="headline">Erros detetados na validação</v-card-title>
          <v-card-text>
            <p>Há erros de validação. Selecione "Validar" para ver extamente quais e proceder à sua correção.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red darken-4"
              round dark
              @click="errosValidacao=false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");
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
import ValidaClasseInfoBox from "@/components/classes/criacao/validaClasseInfoBox.vue";

export default {
  components: {
    BlocoDescritivo,
    BlocoContexto,
    Subdivisao3Nivel,
    DecisaoSemSubPCA,
    DecisaoSemSubDF,
    Subclasses4Nivel,
    InfoBox,
    ValidaClasseInfoBox
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

    pedidoCriado: false,
    errosValidacao: false,
    mensagemPedidoCriadoOK: "Pedido criado com sucesso: ",
    pedidoEliminado: false,
    mensagemPedidoEliminado: "Este trabalho foi eliminado.",
    pendenteGuardado: false,
    mensagemPendenteGuardadoOK: "Trabalho guardado com sucesso.",
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
            valor: null,
            formaContagem: "",
            subFormaContagem: "",
            justificacao: [] // j = [criterio]
          }, // criterio = {tipo, notas, [proc], [leg]}

          df: {
            valor: "NE",
            notas: null,
            justificacao: []
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
            valor: null,
            formaContagem: "",
            subFormaContagem: "",
            justificacao: []
          },

          df: {
            valor: "NE",
            notas: null,
            justificacao: []
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
        var response = await axios.get(
          lhost + "/api/classes?nivel=" + (this.classe.nivel - 1)
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
        var response = await axios.get(lhost + "/api/entidades");
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
        response = await axios.get(lhost + "/api/tipologias");
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
        var response = await axios.get(lhost + "/api/classes?nivel=3");
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
        var response = await axios.get(lhost + "/api/legislacao?estado=A");
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
        var response = await axios.get(
          lhost + "/api/vocabularios/vc_pcaFormaContagem"
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
        var response = await axios.get(
          lhost + "/api/vocabularios/vc_pcaSubformaContagem"
        );
        this.pcaSubFormasContagem = this.pcaSubFormasContagem.concat(
          response.data
            .map(function(item) {
              var formaID = item.termo.substring(item.termo.length - 6);
              return {
                label: formaID + ": " + item.desc.substring(0, 70) + "...",
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
        this.classe.subclasses[1].df.valor = "E";
        this.classe.subclasses[1].processosRelacionados.push({
          codigo: this.classe.subclasses[0].codigo,
          titulo: this.classe.subclasses[0].titulo,
          relacao: "eSintetizadoPor",
          relLabel: "é Sintetizado por"
        });
      } else {
        this.classe.subclasses[0].df.valor = "E";
        this.classe.subclasses[0].processosRelacionados.push({
          codigo: this.classe.subclasses[1].codigo,
          titulo: this.classe.subclasses[1].titulo,
          relacao: "eSintetizadoPor",
          relLabel: "é Sintetizado por"
        });
        this.classe.subclasses[1].df.valor = "C";
        this.classe.subclasses[1].processosRelacionados.push({
          codigo: this.classe.subclasses[0].codigo,
          titulo: this.classe.subclasses[0].titulo,
          relacao: "eSinteseDe",
          relLabel: "é Síntese de"
        });
      }
    },

    remSintese4Nivel: function(subclasses) {
      var index = -1;
      for (var i = 0; i < subclasses.length; i++) {
        if (subclasses[i].processosRelacionados.length > 0) {
          index = subclasses[i].processosRelacionados.findIndex(
            p => p.relacao == "eSintetizadoPor" || p.relacao == "eSinteseDe"
          );
          if (index != -1) subclasses[i].processosRelacionados.splice(index, 1);
        }
      }
    },

    // Verifica se o código introduzido pelo utilizador já existe na BD....................

    verificaExistenciaCodigo: async function(codigo) {
      var response = await axios.get(
        lhost + "/api/classes/verificar/" + codigo
      );
      return response.data;
    },

    notaDuplicada: function(notas){
      if(notas.length > 1){
        var lastNota = notas[notas.length-1].nota
        var duplicados = notas.filter(n => n.nota == lastNota )
        if(duplicados.length > 1){
          return true
        }
        else return false
      }
      else{
        return false
      }
    },

    exemploDuplicado: function(exemplos){
      if(exemplos.length > 1){
        var lastExemplo = exemplos[exemplos.length-1].exemplo
        var duplicados = exemplos.filter(e => e.exemplo == lastExemplo )
        if(duplicados.length > 1){
          return true
        }
        else return false
      }
      else{
        return false
      }
    },

    tiDuplicado: function(termos){
      if(termos.length > 1){
        var lastTermo = termos[termos.length-1].termo
        var duplicados = termos.filter(t => t.termo == lastTermo )
        if(duplicados.length > 1){
          return true
        }
        else return false
      }
      else{
        return false
      }
    },

    // Valida a classe antes de a criar

    validaClasse: async function(c){
      var i = 0, numeroErros = 0
      
      // Codigo
      if(c.codigo){
        if (c.nivel >1){
          if(!c.pai.codigo){
            numeroErros++
          }
          else{
            if(!c.codigo.includes(c.pai.codigo)){
              numeroErros++
            }
          }
          if (!this.codeFormats[c.nivel].test(c.codigo)) {
            numeroErros++
          }
        }
        try{
          var existe = await this.verificaExistenciaCodigo(c.codigo);
          if (existe) {
            numeroErros++
          }
        }
        catch(e){
          numeroErros++
        }
      }
      else{
        numeroErros++
      }
  
      // Título
      if(c.titulo == ""){
        numeroErros++
      }
      else {
        try{
          var existeTitulo = await axios.post( lhost + '/api/classes/verificarTitulo', {titulo: c.titulo})
          if(existeTitulo.data){
            numeroErros++
          }
        }
        catch(e){
          numeroErros++
        }
      }
      
      // Notas de Aplicação
      for(i=0; i < c.notasAp.length; i++){
        try{
          var existeNotaAp = await axios.post( lhost + '/api/classes/verificarNA', {na: c.notasAp[i].nota})
          if(existeNotaAp.data){
            numeroErros++
          }
        }
        catch(e){
          numeroErros++
        }
      }
      if(this.notaDuplicada(c.notasAp)){
          numeroErros++
      }

      // Exemplos de notas de Aplicação
      for(i=0; i < c.exemplosNotasAp.length; i++){
        try{
          var existeExemploNotaAp = await axios.post( lhost + '/api/classes/verificarExemploNA', {exemplo: c.exemplosNotasAp[i].exemplo})
          if(existeExemploNotaAp.data){
            numeroErros++
          }
        }
        catch(e){
          numeroErros++
        }
      }
      if(this.exemploDuplicado(c.exemplosNotasAp)){
        numeroErros++
      }

      // Notas de Exclusão
      if(this.notaDuplicada(c.notasEx)){
        numeroErros++
      }

      // Termos de Índice
      for(i=0; i < c.termosInd.length; i++){
        try{
          var existeTI = await axios.post( lhost + '/api/classes/verificarTI', {ti: c.termosInd[i].termo})
          if(existeTI.data){
            numeroErros++
          }
        }
        catch(e){
          numeroErros++
        }
      }
      if(this.tiDuplicado(c.termosInd)){
          numeroErros++
      }

      // Decisões
      // Sem subdivisão
      if((c.nivel == 3)&&(!c.temSubclasses4Nivel)){
        // PCA: prazo
        if((c.pca.valor<0)||(c.pca.valor>200)||(!c.pca.valor)){
          numeroErros++
        }
        // PCA: forma e subforma de contagem
        if(c.pca.formaContagem == ""){
          numeroErros++
        }
        else if((c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal")&&(c.pca.subFormaContagem == "")){
          numeroErros++
        }
      }
      // Com subdivisão
      else if((c.nivel == 3)&&(c.temSubclasses4Nivel)){
        var subclasse = {}
        // PCA: prazo
        for(i=0; i < c.subclasses.length; i++){
          subclasse = c.subclasses[i]
          if((subclasse.pca.valor<0)||(subclasse.pca.valor>200)||(!subclasse.pca.valor)){
            numeroErros++
          }
          // PCA: forma e subforma de contagem
          if(subclasse.pca.formaContagem == ""){
            numeroErros++
          }
          else if((subclasse.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal")&&(subclasse.pca.subFormaContagem == "")){
            numeroErros++
          }
        }
      }
      return numeroErros
    },

    // Lança o pedido de criação da classe no worflow

    criarClasse: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var erros = await this.validaClasse(this.classe)
          if(erros == 0){
            var userBD = await axios.get(lhost + "/api/users/listarToken/" + this.$store.state.token);
            var pedidoParams = {
              tipoPedido: "Criação",
              tipoObjeto: "Classe",
              novoObjeto: this.classe,
              user: {email: userBD.data.email},
              token: this.$store.state.token
            };

            var response = await axios.post(lhost + "/api/pedidos", pedidoParams);
            this.mensagemPedidoCriadoOK += response.data.codigo;
            this.pedidoCriado = true;
          }
          else{
            this.errosValidacao = true
          }
        } 
      }
      catch (error) {
          return error;
      }
    },

    eliminarClasse: function() {
      this.pedidoEliminado = true;
      this.$router.push("/");
    },

    pedidoCriadoOK: function() {
      this.pedidoCriado = false;
      this.$router.push("/");
    },

    pendenteGuardadoOK: function() {
      this.pendenteGuardado = false;
      this.$router.push("/");
    },

    guardarTrabalhoOK: function() {
      return this.classe.codigo != "" && this.classe.pai.codigo != "";
    },

    guardarTrabalho: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var userBD = await axios.get(
            lhost + "/api/users/listarToken/" + this.$store.state.token
          );
          var pendenteParams = {
            numInterv: 1,
            acao: "Criação",
            tipo: "Classe",
            objeto: this.classe,
            criadoPor: userBD.data.email,
            user: { email: userBD.data.email},
            token: this.$store.state.token
          };
          var response = await axios.post(
            lhost + "/api/pendentes",
            pendenteParams
          );
          this.pendenteGuardado = true;
        }
      } catch (error) {
        return error;
      }
    }
  }
};
</script>

<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
