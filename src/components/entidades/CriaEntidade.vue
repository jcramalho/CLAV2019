<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="green darken-4" dark>
          <v-toolbar-title class="card-heading">Nova Entidade</v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Nome da Entidade:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="150"
                single-line
                v-model="entidade.designacao"
                maxlength="150"
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
                v-model="entidade.sigla"
                maxlength="10"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Internacional:</div>
            </v-col>
            <v-col>
              <v-select
                v-model="entidade.internacional"
                :items="['Sim', 'Não']"
                label="Não"
                item-color="green"
                color="green"
                solo
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">SIOE:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="12"
                single-line
                v-model="entidade.sioe"
                maxlength="12"
                :rules="regraSIOE"
                mask="############"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">Tipologias de Entidade</v-expansion-panel-header>
              <v-expansion-panel-content>
                <DesSelTip :tipologias="tipSel" @unselectTipologia="unselectTipologia($event)" />

                <hr style="border-top: 1px dashed #dee2f8;" />

                <SelTip
                  :tipologiasReady="tipologiasReady"
                  :tipologias="tipologias"
                  @selectTipologia="selectTipologia($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
          {{ text }}
          <v-btn text @click="fecharSnackbar">Fechar</v-btn>
        </v-snackbar>
      </v-card>
      <PainelOpsEnt :e="entidade" />
      <v-row>
        <v-col class="text-center">
          <v-btn
            class="white--text"
            medium
            rounded
            color="#388E3C"
            @click="submeter()"
            :disabled="!(entidade.designacao && entidade.sigla)"
          >Submeter Entidade</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";
import PainelOpsEnt from "@/components/entidades/PainelOperacoesEntidades.vue";

import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    entidade: {
      designacao: "",
      sigla: "",
      internacional: "",
      sioe: "",
      tipologiasSel: [],
      codigo: ""
    },

    // Para o seletor de processos
    tipologias: [],
    tipSel: [],
    tipologiasReady: false,

    regraSIOE: [
      v => /^[0-9]*$/.test(v) || "Apenas são aceites caracteres numéricos."
    ],

    snackbar: false,
    text: ""
  }),
  components: {
    DesSelTip,
    SelTip,
    PainelOpsEnt
  },
  methods: {
    // Vai à API buscar todas as tipologias
    loadTipologias: async function() {
      try {
        var response = await axios.get(lhost + "/api/tipologias/");
        this.tipologias = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        this.tipologiasReady = true;
      } catch (error) {
        return error;
      }
    },
    unselectTipologia: function(tipologia) {
      // Recoloca a tipologia nos selecionáveis
      this.tipologias.push(tipologia);
      var index = this.tipSel.findIndex(e => e.id === tipologia.id);
      this.tipSel.splice(index, 1);
    },
    selectTipologia: function(tipologia) {
      this.tipSel.push(tipologia);
      // Remove dos selecionáveis
      var index = this.tipologias.findIndex(e => e.id === tipologia.id);
      this.tipologias.splice(index, 1);
    },
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
    submeter: async function() {
      try {
        if (this.$store.state.name === "") {
          this.text = "Precisa de fazer login para criar a Entidade";
          this.snackbar = true;
          return false;
        }

        for (var i = 0; i < this.tipSel.length; i++) {
          this.entidade.tipologiasSel[i] = this.tipSel[i].id;
        }

        if (this.entidade.internacional == "") {
          this.entidade.internacional = "Não";
        }

        if (!/^[0-9]*$/.test(this.entidade.sioe)) {
          this.text = "O campo 'SIOE' está no formato errado.";
          this.snackbar = true;
          return false;
        }

        var dataObj = this.entidade;

        dataObj.codigo = "ent_" + this.entidade.sigla;

        // console.log(dataObj);

        var userBD = await axios.get(
          lhost + "/api/users/listarToken/" + this.$store.state.token
        );

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "Entidade",
          novoObjeto: dataObj,
          user: { email: userBD.data.email },
          token: this.$store.state.token
        };

        var response = await axios.post(lhost + "/api/pedidos", pedidoParams);
        this.$router.push("/pedidos/submissao");

        /*axios
          .post(lhost + "/api/entidades/", dataObj)
          .then(res => {
            this.$router.push("/pedidos/submissao");
          })
          .catch(err => {
            if (err.response.status === 409) {
              this.text =
                "Já existe uma entidade com a sigla " +
                this.entidade.sigla +
                " ou designação " +
                this.entidade.designacao;
              this.color = "error";
              this.snackbar = true;
            }
            if (err.response.status === 500) {
              this.text = "Ocorreu um erro na criação desta entidade";
              this.color = "error";
              this.snackbar = true;
            }
          });*/
      } catch (error) {
        return error;
      }
    }
  },
  created: function() {
    this.loadTipologias();
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
