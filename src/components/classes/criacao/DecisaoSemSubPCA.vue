<template>
  <!-- PCA -->
  <div v-if="!c.temSubclasses4Nivel">
    <v-row>
      <v-col>
        <v-toolbar color="indigo darken-4 font-weight-medium" dark height="30">
          <v-toolbar-title>Prazo de Conservação Administrativa</v-toolbar-title>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row class="ma-2">
      <v-col cols="2">
        <div class="info-label">Prazo:</div>
      </v-col>
      <v-col>
        <v-text-field
          v-model="c.pca.valor"
          label="Prazo em anos: 0 a 199"
          v-mask="'###'"
          solo
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row class="ma-2">
      <v-col cols="2">
        <div class="info-label">Notas:</div>
      </v-col>
      <v-col>
        <v-textarea solo label="Notas ao PCA" v-model="c.pca.notas" rows="2"></v-textarea>
      </v-col>
    </v-row>

    <v-row class="ma-2" v-if="semaforos.pcaFormasContagemReady">
      <v-col cols="2">
        <div class="info-label">
          Forma de Contagem:
          <InfoBox header="Forma de Contagem do PCA" :text="myhelp.Classe.Campos.FormaContagem" />
        </div>
      </v-col>
      <v-col>
        <v-select
          item-text="label"
          item-value="value"
          v-model="c.pca.formaContagem"
          :items="pcaFormasContagem"
          label="Selecione uma forma de contagem para o prazo"
          solo
          dense
        />
      </v-col>
    </v-row>
    <v-row
      class="ma-2"
      v-if="
        semaforos.pcaSubFormasContagemReady &&
          c.pca.formaContagem == 'vc_pcaFormaContagem_disposicaoLegal'
      "
    >
      <v-col cols="2">
        <div class="info-label">Subforma de contagem:</div>
      </v-col>
      <v-col cols="10">
        <v-select
          item-text="label"
          item-value="value"
          v-model="c.pca.subFormaContagem"
          :items="pcaSubFormasContagem"
          label="Selecione uma subforma de contagem para o prazo"
          solo
          dense
        >
          <template v-slot:selection="{item}">
            <p>{{ item.label }}</p>
          </template>

          <template v-slot:item="{item}">
            <p>{{ item.label }}</p>
          </template>
        </v-select>
      </v-col>
    </v-row>

    <hr style="border-top: 2px dashed #1A237E;" />

    <!-- JUSTIFICAÇÂO DO PCA -->
    <v-row class="ma-2">
      <v-col cols="3">
        <div class="info-label">
          Justificação do PCA:
          <InfoBox header="Justificação do PCA" :text="myhelp.Classe.Campos.JustificacaoPCA" />
        </div>

        <div class="ma-2">
          <v-btn
            color="indigo darken-2"
            dark
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
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </div>
        <div class="ma-2">
          <v-btn
            color="indigo darken-2"
            dark
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
            <v-icon dark right>add_circle_outline</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col>
        <v-row v-for="(crit, cindex) in c.pca.justificacao" :key="cindex">
          <v-col cols="3">
            <div class="info-label">
              {{ crit.label }}
              <v-icon
                color="red darken-2"
                dark
                small
                @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')"
              >remove_circle_outline</v-icon>
            </div>
          </v-col>

          <v-col v-if="crit.tipo == 'CriterioJustificacaoUtilidadeAdministrativa'">
            <div class="info-content">
              <v-textarea
                auto-grow
                clearable
                single-line
                rows="1"
                :value="crit.notas"
                v-model="crit.notas"
              ></v-textarea>
              <a
                :href="'/classes/consultar/' + p.id"
                v-for="(p, i) in crit.procRel"
                :key="p.id"
              >
                {{ p.codigo }}: {{ p.titulo }}
                <span v-if="i == crit.procRel.length - 1">.</span>
                <span v-else>,</span>
              </a>
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

          <v-col v-else-if="crit.tipo == 'CriterioJustificacaoGestionario'">
            <div class="info-content">
              <v-textarea
                auto-grow
                clearable
                single-line
                rows="1"
                :value="crit.notas"
                v-model="crit.notas"
              ></v-textarea>
            </div>
          </v-col>

          <hr
            v-if="cindex < c.pca.justificacao.length"
            style="border-top: 2px dotted #1A237E; width: 100%;"
          />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";

const help = require("@/config/help").help
const labels = require("@/config/labels").criterios

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

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
