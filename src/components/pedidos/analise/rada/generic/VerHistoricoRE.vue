<template>
  <div>
    <VerHistoricoCampo
      v-if="!!historico.entidadesProd.dados[0]"
      campoText="Entidade produtora"
      :historicoCampo="historico.entidadesProd"
    />

    <VerHistoricoCampo
      v-else
      campoText="Tipologia Produtora"
      :historicoCampo="historico.tipologiasProd"
    />

    <VerHistoricoCampo
      campoText="Data inicial"
      :historicoCampo="historico.dataInicial"
    />

    <VerHistoricoCampo
      campoText="Data final"
      :historicoCampo="historico.dataFinal"
    />

    <VerHistoricoCampo
      campoText="História administrativa/biográfica"
      :historicoCampo="historico.hist_admin"
    />

    <VerHistoricoCampo
      campoText="História custodial"
      :historicoCampo="historico.hist_cust"
    />

    <VerHistoricoCampo
      campoText="Sistema de organização"
      :historicoCampo="historico.sist_org"
    />

    <VerHistoricoCampo
      campoText="Localização"
      :historicoCampo="historico.localizacao"
    />

    <VerHistoricoCampo
      campoText="Estado de conservação"
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