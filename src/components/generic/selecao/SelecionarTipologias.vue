<template>
  <Campo nome="Selecionar Tipologias de Entidade" color="neutralpurple">
    <template v-slot:conteudo>
      <v-card flat v-if="tipologiasReady">
        <v-card-title>
          <v-text-field
            filled
            v-model="searchTipologias"
            append-icon="search"
            label="Filtrar Tipologias"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="tipologiasHeaders"
          :items="tipologias"
          :search="searchTipologias"
          item-key="id"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectTipologia(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
            </tr>
          </template>

          <template v-slot:pageText="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <v-alert v-slot:no-results :value="true" color="error" icon="warning"
            >A procura por "{{ search }}" não deu resultados.</v-alert
          >
        </v-data-table>
      </v-card>
      <v-subheader v-else>A carregar tipologias...</v-subheader>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV.vue";
export default {
  props: ["tipologias", "tipologiasReady"],

  components: {
    Campo,
  },
  data: function () {
    return {
      searchTipologias: "",
      footer_props: {
        "items-per-page-text": "Tipologias por página",
      },
      tipologiasHeaders: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
      ],
    };
  },

  methods: {
    selectTipologia: function (tipologia) {
      this.$emit("selectTipologia", tipologia);
    },
  },
};
</script>

<style scoped></style>
