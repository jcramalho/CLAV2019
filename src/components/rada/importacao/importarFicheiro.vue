<template>
  <v-row>
    <v-col cols="3">
      <div class="info-label">{{ label }}</div>
    </v-col>
    <v-col>
      <v-file-input
        placeholder="Selecione o ficheiro a submeter"
        show-size
        clearable
        single-line
        solo
        @change="transformar_buffer"
        :rules="[v => ficheiroValido(v)]"
      ></v-file-input>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["label"],
  data: () => ({
    reader: null,
  }),
  methods: {
    transformar_buffer(file) {
      if (file) {
        let extensao = file.name.split(".")[1];

        if (extensao == "csv") {
          this.reader.onload = (e) => {
            this.$emit("ficheiro", e.target.result);
          };
          this.reader.readAsText(file);
        }
      }
    },
    ficheiroValido(v) {
      if (!!v) {
        if (v.name.split(".")[1] != "csv") {
          return "Ficheiro no formato errado. Apenas .csv";
        }
        return true;
      } else {
        return "Campo Obrigatório!";
      }
    },
  },
  created() {
    this.reader = new FileReader();
  },
};
</script>

<style scoped>
.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  height: auto;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>