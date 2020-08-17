<template>
  <v-data-table
    :headers="cabecalho"
    :items="agregacoes"
    :items-per-page="5"
    class="elevation-1 ml-2 mt-3"
    :footer-props="footer_props"
    :search="search"
  >
    <template slot="item" slot-scope="prop">
      <tr>
        <td>{{prop.item.codigo}}</td>
        <td>{{prop.item.titulo}}</td>
        <td style="text-align: center; width: 15%">
          <v-text-field
            v-model="prop.item.dataContagem"
            single-line
            dense
          />
        </td>
        <td style="text-align: center;" v-if="(df==='C' || df==='Conservação') && prop.item.ni!=='Participante'">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon color="orange darken-2" v-on="on">warning</v-icon> Participante
            </template>
            <span>Alterado em confomidade com <strong>Destino Final</strong> de <strong>Conservação</strong></span>
          </v-tooltip>
        </td>
        <td style="text-align: center;" v-else>{{prop.item.ni}}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
const help = require("@/config/help").help;

export default {
  props: ["agregacoes","df","pca","dataInicio","search"],

  data: () => ({
    cabecalho: [
      { text: "Código", align: "left", sortable: false, value: "codigo" },
      { text: "Título", align: "left", value: "titulo" },
      { text: "Data de Contagem", align: "center", value: "dataContagem" },
      { text: "Natureza de Intervenção", align: "center", value: "ni" }
    ],
    footer_props: {
      "items-per-page-text": "Mostrar"
    }
  }),
  methods: {
    validaPCA1: function(dataContagem) {
      var currentTime = new Date();
      console.log(pca)
      var pca = parseInt(this.pca) || 0
      var v = parseInt(dataContagem) || 0
      var res = pca + v + 1
      return res <= currentTime.getFullYear() || "Deve ser igual ou inferior à subtração do PCA ao ano corrente."
    },
    
    validaPCA2: function(dataContagem) {
      var currentTime = new Date();
      var data = parseInt(this.dataInicio) || 0
      var v = parseInt(dataContagem) || 0
      var res = v - data
      return res >= 0 || "Não pode ser inferior à Data de Início da Classe."
    }
  }
}
</script>
