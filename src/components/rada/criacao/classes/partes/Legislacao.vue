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
                  @click="desselecionarLegislacao(props.item)"
                >
                  <v-icon dark>remove_circle</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-alert
          v-else
          dense
          icon="warning"
          color="amber accent-3"
        >Não tem legislação selecionada...</v-alert>
      </v-col>
    </v-row>
    <NovaLegislacao :legislacao="legislacao" :newSerie="newSerie" />
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
          :items="filtrarLegislacao"
          item-key="id"
          :footer-props="footer_props"
          :items-per-page="5"
        >
          <template v-slot:item="props">
            <tr @click="selecionarLegislacao(props.item)">
              <td>{{ props.item.tipo }}</td>
              <td>{{ props.item.numero }}</td>
              <td>{{ props.item.sumario }}</td>
              <td>{{ props.item.data }}</td>
            </tr>
          </template>

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
import NovaLegislacao from "./NovaLegislacao";

export default {
  props: ["newSerie", "legislacao", "classes"],
  components: {
    NovaLegislacao
  },
  data: () => {
    return {
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
  computed: {
    filtrarLegislacao() {
      return this.legislacao.filter(leg => {
        return !this.newSerie.legislacao.some(
          e => e.tipo == leg.tipo && e.numero == leg.numero
        );
      });
    }
  },
  methods: {
    selecionarLegislacao(item) {
      this.newSerie.legislacao.push({
        id: item.id,
        data: item.data,
        tipo: item.tipo,
        numero: item.numero,
        sumario: item.sumario
      });
    },
    filtrarCriterioLegal(item) {
      // Necessario remover do critério legal associado à série quer às subséries que são suas filhas

      // 1º remover do critério legal na justificação PCA
      let legalPCA = this.newSerie.justificacaoPCA.find(
        e => e.tipo == "Critério Legal"
      );

      if (legalPCA != undefined) {
        legalPCA.relacoes = legalPCA.relacoes.filter(
          e => e != item.tipo + " " + item.numero
        );
      }

      // 2º remover do critério legal na justificação DF
      let legalDF = this.newSerie.justificacaoDF.find(
        e => e.tipo == "Critério Legal"
      );

      if (legalDF != undefined) {
        legalDF.relacoes = legalDF.relacoes.filter(
          e => e != item.tipo + " " + item.numero
        );
      }
    },
    desselecionarLegislacao(item) {
      this.newSerie.legislacao = this.newSerie.legislacao.filter(
        e => e.id != item.id
      );

      // Filtrar critério legal
      this.filtrarCriterioLegal(item);
    }
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
