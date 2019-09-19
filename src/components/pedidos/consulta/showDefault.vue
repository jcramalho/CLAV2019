<template>
  <v-card class="mt-4">
    <v-card-title class="info-label title" dark>
      Tipo de pedido: {{ p.objeto.acao }} - {{ p.objeto.tipo }}
    </v-card-title>
    <v-card-text>
      <div>
        {{ JSON.stringify(p) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["p"]
}
</script>
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>