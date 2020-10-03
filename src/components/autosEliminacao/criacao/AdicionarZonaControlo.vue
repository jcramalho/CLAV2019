<template>
  <div>
    <v-row class="mx-4">
      <v-btn @click="addZC=true" dark color="indigo darken-4">Adicionar Classe</v-btn>
      <v-btn class="mx-4" @click="importAg=true" v-if="auto.zonaControlo.length>0" dark color="indigo darken-4">Importar Agregações / UI</v-btn>
      <v-btn @click="dialogAddAg=true" v-if="auto.zonaControlo.length>0" dark color="indigo darken-4">Adicionar Agregações / UI</v-btn>
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
          Depois de adicionar as classes / séries tem a possibilidade de identificar 
          as agregações / unidades de instalação que pretende eliminar
          através da importação de um ficheiro.
          <p>
            O ficheiro está disponível
            <a :href="`${publicPath}documentos/Formulario_auto_importacao_agregacoes_UI.csv`" download>aqui</a>.
          </p>
          <p>O seu preenchimento deve ser efetuado offline.</p>
          <p>
            Veja as instruções de preenchimento
            <a :href="`${publicPath}documentos/Instrucoes_preenchimento_AE_por_submissao.pdf`" download>aqui</a>.
          </p>
          <p>O formato do ficheiro tem de ser ".csv"</p>

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
    <v-dialog v-model="sucessDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="teal darken-4 title white--text"
          dark
        >Foi possível importar do ficheiro de agregações</v-card-title>

        <v-card-text>
          <p><b>Agregações adicionadas:</b></p>
          <p class="subtitle-1" v-for="(ag,index) of addedAg" :key="index" v-html="ag"></p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="sucessDialog = false; addedAg=[]">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAddAg" width="500">
      <v-card outlined>
        <v-card-title></v-card-title>
        <v-card-text>
          <p>Para inserir a informação relativa às agregações / UI deve preencher a tabela de identificação das agregações / UI que se encontra no final da área específica de cada <b>classe / série</b>.</p>
          <p>Para ter acesso a esta tabela deve abrir a área da <b>classe / série</b>, clicando na barra de identificação da <b>classe / série</b>.</p>
          <p>O preenchimento da <b>tabela das agregações / UI</b> é feito classe a classe / série a série.</p>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="indigo darken-4" text @click="dialogAddAg = false">Entendi</v-btn>
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
    sucessDialog: false,
    dialogAddAg: false,
    addedAg: [],
    erro: "",
    fileAgreg: null,
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    converter: async function() {
      conversor(this.auto.zonaControlo, this.fileAgreg, this.tipo)
        .then(async res => {
          if(res.addedAg.length>0) {
            this.auto.zonaControlo = res.zonaControlo
            this.addedAg = res.addedAg
            this.importAg = false;
            this.sucessDialog = true;
          }else {
            this.importAg = false;
            this.erro = "Não existem agregações correspondentes às classes / séries deste auto de eliminação, ou não respeitam as validações da data de contagem e/ou natureza de intervenção.";
            this.erroDialog = true;
          }
        })
        .catch(err => {
          this.erro = err;
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
