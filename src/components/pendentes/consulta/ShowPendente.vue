<template>
  <v-card class="ma-8">
    <v-card-title class="pa-2 indigo darken-4 title white--text">
        Consulta do objeto do pendente: {{ p._id }} ({{p.acao}}-{{p.tipo}})</v-card-title>
    <v-card-text>
      <!--ShowTSOrg v-if="p.tipo == 'TS Organizacional'" :p="p" /-->
      <ShowTSPluri v-if="p.tipo == 'TS Pluriorganizacional'" :p="p" />
      <ShowClasse v-else-if="p.tipo == 'Classe'" :p="p" />  
      <ShowRADA v-else-if="p.tipo == 'RADA'" :p="p" /> 
      <ShowAE v-else-if="p.tipo == 'Auto de Eliminação'" :p="p" />
      <ShowDefault v-else :p="p" />
    </v-card-text>
    <v-card-actions>
      <v-btn color="indigo accent-4" dark @click="voltar">Voltar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ShowAE from "@/components/pendentes/consulta/showAE.vue";
import ShowRADA from "@/components/pedidos/consulta/showRADA.vue";
import ShowClasse from "@/components/pendentes/consulta/ShowClasse.vue";
import ShowTSOrg from "@/components/pendentes/consulta/ShowTSOrg.vue";
import ShowTSPluri from "@/components/pendentes/consulta/ShowTSPluri.vue";
import ShowDefault from "@/components/pendentes/consulta/ShowDefault.vue";

export default {
  props: ["p"],

  components: {
    ShowClasse,
    //ShowTSOrg,
    ShowTSPluri,
    ShowDefault,
    ShowRADA,
    ShowAE
  },

  data: () => ({
    
  }),

  methods: {
    voltar: function() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
