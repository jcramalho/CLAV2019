<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field outlined v-model="newSerie.codigo" label="Código"></v-text-field >
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field outlined v-model="newSerie.titulo" label="Título" required></v-text-field >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie"],
  data: () => ({
    regraCodigo: [v => !!v || 'Código é obrigatório!']
  })
};
</script>
