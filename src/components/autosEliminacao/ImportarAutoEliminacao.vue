<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm20>
        <v-card class="panel panel-default panel-custom">
          <v-toolbar class="panel-heading">
            <v-toolbar-title class="page-header">
              <h1>Novo Auto de Eliminação</h1>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="panel-body">
            <div>
              <table
                class="adicao"
                style="border-color: white; border-style:solid; margin-bottom:20px;"
              >
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Fonte de Legitimação:</div>
                  </td>
                  <td style="width:40%">
                    <v-radio-group row v-model="tipo" :mandatory="true">
                      <v-radio xs4 sm4 label="PGD/LC" value="PGD/LC"></v-radio>
                      <v-radio xs4 sm4 label="PGD" value="PGD"></v-radio>
                      <v-radio xs4 sm4 label="RADA" value="RADA"></v-radio>
                    </v-radio-group>
                    <a
                      v-if="tipo === 'PGD/LC'"
                      :href="
                        `${publicPath}documentos/Ficheiro_submissão_PGD_LC.xlsx`
                      "
                    >
                      Transferir ficheiro de submissão
                    </a>
                    <a
                      v-else
                      :href="
                        `${publicPath}documentos/Ficheiro_submissão_${tipo}.xlsx`
                      "
                    >
                      Transferir ficheiro de submissão
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Ficheiro:</div>
                  </td>
                  <td>
                    <div>
                      <input
                        type="file"
                        id="file"
                        ref="myFiles"
                        @change="previewFiles"
                      />
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </v-card-text>
        </v-card>
        <div style="text-align:center">
          <v-btn medium color="primary" @click="submit" :disabled="!file">
            Submeter Auto de Eliminação
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
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Não foi possível criar o pedido de criação de tabela de seleção
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
const conversor = require("@/plugins/conversor").excel2Json;
const conversorTS = require("@/plugins/conversor").excel2JsonTS;

export default {
  data: () => ({
    file: null,
    tipo: "PGD/LC",
    successDialog: false,
    success: "",
    erroDialog: false,
    erro: "",
    publicPath: process.env.BASE_URL
  }),
  methods: {
    submit: async function() {
      conversor(this.file, this.tipo)
        .then(res => {
          console.warn(res);
          this.$request("post", "/api/autosEliminacao/" + this.tipo, {
            auto: res.auto,
            token: this.$store.state.token
          })
            .then(r => {
              this.successDialog = true;
              this.success = `<b>Agregações não adicionadas devido a data contagem inferior à data atual:</b>\n${JSON.stringify(
                res.error
              )}\n\n<b>Código do pedido:</b>\n${JSON.stringify(res.auto)}`;
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
    },
    previewFiles: function(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => (this.file = e.target.result);
      reader.readAsArrayBuffer(file);
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
