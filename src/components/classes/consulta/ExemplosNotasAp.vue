<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row
      :class="{
        'mt-7': $vuetify.breakpoint.smAndDown,
        'mt-6': $vuetify.breakpoint.mdAndUp
      }"
    >
      <!-- EXEMPLOS DE NOTAS DE APLICAÇÂO -->
      <v-col cols="12" lg="2">
        <div class="info-label">
          Exemplos de Notas de Aplicação
          <InfoBox
            header="Exemplos de Notas de Aplicação"
            :text="myhelp.Classe.Campos.ExemplosNotasAp"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content py-4 px-2">
          <ul style="margin-bottom: 0 !important;">
            <li v-for="e in exemplos" :key="e.idExemplo">
              {{ e.exemplo }}
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
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

<style scoped>
.info-label {
  color: #1a237e;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
