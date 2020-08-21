<template>
  <div>
    <v-row class="mx-4">
      <v-btn @click="addZC=true" dark color="indigo darken-4">Adicionar Classe</v-btn>
      <v-btn class="mx-4" @click="importAg=true" v-if="auto.zonaControlo.length>0" dark color="indigo darken-4">Importar Agregações / UI</v-btn>
    </v-row>
    <v-dialog v-model="addZC">
      <DialogZonaControlo
        v-bind:auto="auto"
        v-bind:classes="classes"
        v-bind:entidades="entidades"
        v-bind:closeZC="closeZC"
        v-bind:classesCompletas="classesCompletas"
        v-bind:donos="donos"
        v-bind:tipo="tipo"
      />
    </v-dialog>
    <v-dialog v-model="importAg" width="900">
      <v-card outlined>
        <v-card-title
          class="teal darken-4 title white--text"
          dark
        >
        Importar ficheiro de Agregações / Unidades de instalação
        </v-card-title>

        <v-card-text class="mt-4">
          A Plataforma CLAV permite a submissão de Autos de Eliminação (AE) através da
          importação de ficheiros. Para tal são disponibilizados este formulário que
          devem ser preenchidos previamente offline:
          <li>
            um formulário para as agregações simples / unidades de instalação (veja
            <a :href="`${publicPath}documentos/FormularioAE_UI.csv`" download>aqui</a>)
          </li>
          <v-row>
            <v-col :md="3">
              <div class="info-label">Ficheiro Agregações / Unidades de instalação</div>
            </v-col>
            <v-col class="mt-2">
              <input type="file" id="fileAgreg" ref="myFiles" @change="previewFileAgreg" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="importAg = false" color="indigo darken-4" dark class="ma-2">Fechar</v-btn>
          <v-btn class="ma-2" color="indigo darken-4" dark @click="converter()" :disabled="!fileAgreg">Validar Ficheiro e Continuar</v-btn>  
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Não foi possível importar o ficheiro de agregações</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
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
import DialogZonaControlo from "@/components/autosEliminacao/criacao/DialogZonaControlo.vue"
const conversor = require("@/plugins/conversor").csv2JsonAg;

export default {
  props: ["classes", "entidades", "auto", "classesCompletas","donos","tipo"],
  components: {
    DialogZonaControlo
  },
  data: () => ({
    addZC: false,
    importAg: false,
    erroDialog: false,
    erro: "",
    fileAgreg: null,
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    converter: async function() {
      conversor(this.auto.zonaControlo, this.fileAgreg)
        .then(async res => {
          this.auto.zonaControlo = res.zonaControlo
          this.importAg = false;
        })
        .catch(err => {
          this.erroDialog = err;
          this.erroDialog = true;
        })
    },
    previewFileAgreg: function(ev) {
      const file = ev.target.files[0];
      var fileName = file.name.split(".");
      if (fileName[fileName.length - 1] == "csv") {
        const reader = new FileReader();
        reader.onload = e => (this.fileAgreg = e.target.result);
        reader.readAsArrayBuffer(file);
      } else {
        ev.target.value = "";
        this.erro =
          "Por favor verifique se o ficheiro está no formato <strong>.csv</strong>";
        this.erroDialog = true;
        this.fileAgreg = null;
      }
    },
    closeZC: function () {
      this.addZC = false
    }
  }
};
</script>
