<template>
      <v-card class="ma-2">
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Tabela de Seleção</v-toolbar-title
          >
        </v-app-bar>
        <v-card-text class="panel-body">
          <v-container fluid grid-list-xl>
            <v-layout wrap align-center>
              <v-flex xs3>
                <v-subheader>Selecionar tipo de Tabela de Seleção:</v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-select
                  :items="['Organizacional', 'Pluriorganizacional']"
                  label="Tipo"
                  v-model="tipo"
                ></v-select>
              </v-flex>
              <!--v-flex xs12 sm4>
                <v-btn
                  medium
                  @click="infoButton = true"
                  v-if="!infoButton"
                  icon
                  color="info"
                >
                  <v-icon>info</v-icon>
                </v-btn>
                <v-btn medium v-if="infoButton" color="info" @click="passos()">
                  <v-icon left>info</v-icon>Info dos seguintes passos
                </v-btn>
              </v-flex-->
            </v-layout>
          </v-container>
          <div class="text-xs-center">
            <v-btn
              center
              color="primary"
              @click="continuar()"
              :disabled="!tipo"
            >
              Continuar
            </v-btn>
            <v-btn dark text color="red darken-4" @click="cancelar()">
              Cancelar</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
</template>

<script>
export default {
  data() {
    return {
      // Tipo da TS
      tipo: "",
      // Botão da informação sobre os passos da criação de TS
      infoButton: false
    };
  },
  methods: {
    // Reencaminha para a página da informação dos seguintes passos
    passos: function() {
      this.$router.push("/ts/passos");
    },
    cancelar: function() {
      this.$router.push("/");
    },
    continuar: function() {
      if (this.tipo === "Organizacional") {
        this.$router.push("/ts/criar/organizacional");
      } else if (this.tipo === "Pluriorganizacional") {
        this.$router.push("/ts/criar/pluriorganizacional");
      }
    }
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
