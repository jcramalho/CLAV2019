<template>
  <div>
    <v-data-table
      flat
      :headers="headers"
      :items="classes"
      class="elevation-1 mytable"
      :footer-props="footer_props"
      @click:row="consultaClasse"
      :search="search"
      :items-per-page="5"
      item-key="codigo"
    >
      <template v-slot:item.tipo="{ item }">
        <img v-if="item.tipo == 'serie'" style="width:23px; height:30px" :src="svg_sr" />
        <img v-else-if="item.tipo == 'subserie'" style="width:23px; height:30px" :src="svg_ssr" />
        <img v-else-if="item.nivel == 'N1'" style="width:23px; height:30px" :src="svg_N1" />
        <img v-else-if="item.nivel == 'N2'" style="width:23px; height:30px" :src="svg_N2" />
        <img v-else-if="item.nivel == 'N3'" style="width:23px; height:30px" :src="svg_N3" />
      </template>
    </v-data-table>
  </div>
</template> 

<script>
export default {
  props: ["classes", "search"],
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    svg_N1: require("@/assets/n1.svg"),
    svg_N2: require("@/assets/n2.svg"),
    svg_N3: require("@/assets/n3.svg"),
    footer_props: {
      "items-per-page-options": [1, 5, 10, -1],
      "items-per-page-text": "Mostrar",
    },
    headers: [
      {
        text: "Tipo",
        sortable: true,
        value: "tipo",
        width: "10%",
        align: "center",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Código",
        sortable: true,
        align: "center",
        width: "15%",
        value: "codigo",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Título",
        sortable: true,
        align: "center",
        value: "titulo",
        width: "55%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "PCA",
        sortable: true,
        align: "center",
        value: "pca.pca",
        width: "10%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "DF",
        sortable: true,
        align: "center",
        value: "df.df",
        width: "10%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Classe Pai",
        value: "pai",
        sortable: true,
        align: "center",
        width: "10%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
    ],
  }),
  methods: {
    consultaClasse(item) {
      this.$emit("consultarClasse", item);
    },
  },
};
</script>