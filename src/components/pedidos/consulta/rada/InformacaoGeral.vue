<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Título</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-text-field readonly v-model="RADA.titulo" label="Título" solo></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div style="padding-top:6px" class="info-label">Entidades Responsáveis</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-combobox v-model="RADA.entRes" readonly :items="[]" chips multiple></v-combobox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["RADA"]
};
</script>