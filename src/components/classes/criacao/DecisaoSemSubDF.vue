<template>
  <!-- DF -->
  <div v-if="!c.temSubclasses4Nivel">
    <v-row class="ma-2">
      <v-col>
        <v-toolbar color="indigo darken-2 font-weight-regular" dark height="30">
          <v-toolbar-title>Destino final</v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row class="ma-2">
      <v-col cols="2">
        <div class="info-label">
          Destino
          <InfoBox header="Destino" :text="myhelp.Classe.Campos.DF" />
        </div>
      </v-col>
      <v-col>
        <SelectValueFromList
          v-if="c.df.valor == 'NE'"
          :initial-value="c.df.valor"
          :options="destinoFinalTipos"
          @value-change="c.df.valor = $event"
        />

        <span v-else>{{ destinoFinalLabels[c.df.valor] }}</span>
      </v-col>
    </v-row>

    <v-row class="ma-2">
      <v-col cols="2">
        <div class="info-label">
          Notas
          <InfoBox header="Notas" :text="myhelp.Classe.Campos.NotasDF" />
        </div>
      </v-col>
      <v-col>
        <v-textarea solo label="Notas ao destino final" v-model="c.df.notas" rows="2"></v-textarea>
      </v-col>
    </v-row>

    <hr style="border-top: 2px dashed #1A237E;" />

    <!-- JUSTIFICAÇÂO DO DF -->
    <v-row class="ma-2">
      <v-col cols="2">
        <div class="info-label">
          Justificação do DF
          <InfoBox header="Justificação do DF" :text="myhelp.Classe.Campos.JustificacaoDF" />
        </div>

        <div>
          <v-btn
            color="indigo darken-2"
            dark
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
            v-if="!semaforos.critLegalAdicionadoDF"
          >
            Critério Legal
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </div>
      </v-col>

      <v-col>
        <v-row v-for="(crit, cindex) in c.df.justificacao" :key="cindex">
          <v-col cols="3">
            <div class="info-label">
              {{ crit.label }}
              <v-icon
                v-if="crit.procRel.length == 0 && crit.legislacao.length == 0"
                color="red darken-2"
                dark
                small
                @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')"
              >remove_circle_outline</v-icon>
            </div>
          </v-col>

          <v-col v-if="crit.tipo == 'CriterioJustificacaoComplementaridadeInfo'">
            <div class="info-content">
              {{ crit.notas }}
              <span v-for="(p, i) in crit.procRel" :key="p.id">
                <a :href="'/classes/consultar/' + p.id">{{ p.codigo }}: {{ p.titulo }}</a>
                <v-icon
                  color="red darken-2"
                  dark
                  small
                  @click="crit.procRel.splice(i, 1)"
                >remove_circle_outline</v-icon>
                <span v-if="i == crit.procRel.length - 1">.</span>
                <span v-else>,</span>
              </span>
            </div>
          </v-col>

          <v-col v-else-if="crit.tipo == 'CriterioJustificacaoLegal'">
            <div class="info-content" v-if="crit.legislacao.length > 0">
              <v-textarea
                auto-grow
                clearable
                single-line
                rows="1"
                :value="crit.notas"
                v-model="crit.notas"
              ></v-textarea>
              <span v-for="(l, i) in crit.legislacao" :key="l.id">
                <a :href="'/legislacao/' + l.id">{{ l.tipo }} {{ l.numero }}</a>
                <v-icon
                  color="red darken-2"
                  dark
                  small
                  @click="crit.legislacao.splice(i, 1)"
                >remove_circle_outline</v-icon>
                <span v-if="i == crit.legislacao.length - 1">.</span>
                <span v-else>,</span>
              </span>
            </div>
            <div class="info-content" v-if="crit.legislacao.length == 0">
              Sem legislação associada. Pode associar legislação na área de
              contexto.
            </div>
          </v-col>

          <v-col v-if="crit.tipo == 'CriterioJustificacaoDensidadeInfo'">
            <div class="info-content">
              <p v-if="crit.procRel.filter(p => p.relacao == 'eSinteseDe').length > 0">
                <span>
                  Informação pertinente não recuperável noutro PN. Sintetiza a
                  informação de:
                </span>
                <span
                  v-for="(p, i) in crit.procRel.filter(
                    p => p.relacao == 'eSinteseDe'
                  )"
                  :key="p.id"
                >
                  <a :href="'/classes/consultar/' + p.id">{{ p.codigo }}: {{ p.titulo }}</a>
                  <v-icon
                    color="red darken-2"
                    dark
                    small
                    @click="crit.procRel.splice(i, 1)"
                  >remove_circle_outline</v-icon>
                  <span v-if="i == crit.procRel.length - 1">.</span>
                  <span v-else>,</span>
                </span>
              </p>
              <p v-if="crit.procRel.filter(p => p.relacao == 'eSintetizadoPor').length > 0">
                <span>Informação sintetizada em:</span>
                <span
                  v-for="(p, i) in crit.procRel.filter(
                    p => p.relacao == 'eSintetizadoPor'
                  )"
                  :key="p.id"
                >
                  <a :href="'/classes/consultar/' + p.id">{{ p.codigo }}: {{ p.titulo }}</a>
                  <v-icon
                    color="red darken-2"
                    dark
                    small
                    @click="crit.procRel.splice(i, 1)"
                  >remove_circle_outline</v-icon>
                  <span v-if="i == crit.procRel.length - 1">.</span>
                  <span v-else>,</span>
                </span>
              </p>
            </div>
          </v-col>

          <hr style="border-top: 2px dotted #1A237E; width: 100%;" />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";
import SelectValueFromList from "@/components/generic/SelectValueFromList.vue";

export default {
  props: ["c", "semaforos"],

  components: {
    SelectValueFromList,
    InfoBox
  },

  data: function() {
    return {
      myhelp: help,

      destinoFinalTipos: [
        { label: "Não Especificado", value: "NE" },
        { label: "Conservação", value: "C" },
        { label: "Conservação Parcial", value: "CP" },
        { label: "Eliminação", value: "E" }
      ],

      destinoFinalLabels: {
        NE: "Não Especificado",
        C: "Conservação",
        CP: "Conservação Parcial",
        E: "Eliminação"
      },

      textoCriterioLegal:
        'Prazo prescricional estabelecido em "diplomas selecionados no contexto de avaliação": '
    };
  },

  methods: {
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

    adicionarCriterioLegalPCA: function(
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

    // Remove um critério completo duma vez
    removerCriterioTodo: function(justificacao, i, PCAouDF) {
      if(justificacao[i].tipo == "CriterioJustificacaoDensidadeInfo"){
        if(justificacao[i].procRel.length == 0){
          this.atualizaFlagsCriterios(justificacao[i].tipo, PCAouDF);
          justificacao.splice(i, 1);
        }
      }
      else{
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

    unselectProcesso: function(proc, listaProc) {
      var index = listaProc.findIndex(p => p.id === proc.id);
      listaProc.splice(index, 1);
    },

    unselectDiploma: function(diploma, listaLeg) {
      var index = listaLeg.findIndex(e => e.id === diploma.id);
      listaLeg.splice(index, 1);
      if (listaLeg.length == 0) {
        this.semaforos.critLegalAdicionadoDF = false;
      }
    }
  }
};
</script>
