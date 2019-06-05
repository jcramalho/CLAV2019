<template>
  <!-- PCA -->
  <v-container fluid v-if="!c.temSubclasses4Nivel">
    <v-layout ma-2 wrap>
      <v-flex xs12>
        <v-toolbar color="teal darken-4 font-weight-medium" dark height="30">
          <v-toolbar-title>Prazo de Conservação Administrativa</v-toolbar-title>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <v-layout ma-2 wrap>
      <v-flex xs2>
        <div class="info-label">Prazo:</div>
      </v-flex>
      <v-flex xs10>
        <v-text-field
          v-model="c.pca.valor"
          label="Prazo em anos: 0 a 199"
          mask="###"
          solo
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout ma-2 row wrap v-if="semaforos.pcaFormasContagemReady">
      <v-flex xs2>
        <div class="info-label">
          Forma de Contagem
          <InfoBox header="Forma de Contagem do PCA" :text="myhelp.Classe.Campos.FormaContagem" />
        </div>
      </v-flex>
      <v-flex xs10>
        <v-select
          item-text="label"
          item-value="value"
          v-model="c.pca.formaContagem"
          :items="pcaFormasContagem"
          label="Selecione uma forma de contagem para o prazo"
          solo
          dense
        />
      </v-flex>
    </v-layout>
    <v-layout
      ma-2
      row
      wrap
      v-if="
        semaforos.pcaSubFormasContagemReady &&
          c.pca.formaContagem == 'vc_pcaFormaContagem_disposicaoLegal'
      "
    >
      <v-flex xs2>
        <div class="info-label">Subforma de contagem:</div>
      </v-flex>
      <v-flex xs10>
        <v-select
          item-text="label"
          item-value="value"
          v-model="c.pca.subFormaContagem"
          :items="pcaSubFormasContagem"
          label="Selecione uma subforma de contagem para o prazo"
          solo
          dense
        />
      </v-flex>
    </v-layout>

    <hr style="border-top: 2px dashed green;" />

    <!-- JUSTIFICAÇÂO DO PCA -->
    <v-layout row wrap>
      <v-flex xs3>
        <v-layout row wrap>
          <v-flex xs12>
            <div class="info-label">
              Justificação do PCA
              <InfoBox header="Justificação do PCA" :text="myhelp.Classe.Campos.JustificacaoPCA" />
            </div>
          </v-flex>
          <v-flex xs12>
            <v-btn
              color="green darken-2"
              dark
              round
              @click="
                adicionarCriterioGestionario(
                  c.pca.justificacao,
                  'CriterioJustificacaoGestionario',
                  'Critério Gestionário',
                  textoCriterioGestionario,
                  [],
                  []
                )
              "
              v-if="!semaforos.critGestionarioAdicionado"
            >
              Critério Gestionário
              <v-icon dark right>add_circle_outline</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <v-btn
              color="green darken-2"
              dark
              round
              @click="
                adicionarCriterioLegalPCA(
                  c.pca.justificacao,
                  'CriterioJustificacaoLegal',
                  'Critério Legal',
                  textoCriterioLegal,
                  [],
                  c.legislacao
                )
              "
              v-if="!semaforos.critLegalAdicionadoPCA"
            >
              Critério Legal
              <v-icon dark right>add_circle_outline</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs9>
        <v-layout
          row
          wrap
          v-for="(crit, cindex) in c.pca.justificacao"
          :key="cindex"
        >
          <v-flex xs3>
            <div class="info-label">
              {{ crit.label }}
              <v-icon
                color="red darken-2"
                dark
                small
                @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')"
                >remove_circle</v-icon
              >
            </div>
          </v-flex>

          <v-flex
            xs9
            v-if="crit.tipo == 'CriterioJustificacaoUtilidadeAdministrativa'"
          >
            <div class="info-content">
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
          </v-flex>

          <v-flex xs9 v-else-if="crit.tipo == 'CriterioJustificacaoLegal'">
            <div class="info-content" v-if="crit.legislacao.length > 0">
              {{ crit.notas }}
              <span v-for="(l, i) in crit.legislacao" :key="l.id">
                <a :href="'/legislacao/' + l.id">
                  {{ l.tipo }} {{ l.numero }}
                </a>
                <v-icon
                  color="red darken-2"
                  dark
                  small
                  @click="crit.legislacao.splice(i, 1)"
                  >remove_circle</v-icon
                >
                <span v-if="i == crit.legislacao.length - 1">.</span>
                <span v-else>, </span>
              </span>
            </div>
            <div class="info-content" v-if="crit.legislacao.length == 0">
              Sem legislação associada. Pode associar legislação na área de
              contexto.
            </div>
          </v-flex>

          <v-flex
            xs9
            v-else-if="crit.tipo == 'CriterioJustificacaoGestionario'"
          >
            <div class="info-content">
              {{ crit.notas }}
            </div>
          </v-flex>

          <hr
            v-if="cindex < c.pca.justificacao.length"
            style="border-top: 2px dotted green; width: 100%;"
          />
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ProcessosRelacionadosOps from "@/components/classes/criacao/ProcessosRelacionadosOps.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";

const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c", "semaforos", "pcaFormasContagem", "pcaSubFormasContagem"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      myhelp: help,
      textoCriterioGestionario:
        "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de" +
        " escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para" +
        " a definição do prazo o tempo do mandato de maior duração: 5 anos.",
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
