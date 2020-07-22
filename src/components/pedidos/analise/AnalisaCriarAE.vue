<template>
  <v-flex xs12>
    {{ ae }}
    <div v-if="valida">
      Conformidades Total de agregações conformes para eliminação
    </div>
    <div v-else>
      Não Conformidades Ausência de indicação do dono em PN's com destino final
      de conservação
    </div>
  </v-flex>
</template>

<script>
export default {
  props: ["ae"],

  data: () => ({
    valida: true
  }),

  mounted: function() {
    //Validar no lado do servidor ou cliente?
    //invariastes - valido se
    //Destino C, NI Participante
    //Destino E, NI Dono
  }
};
</script>

<style scoped>
.info-label {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #64b5f6;
  font-weight: bold;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
