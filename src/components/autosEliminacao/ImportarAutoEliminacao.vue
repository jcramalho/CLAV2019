<template>
  <div>
        <v-card class="ma-4">
          <v-app-bar color="expansion-panel-heading" dark>
            <v-toolbar-title class="card-heading">
              Importar Auto de Eliminação
            </v-toolbar-title>
          </v-app-bar>
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
            <v-row>
              <v-col :md="3">
                <div class="info-label">Fonte de legitimação<InfoBox
                        header="Fonte de Legitimação"
                        :text="myhelp.AutoEliminacao.Campos.FonteLegitimacao"
                        helpColor="indigo darken-4"
                        dialogColor="#E0F2F1"
                      /></div>
              </v-col>
              <v-col>
                <v-radio-group row v-model="tipo" :mandatory="true">
                      <v-radio value="PGD_LC">
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
                      <v-radio value="PGD">
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
                      <v-radio value="RADA">
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
                        :items="portariaLC"
                        v-model="auto.legislacao"
                        solo
                        dense
                      ></v-autocomplete>
                    </div>
                    <div v-else-if="tipo=='PGD'">
                      <v-autocomplete
                        label="Selecione a fonte de legitimação"
                        :items="portaria"
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
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="3">
                <div class="info-label">Fundo</div>
              </v-col>
              <v-col class="mt-2">
                <v-autocomplete
                        label="Selecione a entidade responsável pelo fundo"
                        :items="entidades"
                        v-model="auto.fundo"
                        solo
                        dense
                        chips
                        multiple
                      ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="3">
                    <div class="info-label">Ficheiro série</div>
              </v-col>
              <v-col class="mt-2">
                      <input
                        type="file"
                        id="fileSerie"
                        ref="myFiles"
                        @change="previewFileSerie"
                      />
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="3">
                    <div class="info-label">Ficheiro Agregações / Unidades de instalação</div>
                  </v-col>
              <v-col class="mt-2">
                      <input
                        type="file"
                        id="fileAgreg"
                        ref="myFiles"
                        @change="previewFileAgreg"
                      />
              </v-col>
            </v-row>
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
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Pedido de importação de auto de eliminação submetido com sucesso
        </v-card-title>

        <v-card-text>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fonte de Legitimação:</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ auto.legislacao }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fundo:</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="(f,i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="2">
              <div class="info-label">Ficheiro de Série</div>
            </v-col>

            <v-col class="info-content">
              <div>Ficheiro em anexo validado com sucesso!</div>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="2">
              <div class="info-label">Ficheiro Agregações / Unidades de Instalação</div>
            </v-col>

            <v-col class="info-content">
              <div>Ficheiro em anexo validado com sucesso!</div>
            </v-col>
          </v-row>
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
  </div>
</template>

<script>
const conversor = require("@/plugins/conversor").csv2Json;
const conversorTS = require("@/plugins/conversor").excel2JsonTS;
const validador = require("@/plugins/conversor").validarCSVs;
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades","classes"],
  components: {
    InfoBox
  },
  data: () => ({
    auto: {
      legislacao: "",
      fundo: [],
      zonaControlo: []
    },
    portariaLC: [],
    portaria: [],
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
        this.erro = "Por favor verifique se o ficheiro está no formato <strong>.csv</strong>"
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
        this.erro = "Por favor verifique se o ficheiro está no formato <strong>.csv</strong>"
        this.erroDialog = true;
        this.fileAgreg = null;
      }
    },
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push("Portaria " + l.numero + " \n " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    }
  },
  created: async function() {
    try{
      var response = await this.$request("get","/legislacao?fonte=PGD/LC")
      this.portariaLC = await this.prepararLeg(response.data)
      var response2 = await this.$request("get","/legislacao?fonte=PGD")
      this.portaria = await this.prepararLeg(response2.data)
    } catch (e) {
      this.portariaLC = [];
      this.portaria = [];
    }
  },
  watch: {
    'tipo': function () {
      this.auto.legislacao = null
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
</style>
