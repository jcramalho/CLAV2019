<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm20>
        <v-card class="panel panel-default panel-custom">
          <v-toolbar class="panel-heading">
            <v-toolbar-title class="page-header"
              ><h1>Novo Auto de Eliminação</h1></v-toolbar-title
            >
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
                        <v-radio xs4 sm4 label="PGD/LC" value="TS"></v-radio>
                        <v-radio xs4 sm4 label="PGD" value="PGD"></v-radio>
                        <v-radio xs4 sm4 label="RADA" value="RADA"></v-radio>
                    </v-radio-group>
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
                        @change="previewFiles">
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
            :disabled="!(file)"
            >Submeter Auto de Eliminação</v-btn
          >
        </div>
        {{ obj }}
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="snack"
      :color="snackColor"
    >
      {{ mess }}
      <v-btn
        dark
        text
        @click="snack = false;"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>

import axios from "axios";
const lhost = require("@/config/global").host;
const conversor = require("@/plugins/conversor").excel2Json;
const conversorTS = require("@/plugins/conversor").excel2Json;

export default {
  data: () => ({
    file: null,
    tipo: "ts",
    snack: false,
    snackColor: "green",
    mess: "",
    obj: "",
  }),
  methods: {
    submit: async function() {
      switch(this.tipo) {
        case "ts": 
          conversorTS(this.file)
            .then(res => {
              console.warn("TS")
              console.warn(res)
            })
            .catch(err => {
              console.warn(err)
            })
          break;
        default:
          conversor(this.file)
          .then(res => {
            axios.post(lhost + "/api/autosEliminacao/"+this.tipo, {auto: res.auto, token: this.$store.state.token})
              .then(r => {
                this.snack = true
                this.mess = r.data
                this.snackColor = "green"
              })
              .catch((err) => {
                this.snack = true
                this.mess = "Erro na atualização do AE"
                this.snackColor = "red"
              })
          })
          .catch(err => {
            console.warn(err)
          })
      }
    },
    previewFiles: function(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => this.file = e.target.result;
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
