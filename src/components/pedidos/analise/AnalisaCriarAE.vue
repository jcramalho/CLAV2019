<template>
  <v-flex xs12>
    {{ ae }}
    <div v-if="valida">
      Conformidades
      Total de agregações conformes para eliminação
    </div>
    <div v-else>
      Não Conformidades
      Ausência de indicação do dono em PN's com destino final de conservação
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

<style>
.info-label {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #64b5f6;
  font-weight: bold;
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
