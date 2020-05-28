<template>
  <div>
  <v-data-table
    :headers="headers"
    :items="classes"
    :search="search"
    class="elevation-1"
    :footer-props="footer_props"
  >
    <template v-slot:pageText="props">
      Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
      {{ props.itemsLength }}
    </template>
  </v-data-table>
  </div>
</template>
<script>
export default {
  props: ["classes"],
  data: () => ({
    headers: [
      {text: "Código", value: "codigo"},
      {text: "Referência", value: "referencia"},
      {text: "Título", value: "titulo"},
      {text: "PCA", value: "pca"},
      {text: "Destino Final", value: "df"},
    ],
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    }
  })
}
</script>