<template>
  <v-row justify="end">
    <v-col md="3" sm="3">
      <div class="info-label">{{ label }}</div>
    </v-col>
    <v-col sm="9" md="9">
      <v-file-input
        placeholder="Selecione o ficheiro a submeter"
        show-size
        clearable
        single-line
        solo
        @change="transformar_buffer"
      ></v-file-input>
      <!-- :rules="[v => v == undefined || v.name.split('.')[1] == 'csv' || 'Ficheiro no formato errado. Apenas .xls ou .xlsx.']" -->
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["label"],
  data: () => ({
    ficheiro: null,
    erroDialog: false
  }),
  methods: {
    transformar_buffer(file) {
      if (file) {
        this.erroDialog = false;
        let extensao = file.name.split(".")[1];

        if (extensao == "xlsx") {
          let reader = new FileReader();
          reader.onload = e => (this.ficheiro = e.target.result);
          reader.readAsArrayBuffer(file);
          console.log("fiz emit", this.ficheiro, file);
          this.$emit("ficheiro", this.ficheiro);
        } else {
          console.log("nao");
          this.ficheiro = null;
        }
      } else {
        console.log("nao");
        this.ficheiro = null;
      }
    }
  },
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