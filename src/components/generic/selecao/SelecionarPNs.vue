<template>
  <Campo nome="Selecionar Processos" color="neutralpurple">
    <template v-slot:conteudo>
      <v-card flat v-if="processosReady">
        <v-card-title>
          <v-text-field
            filled
            v-model="searchProcessos"
            append-icon="search"
            label="Filtrar Processos de negócio"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="processosHeaders"
          :items="processos"
          :search="searchProcessos"
          item-key="id"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectProcesso(props.item)">
              <td>{{ props.item.codigo }}</td>
              <td>{{ props.item.titulo }}</td>
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
      <div v-else style="text-align: center">
        <p>A carregar processos...</p>
        <v-progress-circular
          indeterminate
          size="100"
          width="10"
          color="indigo accent-4"
        />
      </div>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV.vue";
export default {
  props: ["processos", "processosReady"],

  components: {
    Campo,
  },
  data: function () {
    return {
      searchProcessos: "",
      footer_props: {
        "items-per-page-text": "Linhas por página",
      },
      processosHeaders: [
        { text: "Código", align: "left", value: "codigo" },
        { text: "Designação", value: "titulo" },
      ],
    };
  },

  methods: {
    selectProcesso: function (processo) {
      this.$emit("selectProcesso", processo);
    },
  },
};
</script>

<style scoped></style>
