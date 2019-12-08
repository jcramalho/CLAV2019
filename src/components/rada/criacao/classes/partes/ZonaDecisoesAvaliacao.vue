<template>
  <div>
    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.pca" label="Prazo de Conservação Administrativa"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.formaContagem" label="Forma de Contagem"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.justicacaoPCA" label="Justificação PCA"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field outlined v-model="newSerie.df" label="Destino Final"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field outlined v-model="newSerie.justicacaoDF" label="Justificação DF"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-text-field outlined v-model="newSerie.notas" label="Notas"></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie"]
};
</script>
