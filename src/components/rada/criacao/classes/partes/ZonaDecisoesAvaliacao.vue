<template>
  <div>
    <!-- 1 -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Prazo de Conservação Administrativa</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field
          :rules="[v => rulePCA(v)]"
          v-model="newSerie.pca"
          label="Prazo de Conservação Administrativa"
          solo
          clearable
        ></v-text-field>
      </v-col>
      <v-col md="3" sm="3">
        <div class="info-label">Forma de Contagem do PCA</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field
          :rules="[v => exist(v)]"
          v-model="newSerie.formaContagem"
          label="Forma de Contagem"
          solo
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 2 -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Justificação do PCA</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          :rules="[v => exist(v)]"
          v-model="newSerie.justicacaoPCA"
          label="Justificação do PCA"
          solo
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 3 -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Destino Final</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-select
          :rules="[v => exist(v)]"
          v-model="newSerie.df"
          :items="['Conservação', 'Conservação Parcial', 'Eliminação']"
          label="Destino Final"
          solo
          clearable
        >
          <template v-slot:selection="data">
            <v-chip>
              <v-avatar
                v-if="data.item != 'Conservação Parcial'"
                left
                color="amber accent-3"
              >{{ data.item[0] }}</v-avatar>
              <v-avatar v-else left color="amber accent-3">CP</v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-select>
      </v-col>
      <v-col md="3" sm="3">
        <div class="info-label">Justificação do DF</div>
      </v-col>
      <v-col sm="3" md="3">
        <v-text-field
          :rules="[v => exist(v)]"
          solo
          clearable
          v-model="newSerie.justicacaoDF"
          label="Justificação do DF"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 4 -->
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
export default {
  props: ["newSerie"],
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
    },
    exist(v) {
      if (this.newSerie.tipo == "Subsérie" && (v == "" || v == null)) {
        return "Campo Obrigatório";
      } else {
        return true;
      }
    }
  }
};
</script>
