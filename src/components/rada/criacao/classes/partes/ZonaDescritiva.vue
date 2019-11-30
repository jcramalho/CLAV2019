<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-text-field outlined v-model="newSerie.descricao" label="Descrição"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.dataInicial" label="Data Inicial"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.dataFinal" label="Data Final"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field v-if="newSerie.tipo != 'Subsérie'" outlined v-model="newSerie.tUa" label="Tipo de Unidade Arquivística"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="newSerie.tipo != 'Subsérie'">
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.tSerie" label="Serie Aberta/Fechada"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.suporte" label="Suporte"></v-text-field>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-text-field outlined v-model="newSerie.medicao" label="Medição"></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="newSerie.tipo != 'Subsérie'">
        <v-col cols="12" sm="12" md="12">
            <v-text-field outlined v-model="newSerie.localizacao" label="Localização"></v-text-field>
        </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie"]
};
</script>