<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Código</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field
          :rules="[
            v =>
              verificaCodigo(v) || !!v || 'Campo de preenchimento obrigatório!'
          ]"
          solo
          clearable
          v-model="newSerie.codigo"
          label="Código"
        ></v-text-field>
      </v-col>
      <v-col md="3" sm="3">
        <div class="info-label">Titulo</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field
          :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
          solo
          clearable
          v-model="newSerie.titulo"
          label="Título"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["newSerie", "classes"],
  methods: {
    verificaCodigo(v) {
      if (this.classes.some(e => e.codigo == v)) {
        return "Código já existente!";
      } else {
        return false;
      }
    }
  }
};
</script>
