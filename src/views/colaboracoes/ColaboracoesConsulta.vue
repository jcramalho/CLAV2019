<template>
  <v-card class="ma-4">
    <Loading v-if="!creditoReady" :message="'colaboração'" />
    <v-card-title v-else class="indigo darken-4 white--text">{{
      this.credito.nome
    }}</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2">
          <div class="info-label">Filiação</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ this.credito.filiacao }}</p>
          </div>
        </v-col>
      </v-row> 
      <v-row>
        <v-col cols="2">
          <div class="info-label">Função</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p>{{ this.credito.funcao }}</p>
          </div>
        </v-col>
      </v-row> 
      <v-row v-if="this.credito.desc !== undefined && this.credito.desc !== null && this.credito.desc !== ''">
        <v-col cols="2">
          <div class="info-label">Descrição</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p class="text-justify">{{ this.credito.desc }}</p>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="this.credito.data_inicio !== undefined && this.credito.data_inicio !== null && this.credito.data_inicio !== ''">
        <v-col cols="2">
          <div class="info-label">Início</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p class="text-justify">{{ this.credito.data_inicio }}</p>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="this.credito.data_fim !== undefined && this.credito.data_fim !== null && this.credito.data_fim !== ''">
        <v-col cols="2">
          <div class="info-label">Fim</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <p class="text-justify">{{ this.credito.data_fim }}</p>
          </div>
        </v-col>
      </v-row>  
      <v-spacer />

      <v-row>
        <v-col>
          <v-btn
            class="indigo accent-4 white--text mr-4"
            @click="$router.go(-1)"
            >Voltar</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import marked from "marked";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    Loading
  },
  data: () => ({
    idCredito: "",
    credito: {
      nome: "",
      filiacao: "",
      funcao : "",
      desc: "",
      data_inicio: "",
      data_fim: ""
    },
    creditoReady: false
  }),
  methods: {
    preparaCredito: async function(cred) {
      try {
        var myCredito = {
          nome: cred.nome,
          filiacao: cred.filiacao,
          funcao : cred.funcao,
          desc: cred.desc,
          data_inicio: cred.data_inicio === undefined ? "" : cred.data_inicio,
          data_fim: cred.data_fim === undefined ? "" : cred.data_fim,
        };
        return myCredito;
      } catch (e) {
        return {};
      }
    }
  },
  created: async function() {
    try {
      this.idCredito = window.location.pathname.split("/")[2];

      // Informações sobre o crédito
      var response = await this.$request("get", "/colaboracoes/" + this.idCredito);
      this.credito = await this.preparaCredito(response.data);

      this.creditoReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}
.card-heading {
  font-size: x-large;
  font-weight: bold;
}
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
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
.fakea:hover {
  text-decoration: underline;
  cursor: pointer;
}
.fakea {
  color: #1a76d2;
}
</style>
