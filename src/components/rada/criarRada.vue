<template>
  <v-card flat class="ma-4">
    <v-card-title
      class="indigo darken-4 white--text"
    >Criar Relatório de Avaliação de Documentação Acumulada</v-card-title>
    <v-card-text>
      <br />
      <v-stepper v-model="e1" vertical>
        <!-- Informação Geral -->
        <v-stepper-step :key="1" :complete="e1 > 1" :step="1">
          <h5>Informação Geral</h5>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card flat class="mb-12">
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Título:</div>
              </v-col>
              <v-col cols="12" xs="12" sm="9">
                <v-text-field v-model="RADA.titulo" outlined></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xs="12" sm="3">
                <div class="info-label">Entidades Responsáveis:</div>
              </v-col>
              <v-col cols="12" xs="12" sm="9">
                <v-autocomplete
                  v-model="RADA.entRes"
                  :items="entidades"
                  outlined
                  dense
                  placeholder="Selecione as Entidades Responsáveis."
                  chips
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card>
          <v-btn
            :disabled="!RADA.titulo || !RADA.entRes[0]"
            color="indigo darken-1"
            @click="e1 = 2"
          >Continuar</v-btn>
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step :key="2" :complete="e1 > 2" :step="2">
          <h5>Relatório Expositivo</h5>
        </v-stepper-step>
        <v-stepper-content step="2">
          <RelatorioExpositivo @voltar="changeE1" @relatorioExpositivo="changeRE" />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step :key="3" :complete="e1 > 3" :step="3">
          <h5>Tabela de Seleção</h5>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada @tsrada="changeTSRada" @voltar="changeE1" />
        </v-stepper-content>
      </v-stepper>
      <v-row justify-center>
        <v-dialog v-model="dialogRADACriado" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline">Pedido de Criação do RADA Submetido</v-card-title>
            <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import RelatorioExpositivo from "@/components/rada/criacao/RelatorioExpositivo.vue";
import TSRada from "@/components/rada/criacao/TSRadaManual.vue";

export default {
  components: {
    RelatorioExpositivo,
    TSRada
  },
  data() {
    return {
      mensagemPedidoCriadoOK: "",
      dialogRADACriado: false,
      e1: 1,
      titulo: "",
      RADA: {
        titulo: "",
        entRes: [],
        RE: null,
        tsRada: null
      },
      entidades: []
    };
  },
  methods: {
    changeRE: function(relatorioExpositivo) {
      this.RADA.RE = relatorioExpositivo;
      this.e1 = 3;
    },
    changeE1: function(e) {
      this.e1 = e;
    },
    changeTSRada: async function(tsRada) {
      this.RADA.tsRada = tsRada;

      let userBD = await this.$request(
        "get",
        "/api/users/listarToken/" + this.$store.state.token
      );

      let pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "RADA",
        novoObjeto: this.RADA,
        user: {
          email: userBD.data.email
        },
        token: this.$store.state.token,
        criadoPor: userBD.data.email
      };

      let response = await this.$request("post", "/api/pedidos", pedidoParams);

      this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
      this.dialogRADACriado = true;
    }
  },
  created: async function() {
    let response = await this.$request("get", "/api/entidades");
    this.entidades = response.data.map(item => {
      return item.sigla + " - " + item.designacao;
    });
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
