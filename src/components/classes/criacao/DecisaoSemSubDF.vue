<template>
  <!-- DF -->
  <div v-if="!c.temSubclasses4Nivel">
    <v-expansion-panels>
      <PainelCLAV titulo="Destino final" icon="mdi-archive-marker-outline">
        <template v-slot:conteudo>
          <Campo
            nome="Destino"
            infoHeader="Destino"
            :infoBody="myhelp.Classe.Campos.DF"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <v-select
                item-text="label"
                item-value="value"
                v-model="c.df.valor"
                :items="destinoFinalTipos"
                label="Selecione uma forma de contagem para o prazo"
                solo
                dense
                hide-details
              />
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
              ></v-textarea>
            </template>
          </Campo>
          <hr style="border-top: 2px dashed #1a237e" />

          <!-- JUSTIFICAÇÂO DO DF -->
          <Campo
            nome="Justificação do DF"
            infoHeader="Justificação do DF"
            :infoBody="myhelp.Classe.Campos.JustificacaoDF"
            color="neutralpurple"
          >
            <template v-slot:conteudo>
              <v-btn
                color="indigo darken-2"
                class="white--text"
                rounded
                @click="
                  adicionarCriterioLegalPCA(
                    c.df.justificacao,
                    'CriterioJustificacaoLegal',
                    'Critério Legal',
                    textoCriterioLegal,
                    [],
                    c.legislacao
                  )
                "
                :disabled="semaforos.critLegalAdicionadoDF"
              >
                Critério Legal
                <v-icon right>add_circle_outline</v-icon>
              </v-btn>

              <hr style="border-top: 2px dotted #1a237e" />

              <Campo
                v-for="(crit, cindex) in c.df.justificacao"
                :key="cindex"
                :nome="crit.label"
                :infoHeader="crit.label"
                color="neutralpurple"
              >
                <template v-slot:lateral>
                  <v-row justify="center">
                    <v-col align="center">
                      <v-icon
                        color="error"
                        @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')"
                      >
                        remove_circle_outline
                      </v-icon>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:conteudo>
                  <div v-if="crit.tipo == 'CriterioJustificacaoComplementaridadeInfo'">
                    {{ crit.notas }}
                    <span v-for="(p, i) in crit.procRel" :key="p.id">
                      <a :href="'/classes/consultar/' + p.id" target="_blank"
                        >{{ p.codigo }}: {{ p.titulo }}</a
                      >
                      <v-icon
                        color="error"
                        class="mb-1"
                        small
                        @click="crit.procRel.splice(i, 1)"
                        >remove_circle_outline</v-icon
                      >
                      <span v-if="i == crit.procRel.length - 1">.</span>
                      <span v-else>, </span>
                    </span>
                  </div>

                  <div v-else-if="crit.tipo == 'CriterioJustificacaoLegal'">
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
                        <a :href="'/legislacao/' + l.id" target="_blank"
                          >{{ l.tipo }} {{ l.numero }}</a
                        >
                        <v-icon
                          color="error"
                          class="mb-1"
                          small
                          @click="crit.legislacao.splice(i, 1)"
                          >remove_circle_outline</v-icon
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

                  <div v-if="crit.tipo == 'CriterioJustificacaoDensidadeInfo'">
                    <p
                      v-if="
                        crit.procRel.filter((p) => p.relacao == 'eSinteseDe').length > 0
                      "
                    >
                      <span>
                        Informação pertinente não recuperável noutro PN. Sintetiza a
                        informação de:
                      </span>
                      <span
                        v-for="(p, i) in crit.procRel.filter(
                          (p) => p.relacao == 'eSinteseDe'
                        )"
                        :key="p.id"
                      >
                        <a :href="'/classes/consultar/' + p.id" target="_blank"
                          >{{ p.codigo }}: {{ p.titulo }}</a
                        >
                        <v-icon
                          color="error"
                          class="mb-1"
                          small
                          @click="crit.procRel.splice(i, 1)"
                          >remove_circle_outline</v-icon
                        >
                        <span v-if="i == crit.procRel.length - 1">.</span>
                        <span v-else>, </span>
                      </span>
                    </p>
                    <p
                      v-if="
                        crit.procRel.filter((p) => p.relacao == 'eSintetizadoPor')
                          .length > 0
                      "
                    >
                      <span>Informação sintetizada em:</span>
                      <span
                        v-for="(p, i) in crit.procRel.filter(
                          (p) => p.relacao == 'eSintetizadoPor'
                        )"
                        :key="p.id"
                      >
                        <a :href="'/classes/consultar/' + p.id" target="_blank"
                          >{{ p.codigo }}: {{ p.titulo }}</a
                        >
                        <v-icon
                          color="error"
                          class="mb-1"
                          small
                          @click="crit.procRel.splice(i, 1)"
                          >remove_circle_outline</v-icon
                        >
                        <span v-if="i == crit.procRel.length - 1">.</span>
                        <span v-else>, </span>
                      </span>
                    </p>
                  </div>
                </template>
              </Campo>
            </template>
          </Campo>
        </template>
      </PainelCLAV>
    </v-expansion-panels>
  </div>
</template>

<script>
const help = require("@/config/help").help;

import PainelCLAV from "@/components/generic/PainelCLAV.vue";
import Campo from "@/components/generic/Campo.vue";

export default {
  props: ["c", "semaforos"],

  components: {
    PainelCLAV,
    Campo,
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

      textoCriterioLegal:
        'Prazo prescricional estabelecido em "diplomas selecionados no contexto de avaliação": ',
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
      this.semaforos.critLegalAdicionadoDF = true;
    },

    // Remove um critério completo duma vez
    removerCriterioTodo: function (justificacao, i, PCAouDF) {
      if (justificacao[i].tipo == "CriterioJustificacaoDensidadeInfo") {
        if (justificacao[i].procRel.length == 0) {
          this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
          justificacao.splice(i, 1);
        }
      } else {
        this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
        justificacao.splice(i, 1);
      }
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
