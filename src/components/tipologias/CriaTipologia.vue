<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="green darken-4" dark>
          <v-toolbar-title class="card-heading">Nova Tipologia</v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Designação:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="50"
                single-line
                v-model="tipologia.designacao"
                maxlength="50"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Sigla:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="10"
                single-line
                v-model="tipologia.sigla"
                maxlength="10"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                Entidades
              </v-expansion-panel-header>
              <v-expansion-panel-content>
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
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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

      <!-- Botão -->
      <v-row>
        <v-col class="text-center">
          <v-btn
            class="white--text"
            medium
            rounded
            color="#388E3C"
            @click="submeter()"
            :disabled="!(tipologia.designacao && tipologia.sigla)"
          >
            Submeter Tipologia
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

export default {
  data: () => ({
    tipologia: {
      designacao: "",
      sigla: "",
      entidades: [],
      codigo: ""
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
        var response = await this.$request("get", "/api/entidades");
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

      var userBD = await this.$request(
        "get",
        "/api/users/listarToken/" + this.$store.state.token
      );
      var pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "Tipologia",
        novoObjeto: dataObj,
        user: { email: userBD.data.email },
        token: this.$store.state.token
      };

      var response = await this.$request("post", "/api/pedidos", pedidoParams);
      this.$router.push("/pedidos/submissao");

      /*this.$request("post", "/api/tipologias/", dataObj)
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

<style scoped>
.expansion-panel-heading {
  background-color: #1b5e20 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
