<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Legislação</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-data-table
          v-if="!!newSerie.legislacao[0]"
          :headers="headersDes"
          :items="newSerie.legislacao"
          class="elevation-1"
          hide-default-footer
        >
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
        <v-alert v-else :value="true" icon="warning" color="amber accent-3"
          >Não tem legislação selecionada...</v-alert
        >
      </v-col>
    </v-row>
    <Legislacao :legislacao="legislacao" :legislacaoClone="legislacaoClone" />
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Selecione a legislação</div>
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
          :items="legislacaoClone"
          item-key="id"
          :footer-props="footer_props"
          :items-per-page="5"
        >
          <template v-slot:item="props">
            <tr @click="selectLegislacao(props.item)">
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.data }}</td>
            </tr>
          </template>

          <v-alert v-slot:no-results :value="true" class="error" icon="warning"
            >A procura por "{{ search }}" não deu resultados.</v-alert
          >
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
      legislacaoClone: [],
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
        "items-per-page-all-text": "Todas",
        "show-first-last-page": true,
        "show-current-page": true
      }
    };
  },
  watch: {
    // Voltar a colocar o array inteiro devido ao bug do reset() do form
    "newSerie.legislacao": function(newValue, oldvalue) {
      if (newValue.length == 0) {
        this.legislacaoClone = [...this.legislacao];
      }
    }
  },
  methods: {
    selectLegislacao: function(item) {
      this.newSerie.legislacao.push(item);
      this.legislacaoClone = this.legislacaoClone.filter(
        e => e.tipo != item.tipo && e.numero != item.numero
      );
    },
    unselectLegislacao: function(item) {
      this.legislacaoClone.push(item);
      this.newSerie.legislacao = this.newSerie.legislacao.filter(
        e => e.numero != item.numero && e.tipo != item.tipo
      );
    }
  },
  created: async function() {
    let response = await this.$request("get", "/api/legislacao");
    this.legislacao = response.data;
    this.legislacaoClone = [...response.data];
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
