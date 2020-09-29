<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE IDENTIFICAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        Identificação do plano de preservação digital
        <InfoBox header="Identificação ppd" :text="myhelp.Classe.BlocoDecisoes"  helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Número de referência SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.nRef"
            label="Identificador do sistema de informação"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Nome do SI</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.nomeSI"
            label="Designação oficial do sistema"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Localização dos dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="c.identificacao.local"
            label="Indique nome do(s) organismo(s) onde os dados estão armazenados"
            solo
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <hr style="border: 3px solid indigo; border-radius: 2px;" />
        </v-col>
      </v-row>
      <!-- DONOS -->
      <DonosOps :entidades="c.donos" @unselectEntidade="unselectEntidade($event)" />

      <v-row>
        <v-col>
          <hr style="border-top: 1px dashed indigo;" />
        </v-col>
      </v-row>

      <DonosNew
        @newEntidade="newEntidade($event, c.donos)"
        :entidadesReady="semaforos.entidadesReady"
        :entidades="donos"
      />

      <v-snackbar v-model="erroEntidadeDuplicada" :color="'error'" :timeout="60000">
        {{ mensagemEntidadeDuplicada }}
        <v-btn dark text @click="erroEntidadeDuplicada = false">Fechar</v-btn>
      </v-snackbar>

      <v-row>
        <v-col>
          <hr style="border-top: 1px dashed indigo;" />
        </v-col>
      </v-row>

      <DonosSelect
        :entidadesReady="semaforos.entidadesReady"
        :entidades="donos"
        @selectEntidade="selectEntidade($event)"
      />

      <hr style="border: 3px solid indigo; border-radius: 2px;" />

      <!-- PARTICIPANTES -->
      <div v-if="c.procTrans != 'N'">
        <ParticipantesOps
          :entidades="c.participantes"
          @unselectParticipante="unselectParticipante($event)"
        />

        <hr style="border-top: 1px dashed indigo;" />

        <ParticipantesNew
          @newEntidade="newEntidade($event, c.participantes)"
          :entidadesReady="semaforos.entidadesReady"
          :entidades="participantes"
        />

        <hr style="border-top: 1px dashed indigo;" />

        <ParticipantesSelect
          :entidadesReady="semaforos.entidadesReady"
          :entidades="participantes"
          @selectParticipante="selectParticipante($event)"
        />

        <v-snackbar v-model="erroIntervencaoIndefinida" :color="'error'" :timeout="60000">
          {{ mensagemIntervencaoIndefinida }}
          <v-btn dark text @click="erroIntervencaoIndefinida = false">Fechar</v-btn>
        </v-snackbar>

        <hr style="border: 3px solid indigo; border-radius: 2px;" />
      </div>



      <!-- LEGISLAÇÂO -->
      <LegislacaoOps :legs="c.legislacao" @unselectDiploma="unselectDiploma($event)" />

      <v-row ma-2>
        <v-col>
          <hr style="border-top: 1px dashed #1A237E;" />
        </v-col>
      </v-row>

      <LegislacaoNew :legislacao="c.legislacao" @newLegislacao="newLegislacao($event, c.legislacao)" />

      <hr style="border-top: 1px dashed #1A237E;" />

      <LegislacaoSelect
        :legs="legs"
        :legislacaoReady="semaforos.legislacaoReady"
        @selectDiploma="selectDiploma($event)"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import DonosOps from "@/components/classes/criacao/DonosOps.vue";
import DonosNew from "@/components/classes/criacao/DonosNew.vue";
import DonosSelect from "@/components/classes/criacao/DonosSelect.vue";
import ParticipantesOps from "@/components/classes/criacao/ParticipantesOps.vue";
import ParticipantesNew from "@/components/classes/criacao/ParticipantesNew.vue";
import ParticipantesSelect from "@/components/classes/criacao/ParticipantesSelect.vue";
import LegislacaoOps from "@/components/classes/criacao/LegislacaoOps.vue";
import LegislacaoNew from "@/components/classes/criacao/LegislacaoNew.vue";
import LegislacaoSelect from "@/components/classes/criacao/LegislacaoSelect.vue";
import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c", "semaforos", "donos", "participantes", "procRel", "legs"],

  components: {
    DonosOps,
    DonosNew,
    DonosSelect,
    ParticipantesOps,
    ParticipantesNew,
    ParticipantesSelect,
    LegislacaoOps,
    LegislacaoNew,
    LegislacaoSelect,
    InfoBox
  },

  data: () => {
    return {
      myhelp: help,

      erroEntidadeDuplicada: false,
      mensagemEntidadeDuplicada: "Entidade duplicada! Não será adicionada.",

      erroIntervencaoIndefinida: false,
      mensagemIntervencaoIndefinida: "Tem de selecionar uma intervanção para o participante!",

      textoCriterioUtilidadeAdministrativa:
        "Prazo decorrente da necessidade de consulta para apuramento da " +
        "responsabilidade em sede de: ",
      textoCriterioComplementaridade: "É complementar de: ",
      textoCriterioDensidadeSinPor: "Informação sintetizada em: ",
      textoCriterioDensidadeSinDe:
        "Informação pertinente não recuperável noutro PN. Sintetiza a informação de: ",
      textoCriterioLegal:
        'Prazo prescricional estabelecido em "diplomas selecionados no contexto de avaliação": '
    };
  },

  methods: {
    unselectEntidade: function(entidade) {
      // Recoloca a entidade nos selecionáveis
      if (entidade.estado && entidade.estado != "Nova") {
        this.donos.push(entidade);
      } else if (!entidade.estado) {
        this.donos.push(entidade);
      }
      var index = this.c.donos.findIndex(e => e.id === entidade.id);
      this.c.donos.splice(index, 1);
    },

    selectEntidade: function(entidade) {
      this.c.donos.push(entidade);
      // Remove dos selecionáveis
      var index = this.donos.findIndex(e => e.id === entidade.id);
      this.donos.splice(index, 1);
    },

    newEntidade: function(entidade, lista) {
      var index = lista.findIndex(e => e.id === entidade.id);
      if(index == -1)
        lista.push(entidade);
      else
        this.erroEntidadeDuplicada = true;
    },

    newLegislacao: function(leg, lista) {
      lista.push(leg);
    },

    unselectParticipante: function(entidade) {
      entidade.intervencao = "Indefinido";
      // Recoloca a entidade nos selecionáveis
      this.participantes.push(entidade);
      var index = this.c.participantes.findIndex(e => e.id === entidade.id);
      this.c.participantes.splice(index, 1);
    },

    selectParticipante: function(entidade) {
      if(entidade.intervencao == "Indefinido")
        this.erroIntervencaoIndefinida = true;
      else{
        this.c.participantes.push(entidade);
      }
    },

    selectDiploma: function(leg) {
      this.c.legislacao.push(leg);
      // Remove dos selecionáveis
      var index = this.legs.findIndex(l => l.id === leg.id);
      this.legs.splice(index, 1);
    },

    unselectDiploma: function(diploma) {
      // Recoloca o diploma nos selecionáveis
      this.legs.push(diploma);
      var index = this.c.legislacao.findIndex(e => e.id === diploma.id);
      this.c.legislacao.splice(index, 1);
    }
  }
};
</script>
<style>
.info-label {
  color: #2e7d32;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1a237e;
  font-size: 14pt;
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
