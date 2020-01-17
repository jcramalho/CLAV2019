<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Legislação:</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-data-table
          v-if="!!newSerie.legislacao[0]"
          :headers="headersDes"
          :items="newSerie.legislacao"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:header="props">
            <tr>
              <th v-for="h in props.headers" :key="h.text" class="subtitle-2">{{ h.text }}</th>
            </tr>
          </template>

          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.data }}</td>
              <td>
                <v-btn
                  small
                  color="red darken-2"
                  dark
                  rounded
                  @click="unselectLegislacao(props.item)"
                >
                  <v-icon dark>remove_circle</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-alert
          v-else
          :value="true"
          icon="warning"
          color="amber accent-3"
        >Não tem legislação selecionada...</v-alert>
      </v-col>
    </v-row>
    <Legislacao :legislacao="legislacao" :newSerie="newSerie" />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Selecione a legislação:</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procurar por Legislação"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :search="search"
          :headers="headersSel"
          :items="legislacao"
          item-key="id"
          class="elevation-1"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectLegislacao(props.item)">
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.data }}</td>
            </tr>
          </template>

          <template
            v-slot:footer.page-text="props"
          >{{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>

          <v-alert
            v-slot:no-results
            :value="true"
            class="error"
            icon="warning"
          >A procura por "{{ search }}" não deu resultados.</v-alert>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Legislacao from "./NovaLegislacao";

export default {
  props: ["newSerie"],
  components: {
    Legislacao
  },
  data: () => {
    return {
      legislacao: [],
      search: "",
      headersDes: [
        {
          text: "Tipo",
          align: "left",
          value: "tipo",
          width: "8%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Número",
          value: "numero",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Sumário",
          value: "sumario",
          width: "60%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Data",
          value: "data",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Remover",
          width: "12%",
          class: ["table-header", "body-2", "font-weight-bold"],
          sortable: false
        }
      ],
      headersSel: [
        {
          text: "Tipo",
          align: "left",
          value: "tipo",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Número",
          value: "numero",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Sumário",
          value: "sumario",
          width: "70%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Data",
          value: "data",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      footer_props: {
        "items-per-page-text": "Legislação por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todas"
      }
    };
  },
  methods: {
    selectLegislacao: function(item) {
      this.newSerie.legislacao.push(item);
      this.legislacao = this.legislacao.filter(
        e => e.tipo != item.tipo && e.numero != item.numero
      );
    },
    unselectLegislacao: function(item) {
      this.legislacao.push(item);
      this.newSerie.legislacao = this.newSerie.legislacao.filter(
        e => e.numero != item.numero && e.tipo != item.tipo
      );
    }
  },
  created: async function() {
    let response = await this.$request("get", "/api/legislacao");
    this.legislacao = response.data;
  }
};
</script>

<style scoped>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>