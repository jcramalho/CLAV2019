<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <ArvoreLateralPPD
        @ver="showSI"
        :arvore="ppd.arvore"
        :sistemasInfo="ppd.sistemasInfo"
      />
    </v-col>
  </v-row>
</template>



<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import ArvoreLateralPPD from './criacao/ArvoreLateralPPD.vue';

export default {
  props: [],
  components: {
    ArvoreLateralPPD
  }
};

</script>