<template>
  <div>
    <v-card flat class="pa-3">
      <p class="clav-content-title-1">Importar Auto de Eliminação (JSON / XML)</p>
      <v-card-text class="panel-body">
        <div class="ma-3">
          A Plataforma CLAV permite a submissão de Autos de Eliminação (AE) através da
          importação de ficheiros. Para tal são disponibilizados dois tipos de formulários, 
          para cada formato, que devem ser preenchidos previamente offline:
          <li class="ml-6">
            Um formulário para ficheiro JSON (veja
            <a
              :href="`${publicPath}documentos/AE-IMT.json`"
              download
              >aqui</a
            >)
          </li>
          <li class="ml-6">
            um formulário para ficheiro XML (veja
            <a
              :href="`${publicPath}documentos/AE-IMT.xml`"
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
          
          <div>
            <v-row>
              <v-col :md="3">
                <div class="info-label">Tipo de ficheiro a importar:</div>
              </v-col>
              <v-col class="mt-2">
                <v-radio-group v-model="tipo" row hide-details class="mt-1">
                  <v-radio
                    v-for="(n, i) in ['JSON', 'XML']"
                    :key="i"
                    :label="n"
                    :value="n"
                    color="blue"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </div>

          <div>
            <v-row>
              <v-col :md="3">
                <div class="info-label">Ficheiro</div>
              </v-col>
              <v-col v-if="tipo=='JSON'"class="mt-2">
                <input type="file" id="file" accept=".json" @change="previewFile" />
              </v-col>
              <v-col v-else class="mt-2">
                <input type="file" id="file" accept=".xml" @change="previewFile" />
              </v-col>
            </v-row>
          </div>

          <div>
            <v-tooltip top color="info">
              <template v-slot:activator="{ on }">
                <v-checkbox
                  class="py-5 mt-5"
                  v-model="checkInfo"
                  label=" O auto de eliminação em submissão respeita todas as regras contidas na respetiva fonte de legitimação, nomeadamente a informação contida nos campos 'Notas ao PCA' e 'Notas ao DF'"
                  v-on="on"
                ></v-checkbox>
              </template>
            </v-tooltip>
          </div>

          <v-btn
            class="ma-2"
            color="green darken-4"
            dark
            @click="submit()"
            :disabled="!file || !checkInfo"
            >Submeter
          </v-btn>

          <v-btn 
            class="ma-2" 
            color="red darken-4" 
            dark 
            @click="cleanFiles"
            >Limpar
          </v-btn>
          
          <br/> 
          
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

        <v-card-text>
          </br>
          <span> <b> {{ erroTipo }} </b> </span>
          <div v-if="erros.length">
            <ol class="mt-4">
              <li v-for="(e,index) in erros" :key="index">
                {{e}}
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
import CampoAE from "@/components/generic/CampoAE.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades"],
  components: {
    CampoAE,
  },
  data: () => ({
    codigoPedido: "",
    auto: {
      fundo: [],
    },

    file: null,
    tipo: "JSON",
    
    checkInfo: false, 
  
    successDialog: false,
    erroDialog: false,
    erroTipo: "",
    erros: [],

    valDialog: false,
    publicPath: process.env.BASE_URL,
    myhelp: help,
  }),
  methods: {
    submit: async function () {

      var formData = new FormData();
      formData.append('file', this.file)

      if(this.tipo == "JSON") {
        this.$request("post", "/autosEliminacao/importarJSON", formData)
        .then(res => {
            this.codigoPedido = res.data.codigoPedido
            this.successDialog = true
            this.cleanFiles()
          })
          .catch(e => {
            this.erros = e.response.data.erros
            this.erroTipo = e.response.data.mensagem
            this.erroDialog = true
            this.cleanFiles()
          });
      } else {
        this.$request("post", "/autosEliminacao/importarXML", formData)
        .then(res => {
            this.codigoPedido = res.data.codigoPedido
            this.successDialog = true
            this.cleanFiles()
          })
          .catch(e => {
            this.erros = e.response.data.erros
            this.erroTipo = e.response.data.mensagem
            this.erroDialog = true
            this.cleanFiles()
          });
      }
      
    },
    cleanFiles: function () {
      this.file= null;
      document.getElementById("file").value = "";
    },
    previewFile: function (ev) {
      this.file = ev.target.files[0];
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
