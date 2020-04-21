<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Despachos
    </v-card-title>

    <v-card-text class="mt-2">
      <v-card v-for="(despacho, i) in despachos" :key="i" raised class="ma-4">
        <v-card-title>{{ despacho.estado }}</v-card-title>
        <v-card-subtitle>
          <v-chip class="ma-2" color="indigo accent-4" outlined small>
            {{ despacho.responsavel }}
          </v-chip>
        </v-card-subtitle>

        <v-card-text>
          <v-alert
            v-if="despacho.despacho"
            text
            icon="assignment_ind"
            color="indigo accent-4"
            >{{ despacho.despacho }}</v-alert
          >

          <v-alert v-else text type="warning">Etapa sem despacho</v-alert>
        </v-card-text>
      </v-card>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="cancelar()">
        Cancelar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["despachos"],

  methods: {
    cancelar() {
      this.$emit("fecharDialog");
    },
  },
};
</script>
