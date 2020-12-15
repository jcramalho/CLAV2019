<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE AVALIAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        2.	Avaliação e criticidade do sistema de informação
        <InfoBox header="Avaliação SI" :text="myhelp.Ppd.Avaliacao.geral" helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Descrição do SI
              <InfoBox header="Descrição do SI" :text="myhelp.Ppd.Avaliacao.descricao"/>
            </div>
          </v-col>
          <v-col cols="12" xs="12" sm="8">
            <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.avaliacao.descricao"
              label="Indique o âmbito e conteúdo do sistema de informação"
              solo
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Decomposição do SI</div>
          </v-col>
          <v-col v-if="ppd.si.avaliacao.tabelaDecomposicao.length > 0">
            <v-data-table
            :headers="headersDecomp"
            :items="ppd.si.avaliacao.tabelaDecomposicao"
            class="elevation-1"
            :footer-props="footer_Classes"
            :page.sync="paginaSelectDecomp"
            >
              <template v-slot:header="props">
                  <tr>
                  <th v-for="h in props.headers" :key="h.text" class="subtitle-2">{{ h.text }}</th>
                  </tr>
              </template>

              <template v-slot:item="props">
                <tr>
                <td>{{ props.item.numeroSI }}</td>
                <td>{{ props.item.numeroSub }}</td>
                <td>{{ props.item.nomeSub }}</td>
                <td>
                  <v-btn small color="red darken-2" dark rounded @click="unselectDecomp(props.item)">
                  <v-icon dark>remove_circle_outline</v-icon>
                  </v-btn>
                </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col v-else>
            <v-alert :value="true" type="warning">Não tem nenhuma classe selecionada...</v-alert>
          </v-col>
        </v-row>
        <v-row class="mx-4">
          <v-btn @click="addDecomposicao=true" dark color="indigo darken-4">Adicionar</v-btn>
        </v-row>
        <v-dialog v-model="addDecomposicao">
          <AddDecomposicao
            hide-overlay
            v-bind:numeroSI=ppd.si.numeroSI
            @guardarDecomp="guardarDecomp($event)"
          />
        </v-dialog>


        <v-row>
          <v-col>
            <hr style="border: 3px solid indigo; border-radius: 2px;" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="info-label">PCA do sistema de informação</div>
          </v-col>
          <v-col>
            <v-text-field solo dense >
            </v-text-field>
          </v-col>
          <v-col :md="2">
            <div class="info-label">Destino final do sistema de informação</div>
          </v-col>
          <v-col>
            <v-text-field solo dense >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Classes</div>
          </v-col>
          <v-col v-if="ppd.si.avaliacao.selecionadosTabelaFL.length > 0">
            <v-data-table
            :headers="headersSelecionados"
            :items="ppd.si.avaliacao.selecionadosTabelaFL"
            class="elevation-1"
            :footer-props="footer_Classes"
            :page.sync="paginaSelect"
            >
              <template v-slot:header="props">
                  <tr>
                  <th v-for="h in props.headers" :key="h.text" class="subtitle-2">{{ h.text }}</th>
                  </tr>
              </template>

              <template v-slot:item="props">
                <tr>
                <td>{{ props.item.codigo}}</td>
                <td>{{ props.item.referencia}}</td>
                <td>{{ props.item.titulo}}</td>
                <td>
                  <v-btn small color="red darken-2" dark rounded @click="unselectClasse(props.item)">
                  <v-icon dark>remove_circle_outline</v-icon>
                  </v-btn>
                </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col v-else>
            <v-alert :value="true" type="warning">Não tem nenhuma classe selecionada...</v-alert>
          </v-col>
        </v-row>


        <v-row class="mx-4">
          <v-btn @click="addClasse=true" dark color="indigo darken-4">Adicionar Classe</v-btn>
        </v-row>
        <v-dialog v-model="addClasse">
          <AddClasse
            v-bind:classesSI="classesSI"
            v-bind:classesDaFonteL="classesDaFonteL"
            hide-overlay
            @guardarClasse="guardarClasse($event)"
          />
        </v-dialog>

        <v-row>
          <v-col>
            <hr style="border: 3px solid indigo; border-radius: 2px;" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sistemas informação</div>
          </v-col>
          <v-col v-if="ppd.si.avaliacao.sistemasRelacionados.length > 0">
            <v-data-table :headers="siRelacionadosHeadersShow" :items="ppd.si.avaliacao.sistemasRelacionados" class="elevation-1" hide-default-footer>
              <template v-slot:header="props">
                <tr>
                  <th v-for="h in props.headers" :key="h.text" class="subtitle-2">{{ h.text }}</th>
                </tr>
              </template>

              <template v-slot:item="props">
                <tr>
                  <td>{{ props.item.relacao }}</td>
                  <td>{{ props.item.numeroSI }}</td>
                  <td>
                    <v-btn small color="red darken-2" dark rounded @click="unselectSistemasRelacionados(props.item)">
                      <v-icon dark>remove_circle_outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col v-else>
            <v-alert :value="true" type="warning">Não tem sistemas informação relacionados...</v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Selecione o(s) sistema(s) informação relacionado(s)</div>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title>
                <v-text-field
                  v-model="searchProcessos"
                  append-icon="search"
                  label="Procura filtra sistemas informação"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="siRelacionadosHeaders"
                :items="ppd.listaSistemasInfoAuxiliar"
                :items-per-page="5"
                :search="searchProcessos"
                item-key="numeroSI"
                class="elevation-1"
                :sort-by="['numeroSI']"
                :footer-props="footer_props"
              >
                <template v-slot:item="props">
                  <tr>
                    <td>
                      <v-select
                        :key="props.item.numeroSI"
                        item-text="label"
                        item-value="value"
                        label="Indique a relação"
                        :items="tipoRelacao"
                        solo
                        @change="selectSistema(props.item.numeroSI, $event)"
                      />
                    </td>
                    <td>{{ props.item.numeroSI }}</td>
                  </tr>
                </template>

                <v-alert
                  v-slot:no-results
                  :value="true"
                  color="error"
                  icon="warning"
                >A procura por "{{ search }}" não deu resultados.</v-alert>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Atividade do SI
                <InfoBox header="Atividade do SI" :text="myhelp.Ppd.Avaliacao.estadoSI" />
              </div>
          </v-col>
          <v-col
            class="d-flex"
            cols="12"
            sm="9"
          >
            <v-select
              :items="checkedAti"
              label="Indique o estado de atividade do sistema"
              v-model="ppd.si.avaliacao.checkedAti"
              dense
              solo
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Grau de utilização do SI
                <InfoBox header="Grau de utilização do SI" :text="myhelp.Ppd.Avaliacao.utilizacaoSI" />
              </div>
          </v-col>
          <v-col class="d-flex" cols="12" sm="9">
            <v-select
              :items="checkedGrau"
              label="Indique o grau de utilização do SI (1-5)"
              v-model="ppd.si.avaliacao.checkedGrau"
              dense
              solo
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Criticidade do SI
                <InfoBox header="Criticidade do SI" :text="myhelp.Ppd.Avaliacao.criticidadeSI" />
              </div>
          </v-col>
          <v-col class="d-flex" cols="12" sm="9">
            <v-select
              :items="checkedCriticidade"
              label="Indique a criticidade do SI (1-4)"
              v-model="ppd.si.avaliacao.checkedCriticidade"
              dense
              solo
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Objeto de preservação
              <InfoBox header="Objeto de preservação" :text="myhelp.Ppd.Avaliacao.siObjetoPreservacao"/>
            </div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.avaliacao.objetoPreservacao" row>
              <v-radio
                v-for="(p, i) in simNao"
                :key="i"
                :label="p"
                :value="p"
                color="indigo darken-3"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <hr style="border: 3px solid indigo; border-radius: 2px;" />
          </v-col>
        </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";
import AddDecomposicao from"@/components/ppd/criacao/sistemaInformacao/AddDecomposicao.vue";
import AddClasse from"@/components/ppd/criacao/sistemaInformacao/AddClasse.vue";

export default {
  props: ["ppd", "semaforos", "listaLegislacao", "classesSI", "classesDaFonteL"],

  components: {
    InfoBox,
    AddDecomposicao,
    AddClasse
  },

  data: () => {
    return {
      myhelp: help,
      siTipoRelacao: [],
      loadCheck: "",
      addDecomposicao: false,
      addClasse: false,

      siRelacionadosHeaders: [
        { text: "Relação", align: "left", value: "relacao" },
        { text: "Número SI", align: "left", value: "numeroSI", sortable: true },
      ],
      siRelacionadosHeadersShow: [
        { text: "Relação", align: "left", value: "relacao" },
        { text: "Número SI", align: "left", value: "numeroSI", sortable: true },
        { text: "Remover", align: "left", sortable: false, value: "" },
      ],
      headersSelecionados:[
        {text: "Código", sortable: false, value: "codigo"},
        {text: "Referência", sortable: false, value: "referencia"},
        {text: "Título", sortable: false, value: "titulo"},
        {text: "Remover", align: "left", sortable: false, value: "" },
      ],
      headersDecomp:[
        {text: "Numero SI", sortable: false, value: "numeroSI"},
        {text: "Numero subSI", sortable: false, value: "numeroSub"},
        {text: "Nome subSI", sortable: false, value: "nomeSub"},
        {text: "Remover", align: "left", sortable: false, value: "" },
      ],
      footer_props: {
        "items-per-page-text": "Sistemas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      },
      footer_Classes: {
        "items-per-page-text": "Classes por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      },

      paginaSelect: 1,
      paginaSelectDecomp: 1,

      searchProcessos: "",


      //Listas das opções disponiveis
      tipoRelacao: [
        {label: "S (síntese - quando sintetiza o conteúdo informativo do sistema em análise)", value:"Síntese"},
        {label: "D (duplicada - quando possui, no todo ou em parte, o mesmo conteúdo informativo do sistema em análise - não confundir com backups ou réplicas do sistema)",value:"Duplicada"},
        {label: "I (complementar - quando possui informação adicional que acrescenta significado à informação do sistema em análise)",value:"Complementar"},
        {label: "A (antecedente - quando se trata de um sistema inactivo, que foi substituído pelo sistema em análise)",value:"Antecedente"},
        {label: "X (Input - quando fornece dados ou informação ao sistema em análise)",value:"Input"},
        {label: "O (Output - quando a informação, no todo ou em parte, tem origem ou resulta do processamento de dados existentes no sistema em análise)",value:"Output"},
      ],
      checkedAti: ["Ativo", "Semi-ativo","Inativo","Abatido"],
      checkedGrau: ["O sistema é utilizado regularmente (todos os dias)",
                    "O sistema é usado menos regularmente (todas as semanas)",
                    "O sistema é utilizado com pouca regularidade (mensalmente ou semestralmente)",
                    "O sistema é pouco utilizado (anualmente)",
                    "O sistema nunca é utilizado (desconhecido)."],
      checkedCriticidade: ["Muito crítico", "Crítico", "Pouco crítico", "Não crítico"],
      simNao: ["Sim", "Não"],

      tabelaDecomposicao:[]

    };
  },



  methods: {

    //-----------
    guardarClasse(item) {
      this.ppd.si.avaliacao.selecionadosTabelaFL.push(item);
      this.addClasse= false;
    },

    unselectClasse: function(item) {
      if(item.codigo){
        this.classesSI.push({info:"Cod: " + item.codigo + " - " + item.titulo , classe:item.classe});
      }
      else{
        this.classesSI.push({info:"Ref: " + item.referencia + " - " + item.titulo , classe:item.classe})
      }
      var index = this.ppd.si.avaliacao.selecionadosTabelaFL.findIndex(e => e.classe === item.classe);
      this.ppd.si.avaliacao.selecionadosTabelaFL.splice(index, 1);
    },

    guardarDecomp(item) {
      this.ppd.si.avaliacao.tabelaDecomposicao.push(item);
      this.addDecomposicao= false;
    },

    unselectDecomp: function(item) {
      var index = this.ppd.si.avaliacao.tabelaDecomposicao.findIndex(e => e.numeroSub === item.numeroSub);
      this.ppd.si.avaliacao.tabelaDecomposicao.splice(index, 1);
    },

    selectSistema: function(numeroSI, relacao) {
      var index = this.ppd.listaSistemasInfoAuxiliar.findIndex(p => p.numeroSI === numeroSI);
      this.ppd.listaSistemasInfoAuxiliar[index].relacao = relacao;
      var selectedSistema = JSON.parse(JSON.stringify(this.ppd.listaSistemasInfoAuxiliar[index]));
      this.ppd.listaSistemasInfoAuxiliar.splice(index, 1);
      this.$emit("newSistemasRelacionados", selectedSistema);
    },

    unselectSistemasRelacionados: function(sistema) {
      sistema.idRel= "Por selecionar";
      sistema.relacao = "";
      this.$emit("unselectSistemasRelacionados", sistema);
    },

  }
};
</script>
<style>
.info-label {
  color: #2e7d32;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1a237e;
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
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
