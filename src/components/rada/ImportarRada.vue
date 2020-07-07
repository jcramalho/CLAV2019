<template>
  <v-card class="ma-4" style="background-color:#fafafa">
    <v-card-title
      class="indigo darken-4 white--text"
    >Importar Relatório de Avaliação de Documentação Acumulada</v-card-title>
    <v-card-text>
      <v-row justify="end">
        <v-col md="3" sm="3">
          <div class="info-label">Ficheiro</div>
        </v-col>
        <v-col sm="9" md="9">
          <v-file-input
            placeholder="Selecione o ficheiro a submeter"
            show-size
            clearable
            single-line
            solo
            @change="transformar_buffer"
            :rules="[v => v == undefined || v.name.split('.')[1] == 'xls' || v.name.split('.')[1] == 'xlsx' || 'Ficheiro no formato errado. Apenas .xls ou .xlsx.']"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col sm="1" md="1">
          <v-btn :disabled="!ficheiro" @click="importar">Importar</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
const conversor = require("@/plugins/conversorRADA").excel2Json;

export default {
  data: () => ({
    ficheiro: null,
    erroDialog: false,
    reader: null
  }),
  methods: {
    importar() {
      conversor(this.ficheiro)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    transformar_buffer(file) {
      if (file) {
        this.erroDialog = false;
        let extensao = file.name.split(".")[1];

        if (extensao == "xls" || extensao == "xlsx") {
          this.reader.onload = e => (this.ficheiro = e.target.result);
          this.reader.readAsArrayBuffer(file);
        } else {
          this.ficheiro = null;
          this.erroDialog = true;
        }
      } else {
        this.ficheiro = null;
      }
    }
  },

  created() {
    this.reader = new FileReader();
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