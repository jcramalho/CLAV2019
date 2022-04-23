<template>
  <v-expansion-panels>
    <PainelCLAV
      v-if="c.temSubclasses4NivelPCA || c.temSubclasses4NivelDF"
      titulo="Subclasses de nível 4"
      infoHeader="Subclasses de nível 4"
      icon="mdi-file-tree"
    >
      <template v-slot:conteudo>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="2">
              <v-tabs vertical v-model="active">
                <v-tab v-for="subClasse in c.subclasses" :key="subClasse.codigo">
                  {{ subClasse.codigo }}
                </v-tab>
              </v-tabs>

              <v-btn
                v-if="!disable"
                class="white-text"
                depressed
                x-small
                color="primary"
                @click="addSubclasse"
              >
                Adicionar subclasse
                <v-icon right>add_circle_outline</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-tabs-items v-model="active">
                <v-tab-item
                  v-for="subClasse in c.subclasses"
                  :key="subClasse.codigo"
                  class="ma-2 pa-2"
                >
                  <Campo nome="Código" infoHeader="Código" color="neutralpurple">
                    <template v-slot:conteudo>
                      {{ subClasse.codigo }}
                    </template>
                  </Campo>
                  <Campo
                    nome="Código do pai"
                    infoHeader="Código do pai"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      {{ c.codigo }}
                    </template>
                  </Campo>
                  <Campo nome="Título" infoHeader="Título" color="neutralpurple">
                    <template v-slot:conteudo>
                      <v-text-field
                        v-if="!disable"
                        v-model="subClasse.titulo"
                        label="Título"
                        solo
                        clearable
                        dense
                        hide-details
                      ></v-text-field>
                      <p v-else>{{ subClasse.titulo }}</p>
                    </template>
                  </Campo>
                  <Campo nome="Descrição" infoHeader="Descrição" color="neutralpurple">
                    <template v-slot:conteudo>
                      <v-text-field
                        v-if="!disable"
                        v-model="subClasse.descricao"
                        label="Descrição"
                        solo
                        clearable
                        dense
                        hide-details
                      ></v-text-field>
                      <p v-else>{{ subClasse.descricao }}</p>
                    </template>
                  </Campo>

                  <TermosIndiceOps v-if="!disable" :c="subClasse" />

                  <Campo
                    v-else
                    nome="Termos de Índice"
                    infoHeader="Termos de Índice"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <ul>
                        <li v-for="(ti, index) in subClasse.termosInd" :key="index">
                          {{ ti.termo }}
                        </li>
                      </ul>
                    </template>
                  </Campo>

                  <BlocoDecisoes4Nivel
                    class="my-4"
                    :c="subClasse"
                    :semaforos="semaforos"
                    :pcaFormasContagem="pcaFormasContagem"
                    :pcaSubFormasContagem="pcaSubFormasContagem"
                    :disable="disable"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </template>
    </PainelCLAV>
  </v-expansion-panels>
</template>

<script>
const help = require("@/config/help").help;

import BlocoDecisoes4Nivel from "@/components/classes/criacao/BlocoDecisoes4Nivel.vue";
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";
import Campo from "@/components/generic/CampoCLAV.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem", "disable"],

  components: {
    BlocoDecisoes4Nivel,
    TermosIndiceOps,
    PainelCLAV,
    Campo,
  },

  data: function () {
    return {
      myhelp: help,
      active: null,

      destinoFinalTipos: [
        { label: "Não Especificado (NE)", value: "NE" },
        { label: "Conservação (C)", value: "C" },
        { label: "Conservação Parcial (CP)", value: "CP" },
        { label: "Eliminação (E)", value: "E" },
      ],

      destinoFinalLabels: {
        NE: "Não Especificado (NE)",
        C: "Conservação (C)",
        CP: "Conservação Parcial (CP)",
        E: "Eliminação (E)",
      },
    };
  },

  methods: {
    // Adiciona um critério à lista de critérios do PCA ou do DF....................
    adicionarCriterio: function (justificacao, tipo, label, notas, procRel, legislacao) {
      let myProcRel = JSON.parse(JSON.stringify(procRel));
      let myLeg = JSON.parse(JSON.stringify(legislacao));

      var indice = justificacao.findIndex((crit) => crit.tipo === tipo);
      if (indice == -1) {
        justificacao.push({
          tipo: tipo,
          label: label,
          notas: notas,
          procRel: myProcRel,
          legislacao: myLeg,
        });
      } else {
        justificacao[indice].procRel = justificacao[indice].procRel.concat(myProcRel);
        justificacao[indice].legislacao = justificacao[indice].legislacao.concat(myLeg);
      }
    },

    adicionarCriterioLegalPCA: function (
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
      this.semaforos.critLegalAdicionadoPCA = true;
    },

    adicionarCriterioGestionario: function (
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
      this.semaforos.critGestionarioAdicionado = true;
    },

    // Remove um critério completo duma vez
    removerCriterioTodo: function (justificacao, i, PCAouDF) {
      this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
      justificacao.splice(i, 1);
    },

    // Atualiza as flags que controlam os botões de adicionar e remover critérios
    atualizaFlagsCriterios(tipo, PCAouDF) {
      if (tipo == "CriterioJustificacaoLegal") {
        if (PCAouDF == "PCA") this.semaforos.critLegalAdicionadoPCA = false;
        else this.semaforos.critLegalAdicionadoDF = false;
      } else if (tipo == "CriterioJustificacaoGestionario") {
        this.semaforos.critGestionarioAdicionado = false;
      }
    },

    unselectProcesso: function (proc, listaProc) {
      var index = listaProc.findIndex((p) => p.id === proc.id);
      listaProc.splice(index, 1);
    },

    // Calcula o destino final para o contexto do momento
    calcDF: function (listaProc) {
      var res = "NE";

      if (!this.c.temSubclasses4NivelDF) {
        var complementar = listaProc.findIndex((p) => p.relacao == "eComplementarDe");
        if (complementar != -1) {
          res = "C";
        } else {
          var sinteseDe = listaProc.findIndex((p) => p.relacao == "eSinteseDe");
          if (sinteseDe != -1) {
            res = "C";
          } else {
            var sintetizado = listaProc.findIndex((p) => p.relacao == "eSintetizadoPor");
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

    procHeranca: function (procRel, novaClasse) {
      for (var i = 0; i < procRel.length; i++) {
        // Tratamento do invariante: se é Suplemento Para então cria-se um critério de Utilidade Administrativa
        if (procRel[i].relacao == "eSuplementoPara") {
          this.adicionarCriterio(
            novaClasse.pca.justificacao,
            "CriterioJustificacaoUtilidadeAdministrativa",
            "Critério de Utilidade Administrativa",
            this.textoCriterioUtilidadeAdministrativa,
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
            this.textoCriterioLegal,
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
            this.textoCriterioDensidadeSinDe,
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
            this.textoCriterioDensidadeSinPor,
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
            this.textoCriterioComplementaridade,
            [procRel[i]],
            []
          );
        }
      }
      if (!this.c.temSubclasses4NivelDF) {
        novaClasse.df.valor = this.calcDF(novaClasse.processosRelacionados);
      }
    },

    pad: function (num, size) {
      var s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    },

    showSubs: function () {
      alert(JSON.stringify(this.c.subclasses));
    },

    addSubclasse: function () {
      var novaSubclasse = {
        nivel: 4,
        pai: this.c.codigo,
        codigo: this.c.codigo + "." + this.pad(this.c.subclasses.length + 1, 2),
        titulo: this.c.titulo + ": ",
        descricao: "",
        termosInd: [],

        // Bloco de contexto de avaliação

        processosRelacionados: JSON.parse(JSON.stringify(this.c.processosRelacionados)),
        legislacao: JSON.parse(JSON.stringify(this.c.legislacao)),

        // Bloco de decisão de avaliação: PCA e DF

        pca: {
          valor: null,
          formaContagem: "",
          subFormaContagem: "",
          justificacao: [],
        },

        df: {
          valor: "NE",
          notas: null,
          justificacao: [],
        },
        // Contexto para controlar a interface de cada subclasse
        semaforos: {
          critLegalAdicionadoPCA: false,
          critLegalAdicionadoDF: false,
          critGestionarioAdicionado: false,
        },
      };

      this.procHeranca(this.c.processosRelacionados, novaSubclasse);
      this.c.subclasses.push(novaSubclasse);
    },
  },
};
</script>
<style>
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
