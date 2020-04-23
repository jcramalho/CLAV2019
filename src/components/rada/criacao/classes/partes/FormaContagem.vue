<template>
  <v-card outlined>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Forma de Contagem do PCA</div>
      </v-col>

      <v-col sm="9" md="9" style="padding-right: 20px;">
        <v-select
          :rules="[v => rule(v)]"
          :items="formaContagem.formasContagem"
          v-model="newSerie.formaContagem.forma"
          item-text="label"
          label="Forma de Contagem"
          solo
          clearable
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="newSerie.formaContagem.forma == 'vc_pcaFormaContagem_disposicaoLegal'">
      <!-- newSerie.formaContagem.forma == 'vc_pcaFormaContagem_disposicaoLegal'  -->
      <v-col md="3" sm="3">
        <div class="info-label">Subforma de Contagem do PCA</div>
      </v-col>
      <v-col sm="9" md="9" style="padding-right: 20px;">
        <v-select
          :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
          :items="formaContagem.subFormasContagem"
          v-model="newSerie.formaContagem.subforma"
          item-text="label"
          label="Subforma de Contagem"
          solo
          clearable
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: ["newSerie", "formaContagem", "rules"],
  watch: {
    "newSerie.formaContagem.forma": function(val) {
      // console.log(JSON.stringify(val));
      if (val != "vc_pcaFormaContagem_disposicaoLegal") {
        delete this.newSerie.formaContagem["subforma"];
      }
    }
  },
  methods: {
    rule(v) {
      if (this.rules && (v == "" || v == null)) {
        return "Campo Obrigatório";
      } else {
        return true;
      }
    }
  }
};
</script>
