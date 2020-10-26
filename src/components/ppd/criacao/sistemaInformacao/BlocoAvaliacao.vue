<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE AVALIAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        2.	Avaliação do sistema de informação (SI)
        <InfoBox header="Avaliação SI" :text="myhelp.Ppd.Avaliacao.geral" helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sistemas informação</div>
          </v-col>
          <v-col v-if="ppd.avaliacao.sistemasRelacionados.length > 0">
            <v-data-table :headers="siRelacionadosHeadersShow" :items="ppd.avaliacao.sistemasRelacionados" class="elevation-1" hide-default-footer>
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
                        v-model="props.item.idRel"
                        :items="tipoRelacao"
                        solo
                        @change="selectSistema(props.item.numeroSI, $event)"
                      />
                    </td>
                    <td>{{ props.item.numeroSI }}</td>
                    <td>{{ props.item.relacao }}</td>
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
            <div class="info-label">Fonte de legitimação </div>
          </v-col>
          <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="loadCheck" row>
              <v-radio
                v-for="(p, i) in fonteLegitimacao"
                :key="i"
                :label="p"
                :value="p"
                color="indigo darken-3"
              ></v-radio>
            </v-radio-group>
            <div v-if="loadCheck === 'TS/LC'">
              <v-autocomplete
                label="Selecione a fonte de legitimação"
                :items="tabelasSelecao"
                item-text="titulo"
                return-object
                v-model="a"
                solo
                dense
              />
            </div>
            <div v-else-if="loadCheck === 'PGD/LC'">
              <v-autocomplete
                label="Selecione a fonte de legitimação"
                :items="portariaLC"
                item-text="titulo"
                return-object
                v-model="a"
                solo
                dense
              />
            </div>
            <div v-else-if="loadCheck === 'PGD'">
              <v-autocomplete
                label="Selecione a fonte de legitimação"
                :items="portaria"
                item-text="titulo"
                return-object
                v-model="fonteLegitimacaoSelected"
                solo
                dense
              />
            </div>
            <div v-else-if="loadCheck === 'RADA'">
              <v-autocomplete
                label="Selecione a fonte de legitimação"
                :items="portariaRada"
                item-text="titulo"
                return-object
                v-model="a"
                solo
                dense
              />
            </div>
            <div v-else>
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="tsRada"
                    item-text="titulo"
                    return-object
                    v-model="a"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="2" sm="2" class="mt-3">
            <div class="info-label">
              Tabela de Seleção
            </div>
          </v-col>
          <v-col xs="3" sm="3"/>
          <v-col xs="5" sm="5">
            <v-text-field
              v-if="!tree_ou_tabela"
              label="Procurar"
              v-model="search"
              append-icon="search"
              single-line
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list v-if="tree_ou_tabela">
              <v-list-group
                v-for="(classe, i) in classesTree"
                :key="i"
                multiple
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      <span v-if="classe.codigo">{{classe.codigo}} <span class="ml-7">{{classe.titulo}}</span></span>
                      <span v-else class="ml-9">{{classe.titulo}}</span>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                  <ShowPGD :classe="classe"/>
              </v-list-group>
            </v-list>
            <v-data-table v-else
              :headers="headers"
              :items="classeSelecionada"
              item-key="idClasse"
              :search="search"
              class="elevation-1"
              :footer-props="footer_props"
              :page.sync="paginaTabela"
              :expanded="expanded"
              :single-expand="true"
              @click:row="clicked">
            >
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Atividade do SI</div>
          </v-col>
          <v-col
            class="d-flex"
            cols="12"
            sm="9"
          >
            <v-select
              :items="checkedAti"
              label="Indique o estado de atividade do sistema"
              v-model="ppd.avaliacao.checkedAti"
              dense
              solo
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Legislação / Diplomas jurídico-administrativos</div>
          </v-col>
          <v-col cols="12" xs="12" sm="9" v-if="semaforos.legislacaoReady">
            <v-autocomplete
              v-model="ppd.avaliacao.legislacao"
              :items="listaLegislacao"
              item-text="numero"
              item-value="numero"
              placeholder="Selecione as legislações/diplomas jurídico-administrativos"
              multiple
              chips
              deletable-chips
              return-object
            >
            </v-autocomplete>
          </v-col>
          <v-col v-else>
            <v-alert dense type="info">
              Ainda não foi possível carregar as legislações/diplomas jurídico-administrativos...
            </v-alert>
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

export default {
  props: ["ppd", "semaforos", "listaLegislacao"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      myhelp: help,
      siTipoRelacao: [],
      loadCheck: "",
      fonteLegitimacaoSelected: "",

      siRelacionadosHeaders: [
        { text: "Relação", align: "left", value: "relacao" },
        { text: "Número SI", align: "left", value: "numeroSI", sortable: true },
      ],
      siRelacionadosHeadersShow: [
        { text: "Relação", align: "left", value: "relacao" },
        { text: "Número SI", align: "left", value: "numeroSI", sortable: true },
        { text: "Remover", align: "left", sortable: false, value: "" },
      ],
      footer_props: {
        "items-per-page-text": "Sistemas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      },
      //para apagar!!
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
      fonteLegitimacao: ["TS/LC", "PGD/LC", "PGD", "RADA", "RADA/CLAV"],

      a: "",
      portaria: [],
      portariaLC: [],
      portariaRada: [],
      tabelasSelecao: [],
      tsRada: [],



      //---------------------------------------------------------------------
      //----
      classes: [],
      classesTree: [],
      classeSelecionada: [],
      //----

      expanded: [],
      tree_ou_tabela: false,
      search: "",
      paginaTabela: 1,
      headers: [
      {text: "Código", sortable: false, value: "codigo"},
      {text: "Referência", sortable: false, value: "referencia"},
      {text: "Título", sortable: false, value: "titulo"},
      {text: "PCA", sortable: false, value: "pca"},
      {text: "Destino Final", sortable: false, value: "df"},
      ],
      headersLC: [
        {text: "Código", sortable: false, value: "codigo"},
        {text: "Título", sortable: false, value: "titulo"},
        {text: "PCA", sortable: false, value: "pca"},
        {text: "Destino Final", sortable: false, value: "df"}
      ],
    };
  },

  created: async function() {
    try {
      //var user = this.$verifyTokenUser();
      //var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
      //this.portariaLC = await this.prepararLeg(response.data);
      var response2 = await this.$request("get", "/pgd");
      this.portaria = await this.prepararLeg(response2.data);
      //var response3 = await this.$request("get", "/legislacao?fonte=RADA");
      //this.portariaRada = await this.prepararLeg(response3.data);
      //var response4 = await this.$request("get","/rada");
      //this.tsRada = response4.data
      var response5 = await this.$request("get","/tabelasSelecao")
      this.tabelasSelecao = response5.data.map(ts=>{return {
          titulo: ts.designacao,
          codigo: ts.id.split("clav#")[1]
        }
      });
    }catch (e) {
      this.portariaLC = [];
      this.portaria = [];
      this.portariaRada = [];
      this.tabelasSelecao = [];
      this.tsRada = [];
    }


  },

  watch:{
    "fonteLegitimacaoSelected": function() {

      //if (this.fonteLegitimacaoSelected != "") {
        this.loadConsultaPGD(this.fonteLegitimacaoSelected.id);
      //}
    },
  },

  methods: {

    //-----------

    loadConsultaPGD: async function(id) {
      try {
        var response = await this.$request("get", "/pgd/"+id);
        this.classeSelecionada = response.data;
      }
        catch (err) {
          return err;
      }
    },

    clicked(value) {
      if(value.descricao || value.notaDF || value.notaPCA || value.formaContagem || value.subFormaContagem || value.designacaoParticipante || value.designacaoDono)
        if(this.expanded[0] == value) this.expanded.pop();
        else this.expanded = [value]
    },

    //--------------------
    parseEntidades: async function(ent) {
      try {
        var entidades = "";
        for (var i = 0; i < ent.length; i++) {
          entidades = entidades + ent[i] + " ";
        }
        return entidades;
      } catch (e) {
        return {};
      }
    },
    preparaLegislacao: async function(leg) {
      try {
        var myLegislacao = {
          data: {
            campo: "Data do diploma",
            text: leg.data
          },
          sumario: {
            campo: "Sumário",
            text: leg.sumario
          },
          fonte: {
            campo: "Fonte de legitimação",
            text: leg.fonte
          },
          link: {
            campo: "Link",
            text: leg.link
          },
          entidades: {
            campo: "Entidades",
            text: await this.parseEntidades(leg.entidades)
          }
        };
        return myLegislacao;
      } catch (e) {
        return {};
      }
    },
    procuraClasse: function (classe, myClasses, classePai) {
      var index = myClasses.map(cl => cl.classe).indexOf(classePai)
      if(index>=0) myClasses[index].filhos.push(classe)
      else
        for(var c of myClasses) {
          c.filhos = this.procuraClasse(classe,c.filhos,classePai)
        }
      return myClasses
    },
    prepararClasses: async function(classes) {
      var myClasses = [];
      for(var c of classes) {
        c.filhos = []

        if(c.nivel == 1) {
          myClasses.push(c)
        }
        else {
          myClasses = this.procuraClasse(c,myClasses,c.classePai)
        }
      }
      return myClasses;
    },
    //--------------------
    //----------------------------------------------
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push({id: l.idPGD , titulo: l.tipo + " " + l.numero + " - " + l.sumario});
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
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
