<template>
  <v-card class="ma-4" style="background-color:#fafafa">
    <v-card-title
      class="indigo darken-4 white--text"
    >Importar Relatório de Avaliação de Documentação Acumulada</v-card-title>
    <v-card-text>
      <v-row>
        <v-col md="3" sm="3">
          <div class="info-label">Ficheiro</div>
        </v-col>
        <v-col sm="9" md="9">
          <!-- <v-file-input
            placeholder="Selecione o ficheiro a submeter"
            v-model="ficheiro"
            show-size
            clearable
            single-line
            accept="*"
            solo
          ></v-file-input>-->
          <input type="file" id="fileRADA" ref="myFiles" @change="previewFileRADA" />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col sm="1" md="1">
          <v-btn @click="importar">Importar</v-btn>
        </v-col>
      </v-row>
      <v-alert :value="erroDialog" dense outlined type="error">{{ erro }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
const conversor = require("@/plugins/conversorRADA").excel2Json;

export default {
  data: () => ({
    ficheiro: null,
    erro: "",
    erroDialog: false
  }),
  methods: {
    importar() {
      conversor(this.ficheiro)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    previewFileRADA(ev) {
      const file = ev.target.files[0];
      var fileName = file.name.split(".");
      if (fileName[fileName.length - 1] == "xls") {
        const reader = new FileReader();
        reader.onload = e => (this.ficheiro = e.target.result);
        reader.readAsArrayBuffer(file);
      } else {
        ev.target.value = "";
        this.erro = "Por favor verifique se o ficheiro está no formato .xls";
        this.erroDialog = true;
        this.ficheiro = null;

        setTimeout(() => {
          this.erroDialog = false;
        }, 3000);
      }
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  height: 35px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>