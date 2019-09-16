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
  </v-container>
</template>

<script>

import axios from "axios";
const lhost = require("@/config/global").host;
const conversor = require("@/plugins/conversor").excel2Json;

export default {
  data: () => ({
    file: null,
    obj: "",
  }),
  methods: {
    submit: async function() {
        this.obj = await conversor(this.file)
        console.log(this.obj)
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
