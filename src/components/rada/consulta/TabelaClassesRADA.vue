<template>
  <div style="overflow: auto; width:100%;">
    <v-data-table
      flat
      style="background-color:#fafafa;"
      :headers="headers"
      :items="classes"
      class="elevation-1 mytable"
      :footer-props="footer_props"
      :search="search"
      :items-per-page="5"
      show-expand
      single-expand
      item-key="codigo"
    >
      <template v-slot:item.tipo="{ item }">
        <img v-if="item.tipo == 'Série'" style="width:23px; height:30px" :src="svg_sr" />
        <img v-else-if="item.tipo == 'Subsérie'" style="width:23px; height:30px" :src="svg_ssr" />
        <img v-else-if="item.tipo == 'N1'" style="width:23px; height:30px" :src="svg_N1" />
        <img v-else-if="item.tipo == 'N2'" style="width:23px; height:30px" :src="svg_N2" />
        <img v-else-if="item.tipo == 'N3'" style="width:23px; height:30px" :src="svg_N3" />
        <i v-else>{{ item.tipo }}</i>
      </template>

      <template
        v-slot:item.df="{ item }"
      >{{ !classes.some(e => e.eFilhoDe == item.codigo) ? item.df : '' }}</template>

      <template
        v-slot:item.pca="{ item }"
      >{{ !classes.some(e => e.eFilhoDe == item.codigo) ? item.pca : '' }}</template>

      <template v-slot:item.editar="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" v-if="true" @click="editarClasse(item)">edit</v-icon>
          </template>
          <span>Clique para editar</span>
        </v-tooltip>
      </template>

      <template v-slot:item.completo="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              color="red"
              v-on="on"
              v-if="(item.tipo == 'Série' && (item.eFilhoDe == null || (item.temDF && !!!item.children[0]))) || (item.tipo == 'Subsérie' && (item.eFilhoDe == null || item.temDF)) || (item.eFilhoDe == null &&
                    (item.tipo == 'N2' || item.tipo == 'N3'))"
            >report</v-icon>
          </template>
          <span>Classe incompleta</span>
        </v-tooltip>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <AreaOrganica :classe="item" v-if="item.tipo != 'Série' && item.tipo != 'Subsérie'" />
          <SerieSubserie :classe="item" :formaContagem="formaContagem" :classes="classes" v-else />
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import AreaOrganica from "@/components/rada/consulta/elementos_tabela/AreaOrganica";
import SerieSubserie from "@/components/rada/consulta/elementos_tabela/SerieSubserie";

export default {
  props: ["classes", "formaContagem", "search"],
  components: {
    AreaOrganica,
    SerieSubserie,
  },
  methods: {
    editarClasse(item) {
      this.$emit("editarClasse", {
        tipo: item.tipo,
        titulo: item.titulo,
        codigo: item.codigo,
        children: [this.classes.find((e) => e.eFilhoDe == item.codigo)],
        temDF: Boolean(
          (!Boolean(item.df) && !Boolean(item.notaDF)) ||
            (!Boolean(item.pca) && !Boolean(item.notaPCA)) ||
            item.formaContagem.forma == null
        ),
      });
    },
  },
  data: () => ({
    footer_props: {
      "items-per-page-options": [1, 5, 10, -1],
      "items-per-page-text": "Mostrar",
    },
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    svg_N1: require("@/assets/n1.svg"),
    svg_N2: require("@/assets/n2.svg"),
    svg_N3: require("@/assets/n3.svg"),
    class: ["table-header", "body-2", "font-weight-bold"],
    headers: [
      {
        sortable: false,
        value: "editar",
        align: "right",
        width: "5%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
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
        width: "10%",
        value: "codigo",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Título",
        sortable: true,
        align: "center",
        value: "titulo",
        width: "35%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "PCA",
        sortable: true,
        align: "center",
        value: "pca",
        width: "10%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "DF",
        sortable: true,
        align: "center",
        value: "df",
        width: "10%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "Classe pai",
        value: "eFilhoDe",
        sortable: true,
        align: "center",
        width: "10%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        align: "center",
        value: "completo",
        width: "5%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
      {
        text: "",
        value: "data-table-expand",
        width: "5%",
        class: ["table-header", "body-2", "font-weight-bold"],
      },
    ],
  }),
};
</script>
<style scoped>
.mytable table tr {
  background-color: #333;
  overflow: auto;
  white-space: nowrap;
}
</style>
