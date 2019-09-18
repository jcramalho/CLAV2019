<template>
  <v-row>
    <!-- EXEMPLOS DE NOTAS DE APLICAÇÂO -->
    <v-col xs="2" sm="2">
      <div class="info-label">
        Exemplos de Notas de Aplicação
        <InfoBox
          header="Exemplos de Notas de Aplicação"
          :text="myhelp.Classe.Campos.ExemplosNotasAp"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-col>
    <v-col xs="10" sm="10">
      <div class="info-content">
        <ul>
          <li v-for="e in exemplos" :key="e.idExemplo">
            {{ e.exemplo }}
          </li>
        </ul>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["exemplos"],
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
