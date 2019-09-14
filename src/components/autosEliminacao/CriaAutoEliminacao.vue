<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm20>
        <v-card class="panel panel-default panel-custom">
          <v-toolbar class="panel-heading">
            <v-toolbar-title class="page-header"
              ><h1>Novo Auto de Eliminação</h1></v-toolbar-title
            >
          </v-toolbar>
          <v-card-text class="panel-body">
            <div>
              <table
                class="adicao"
                style="border-color: white; border-style:solid; margin-bottom:20px;"
              >
                <tr>
                  <td style="width:20%;">
                    <div class="info-label">Ficheiro:</div>
                  </td>
                  <td>
                    <v-file-imput
                      placeholder="Escolha um ficheiro xlsx"
                    ></v-file-imput>
                  </td>
                </tr>
              </table>

              <v-expansion-panel>
                <v-expansion-panel-content class="expansion-panel-heading">
                  <template v-slot:header>
                    <div class="subheading font-weight-bold">
                      Entidades
                    </div>
                  </template>
                  <v-card style="padding-top:30px;">
                    <DesSelEnt
                      :entidades="entSel"
                      tipo="tipologias"
                      @unselectEntidade="unselectEntidade($event)"
                    />

                    <hr style="border-top: 1px dashed #dee2f8;" />

                    <SelEnt
                      :entidadesReady="entidadesReady"
                      :entidades="entidades"
                      @selectEntidade="selectEntidade($event)"
                    />
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
          </v-card-text>
          <v-snackbar
            v-model="snackbar"
            :timeout="8000"
            color="error"
            :top="true"
          >
            {{ text }}
            <v-btn text @click="fecharSnackbar">Fechar</v-btn>
          </v-snackbar>
        </v-card>
        <div style="text-align:center">
          <v-btn
            medium
            color="primary"
            @click="submeter()"
            :disabled="!(tipologia.designacao && tipologia.sigla)"
            >Submeter Tipologia</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    tipologia: {
      designacao: "",
      sigla: "",
      entidades: [],
      codigo: "",
    },
    designacao: "",
    sigla: "",
    entidades: [],
    entSel: [],
    entidadesReady: false,

    snackbar: false,
    text: ""
  }),
  components: {
    DesSelEnt,
    SelEnt
  },
  methods: {
    unselectEntidade: function(entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      var index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
    },
    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      // Remove dos selecionáveis
      var index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },
    // Vai à API buscar todas as entidades
    loadEntidades: async function() {
      try {
        var response = await axios.get(lhost + "/api/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        this.entidadesReady = true;
      } catch (error) {
        return error;
      }
    },
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
    submeter: async function() {
      if (this.$store.state.name === "") {
        this.text = "Precisa de fazer login para criar a Tipologia";
        this.snackbar = true;
        return false;
      }

      for (var i = 0; i < this.entSel.length; i++) {
        this.tipologia.entidades[i] = this.entSel[i].id;
      }

      var dataObj = this.tipologia;

      dataObj.codigo = "tip_" + this.tipologia.sigla;

      var userBD = await axios.get(
        lhost + "/api/users/listarToken/" + this.$store.state.token
      );
      var pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "Tipologia",
        novoObjeto: dataObj,
        user: { email: userBD.data.email },
        token: this.$store.state.token
      };

      var response = await axios.post(lhost + "/api/pedidos", pedidoParams);
      this.$router.push("/pedidos/submissao");

      /*axios
        .post(lhost + "/api/tipologias/", dataObj)
        .then(res => {
          this.$router.push("/pedidos/submissao");
        })
        .catch(err => {
          if (err.response.status === 409) {
            this.text =
              "Já existe uma tipologia com a sigla " +
              this.tipologia.sigla +
              " ou designação " +
              this.tipologia.designacao;
            this.color = "error";
            this.snackbar = true;
          }
          if (err.response.status === 500) {
            this.text = "Ocorreu um erro na criação desta entidade";
            this.color = "error";
            this.snackbar = true;
          }
        });*/
    }
  },
  created: function() {
    this.loadEntidades();
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

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}

.adicao tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.adicao td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
}

.adicao td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
