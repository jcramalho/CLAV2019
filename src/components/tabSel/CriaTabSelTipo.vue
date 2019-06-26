<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm20>
        <v-card class="panel panel-default panel-custom">
          <v-toolbar class="panel-heading">
            <v-toolbar-title class="page-header"
            ><h1>Nova Tabela de Seleção</h1></v-toolbar-title
            >
          </v-toolbar>
        <v-card-text class="panel-body">
          <v-container fluid grid-list-xl>
            <v-layout wrap align-center>
              <v-flex xs3>
                <v-subheader>Selecionar tipo de Tabela de Seleção:</v-subheader>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select
                  :items="['Organizacional', 'Pluriorganizacional']"
                  label="Tipo"
                  v-model="tipo"
                ></v-select>
              <v-flex xs12 sm3>
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
                  <v-icon left>info</v-icon>Info sobre os seguintes passos
                </v-btn>
              </v-flex>
            </v-flex>
            </v-layout>
          </v-container>
          <div class="text-xs-center">
            <v-btn
                center
                color="primary"
                @click="estado.tipo = tipo; continuar()"
                :disabled="!tipo"
            >
                Continuar
            </v-btn>
            <v-btn 
                dark 
                flat 
                color="red darken-4" 
                @click="cancelar()"
                > Cancelar</v-btn>
          </div>
        </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
    computed: {
      estado() {
        return this.$store.state.criacaoTabSel;
      }
    },
    watch: {
      tipo: function() {
        if (this.tipo === "Organizacional") {
          this.infoUserEnt();
        }
        if (this.tipo === "Pluriorganizacional") {
          this.estado.designacao = "";
        }
      },
    },
    data(){
      return {
      // Tipo da TS
      tipo: "",
      // Botão da informação sobre os passos da criação de TS
      infoButton: false,
      }
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
          console.log(this.estado)
          if(this.estado.tipo === "Organizacional"){
              this.$router.push("/ts/criar/organizacional")
          }
          else if(this.estado.tipo === "Pluriorganizacional"){
              this.$router.push("/ts/criar/pluriorganizacional")
          }
      },
      // Função que procura o nome da entidade e o id da Entidade associada ao utilizador
      infoUserEnt: async function() {
        var resUser = await axios.get(
            lhost + "/api/users/listarToken/" + this.$store.state.token
        );
        var resEnt = await axios.get(
            lhost + "/api/entidades/" + resUser.data.entidade
        );
        this.estado.designacao = resEnt.data.designacao;
        this.estado.idEntidade = resUser.data.entidade;
      }
    }
}
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

</style>
