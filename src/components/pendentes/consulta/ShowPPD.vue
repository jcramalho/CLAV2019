<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <ArvoreLateralPPD
        @ver="showSI"
        :arvore="ppd.arvore"
        :sistemasInfo="ppd.sistemasInfo"
      />
    </v-col>
    <v-col cols="12" xs="12" sm="9">
      <div>
        <v-col cols="5" xs="5" sm="2">
          <div class="info-label">Título</div>
        </v-col>
        <v-col>
          <v-text-field solo readonly :value="this.ppd.geral.nomePPD"></v-text-field>
        </v-col>
        <v-col cols="5" xs="5" sm="4">
          <div class="info-label">Menção de responsabilidade</div>
        </v-col>
        <v-col>
          <v-text-field solo readonly :value="this.ppd.geral.mencaoResp"></v-text-field>
        </v-col>
        <v-col cols="5" xs="5" sm="4">
          <div class="info-label">Tipo da fonte de legitimação</div>
        </v-col>
        <v-col>
          <v-text-field solo readonly :value="this.ppd.tipoFonteL"></v-text-field>
        </v-col>
        <v-col cols="5" xs="5" sm="4">
          <div class="info-label">Fonte de legitimação</div>
        </v-col>
        <v-col>
          <v-text-field solo readonly :value="this.ppd.fonteLegitimacao.titulo"></v-text-field>
        </v-col>
      </div>
      <v-col v-if="this.ppd.geral.entSel.length > 0">
        <v-card-title>
          <v-text-field
            v-model="searchSI"
            append-icon="search"
            label="Procura filtra entidades"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headersEnt"
          :items="this.ppd.geral.entSel"
          :items-per-page="5"
          item-key="id"
          :search="searchSI"
          :sort-by="['sigla']"
          class="elevation-1"
          :footer-props="footer_propsEnt"
        >
          <template v-slot:header="props">
            <tr>
              <th
                v-for="h in props.headers"
                :key="h.text"
                class="body-2 font-weight-bold"
                style="color: green;"
              >{{ h.text }}
              </th>
            </tr>
          </template>

          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.identificacao }}</td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props">
              Sistemas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-col>
      <v-col v-if="this.ppd.sistemasInfo.length > 0">
        <v-card-title>
          <v-text-field
            v-model="searchSI"
            append-icon="search"
            label="Procura filtra sistemas informação"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="this.ppd.sistemasInfo"
          :items-per-page="5"
          item-key="numeroSI"
          :search="searchSI"
          :sort-by="['numeroSI']"
          class="elevation-1"
          :footer-props="footer_props"
        >
          <template v-slot:header="props">
            <tr>
              <th
                v-for="h in props.headers"
                :key="h.text"
                class="body-2 font-weight-bold"
                style="color: green;"
              >{{ h.text }}
              </th>
            </tr>
          </template>

          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.numeroSI }}</td>
              <td>{{ props.item.nomeSI }}</td>
              <td>
                <v-btn small color="blue darken-2" dark rounded @click="show(props.item)">
                  <v-icon dark>edit</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props">
              Sistemas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-col>
    </v-col>
  </v-row>
</template>



<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import ArvoreLateralPPD from '@/components/ppd/criacao/ArvoreLateralPPD.vue';
import mixinCriacaoPPD from "@/mixins/ppd/mixinCriacaoPPD.js";

export default {
  props: ['p'],
  components: {
    ArvoreLateralPPD,
		mixinCriacaoPPD
  },
	mixins: [mixinCriacaoPPD],

	data: () => ({
		ppd: {},
    searchSI: "",
    entidades: [],

    headersEnt: [
      { text: "Sigla", value: "sigla" },
      { text: "Identificação", value: "identificacao" }
    ],

    headers: [
      { text: "Número", value: "numeroSI" },
      { text: "Nome", value: "nomeSI" },
      { text: "Ver", value: ""},
    ],

    footer_propsEnt: {
      "items-per-page-text": "Entidades por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todos"
    },

    footer_props: {
      "items-per-page-text": "Sistemas por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todos"
    },
	}),

	created: async function() {
      try{
        this.ppd = this.p.objeto;
        //this.ppd.listaSistemasInfoAuxiliar = this.ppd.sistemasInfo;
        //await this.loadEntidades();
        //await this.consultaFT();
      }
      catch(e){
        console.log('Erro ao carregar a informação inicial: ' + e);
      }
  }

};

</script>