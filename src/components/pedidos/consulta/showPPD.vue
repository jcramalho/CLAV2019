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
        <v-col cols="5" xs="5" sm="3">
          <div class="info-label">Número</div>
        </v-col>
        <v-col>
          <v-text-field solo readonly :value="this.ppd.geral.numeroPPD"></v-text-field>
        </v-col>
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
          <v-text-field solo readonly :value="this.ppd.geral.tipoFonteL"></v-text-field>
        </v-col>
        <v-col cols="5" xs="5" sm="4">
          <div class="info-label">Fonte de legitimação</div>
        </v-col>
        <v-col>
          <v-text-field solo readonly :value="this.ppd.geral.fonteLegitimacao.titulo"></v-text-field>
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
              Entidades {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
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
                <v-btn small color="blue darken-2" dark rounded @click="item2Show(props.item)">
                  <v-icon dark>visibility</v-icon>
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
    <template>
      <div>
        <v-dialog
          :retain-focus="false"
          v-model="verSI"
        >
          <v-card>
            <v-card-title class="expansion-panel-heading">Sitema de informação</v-card-title>
            <div class="v-card__text mt-4">
              <verBlocoIdentificacao
                :siSpec="siSpec"
              />
              <verBlocoAvaliacao
                :siSpec="siSpec"
              />
              <verBlocoCaracterizacao
                :siSpec="siSpec"
              />
              <verBlocoEstrategia
                :siSpec="siSpec"
              />
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-row align="center" justify="space-around">
                <v-btn
                color="indigo darken-2"
                dark
                class="ma-2"
                rounded
                @click="verSI = false"
                >
                  Fechar
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-row>
</template>



<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import ArvoreLateralPPD from '@/components/ppd/criacao/ArvoreLateralPPD.vue';
import verBlocoIdentificacao from "@/components/ppd/criacao/verSI/verBlocoIdentificacao.vue"
import verBlocoAvaliacao from "@/components/ppd/criacao/verSI/verBlocoAvaliacao.vue"
import verBlocoCaracterizacao from "@/components/ppd/criacao/verSI/verBlocoCaracterizacao.vue"
import verBlocoEstrategia from "@/components/ppd/criacao/verSI/verBlocoEstrategia.vue"
import mixinCriacaoPPD from "@/mixins/ppd/mixinCriacaoPPD.js";


export default {
  props: ['p'],
  components: {
    ArvoreLateralPPD,
    verBlocoIdentificacao,
    verBlocoAvaliacao,
    verBlocoCaracterizacao,
    verBlocoEstrategia,
    mixinCriacaoPPD
  },
  mixins: [mixinCriacaoPPD],

	data: () => ({
    ppd: {},
    searchSI: "",
    entidades: [],
    siSpec: {
      numeroSI: [],
        nomeSI: [],
        identificacao:{},
        avaliacao:{},
        caracterizacao:{},
        estrategia:{}
    },
    verSI: false,

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
        this.ppd = this.p.objeto.dados;
        this.criarArvore()
      }
      catch(e){
        console.log('Erro ao carregar a informação inicial: ' + e);
      }
  },
  methods: {
    item2Show: function(item){
      this.siSpec = item;
      this.verSI = true;
      if(item.visto){
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema.map(e => e.sigla).toString()
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propDados= item.identificacao.propDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico.map(e => e.sigla).toString(),
        this.siSpec.avaliacao.decomposicao= item.avaliacao.decomposicao.map(e=> e.numeroSI+"."+e.numeroSub + " " + e.nomeSub).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionado= item.avaliacao.sistemasRelacionados.map(e=> e.numeroSI).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionadoRelacao= item.avaliacao.sistemasRelacionados.map(e=> e.relacao).toString().replaceAll(",","#")
        item.visto=false;
      }
    },

    criarArvore: function(){
      var child = [];
      this.ppd.arvore = []
      this.ppd.sistemasInfo.forEach(element => {
        var index =  this.ppd.arvore.findIndex(l => l.id === element.numeroSI);
        child = [];
        if(element.avaliacao.decomposicao != ""){
          child = element.avaliacao.decomposicao.split("#").map(e=> e=({"id": e.split("-")[0], "name":e.split("-").slice(1).toString()}));
        }
        child.sort((a,b) => (parseFloat(a.id) > parseFloat(b.id)) ? 1 : ((parseFloat(b.id) > parseFloat(a.id)) ? -1 : 0));
        this.ppd.arvore.push({"id": element.numeroSI, "name": element.nomeSI, "titulo": element.nomeSI, children: child })
        this.ppd.arvore.sort((a,b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : ((parseInt(b.id) > parseInt(a.id)) ? -1 : 0));
      });
    }
  }

};

</script>

<style>
.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E;
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separadorMini {
  color: #283593;
  text-align: center;
  padding: 5px;
  font-weight: 400;
  width: 75%;
  background-color: #e8eaf6;
  font-size: 14pt;
  font-weight: bold;
  margin: auto;
  border-radius: 3px;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
