<template>
  <div>
    <VerHistoricoCampo
      v-if="!!historico.entidadesProd.dados[0]"
      campoText="Entidades Produtoras"
      :historicoCampo="historico.entidadesProd"
    />

    <VerHistoricoCampo
      v-else
      campoText="Tipologia Produtora"
      :historicoCampo="historico.tipologiasProd"
    />

    <VerHistoricoCampo
      campoText="Data Inicial"
      :historicoCampo="historico.dataInicial"
    />

    <VerHistoricoCampo
      campoText="Data Final"
      :historicoCampo="historico.dataFinal"
    />

    <VerHistoricoCampo
      campoText="História Administrativa/Biográfica"
      :historicoCampo="historico.hist_admin"
    />

    <VerHistoricoCampo
      campoText="História Custodial"
      :historicoCampo="historico.hist_cust"
    />

    <VerHistoricoCampo
      campoText="Sistema de Organização"
      :historicoCampo="historico.sist_org"
    />

    <VerHistoricoCampo
      campoText="Localização"
      :historicoCampo="historico.localizacao"
    />

    <VerHistoricoCampo
      campoText="Estado de Conservação"
      :historicoCampo="historico.est_conser"
    />
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/rada/generic/VerHistoricoCampo";

export default {
  props: ["historico"],
  components: {
    VerHistoricoCampo,
  },
};
</script>