<template>
  <!-- PCA -->
  <v-container
    v-if="!c.temSubclasses4Nivel"
    fluid
    class="pa-0 ma-0"
    style="max-width:100%;"
  >
    <v-row>
      <v-col class="mx-1">
        <v-toolbar
          color="#083581"
          dark
          height="45"
          style="border-radius: 6px;"
          class="caption mt-5"
        >
          <v-toolbar-title
            :class="{
              'mx-auto': $vuetify.breakpoint.smAndDown,
              'mx-0': $vuetify.breakpoint.mdAndUp
            }"
          >
            Prazo de Conservação Administrativa
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
          Prazo
          <InfoBox
            header="Prazo de Conservação Administrativa"
            :text="myhelp.Classe.Campos.Prazo"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 px-5 pb-6" style="min-height: 50px;">
          <v-text-field
            class="mt-n4 px-3"
            v-model="c.pca.valor"
            label="Prazo em anos: 0 a 199"
            v-mask="'###'"
            text
            hide-details
            single-line
            clearable
            color="blue darken-3"
          ></v-text-field>
        </div>
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
            :text="myhelp.Classe.Campos.Notas"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content pa-4 px-5 pb-6" style="min-height: 50px;">
          <v-textarea
            class="mt-n2 px-3"
            label="Notas ao PCA"
            v-model="c.pca.notas"
            rows="1"
            hide-details
            auto-grow
            color="blue darken-3"
          ></v-textarea>
        </div>
      </v-col>
    </v-row>

    <v-row
      :class="{
        'mt-5': $vuetify.breakpoint.smAndDown,
        'mt-0': $vuetify.breakpoint.mdAndUp
      }"
      class="ma-2"
      v-if="semaforos.pcaFormasContagemReady"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Forma de Contagem
          <InfoBox
            header="Forma de Contagem do PCA"
            :text="myhelp.Classe.Campos.FormaContagem"
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
            v-model="c.pca.formaContagem"
            :items="pcaFormasContagem"
            label="Selecione uma forma de contagem para o prazo"
            clearable
            hide-details
            single-line
          />
        </div>
      </v-col>
    </v-row>
    <v-row
      :class="{
        'mt-5': $vuetify.breakpoint.smAndDown,
        'mt-0': $vuetify.breakpoint.mdAndUp
      }"
      class="ma-2"
      v-if="
        semaforos.pcaSubFormasContagemReady &&
          c.pca.formaContagem == 'vc_pcaFormaContagem_disposicaoLegal'
      "
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Subforma de contagem
          <InfoBox
            header="Forma de Contagem do PCA"
            :text="myhelp.Classe.Campos.SubformaContagem"
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
            v-model="c.pca.subFormaContagem"
            :items="pcaSubFormasContagem"
            label="Selecione uma subforma de contagem para o prazo"
            clearable
            hide-details
            single-line
          >
            <template v-slot:selection="{ item }">
              <p class="selected py-3">
                {{ item.label }}
              </p>
            </template>

            <template v-slot:item="{ item }">
              <p class="py-3">{{ item.label }}</p>
            </template>
          </v-select>
        </div>
      </v-col>
    </v-row>

    <hr style="border-top: 1px dashed #dee2f8;" class="mx-7" />

    <!-- JUSTIFICAÇÃO DO PCA -->
    <v-row
      :class="{
        'mt-5': $vuetify.breakpoint.smAndDown,
        'mt-0': $vuetify.breakpoint.mdAndUp
      }"
      class="ma-2"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Justificação do PCA
          <InfoBox
            header="Justificação do PCA"
            :text="myhelp.Classe.Campos.JustificacaoPCA"
            helpColor="info"
          />
        </div>

        <div class="ma-2">
          <v-btn
            class="secondary-button"
            rounded
            @click="
              adicionarCriterioGestionario(
                c.pca.justificacao,
                'CriterioJustificacaoGestionario',
                'Critério Gestionário',
                mylabels.textoCriterioJustificacaoGestionario,
                [],
                []
              )
            "
            v-if="!semaforos.critGestionarioAdicionado"
          >
            Critério Gestionário
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
        <div class="ma-2">
          <v-btn
            class="secondary-button"
            rounded
            @click="
              adicionarCriterioLegalPCA(
                c.pca.justificacao,
                'CriterioJustificacaoLegal',
                'Critério Legal',
                mylabels.textoCriterioLegal,
                [],
                c.legislacao
              )
            "
            v-if="!semaforos.critLegalAdicionadoPCA"
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
        <v-row v-for="(crit, cindex) in c.pca.justificacao" :key="cindex">
          <v-col cols="3" class="mt-n3">
            <div class="info-label">
              {{ crit.label }}
              <v-btn
                icon
                small
                color="red"
                @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')"
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
            v-if="crit.tipo == 'CriterioJustificacaoUtilidadeAdministrativa'"
            class="mt-n3"
          >
            <div class="info-content pa-4">
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
                <a
                  :href="'/classes/consultar/' + p.id"
                  v-for="(p, i) in crit.procRel"
                  :key="p.id"
                >
                  {{ p.codigo }}: {{ p.titulo }}
                  <span v-if="i == crit.procRel.length - 1" class="ml-n1"
                    >.</span
                  >
                  <span v-else class="ml-n1 mr-4">, <br class="mb-3"/></span>
                </a>
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
              v-if="crit.legislacao.length == 0"
              class="info-content pa-4 px-7"
            >
              Sem legislação associada. Pode associar legislação na área de
              contexto.
            </div>
          </v-col>

          <v-col
            v-else-if="crit.tipo == 'CriterioJustificacaoGestionario'"
            class="mt-n3"
          >
            <div class="info-content pa-4">
              <v-textarea
                class="mt-n2 px-3 pb-1"
                :value="crit.notas"
                v-model="crit.notas"
                clearable
                single-line
                hide-details
                rows="1"
                auto-grow
                color="blue darken-3"
              ></v-textarea>
            </div>
          </v-col>
          <hr style="border-top: 1px #ffffff ; width: 100%;" />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";

const help = require("@/config/help").help;
const labels = require("@/config/labels").criterios;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      myhelp: help,
      mylabels: labels
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
      this.semaforos.critLegalAdicionadoPCA = true;
    },

    adicionarCriterioGestionario: function(
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
      this.semaforos.critGestionarioAdicionado = true;
    },

    // Remove um critério completo duma vez
    removerCriterioTodo: function(justificacao, i, PCAouDF) {
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

    unselectProcesso: function(proc, listaProc) {
      var index = listaProc.findIndex(p => p.id === proc.id);
      listaProc.splice(index, 1);
    },

    unselectDiploma: function(diploma, listaLeg) {
      var index = listaLeg.findIndex(e => e.id === diploma.id);
      listaLeg.splice(index, 1);
      if (listaLeg.length == 0) {
        this.semaforos.critLegalAdicionadoPCA = false;
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
