<template>
  <div>
    <!-- 1 -->
    <v-row>
      <!-- {{newSerie}} -->
      <v-col md="3" sm="3">
        <div class="info-label">Prazo de Conservação Administrativa</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          :rules="[v => rule(v)]"
          type="number"
          v-model="newSerie.pca"
          label="Prazo de Conservação Administrativa"
          solo
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 2 -->
    <FormaContagem :newSerie="newSerie" :formaContagem="formaContagem" :rules="rules" />
    <!-- 3 -->
    <JustificacaoPCA :newSerie="newSerie" :classes="classes" :rules="rules" />
    <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    <!-- 4 -->
    <JustificacaoDF :newSerie="newSerie" :classes="classes" :rules="rules" />
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
  props: ["newSerie", "classes", "formaContagem", "rules"],
  components: {
    JustificacaoPCA,
    FormaContagem,
    JustificacaoDF
  },
  methods: {
    rule(v) {
      if (this.rules && v == null) {
        return "Campo Obrigatório";
      } else {
        return true;
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