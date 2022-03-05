<template>
  <div>
    <v-card flat class="pa-3">
      <p class="clav-content-title-1">Importar Auto de Eliminação (CSV)</p>
      <v-card-text class="panel-body">
        <div class="ma-3">
          A Plataforma CLAV permite a submissão de Autos de Eliminação (AE) através da
          importação de ficheiros. Para tal são disponibilizados dois tipos de formulários
          que devem ser preenchidos previamente offline:
          <li class="ml-6">
            Um formulário para as classes / séries (veja
            <a
              :href="`${publicPath}documentos/Formulario_auto_importacao_classes_series.csv`"
              download
              >aqui</a
            >)
          </li>
          <li class="ml-6">
            um formulário para as agregações simples / unidades de instalação (veja
            <a
              :href="`${publicPath}documentos/Formulario_auto_importacao_agregacoes_UI.csv`"
              download
              >aqui</a
            >)
          </li>

          <p>
            Consulte
            <a
              :href="`${publicPath}documentos/Instrucoes_preenchimento_AE_por_submissao.pdf`"
              >aqui</a
            >
            as instruções de preenchimento.
          </p>
        </div>

        <div>
          <v-row>
            <v-col :md="3">
              <div class="info-label">
                Fonte de legitimação
                <InfoBox
                  header="Fonte de Legitimação"
                  :text="myhelp.AutoEliminacao.Campos.FonteLegitimacao"
                  helpColor="indigo darken-4"
                  dialogColor="#E0F2F1"
                />
              </div>
            </v-col>
            <v-col>
              <v-radio-group row v-model="tipo" :mandatory="true">
                <v-radio value="TS_LC" @click="getTSLC">
                  <template v-slot:label>
                    <div class="mt-2">
                      TS/LC
                      <InfoBox
                        header="Fonte de Legitimação - TS/LC"
                        :text="myhelp.AutoEliminacao.Campos.TS_LC"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </div>
                  </template>
                </v-radio>
                <v-radio value="PGD_LC" @click="getPGDLC">
                  <template v-slot:label>
                    <div class="mt-2">
                      PGD/LC
                      <InfoBox
                        header="Fonte de Legitimação - PGD/LC"
                        :text="myhelp.AutoEliminacao.Campos.PGD_LC"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </div>
                  </template>
                </v-radio>
                <v-radio value="PGD" @click="getPGD">
                  <template v-slot:label>
                    <div class="mt-2">
                      PGD
                      <InfoBox
                        header="Fonte de Legitimação - PGD"
                        :text="myhelp.AutoEliminacao.Campos.PGD"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </div>
                  </template>
                </v-radio>
                <v-radio value="RADA" @click="getRADA">
                  <template v-slot:label>
                    <div class="mt-2">
                      RADA
                      <InfoBox
                        header="Fonte de Legitimação - RADA"
                        :text="myhelp.AutoEliminacao.Campos.RADA"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </div>
                  </template>
                </v-radio>
                <v-radio value="RADA_CLAV" @click="getRADACLAV">
                  <template v-slot:label>
                    <div class="mt-2">
                      RADA/CLAV
                      <InfoBox
                        header="Fonte de Legitimação - RADA/CLAV"
                        :text="myhelp.AutoEliminacao.Campos.RADA_CLAV"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <div v-if="tipo == 'PGD_LC'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portariaLC"
                  v-model="auto.legislacao"
                  solo
                  dense
                ></v-autocomplete>
              </div>
              <div v-else-if="tipo == 'TS_LC'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="tabelasSelecao"
                  return-object
                  item-text="titulo"
                  v-model="auto.legislacao"
                  solo
                  dense
                />
              </div>
              <div v-else-if="tipo == 'PGD'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portaria"
                  v-model="auto.legislacao"
                  solo
                  dense
                ></v-autocomplete>
              </div>
              <div v-else-if="tipo == 'RADA'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portariaRada"
                  v-model="auto.legislacao"
                  solo
                  dense
                ></v-autocomplete>
              </div>
              <div v-else>
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="tsRada"
                  item-text="titulo"
                  return-object
                  v-model="auto.legislacao"
                  solo
                  dense
                ></v-autocomplete>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col :md="3">
              <div class="info-label">Entidade</div>
            </v-col>
            <v-col class="mt-2">
              <v-autocomplete
                deletable-chips
                label="Selecione a(s) entidade(s) produtora(s) da documentação"
                :items="entidades"
                v-model="auto.fundo"
                solo
                dense
                chips
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>

          <div>
            <v-row>
              <v-col :md="3">
                <div class="info-label">Ficheiro classes / séries</div>
              </v-col>
              <v-col class="mt-2">
                <input type="file" id="fileSerie" accept=".csv" @change="previewFileSerie" />
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="3">
                <div class="info-label">
                  Ficheiro agregações / unidades de instalação
                </div>
              </v-col>
              <v-col class="mt-2">
                <input type="file" id="fileAgreg" accept=".csv" @change="previewFileAgreg" />
              </v-col>
            </v-row>
          </div>
          
          </br> 
          <v-btn
            class="ma-2"
            color="indigo darken-4"
            dark
            @click="submit()"
            :disabled="!fileSerie || !auto.legislacao || !auto.fundo"
            >Submeter
          </v-btn>

          <v-btn 
            class="ma-2" 
            color="red darken-4" 
            dark 
            @click="cleanFiles"
            >Limpar
          </v-btn>
          
          </br> 
          
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark
          >Pedido de importação de auto de eliminação submetido com sucesso</v-card-title
        >

        <v-card-text>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Codigo do pedido</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ codigoPedido }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fonte de Legitimação</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ auto.legislacao }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fundo</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="(f, i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="$router.push('/')">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark
          >Erro no pedido de importação de auto de eliminação</v-card-title
        >

        
        <v-card-text> </br>
          <span> <b> {{ erroTipo }} </b> </span>
          <div v-if="erro.length">
            <ol class="mt-4">
              <li v-for="(e,index) in erro">
                Não foi possível importar o <b>{{erroFile[index]}}</b> {{erroCont[index]}} <b>{{erroLinh[index]}}</b>
              </li>
            </ol>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const papa = require('papaparse')
const conversor = require("@/plugins/conversor").csv2Json;
const conversorTS = require("@/plugins/conversor").excel2JsonTS;
const validador = require("@/plugins/conversor").validarCSVs;
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades"],
  components: {
    InfoBox,
  },
  data: () => ({
    codigoPedido: "",
    auto: {
      legislacao: "",
      fundo: [],
      zonaControlo: [],
    },

    portariaLC: [],
    portaria: [],
    portariaRada: [],
    tabelasSelecao: [],
    tsRada: [],

    fundo: [],
    fileSerie: null,
    fileAgreg: null,
    tipo: "TS_LC",
    successDialog: false,
    erroDialog: false,
    erroTipo: "",
    erro: "",
    erroFile: [],
    erroCont: [],
    erroLinh: [],
    valDialog: false,
    publicPath: process.env.BASE_URL,
    myhelp: help,
  }),
  methods: {
    getTSLC: async function () {
      try {
        var response = await this.$request("get", "/tabelasSelecao");
        this.tabelasSelecao = response.data.map((ts) => {
          return {
            titulo: ts.designacao,
            codigo: ts.id.split("clav#")[1],
          };
        });
      } catch (e) {
        this.tabelasSelecao = [];
      }
    },
    getPGDLC: async function () {
      try {
        var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
        this.portariaLC = await this.prepararLeg(response.data);
      } catch (e) {
        this.portariaLC = [];
      }
    },
    getPGD: async function () {
      try {
        var response = await this.$request("get", "/legislacao?fonte=PGD");
        this.portaria = await this.prepararLeg(response.data);
      } catch (e) {
        this.portaria = [];
      }
    },
    getRADA: async function () {
      try {
        var response3 = /*await this.$request("get", "/legislacao?fonte=RADA");*/ []
        this.portariaRada = await this.prepararLeg(response3.data);
      } catch (e) {
        this.portariaRada = [];
      }
    },
    getRADACLAV: async function () {
      try {
        var response4 = await this.$request("get", "/rada");
        this.tsRada = response4.data;
      } catch (e) {
        this.tsRada = [];
      }
    },
    submit: async function () {
      var formData = new FormData();
      formData.append('tipo', this.tipo)
      formData.append('legitimacao', this.auto.legislacao)
      formData.append('entidade', this.auto.fundo)
      formData.append('file', this.fileSerie)
      formData.append('agreg', this.fileAgreg)

      this.$request("post", "/autosEliminacao/importarCSV", formData)
       .then(res => {
          this.codigoPedido = res.data.codigoPedido
          this.successDialog = true
          this.cleanFiles()
        })
        .catch(e => {
          var er = e.response.data.split("&&&")
          this.erroTipo = er[0]
          this.erro = []
          if(er[1] != '') {
            this.erro = er[1].split("%%%")
            this.erro.pop()
            for(var j=0; j < this.erro.length; j++) {
              var cont = /Não foi possível importar o (.*?\.)(.*Verifique o seu preenchimento na seguinte)(.*)/.exec(this.erro[j])
              this.erroFile.push(cont[1])
              this.erroCont.push(cont[2])
              this.erroLinh.push(cont[3])
            }         
          } 
          this.erroDialog = true
          this.cleanFiles()
        });
    },
    cleanFiles: function () {
      this.fileSerie = null;
      this.fileAgreg = null;
      document.getElementById("fileSerie").value = "";
      document.getElementById("fileAgreg").value = "";
    },
    previewFileSerie: function (ev) {
      this.fileSerie = ev.target.files[0];
      /*const reader = new FileReader();
      reader.onload = (e) => (this.fileSerie = e.target.result);
      reader.readAsArrayBuffer(file);*/
    },
    previewFileAgreg: function (ev) {
      this.fileAgreg = ev.target.files[0];
      /*const reader = new FileReader();
      reader.onload = (e) => (this.fileAgreg = e.target.result);
      reader.readAsArrayBuffer(file);*/
    },
    prepararLeg: async function (leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push(l.tipo + " " + l.numero + " - " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
  },
  created: async function () {
    try {
      var user = this.$verifyTokenUser();
      let user_entidade = await this.$request("get", "/entidades/" + user.entidade);

      this.auto.fundo.push(
        user_entidade.data.sigla + " - " + user_entidade.data.designacao
      );
    } catch (e) {
      console.log(e)
    }
  }
};
</script>

<style>
.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}
.info-label {
  color: #1a237e; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #696969;
}

.expansion-panel-heading {
  background-color: #1a237e !important;
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

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #bfbfbf !important;
    color: #ffffff73 !important;
}

.v-autocomplete__content {
  max-width: 0px;
}
</style>
