<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE AVALIAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        2.	Avaliação do sistema de informação (SI)
        <InfoBox header="Avaliação SI" helpColor="white"/>
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


          <v-col dark cols="12" xs="12" sm="12">
            <div style="text-align:center" class="separador">SI relacionado</div>
          </v-col>

          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Decomposição do</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <div class="info-label">???</div>
          </v-col>

          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Número de referência</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="numeroRef"
                label="Indique o número de referência do sistema relacionado"
                solo
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Tipo de relação</div>
          </v-col>
          <v-col
            class="d-flex"
            cols="12"
            sm="9"
          >
            <v-select
              :items="tipoRelacao"
              label="Indique o estado de atividade do sistema"
              v-model="siTipoRelacao"
              dense
              multiple
            ></v-select>
          </v-col>

          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Código de classificação </div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="loadCheck" row>
              <v-radio
                v-for="(p, i) in tsRada"
                :key="i"
                :label="p"
                :value="p"
                color="indigo darken-3"
              ></v-radio>
            </v-radio-group>
            <div v-if="loadCheck === 'TS'">
              <span>TS</span>
            </div>
            <div v-if="loadCheck === 'RADA'">
              <span>RADA</span>
            </div>
          </v-col>

          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Atividade do SI</div>
          </v-col>
          <v-col
            class="d-flex"
            cols="12"
            sm="9"
          >
            <v-select
              :items="checkedAti"
              label="Indique o estado de atividade do sistema"
              v-model="c.avaliacao.checkedAti"
              dense
              solo
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
        <v-col>
          <hr style="border: 3px solid indigo; border-radius: 2px;" />
        </v-col>
        </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["c"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      myhelp: help,
      numeroRef: "",
      siTipoRelacao: [],
      
      loadCheck: "",


      //Listas das opções disponiveis
      tipoRelacao: ["S (síntese - quando sintetiza o conteúdo informativo do sistema em análise)",
                    "D (duplicada - quando possui, no todo ou em parte, o mesmo conteúdo informativo do sistema em análise - não confundir com backups ou réplicas do sistema)",
                    "I (complementar - quando possui informação adicional que acrescenta significado à informação do sistema em análise)",
                    "A (antecedente - quando se trata de um sistema inactivo, que foi substituído pelo sistema em análise)",
                    "X (Input - quando fornece dados ou informação ao sistema em análise)",
                    "O (Output - quando a informação, no todo ou em parte, tem origem ou resulta do processamento de dados existentes no sistema em análise)"],
      checkedAti: ["Ativo", "Semi-ativo","Inativo","Abatido"],
      tsRada: ["TS","RADA"],
    };
  },

  methods: {

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
