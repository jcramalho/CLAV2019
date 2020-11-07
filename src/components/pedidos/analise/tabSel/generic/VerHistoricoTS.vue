<template>
  <div>
    <VerHistoricoCampo
      v-if="tipo === 'TS Organizacional'"
      campoText="Título"
      :historicoCampo="historico.designacao"
    />

    <VerHistoricoCampo
      v-else
      campoText="Título"
      :historicoCampo="historico.ts.designacao"
    />

    <VerHistoricoCampo
      campoText="Entidade Produtora"
      :historicoCampo="historico.entProd"
    />

    <VerHistoricoCampo
      v-if="tipo === 'TS Organizacional' && historico.ts.entidade.dados != ''"
      campoText="Entidade"
      :historicoCampo="historico.ts.entidade"
    />
    <VerHistoricoCampo
      v-else-if="
        tipo === 'TS Organizacional' && historico.ts.tipologia.dados != ''
      "
      campoText="Entidade"
      :historicoCampo="historico.ts.tipologia"
    />

    <VerHistoricoCampo
      v-else-if="tipo === 'TS Pluriorganizacional'"
      :historicoCampo="historico.ts.entidades"
      campoText="Entidades"
      tipo="array"
      arrayValue="label"
    />

    <v-expansion-panels class="ma-1">
      <v-expansion-panel class="ma-1" popout focusable>
        <v-expansion-panel-header
          class="pa-2 indigo darken-4 title white--text"
        >
          <b>Tabela de Seleção</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <VerHistoricoTabela :historico="historico.ts" :tipo="tipo" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <p>{{ historico }}</p> -->
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/tabSel/generic/VerHistoricoCampo";
import VerHistoricoTabela from "@/components/pedidos/analise/tabSel/generic/VerHistoricoTabela";

export default {
  props: ["historico", "tipo"],
  components: {
    VerHistoricoCampo,
    VerHistoricoTabela
  }
};
</script>
