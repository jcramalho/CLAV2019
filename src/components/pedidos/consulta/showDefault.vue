<template>
  <v-card class="mt-4">
    <v-card-title
      class="info-label title"
      dark
    >Tipo de pedido: {{ p.objeto.acao }} - {{ p.objeto.tipo }}</v-card-title>
    <v-card-text>
      <div>{{ JSON.stringify(p) }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"]
};
</script>
<style scoped>
.info-label {
  color: #1565c0; /* blue darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e3f2fd; /* blue lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}
</style>
