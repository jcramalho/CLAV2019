<template>
  <v-card flat class="ma-4">
    <v-card-title
      class="indigo darken-4 white--text"
    >Criar Relatório de Avaliação de Documentação Acumulada</v-card-title>
    <v-card-text>
      <br />
      <v-stepper v-model="e1" vertical>
        <!-- Informação Geral -->
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1" editable>
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral @seguinte="changeE1" :RADA="RADA" />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2" editable>
          <font size="4">
            <b>Relatório Expositivo</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="2">
          <RelatorioExpositivo @seguinte="changeE1" :RE="RADA.RE" />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step color="amber accent-3" :key="3" :complete="e1 > 3" :step="3" editable>
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada @done="done" @voltar="changeE1" :TS="RADA.tsRada" />
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
import InformacaoGeral from "@/components/rada/criacao/InformacaoGeral";

export default {
  components: {
    RelatorioExpositivo,
    TSRada,
    InformacaoGeral
  },
  data() {
    return {
      mensagemPedidoCriadoOK: "",
      dialogRADACriado: false,
      e1: 1,
      titulo: "",
      RADA: {
        titulo: "",
        despachoAprovacao: null,
        dataAprovacao: null,
        despachoRevogacao: null,
        dataRevogacao: null,
        entRes: [],
        RE: {
          entidadesProd: [],
          tipologiasProd: [],
          dataInicial: "",
          dataFinal: "",
          dimSuporte: {
            nSeries: 0,
            nSubSeries: 0,
            nUI: null,
            medicaoUI_papel: 0,
            medicaoUI_digital: 0,
            medicaoUI_outros: 0
          },
          hist_admin: "",
          hist_cust: "",
          sist_org: "",
          localizacao: "",
          est_conser: ""
        },
        tsRada: {
          titulo: "",
          classes: [
            // {
            //   codigo: "01",
            //   tipo: "N1",
            //   titulo: "Reforma Agraria",
            //   eFilhoDe: "",
            //   descricao: "Descricaao 01"
            // },
            // {
            //   codigo: "01.01",
            //   tipo: "Série",
            //   titulo: "Serie da Reforma Agraria",
            //   eFilhoDe: "01",
            //   descricao: "asjdbjahs"
            // },
            // {
            //   codigo: "01.01.01",
            //   tipo: "Subsérie",
            //   titulo: "Subserie da Serie da Reforma Agraria",
            //   eFilhoDe: "01.01",
            //   descricao: "askpdoiapsodi"
            // }
          ]
        }
      },
      userEmail: "",
      entidades: []
    };
  },
  methods: {
    changeE1: function(e) {
      this.e1 = e;
    },
    done: async function() {

      let pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "RADA",
        novoObjeto: this.RADA,
        user: {
          email: this.userEmail
        },
        token: this.$store.state.token,
        criadoPor: this.userEmail
      };

      let response = await this.$request("post", "/api/pedidos", pedidoParams);

      this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
      this.dialogRADACriado = true;
    }
  },
  mounted: async function () {
    let userBD = await this.$request(
        "get",
        "/api/users/" + this.$store.state.token + "/token"
      );
      this.userEmail = userBD.data.email;

      let userEntidade = await this.$request("get", "/api/entidades/" + userBD.data.entidade)
      this.RADA.entRes.push(userEntidade.data.sigla + " - " + userEntidade.data.designacao)
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
  height: 50%;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
