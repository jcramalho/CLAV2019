<template>
  <div>
    <showPedidosDependentes
      v-if="!!p.pedidos_dependentes[0]"
      :pedidos="p.pedidos_dependentes"
    />
    <v-row>
      <v-col>
        <v-stepper v-model="e1" vertical elevation="6">
          <br />
          <v-tooltip
            v-if="
              temPermissaoConsultarHistorico() &&
              !(p.objeto.acao === 'Criação' && p.estado === 'Submetido')
            "
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-icon @click="verHistorico()" color="white" v-on="on"> history </v-icon>
            </template>
            <span>Ver histórico de alterações...</span>
          </v-tooltip>
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import InformacaoGeral from "@/components/pedidos/consulta/rada/InformacaoGeral";
import showPedidosDependentes from "@/components/pedidos/consulta/showPedidosDependentes";
import RelatorioExpositivo from "@/components/pedidos/consulta/rada/RelatorioExpositivo";
import TSRada from "@/components/pedidos/consulta/rada/TabelaSelecao";
import { NIVEIS_CONSULTAR_HISTORICO } from "@/utils/consts";

export default {
  props: ["p"],
  data: () => ({
    e1: 1,
  }),
  components: {
    InformacaoGeral,
    RelatorioExpositivo,
    TSRada,
    showPedidosDependentes,
  },
  created() {
    if (!this.p.objeto.dados) {
      this.p.objeto.dados = this.p.objeto.rada;
      delete this.p.objeto["rada"];
    }
  },
  methods: {
    temPermissaoConsultarHistorico() {
      return NIVEIS_CONSULTAR_HISTORICO.includes(this.$userLevel());
    },
    verHistorico() {
      this.$emit("verHistorico");
    },
  },
};
</script>
