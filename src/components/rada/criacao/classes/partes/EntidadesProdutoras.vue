/* eslint-disable prettier/prettier */
<template>
  <div v-if="RE.entidadesProd.length > 0">
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Entidades Produtoras</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-data-table
          v-if="!!newSerie.entProdutoras[0]"
          :headers="headersDes"
          :items="newSerie.entProdutoras"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.estado }}</td>
              <td>
                <v-btn
                  small
                  color="red darken-2"
                  dark
                  rounded
                  @click="unselectEntidade(props.item)"
                >
                  <v-icon dark>remove_circle</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-alert
          dense
          v-else
          icon="warning"
          color="amber accent-3"
        >Não tem entidades produtoras selecionadas...</v-alert>
      </v-col>
    </v-row>
    <v-row v-if="filterEntidades.length > 0">
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Selecione a(s) entidade(s) produtora(s)</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procurar por entidades"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :search="search"
          :headers="headersSel"
          :items="filterEntidades"
          item-key="id"
          :footer-props="footer_props"
          :items-per-page="5"
        >
          >
          <template v-slot:item="props">
            <tr @click="selectEntidade(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.estado }}</td>
            </tr>
          </template>

          <v-alert
            v-slot:no-results
            class="error"
            icon="warning"
          >A procura por "{{ search }}" não deu resultados.</v-alert>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Tipologias das Entidades Produtoras</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-data-table
          v-if="!!newSerie.tipologiasProdutoras[0]"
          :headers="headersDes"
          :items="newSerie.tipologiasProdutoras"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.estado }}</td>
              <td>
                <v-btn
                  small
                  color="red darken-2"
                  dark
                  rounded
                  @click="unselectTipologia(props.item)"
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
        >Não tem entidades produtoras selecionadas...</v-alert>
      </v-col>
    </v-row>
    <v-row v-if="filterTipologias.length > 0">
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Selecione a(s) tipologia(s) produtora(s)</div>
      </v-col>
      <v-col xs="12" sm="9">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procurar por entidades"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :search="search"
          :headers="headersSel"
          :items="filterTipologias"
          item-key="id"
          :footer-props="footer_props"
          :items-per-page="5"
        >
          >
          <template v-slot:item="props">
            <tr @click="selectTipologia(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.estado }}</td>
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
export default {
  name: "EntidadesProdutores",
  props: ["newSerie", "RE"],
  data: () => {
    return {
      search: "",
      headersDes: [
        {
          text: "Sigla",
          align: "left",
          value: "sigla",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Designação",
          value: "designacao",
          width: "55%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Tipo",
          value: "estado",
          width: "25%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      headersSel: [
        {
          text: "Sigla",
          align: "left",
          value: "sigla",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Designação",
          value: "designacao",
          width: "80%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Tipo",
          value: "estado",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      footer_props: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todas",
        "show-first-last-page": true,
        "show-current-page": true
      }
    };
  },
  computed: {
    filterEntidades() {
      return this.RE.entidadesProd.filter(ent => {
        return !this.newSerie.entProdutoras.some(e => ent.id == e.id);
      });
    },
    filterTipologias() {
      return this.RE.tipologiasProd.filter(ent => {
        return !this.newSerie.tipologiasProdutoras.some(e => ent.id == e.id);
      });
    }
  },
  methods: {
    //{ "estado": "Ativa", "sigla": "A3ES", "sioe": "", "designacao": "Agência de Avaliação e Acreditação do Ensino Superior", "id": "ent_A3ES", "internacional": "", "searchField": "A3ES - Agência de Avaliação e Acreditação do Ensino Superior", "disabled": false },
    selectEntidade: function(item) {
      this.newSerie.entProdutoras.push({
        id: item.id,
        sigla: item.sigla,
        designacao: item.designacao,
        estado: item.estado
      });
    },
    unselectEntidade: function(item) {
      this.newSerie.entProdutoras = this.newSerie.entProdutoras.filter(
        e => e.id != item.id
      );
    },
    //{ "estado": "Ativa", "sigla": "AAC", "designacao": "Autoridades Administrativas Civis", "id": "tip_AAC", "searchField": "AAC - Autoridades Administrativas Civis", "disabled": false }
    selectTipologia: function(item) {
      this.newSerie.tipologiasProdutoras.push({
        id: item.id,
        sigla: item.sigla,
        designacao: item.designacao,
        estado: item.estado
      });
    },
    unselectTipologia: function(item) {
      this.newSerie.tipologiasProdutoras = this.newSerie.tipologiasProdutoras.filter(
        e => e.id != item.id
      );
    }
  }
};
</script>

<style>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
