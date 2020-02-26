<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Código</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field disabled solo v-model="newSerie.codigo"></v-text-field>
      </v-col>
      <v-col md="3" sm="3">
        <div class="info-label">Titulo</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field clearable solo v-model="newSerie.titulo"></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie"]
};
</script>
