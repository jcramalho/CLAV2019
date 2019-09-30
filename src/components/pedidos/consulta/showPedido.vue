<template>
  <v-card class="ma-8">
    <v-card-title class="pa-2 indigo darken-4 title white--text" dark
      >Consulta do pedido: {{ p.codigo }}</v-card-title
    >
    <v-card-text>
      <v-row class="ma-1">
        <v-col cols="2">
          <div class="info-label">Estado</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.estado }}</div>
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col cols="2">
          <div class="info-label">Data</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.data.split("T")[0] }}</div>
        </v-col>
      </v-row>
      <v-row class="ma-1" v-if="p.entidade">
        <v-col cols="2">
          <div class="info-label">Entidade</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.entidade }}</div>
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col cols="2">
          <div class="info-label">Criado Por</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ p.criadoPor }}</div>
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col cols="2">
          <div class="info-label">Tipo</div>
        </v-col>
        <v-col>
          <div class="info-content">
            {{ p.objeto.acao }} - {{ p.objeto.tipo }}
          </div>
        </v-col>
      </v-row>

      <v-card>
        <v-card-title class="info-label title" dark>Distribuição</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="distHeaders"
            :items="p.distribuicao"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:item="props">
              <tr>
                <td class="subheading">{{ props.item.estado }}</td>
                <td class="subheading">{{ props.item.data }}</td>
                <td class="subheading">{{ props.item.responsavel }}</td>
                <td class="subheading">{{ props.item.despacho }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <ShowTSOrg v-if="p.objeto.tipo == 'TS Organizacional'" :p="p" />
      <ShowClasse v-else-if="p.objeto.tipo == 'Classe'" :p="p" />
      <ShowAE v-else-if="p.objeto.tipo.includes('AE ')" :p="p" />
      <ShowDefault v-else :p="p" />
    </v-card-text>
    <v-card-actions>
      <v-btn color="indigo darken-4" rounded dark @click="voltar">
        Voltar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ShowTSOrg from "@/components/pedidos/consulta/showTSOrg.vue";
import ShowClasse from "@/components/pedidos/consulta/showClasse.vue";
import ShowDefault from "@/components/pedidos/consulta/showDefault.vue";
import ShowAE from "@/components/pedidos/consulta/showAE.vue";

export default {
  props: ["p"],

  components: { ShowTSOrg, ShowClasse, ShowDefault, ShowAE },

  data: () => ({
    headers: [
      { text: "Estado", align: "left", sortable: false, value: "estado" },
      { text: "Data", value: "data" },
      { text: "Responsável", value: "responsavel" },
      { text: "Despacho", value: "despacho" },
      { text: "Objeto", value: "objeto" }
    ],
    distHeaders: [
      { text: "Estado", value: "estado", class: "subtitle-1" },
      { text: "Data", value: "data", class: "subtitle-1" },
      { text: "Responsável", value: "responsavel", class: "subtitle-1" },
      { text: "Despacho", value: "despacho", class: "subtitle-1" }
    ]
  }),

  methods: {
    voltar: function() {
      this.$router.go(-1);
    }
  }
};
</script>

<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>
