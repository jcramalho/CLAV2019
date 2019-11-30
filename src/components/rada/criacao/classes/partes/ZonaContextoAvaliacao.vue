<template>
  <div>
    <v-row v-if="newSerie.tipo != 'Subsérie'">
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.produtores" label="Produtores da Documentação"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.legislacao" label="Legislação"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.relacoes" label="Relações"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" sm="12" md="12">
        <v-text-field outlined v-model="newSerie.relacoes" label="Relações"></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie"]
};
</script>