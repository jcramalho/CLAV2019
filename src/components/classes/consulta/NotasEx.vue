<template>
  <v-row>
    <!-- NOTAS DE EXCLUSÂO -->
    <v-col xs="2" sm="2">
      <div class="info-label">
        Notas de Exclusão
        <InfoBox
          header="Notas de Exclusão"
          :text="myhelp.Classe.Campos.NotasEx"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-col>
    <v-col xs="10" sm="10">
      <div class="info-content">
        <ul>
          <li v-for="n in notas" :key="n.idNota" v-html="analisaRefs(n.nota)"/>
        </ul>
      </div>
    </v-col>
  </v-row>
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
    },
  }),
  methods: {
    analisaRefs: function(nota){
      var notaHtml = nota.replace(this.codeFormats[3], '<a href=\"/classes/consultar/c$&\">$&</a>')
      notaHtml = notaHtml.replace(this.codeFormats[2], '<a href=\"/classes/consultar/c$&\">$&</a>')
      return notaHtml
    }
  }
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
