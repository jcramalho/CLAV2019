<template>
  <!-- BLOCO DESCRITIVO -->
  <v-expansion-panel popout focusable>
    <v-expansion-panel-header  class="expansion-panel-heading">
      <div>
        Identificação da Classe
      </div>
      <template v-slot:actions>
        <v-icon color="white">expand_more</v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
    <!-- IDENTIFICAÇÃO -->
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Nível
          </div>
        </v-col>
        <v-col>
          <v-text-field readonly :value="c.nivel" solo></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Título
          </div>
        </v-col>
        <v-col>
          <v-text-field v-model="c.titulo" solo></v-text-field>
        </v-col>
      </v-row>

    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>

export default {
  props: ["c"],

  data() {
    return {
     
    };
  }
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E; 
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
