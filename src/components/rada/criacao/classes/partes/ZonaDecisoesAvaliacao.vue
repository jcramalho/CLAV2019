<template>
  <div>
    <!-- 1 -->
    <v-row>

      <v-col md="3" sm="3">
        <div class="info-label">Prazo de conservação administrativa</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          v-mask="'###'"
          v-model="newSerie.pca"
          label="Prazo em anos: 0 a 199"
          solo
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <!-- {{newSerie}} -->
      <v-col md="3" sm="3">
        <div class="info-label">Notas ao PCA</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          :rules="[v => rule_nota_PCA(v)]"
          solo
          clearable
          label="Notas ao PCA"
          v-model="newSerie.notaPCA"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 2 -->
    <FormaContagem :newSerie="newSerie" :formaContagem="formaContagem" :rules="rules" />
    <!-- 3 -->
    <JustificacaoPCA :newSerie="newSerie" :classes="classes" :rules="rules" />
    <!-- 4 -->
    <JustificacaoDF :newSerie="newSerie" :classes="classes" :rules="rules" />
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
    rule_nota_PCA(v) {
      if (this.rules && (v == null || v == "") && !Boolean(this.newSerie.pca)) {
        return "Campo obrigatório! PCA sem valor!";
      }

      return true;
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
