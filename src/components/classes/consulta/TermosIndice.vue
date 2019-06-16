<template>
  <v-layout wrap ma-2>
    <!-- TERMOS DE ÍNDICE -->
    <v-flex xs2>
      <div class="info-label">
        Termos de Índice
        <InfoBox
          header="Termos de Índice"
          :text="myhelp.Classe.Campos.TermosIndice"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-flex>
    <v-flex xs10>
      <div class="info-content">
        <ul>
          <li v-for="t in termos" :key="t.idTI">
            {{ t.termo }}
          </li>
        </ul>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["termos"],
  components: { InfoBox },
  data: () => ({
    myhelp: help
  })
};
</script>

<style>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>
