<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm20>
        <v-card class="panel panel-default panel-custom">
          <v-toolbar class="panel-heading">
            <v-toolbar-title class="page-header">
              <h1>Importar Auto de Eliminação</h1>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="panel-body">
            <div class="ma-3">
              A Plataforma CLAV permite a submissão de Autos de Eliminação (AE) através da
              importação de ficheiros. Para tal são disponibilizados dois tipos de formulários que
              devem ser preenchidos previamente offline:

              <li>Um formulário para as séries (veja <a :href="`${publicPath}documentos/FormularioAE_SERIE.csv`" download>aqui</a>)</li>
              <li>um formulário para as agregações simples / unidades de instalação (veja <a :href="`${publicPath}documentos/FormularioAE_UI.csv`" download>aqui</a>)</li>

              <p>
                Consulte
                <a
                  :href="
                    `${publicPath}documentos/Instrucoes_preenchimento_AE_por_submissao.pdf`
                  "
                >
                  aqui
                </a>
                as instruções de preenchimento.
              </p>
            </div>
            <div>
              <table
                class="adicao"
                style="border-color: white; border-style:solid; margin-bottom:20px;"
              >
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">
                      Fonte de Legitimação
                      <InfoBox
                        header="Fonte de Legitimação"
                        :text="myhelp.AutoEliminacao.Campos.FonteLegitimacao"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      />
                    </div>
                  </td>
                  <td style="width:40%">
                    <v-radio-group row v-model="tipo" :mandatory="true">
                      <v-radio xs4 sm4 value="PGD_LC">
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
                      <v-radio xs4 sm4 value="PGD">
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
                      <v-radio xs4 sm4 value="RADA">
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
                    </v-radio-group>
                    <div v-if="tipo=='PGD_LC'">
                      <v-autocomplete
                        label="Selecione a fonte de legitimação"
                        :items="portarias"
                        v-model="auto.legislacao"
                        solo
                        dense
                      ></v-autocomplete>
                    </div>
                    <div v-else>
                      <v-text-field v-model="auto.legislacao" solo dense label="Indique a fonte de legitimação"></v-text-field>
                    </div>
                    <div style="width:100%">
                      Para submeter um auto de eliminação, selecione os ficheiros
                      que preencheu e guardou previamente.
                    </div>
                    <div>
                      Em seguida, para concluir, execute o comando
                      <strong>SUBMETER AUTO DE ELIMINAÇÃO</strong>.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Fundo</div>
                  </td>
                  <td style="width:40%;">
                    <div>
                      <v-autocomplete
                        label="Selecione a entidade responsável pelo fundo"
                        :items="entidades"
                        v-model="auto.fundo"
                        solo
                        dense
                        chips
                        multiple
                      ></v-autocomplete>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Ficheiro série</div>
                  </td>
                  <td style="width:40%">
                    <div>
                      <input
                        type="file"
                        id="fileSerie"
                        ref="myFiles"
                        @change="previewFileSerie"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Ficheiro Agregações / Unidades de instalação</div>
                  </td>
                  <td style="width:40%">
                    <div>
                      <input
                        type="file"
                        id="fileAgreg"
                        ref="myFiles"
                        @change="previewFileAgreg"
                      />
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </v-card-text>
        </v-card>
        <div style="text-align:center">
          <v-btn
            medium
            color="primary"
            @click="submit"
            :disabled="!fileSerie || !fileAgreg || !auto.fundo || !auto.legislacao"
            class="ma-2"
          >
            Submeter Auto de Eliminação
          </v-btn>
          <v-btn
            medium
            color="warning"
            @click="validar"
            :disabled="!fileSerie || !fileAgreg"
            class="ma-2"
          >
            Validar Auto de Eliminação
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Pedido de criação de auto de eliminação criado com sucesso
        </v-card-title>

        <v-card-text>
          <span
            class="subtitle-1"
            style="white-space: pre-wrap"
            v-html="success"
          >
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="$router.push('/')">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="valDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Validação de auto de eliminação executada com sucesso
        </v-card-title>

        <v-card-text>
          <span
            class="subtitle-1"
            style="white-space: pre-wrap"
            v-html="success"
          >
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="valDialog=false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errosValDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="title" dark>
          Ficheiros anexo com {{errosVal.numErros}} erros
        </v-card-title>

        <v-card-text v-if="errosVal.erros">
          <v-row ma-2 v-for="(m, i) in errosVal.erros" :key="i">
            <v-col cols="4">
              <div class="info-label">{{ m.sobre }}</div>
            </v-col>
            <v-col class="info-content">
              <div>{{ m.mensagem }}</div>
              <div></div>
              <div v-if="m.linhasSerie && m.linhasSerie.length>0">Erro em ficheiro Classe / Série nas linhas: <span v-for="l in m.linhasSerie" :key="l">{{l}}; </span></div>
              <div v-if="m.linhasUI && m.linhasUI.length>0">Erro em ficheiro Agregações / UI nas linhas: <span v-for="l in m.linhasUI" :key="l">{{l}}; </span></div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          <div>{{errosVal.msg}}</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="errosValDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Não foi possível criar o pedido de criação de auto de eliminação
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro">
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const conversor = require("@/plugins/conversor").csv2Json;
const conversorTS = require("@/plugins/conversor").excel2JsonTS;
const validador = require("@/plugins/conversor").validarCSVs;
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["portarias","entidades","classes"],
  components: {
    InfoBox
  },
  data: () => ({
    auto: {
      legislacao: "",
      fundo: [],
      zonaControlo: []
    },
    fileSerie: null,
    fileAgreg: null,
    tipo: "PGD_LC",
    flagAE: false,
    successDialog: false,
    success: "",
    erroDialog: false,
    erro: "",
    errosValDialog: false,
    errosVal: {
      erros: [],
      numErros: 0
    },
    valDialog: false,
    publicPath: process.env.BASE_URL,
    myhelp: help
  }),
  methods: {
    validar: async function() {
      validador(this.fileSerie, this.fileAgreg, this.tipo)
        .then(res => {
          this.valDialog = true;
          this.success = res;
        })
        .catch(err => {
          this.errosVal = err;
          this.errosValDialog = true;
        })
    },
    submit: async function() {
      validador(this.fileSerie, this.fileAgreg, this.tipo)
        .then(()=> {
          conversor(this.fileSerie, this.fileAgreg, this.tipo)
          .then(res => {
            const eliminacao = res.auto
            eliminacao.fundo = this.auto.fundo
            eliminacao.legislacao = this.auto.legislacao
            if(this.tipo=="PGD_LC") {
              //VERIFICA AS CLASSES DA LC
              eliminacao.zonaControlo.forEach( zc => {
                var classe = this.classes.find(elem => elem.codigo == zc.codigo) 
                if(!classe) {
                  this.flagAE = true;
                  this.erro = "Codigo da classe <b>"+zc.codigo+"</b> não foi encontrado na Lista Consolidada"
                  return; //ERROS
                }

                delete zc["referencia"]
                zc.titulo = classe.titulo
                zc.prazoConservacao = classe.pca.valores
                zc.destino = classe.df.valor
              })
            }
            if(this.flagAE) this.erroDialog = true
            else 
              this.$request("post", "/autosEliminacao?tipo=" + this.tipo, {
                auto: eliminacao
              })
              .then(r => {
                this.successDialog = true;
                this.success = `<b>Código do pedido:</b>\n${JSON.stringify(eliminacao)}`;
              })
              .catch(e => {
                this.erro = e.response.data;
                this.erroDialog = true;
              });
          })
          .catch(err => {
            this.erro = err;
            this.erroDialog = true;
          });
        })
        .catch(err => {
          this.errosVal = err;
          this.errosValDialog = true;
        })
    },
    previewFileSerie: function(ev) {
      const file = ev.target.files[0];
      var fileName = file.name.split(".")
      if(fileName[fileName.length-1] == "csv") {
        const reader = new FileReader();
        reader.onload = e => (this.fileSerie = e.target.result);
        reader.readAsArrayBuffer(file);
      }
      else {
        ev.target.value = ""
        this.erro = "Porfavor verifique se o ficheiro está no formato <strong>.csv</strong>"
        this.erroDialog = true;
        this.fileSerie = null;
      }

    },
    previewFileAgreg: function(ev) {
      const file = ev.target.files[0];
      var fileName = file.name.split(".")
      if(fileName[fileName.length-1] == "csv") {
        const reader = new FileReader();
        reader.onload = e => (this.fileAgreg = e.target.result);
        reader.readAsArrayBuffer(file);
      }
      else {
        ev.target.value = ""
        this.erro = "Porfavor verifique se o ficheiro está no formato <strong>.csv</strong>"
        this.erroDialog = true;
        this.fileAgreg = null;
      }
    }
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}

.adicao tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.adicao td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.adicao td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
