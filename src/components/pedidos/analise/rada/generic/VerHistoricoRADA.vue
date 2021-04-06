<template>
  <div>
    <VerHistoricoCampo campoText="Título" :historicoCampo="historico.titulo" />
    <VerHistoricoCampo campoText="Entidade responsável" :historicoCampo="historico.entRes" />

    <v-expansion-panels class="ma-1">
      <v-expansion-panel class="ma-1" popout focusable>
        <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
          <b>Relatório Expositivo</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <VerHistoricoRE :historico="historico.RE"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel class="ma-1" popout focusable>
        <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">
          <b>Tabela de Seleção</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <VerHistoricoTS :historico="historico.tsRada"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <p>{{ historico }}</p> -->
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/rada/generic/VerHistoricoCampo";
import VerHistoricoRE from "@/components/pedidos/analise/rada/generic/VerHistoricoRE";
import VerHistoricoTS from "@/components/pedidos/analise/rada/generic/VerHistoricoTS";

export default {
  props: ["historico"],
  components: {
    VerHistoricoCampo,
    VerHistoricoRE,
    VerHistoricoTS
  }
};
</script>