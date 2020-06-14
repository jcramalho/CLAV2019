<template>
  <v-card class="mt-4">
    <v-card-title class="indigo darken-4 white--text title">{{ !!p.objeto.acao ?  p.objeto.acao : 'Criação'}} do RADA</v-card-title>
    <v-card-text>
      <br />
      <v-stepper v-model="e1" vertical class="elevation-0">
        <!-- Informação Geral -->
        <v-stepper-step color="amber accent-3" :key="1" :step="1" editable>
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral :RADA="p.objeto.dados" />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :step="2" editable>
          <font size="4">
            <b>Relatório Expositivo</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="2">
          <RelatorioExpositivo :RE="p.objeto.dados.RE" />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step color="amber accent-3" :key="3" :step="3" editable>
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada :TS="p.objeto.dados.tsRada" />
        </v-stepper-content>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script>
import InformacaoGeral from "@/components/pedidos/consulta/rada/InformacaoGeral";
import RelatorioExpositivo from "@/components/pedidos/consulta/rada/RelatorioExpositivo";
import TSRada from "@/components/pedidos/consulta/rada/TabelaSelecao";

export default {
  props: ["p"],
  data: () => ({
    e1: 1
  }),
  components: {
    InformacaoGeral,
    RelatorioExpositivo,
    TSRada
  },
  created(){
    if(!this.p.objeto.dados){
      this.p.objeto.dados = this.p.objeto.rada;
      delete this.p.objeto["rada"];
    }
  }
};
</script>