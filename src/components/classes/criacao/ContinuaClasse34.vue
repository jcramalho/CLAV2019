<template>
  <v-card flat class="pa-3">
  <v-row class="ma-1">
    <v-col>
      <!-- HEADER -->
      <p class="clav-content-title-1">Nova Classe (continuação do trabalho guardado)</p>
      
      <Campo nome="Nível" color="neutralpurple">
          <template v-slot:conteudo>
            <div class="info-content">
                {{ classe.nivel }}
              </div>
          </template>
        </Campo>

        <Campo 
          nome="Código" 
          color="neutralpurple"
          infoHeader="Código da Classe"
          :infoBody="myhelp.Classe.Campos.Codigo">
          <template v-slot:conteudo>
            <div class="info-content">
                {{ classe.codigo }}
              </div>
          </template>
        </Campo>

        <!-- TÍTULO -->
        <Campo
          nome="Título"
          color="neutralpurple"
          infoHeader="Título da Classe"
          :infoBody="myhelp.Classe.Campos.Titulo"
        >
          <template v-slot:conteudo>
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
          </template>
        </Campo>
          
          <v-expansion-panels flat class="mt-6">
            <!-- DESCRITIVO DA CLASSE -->
            <BlocoDescritivo :c="classe" class="mt-6" />

            <!-- CONTEXTO DE AVALIAÇÃO DA CLASSE -->
            <BlocoContexto
              :c="classe"
              :semaforos="semaforos"
              :donos="entidadesD"
              :participantes="entidadesP"
              :procRel="listaProcessos"
              :legs="listaLegislacao"
              v-if="classe.nivel == 3"
            />

            <!-- DECISÕES DE AVALIAÇÂO -->
            <PainelCLAV
            v-if="classe.nivel == 3"
            titulo="Decisões de Avaliação"
            infoHeader="Decisões de Avaliação"
            :infoBody="myhelp.Classe.BlocoDecisoes"
          >
            <template v-slot:icon>
              <unicon
                name="decisao-icon"
                width="20"
                height="20"
                viewBox="0 0 20.71 23.668"
                fill="#ffffff"
              />
            </template>
            <template v-slot:conteudo>
              <v-expansion-panel-content>
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
                  class="mt-3"
                />
              </v-expansion-panel-content>
            </template>
          </PainelCLAV>
          </v-expansion-panels>

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
      
      <!-- TODO: Corrigir este componente -->
      <PainelOperacoes :c="classe" :pendenteId="pendenteID" />
    </v-col>
  </v-row>
  </v-card>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import Campo from "@/components/generic/Campo.vue";
import InfoBox from "@/components/generic/infoBox.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";

import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import BlocoContexto from "@/components/classes/criacao/BlocoContexto.vue";

import Subdivisao3Nivel from "@/components/classes/criacao/Subdivisao3Nivel.vue";
import DecisaoSemSubPCA from "@/components/classes/criacao/DecisaoSemSubPCA.vue";
import DecisaoSemSubDF from "@/components/classes/criacao/DecisaoSemSubDF.vue";
import Subclasses4Nivel from "@/components/classes/criacao/Subclasses4Nivel.vue";
import PainelOperacoes from "@/components/classes/criacao/PainelOperacoes.vue";

export default {
  props: ["obj"],

  components: {
    BlocoDescritivo,
    BlocoContexto,
    Subdivisao3Nivel,
    DecisaoSemSubPCA,
    DecisaoSemSubDF,
    Subclasses4Nivel,
    Campo,
    PainelCLAV,
    InfoBox,
    PainelOperacoes
  },

  created: function() {
    this.classe = this.obj.objeto;
    this.pendenteID = this.obj._id;
  },

  data: () => ({
    // Objeto que guarda uma classe

    classe: {},
    pendenteID: "",

    // Estruturas auxiliares

    myhelp: help,

    codeFormats: {
      1: /^[0-9]{3}$/,
      2: /^[0-9]{3}\.[0-9]{2}$/,
      3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
      4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/
    },

    entidadesD: [],
    entidadesP: [],
    listaProcessos: [],
    listaLegislacao: [],

    pcaFormasContagem: [],
    pcaSubFormasContagem: [],

    semaforos: {
      classesReady: false,
      entidadesReady: false,
      legislacaoReady: false,
      pcaFormasContagemReady: false,
      pcaSubFormasContagemReady: false,
      critLegalAdicionadoPCA: false,
      critLegalAdicionadoDF: false,
      critGestionarioAdicionado: false,
      arranqueSistema: true,
    },

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar a Classe!",
    mensValCodigo: ""
  }),

  mounted: function(){
    this.loadPCA();
  },

  watch: {
    "classe.temSubclasses4Nivel": function() {
      // Se passou a verdade  depois do sistema arrancar vamos criar um par de subclasses
      // A flag arranqueSistema evita a duplicação de subsclasses se já houve subdivisão anterior
      if(!this.semaforos.arranqueSistema) this.subdivideClasse();
      else this.semaforos.arranqueSistema = false;
    },
    "classe.temSubclasses4NivelDF": function() {
      if (this.classe.temSubclasses4NivelDF) this.calcSinteseDF4Nivel();
    },
    "classe.subdivisao4Nivel01Sintetiza02": function() {
      if (this.classe.temSubclasses4NivelDF) {
        this.remSintese4Nivel(this.classe.subclasses);
        this.calcSinteseDF4Nivel();
      }
    }
  },

  methods: {
    // Carrega as entidades da BD....................

    subdivideClasse: function(){
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
      for (var i = 0; i < subclasses.length; i++) {
        if (subclasses[i].processosRelacionados.length > 0) {
          index = subclasses[i].processosRelacionados.findIndex(
            p => p.relacao == "eSintetizadoPor" || p.relacao == "eSinteseDe"
          );
          if (index != -1) subclasses[i].processosRelacionados.splice(index, 1);
        }
      }
    }
  }
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
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
