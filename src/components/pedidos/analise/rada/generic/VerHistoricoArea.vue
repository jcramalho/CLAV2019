<template>
  <div style="width: 100%;">
    <div v-for="(campo, i) in Object.keys(historico)" :key="i">
      <VerHistoricoCampo
        v-if="campo != 'id' && !!historico[campo].dados"
        :campoText="mapKeysRADA(campo)"
        :historicoCampo="historico[campo]"
      />
    </div>
  </div>
</template>

<script>
import VerHistoricoCampo from "@/components/pedidos/analise/rada/generic/VerHistoricoCampo";
import { mapKeysRADA } from "@/utils/utils";

export default {
  props: ["historico"],
  components: {
    VerHistoricoCampo,
  },
  methods: {
    mapKeysRADA: mapKeysRADA,
  },
};
</script>