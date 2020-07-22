<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row
      :class="{
        'mt-7': $vuetify.breakpoint.smAndDown,
        'mt-6': $vuetify.breakpoint.mdAndUp
      }"
    >
      <!-- NOTAS DE EXCLUSÂO -->
      <v-col cols="12" lg="2">
        <div class="info-label">
          Notas de Exclusão
          <InfoBox
            header="Notas de Exclusão"
            :text="myhelp.Classe.Campos.NotasEx"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content py-4 px-2">
          <ul style="margin-bottom: 0 !important;">
            <li
              v-for="n in notas"
              :key="n.idNota"
              v-html="analisaRefs(n.nota)"
            />
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
  props: ["notas"],
  components: { InfoBox },
  data: () => ({
    myhelp: help,
    codeFormats: {
      2: /[0-9]{3}\.[0-9]{2}(?!\.)/,
      3: /[0-9]{3}\.[0-9]{2}\.[0-9]{3}(?!\.)/
    }
  }),
  methods: {
    analisaRefs: function(nota) {
      var notaHtml = nota.replace(
        this.codeFormats[3],
        '<a href="/classes/consultar/c$&">$&</a>'
      );
      notaHtml = notaHtml.replace(
        this.codeFormats[2],
        '<a href="/classes/consultar/c$&">$&</a>'
      );
      return notaHtml;
    }
  }
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
