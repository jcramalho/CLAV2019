<template>
  <!-- DF -->
  <v-card class="ma-2">
    <v-card-title class="clav-linear-background white--text">Destino final</v-card-title>
    <v-card-text class="pa-2">
      <Campo
        nome="Destino"
        infoHeader="Destino"
        :infoBody="myhelp.Classe.Campos.DF"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-select
            v-model="c.df.valor"
            :items="destinoFinalTipos"
            item-value="value"
            item-text="label"
            solo
            dense
            hide-details
          >
          </v-select>
        </template>
      </Campo>
      <Campo
        nome="Notas"
        infoHeader="Notas"
        :infoBody="myhelp.Classe.Campos.NotasDF"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-textarea
            solo
            label="Notas ao destino final"
            v-model="c.df.notas"
            rows="2"
            dense
            hide-details
          ></v-textarea>
        </template>
      </Campo>

      <hr style="border-top: 1px dashed #1a237e" />

      <!-- JUSTIFICAÇÂO DO DF -->
      <Campo
        nome="Justificação do DF"
        infoHeader="Justificação do DF"
        :infoBody="myhelp.Classe.Campos.JustificacaoDF"
        color="neutralpurple"
      >
        <template v-slot:lateral>
          <v-row>
            <v-col align="right">
              <v-btn
                v-if="!c.semaforos.critLegalAdicionadoDF"
                color="primary"
                class="white-text my-2"
                rounded
                @click="
                  adicionarCriterioLegalDF(
                    c.df.justificacao,
                    'CriterioJustificacaoLegal',
                    'Critério Legal',
                    '',
                    [],
                    c.legislacao
                  )
                "
              >
                Critério Legal
                <v-icon right>add_circle_outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template v-slot:conteudo>
          <div v-if="c.df.justificacao.length">
            <div class="my-2" v-for="(crit, cindex) in c.df.justificacao" :key="cindex">
              <!-- O critério de densidade não pode ser removido -->

              <Campo :nome="crit.label" :infoHeader="crit.label" color="neutralpurple">
                <template v-slot:lateral>
                  <v-row>
                    <v-col align="center">
                      <v-icon
                        v-if="crit.tipo != 'CriterioJustificacaoDensidadeInfo'"
                        color="error"
                        @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')"
                        >remove_circle</v-icon
                      >
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:conteudo>
                  <!-- Se existir um critério Legal ..............................................-->
                  <div v-if="crit.tipo == 'CriterioJustificacaoLegal'">
                    <div v-if="crit.legislacao.length > 0">
                      <v-textarea
                        auto-grow
                        clearable
                        single-line
                        rows="1"
                        :value="crit.notas"
                        v-model="crit.notas"
                      ></v-textarea>
                      <span v-for="(l, i) in crit.legislacao" :key="l.id">
                        <a :href="'/legislacao/' + l.id"> {{ l.tipo }} {{ l.numero }} </a>
                        <v-icon color="error" small @click="crit.legislacao.splice(i, 1)"
                          >remove_circle</v-icon
                        >
                        <span v-if="i == crit.legislacao.length - 1">.</span>
                        <span v-else>, </span>
                      </span>
                    </div>
                    <div v-if="crit.legislacao.length == 0">
                      Sem legislação associada. Pode associar legislação na área de
                      contexto.
                    </div>
                  </div>
                  <!-- Se existir um critério de densidade ou de complementaridade ..................-->

                  <div v-else>
                    {{ crit.notas }}
                    <a
                      :href="'/classes/consultar/' + p.id"
                      v-for="(p, i) in crit.procRel"
                      :key="p.id"
                    >
                      {{ p.codigo }}: {{ p.titulo }}
                      <span v-if="i == crit.procRel.length - 1">.</span>
                      <span v-else>, </span>
                    </a>
                  </div>
                </template>
              </Campo>
            </div>
          </div>
          <v-alert v-else border="left" type="warning">
            Nenhum critério selecionado!
          </v-alert>
        </template>
      </Campo>
    </v-card-text>
  </v-card>
</template>

<script>
const help = require("@/config/help").help;

import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";
import Campo from "@/components/generic/Campo";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    //ProcessosRelacionadosOps,
    //LegislacaoOps,
    Campo,
  },

  created: function () {
    // Vou ordenar os processos relacionados no critério de densidade
    var res = 0;
    for (var i = 0; i < this.c.df.justificacao.length; i++) {
      if (this.c.df.justificacao[i].tipo == "CriterioJustificacaoDensidadeInfo") {
        this.c.df.justificacao[i].procRel.sort((p1, p2) => {
          var p1Nivel = p1.codigo.split(".").length;
          var p2Nivel = p2.codigo.split(".").length;
          if (p1Nivel == p2Nivel) {
            if (p1.codigo < p2.codigo) res = -1;
            else res = 1;
          } else if (p1Nivel > p2Nivel) res = -1;
          else res = 1;
          return res;
        });
      }
    }
  },

  data: function () {
    return {
      myhelp: help,

      destinoFinalTipos: [
        { label: "Não Especificado", value: "NE" },
        { label: "Conservação", value: "C" },
        { label: "Conservação Parcial", value: "CP" },
        { label: "Eliminação", value: "E" },
      ],

      destinoFinalLabels: {
        NE: "Não Especificado",
        C: "Conservação",
        CP: "Conservação Parcial",
        E: "Eliminação",
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

    adicionarCriterioLegalDF: function (
      justificacao,
      tipo,
      label,
      notas,
      procRel,
      legislacao
    ) {
      this.adicionarCriterio(justificacao, tipo, label, notas, procRel, legislacao);
      this.c.semaforos.critLegalAdicionadoDF = true;
    },

    // Remove um critério completo duma vez
    removerCriterioTodo: function (justificacao, i, PCAouDF) {
      this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
      justificacao.splice(i, 1);
    },

    // Atualiza as flags que controlam os botões de adicionar e remover critérios
    atualizaFlagsCriterios(tipo, PCAouDF) {
      if (tipo == "CriterioJustificacaoLegal") {
        if (PCAouDF == "PCA") this.c.semaforos.critLegalAdicionadoPCA = false;
        else this.c.semaforos.critLegalAdicionadoDF = false;
      } else if (tipo == "CriterioJustificacaoGestionario") {
        this.c.semaforos.critGestionarioAdicionado = false;
      }
    },

    unselectProcesso: function (proc, listaProc) {
      var index = listaProc.findIndex((p) => p.id === proc.id);
      listaProc.splice(index, 1);
    },

    unselectDiploma: function (diploma, listaLeg) {
      var index = listaLeg.findIndex((e) => e.id === diploma.id);
      listaLeg.splice(index, 1);
      if (listaLeg.length == 0) {
        this.semaforos.critLegalAdicionadoDF = false;
      }
    },
  },
};
</script>
