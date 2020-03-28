<template>
  <div>
    <!-- 1 -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Prazo de Conservação Administrativa</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          :rules="[v => rulePCA(v)]"
          v-model="newSerie.pca"
          label="Prazo de Conservação Administrativa"
          solo
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 2 -->
    <FormaContagem :newSerie="newSerie" :formaContagem="formaContagem" />
    <!-- 3 -->
    <JustificacaoPCA :newSerie="newSerie" :classes="classes" />
    <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    <!-- 4 -->
    <JustificacaoDF :newSerie="newSerie" :classes="classes" />
    <!-- 5 -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Notas</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field solo clearable v-model="newSerie.notas" label="Notas"></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import JustificacaoPCA from "./JustificacaoPCA";
import FormaContagem from "./FormaContagem";
import JustificacaoDF from "./JustificacaoDF";

export default {
  props: ["newSerie", "classes", "formaContagem"],
  components: {
    JustificacaoPCA,
    FormaContagem,
    JustificacaoDF
  },
  methods: {
    rulePCA: function(v) {
      if (v == "" || v == null) {
        if (this.newSerie.tipo == "Subsérie") {
          return "Campo Obrigatório";
        } else {
          return true;
        }
      } else {
        if (!isNaN(parseInt(v)) && parseInt(v) >= 0) {
          return true;
        } else {
          return "Valor tem que ser inteiro.";
        }
      }
    }
  }
};
</script>

<style scoped>
.info-content {
  padding-right: 20px;
  border: 1px solid #e0e0e0;
}
</style>