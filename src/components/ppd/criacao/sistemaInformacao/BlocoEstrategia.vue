<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE AVALIAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        4.	Planeamento da estratégia de preservação do sistema de informação
        <InfoBox header="Estrategia SI" helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" xs="12" sm="12">
            <div class="separador">Estratégia de preservação: utilização operacional</div>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Identificação dos métodos de preservação</div>
          </v-col>
          <v-col class="d-flex" cols="12" sm="9">
            <v-select
              :items="metodosPreservacaoOperacional"
              label="Indique se a organização dispõe de armazenamento com maior ou menor grau de sofisticação"
              v-model="metodoCheckOperacional"
              dense
              solo
            ></v-select>
            <v-text-field v-if="metodoCheckOperacional ==='Outro'"
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.estrategia.utilizacaoOperacional.idMetodoPreservacao"
              label="Indique qual"
              solo
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Fundamentação da escolha do método de preservação</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.estrategia.utilizacaoOperacional.fundMetodoPreservacao"
              label="Indique os motivos que conduziram à seleção do método de preservação. "
              solo
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Identificação de lacunas e necessidade de desenvolvimento</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.estrategia.utilizacaoOperacional.lacunas"
              label="Indique as lacunas e necessidade de desenvolvimento para a implementação das soluções."
              solo
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="12">
            <div class="separador">Estratégia de preservação: utilização memória</div>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Identificação dos métodos de preservação</div>
          </v-col>
          <v-col class="d-flex" cols="12" sm="9">
            <v-select
              :items="metodosPreservacaoMemoria"
              label="Indique se a organização dispõe de armazenamento com maior ou menor grau de sofisticação"
              v-model="metodoCheckMemoria"
              dense
              solo
            ></v-select>
            <v-text-field v-if="metodoCheckMemoria ==='Outro'"
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.estrategia.utilizacaoMemoria.idMetodoPreservacao"
              label="Indique qual"
              solo
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Fundamentação da escolha do método de preservação</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.estrategia.utilizacaoMemoria.fundMetodoPreservacao"
              label="Indique os motivos que conduziram à seleção do método de preservação. "
              solo
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Identificação de lacunas e necessidade de desenvolvimento</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.estrategia.utilizacaoMemoria.lacunas"
              label="Indique as lacunas e necessidade de desenvolvimento para a implementação das soluções."
              solo
              clearable
            ></v-text-field>
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
  props: ["ppd"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      myhelp: help,
      checkedAti: ["Ativo", "Semi-ativo","Inativo","Abatido"],
      loadCheck: "",
      tsRada: ["TS","RADA"],
      metodoCheckOperacional: "",
      metodosPreservacaoOperacional: ["Retrocompatibilidade", "Migração da informação", "Outro"],
      metodoCheckMemoria: "",
      metodosPreservacaoMemoria: ["Migração da informação", "Encapsulamento", "Emulação", "Outro"],
    };
  },

  methods: {

  },

  watch:{
    "metodoCheckOperacional": function() {

      if(this.metodoCheckOperacional !='Outro'){
        this.ppd.si.estrategia.utilizacaoOperacional.idMetodoPreservacao = this.metodoCheckOperacional;
      }
      else{
        this.ppd.si.estrategia.utilizacaoOperacional.idMetodoPreservacao = "";
      }
    },
    "metodoCheckMemoria": function() {

      if(this.metodoCheckMemoria !='Outro'){
        this.ppd.si.estrategia.utilizacaoMemoria.idMetodoPreservacao = this.metodoCheckMemoria;
      }
      else{
        this.ppd.si.estrategia.utilizacaoMemoria.idMetodoPreservacao = "";
      }
    },
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
