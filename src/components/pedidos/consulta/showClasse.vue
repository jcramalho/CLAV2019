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