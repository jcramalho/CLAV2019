<template>
  <!-- DF -->
  <v-container
    v-if="!c.temSubclasses4Nivel"
    fluid
    class="pa-0 ma-0"
    style="max-width:100%;"
  >
    <v-row class="mt-n6">
      <v-col class="mx-1">
        <v-toolbar
          color="#083581"
          class="caption mt-5"
          dark
          height="45"
          style="border-radius: 6px;"
        >
          <v-toolbar-title
            :class="{
              'mx-auto': $vuetify.breakpoint.smAndDown,
              'mx-0': $vuetify.breakpoint.mdAndUp
            }"
          >
            Destino Final
          </v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row
      :class="{
        'mt-5': $vuetify.breakpoint.smAndDown,
        'mt-0': $vuetify.breakpoint.mdAndUp
      }"
      class="ma-2"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Destino
          <InfoBox
            header="Destino"
            :text="myhelp.Classe.Campos.DF"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 px-5 pb-6" style="min-height: 50px;">
          <v-select
            class="mt-n4 px-3"
            item-text="label"
            item-value="value"
            v-model="c.df.valor"
            :items="destinoFinalTipos"
            label="Selecione uma forma de contagem para o prazo"
            clearable
            hide-details
            single-line
          />
        </div>
        <!--
        <div class="info-content pa-4" style="font-weight: bold;">
          <SelectValueFromList
            class="mt-n4 px-4"
            v-if="c.df.valor == 'NE'"
            :initial-value="c.df.valor"
            :options="destinoFinalTipos"
            @value-change="c.df.valor = $event"
          />

          <span class="mt-n4 px-4" v-else>{{
            destinoFinalLabels[c.df.valor]
          }}</span>
        </div> -->
      </v-col>
    </v-row>

    <v-row
      :class="{
        'mt-5': $vuetify.breakpoint.smAndDown,
        'mt-0': $vuetify.breakpoint.mdAndUp
      }"
      class="ma-2"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Notas
          <InfoBox
            header="Notas"
            :text="myhelp.Classe.Campos.NotasDF"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 px-5 pb-6" style="min-height: 50px;">
          <v-textarea
            class="mt-n2 px-3"
            label="Notas ao destino final"
            v-model="c.df.notas"
            rows="1"
            hide-details
            auto-grow
            color="blue darken-3"
          ></v-textarea>
        </div>
      </v-col>
    </v-row>

    <hr style="border-top: 1px dashed #dee2f8;" class="mx-7" />

    <!-- JUSTIFICAÇÂO DO DF -->
    <v-row
      :class="{
        'mt-5': $vuetify.breakpoint.smAndDown,
        'mt-0': $vuetify.breakpoint.mdAndUp
      }"
      class="ma-2"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Justificação do DF
          <InfoBox
            header="Justificação do DF"
            :text="myhelp.Classe.Campos.JustificacaoDF"
            helpColor="info"
          />
        </div>

        <div class="ma-2">
          <v-btn
            class="secondary-button"
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
            <unicon
              class="ml-3 mb-1"
              name="adicionar-icon"
              width="15"
              height="15"
              viewBox="0 0 20.71 20.71"
              fill="#4caf50"
            />
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" lg="10">
        <v-row v-for="(crit, cindex) in c.df.justificacao" :key="cindex">
          <v-col cols="3" class="mt-n3">
            <div class="info-label">
              {{ crit.label }}
              <!-- v-if="crit.procRel.length == 0 && crit.legislacao.length == 0" -->
              <v-btn
                icon
                small
                color="red"
                @click="removerCriterioTodo(c.df.justificacao, cindex, 'DF')"
              >
                <unicon
                  name="remove-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 20.71 20.697"
                  fill="#ff5252"
                />
              </v-btn>
            </div>
          </v-col>
          <v-col
            v-if="crit.tipo == 'CriterioJustificacaoComplementaridadeInfo'"
          >
            <div class="info-content mt-n3 pa-4">
              <div class="px-3 mt-2">
                <span style="font-weight: bold; font-size: 16px;">
                  {{ crit.notas }}
                </span>
                <br class="mb-3" />
                <span
                  v-for="(p, i) in crit.procRel"
                  :key="p.id"
                  style="font-size: 14px;"
                >
                  <a :href="'/classes/consultar/' + p.id"
                    >{{ p.codigo }}: {{ p.titulo }}</a
                  >
                  <v-btn
                    icon
                    small
                    color="red"
                    @click="crit.procRel.splice(i, 1)"
                  >
                    <unicon
                      class="mt-n1"
                      name="remove-icon"
                      width="13"
                      height="13"
                      viewBox="0 0 20.71 20.697"
                      fill="#ff5252"
                    />
                  </v-btn>
                  <span v-if="i == crit.procRel.length - 1" class="ml-n1"
                    >.</span
                  >
                  <span v-else class="ml-n1 mr-4">, <br class="mb-3"/></span>
                </span>
              </div>
            </div>
          </v-col>

          <v-col
            v-else-if="crit.tipo == 'CriterioJustificacaoLegal'"
            class="mt-n3"
          >
            <div class="info-content pa-4" v-if="crit.legislacao.length > 0">
              <v-textarea
                class="mt-n2 px-3"
                auto-grow
                clearable
                single-line
                rows="1"
                :value="crit.notas"
                v-model="crit.notas"
              ></v-textarea>
              <div class="px-3">
                <span v-for="(l, i) in crit.legislacao" :key="l.id">
                  <a :href="'/legislacao/' + l.id"
                    >{{ l.tipo }} {{ l.numero }}</a
                  >
                  <v-btn
                    icon
                    small
                    color="red"
                    @click="crit.legislacao.splice(i, 1)"
                  >
                    <unicon
                      class="mt-n1"
                      name="remove-icon"
                      width="13"
                      height="13"
                      viewBox="0 0 20.71 20.697"
                      fill="#ff5252"
                    />
                  </v-btn>

                  <span v-if="i == crit.legislacao.length - 1" class="ml-n1"
                    >.</span
                  >
                  <span v-else class="ml-n1 mr-4">, <br class="mb-3"/></span>
                </span>
              </div>
            </div>
            <div
              class="info-content pa-4 px-7"
              v-if="crit.legislacao.length == 0"
            >
              Sem legislação associada. Pode associar legislação na área de
              contexto.
            </div>
          </v-col>

          <v-col v-if="crit.tipo == 'CriterioJustificacaoDensidadeInfo'">
            <div class="info-content mt-n2 pa-4">
              <p
                v-if="
                  crit.procRel.filter(p => p.relacao == 'eSinteseDe').length > 0
                "
                class="px-3 mt-2"
                style="font-size: 16px;"
              >
                <span style="font-weight: bold;">
                  Informação pertinente não recuperável noutro PN. Sintetiza a
                  informação de:
                </span>
                <br class="mb-3" />
                <span
                  v-for="(p, i) in crit.procRel.filter(
                    p => p.relacao == 'eSinteseDe'
                  )"
                  :key="p.id"
                  style="font-size: 14px;"
                >
                  <a :href="'/classes/consultar/' + p.id"
                    >{{ p.codigo }}: {{ p.titulo }}</a
                  >
                  <v-btn
                    icon
                    small
                    color="red"
                    @click="crit.procRel.splice(i, 1)"
                  >
                    <unicon
                      class="mt-n1"
                      name="remove-icon"
                      width="13"
                      height="13"
                      viewBox="0 0 20.71 20.697"
                      fill="#ff5252"
                    />
                  </v-btn>
                  <span v-if="i == crit.procRel.length - 1" class="ml-n1"
                    >.</span
                  >
                  <span v-else class="ml-n1 mr-4">, <br class="mb-3"/></span>
                </span>
              </p>
              <p
                v-if="
                  crit.procRel.filter(p => p.relacao == 'eSintetizadoPor')
                    .length > 0
                "
                class="px-3 mt-2"
                style="font-size: 16px;"
              >
                <span style="font-weight: bold;"
                  >Informação sintetizada em:</span
                >
                <br class="mb-3" />
                <span
                  v-for="(p, i) in crit.procRel.filter(
                    p => p.relacao == 'eSintetizadoPor'
                  )"
                  :key="p.id"
                  style="font-size: 14px;"
                >
                  <a :href="'/classes/consultar/' + p.id"
                    >{{ p.codigo }}: {{ p.titulo }}</a
                  >
                  <v-btn
                    icon
                    small
                    color="red"
                    @click="crit.procRel.splice(i, 1)"
                  >
                    <unicon
                      class="mt-n1"
                      name="remove-icon"
                      width="13"
                      height="13"
                      viewBox="0 0 20.71 20.697"
                      fill="#ff5252"
                    />
                  </v-btn>

                  <span v-if="i == crit.procRel.length - 1" class="ml-n1"
                    >.</span
                  >
                  <span v-else class="ml-n1 mr-4">, <br class="mb-3"/></span>
                </span>
              </p>
            </div>
          </v-col>
          <hr style="border-top: 1px #ffffff ; width: 100%;" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";
import SelectValueFromList from "@/components/generic/SelectValueFromList.vue";

export default {
  props: ["c", "semaforos"],

  components: {
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
<style scoped>
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
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.selected {
  color: #000000 !important;
  font-weight: bold !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
.secondary-button {
  color: #1a237e !important;
  background: linear-gradient(to right, #c8cce0 0%, #e7eafb 100%);
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  outline: none !important;
}
</style>
