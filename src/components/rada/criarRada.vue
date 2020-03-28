<template>
  <v-card flat class="ma-4" style="background-color:#fafafa">
    <v-card-title class="indigo darken-4 white--text">
      Criar Relatório de Avaliação de Documentação Acumulada
      <v-spacer />
      <v-btn
        v-if="guardar"
        style="background-color: #1a237e;"
        dark
        @click="guardarTrabalho"
      >
        Guardar Trabalho
        <v-icon right>save</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <br />
      <v-stepper v-model="e1" vertical class="elevation-0" style="background-color:#fafafa">
        <!-- Informação Geral -->
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1" editable>
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral
            @seguinte="changeE1"
            :RADA="RADA"
            :entidades="entidades"
          />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2" editable>
          <font size="4">
            <b>Relatório Expositivo</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="2">
          <RelatorioExpositivo
            @seguinte="changeE1"
            :classes="RADA.tsRada.classes"
            :UIs="RADA.tsRada.UIs"
            :RE="RADA.RE"
            :entidades="entidades"
            :tipologias="tipologias"
          />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step color="amber accent-3" :key="3" :complete="e1 > 3" :step="3" editable>
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada
            @done="done"
            @voltar="changeE1"
            :legislacao="legislacao"
            :RE="RADA.RE"
            :TS="RADA.tsRada"
            :entidades="entidades"
          />
        </v-stepper-content>
      </v-stepper>
      <v-row justify-center>
        <v-dialog v-model="dialogRADAPendente" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline"
              >Trabalho pendente guardado</v-card-title
            >
            <v-card-text>
              <p>
                Os seus dados foram guardados para que possa retomar o trabalho
                mais tarde.
              </p>
              <!-- <p>{{ mensagemPendenteCriadoOK }}</p> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/')"
                >Fechar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify-center>
        <v-dialog v-model="dialogRADACriado" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline"
              >Pedido de Criação do RADA Submetido</v-card-title
            >
            <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/')"
                >Fechar</v-btn
              >
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
      mensagemPendenteCriadoOK: "",
      dialogRADAPendente: false,
      mensagemPedidoCriadoOK: "",
      dialogRADACriado: false,
      entidades: [],
      tipologias: [],
      legislacao: [],
      e1: 1,
      titulo: "",
      guardar: false,
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
          dataInicial: null,
          dataFinal: null,
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
            //   codigo: "01.02",
            //   tipo: "N2",
            //   titulo: "Reforma Agraria N2",
            //   eFilhoDe: "01",
            //   descricao: "Descricaao 01"
            // },
            // // {
            // //   codigo: "OLA",
            // //   tipo: "Série",
            // //   titulo: "MUNDOOO",
            // //   eFilhoDe: "",
            // //   descricao: "",
            // //   relacoes: [],
            // //   dataInicial: "",
            // //   dataFinal: null,
            // //   tUA: "",
            // //   tSerie: "",
            // //   UIs: [],
            // //   suporte: "",
            // //   medicao: "",
            // //   localizacao: [],
            // //   entProdutoras: [],
            // //   tipologiasProdutoras: [],
            // //   legislacao: [],
            // //   pca: "",
            // //   formaContagem: {
            // //    forma: null
            // //   },
            // //   justificacaoPCA: [],
            // //   df: null,
            // //   justificacaoDF: [],
            // //   notas: "",
            // //   children: []
            // // },
            // {
            //   codigo: "01.01",
            //   tipo: "Série",
            //   titulo: "Serie da Reforma Agraria - 1",
            //   eFilhoDe: "01",
            //   descricao: "asjdbjahs",
            //   relacoes: [],
            //   dataInicial: null,
            //   dataFinal: null,
            //   UIs: [{ codigo: "UI - 01" }],
            //   // UIs: [],
            //   tUA: "Processo",
            //   tSerie: "Aberta",
            //   suporte: "Papel",
            //   medicao: "12",
            //   localizacao: ["ola"],
            //   entProdutoras: [],
            //   tipologiasProdutoras: [],
            //   legislacao: [],
            //   pca: "",
            //   formaContagem: {
            //     forma: null
            //   },
            //   justificacaoPCA: [],
            //   df: null,
            //   justificacaoDF: [],
            //   notas: "",
            //   children: []
            // },
            // {
            //   codigo: "01.01.01",
            //   tipo: "Subsérie",
            //   titulo: "Subserie da Serie da Reforma Agraria - 1",
            //   eFilhoDe: "01.01",
            //   descricao: "askpdoiapsodi",
            //   relacoes: [],
            //   UIs: [],
            //   dataInicial: "2020-03-17",
            //   dataFinal: "2020-04-12",
            //   pca: "12",
            //   formaContagem: {
            //     forma: null
            //   },
            //   justificacaoPCA: [],
            //   df: null,
            //   justificacaoDF: [],
            //   notas: "asd"
            // },
            // {
            //   codigo: "02",
            //   tipo: "N1",
            //   titulo: "Reforma Agraria",
            //   eFilhoDe: "",
            //   descricao: "Descricaao 01"
            // },
            // {
            //   codigo: "02.01",
            //   tipo: "Série",
            //   titulo: "Serie da Reforma Agraria - 2",
            //   eFilhoDe: "02",
            //   descricao: "asjdbjahs",
            //   relacoes: [],
            //   UIs: [],
            //   dataInicial: "2020-03-17",
            //   dataFinal: "2020-04-12",
            //   tUA: "",
            //   tSerie: "",
            //   suporte: "",
            //   medicao: "",
            //   localizacao: [],
            //   entProdutoras: [],
            //   tipologiasProdutoras: [],
            //   legislacao: [],
            //   pca: "",
            //   formaContagem: {
            //     forma: null
            //   },
            //   justificacaoPCA: [],
            //   df: null,
            //   justificacaoDF: [],
            //   notas: "",
            //   children: []
            // },
            // {
            //   codigo: "02.01.01",
            //   tipo: "Subsérie",
            //   titulo: "Subserie da Serie da Reforma Agraria - 2",
            //   eFilhoDe: "02.01",
            //   descricao: "askpdoiapsodi",
            //   relacoes: [],
            //   UIs: [],
            //   dataInicial: "2020-03-17",
            //   dataFinal: "2020-04-12",
            //   pca: "",
            //   formaContagem: {
            //     forma: null
            //   },
            //   justificacaoPCA: [],
            //   df: "Conservação",
            //   justificacaoDF: [],
            //   notas: ""
            // }
          ],
          UIs: [
            // {
            //   codigo: "UI - 01",
            //   codCota: "A",
            //   titulo: "TITULO",
            //   dataInicial: "2020-03-03",
            //   dataFinal: "2020-03-05",
            //   produtor: {
            //     tipologiasProdutoras: [],
            //     entProdutoras: []
            //   },
            //   classesAssociadas: [],
            //   descricao: "Desc",
            //   notas: "Notas",
            //   localizacao: "Loc"
            // }
          ]
        }
      },
      userEmail: ""
    };
  },
  watch: {
    e1(v) {
      if (v > 1 && !this.guardar) {
        this.guardar = true;
      }
    }
  },
  methods: {
    guardarTrabalho: function() {
      let pendenteParams = {
        numInterv: 1,
        acao: "Criação",
        tipo: "RADA",
        objeto: {
          rada: this.RADA,
          entidades: this.entidades.filter(e => e.estado == "Nova"),
          legislacao: this.legislacao.filter(e => e.estado == "Nova")
        },
        criadoPor: this.userEmail,
        user: { email: this.userEmail },
        token: this.$store.state.token
      };

      let response = this.$request("post", "/pendentes", pendenteParams);

      response.then(resp => {
        this.dialogRADAPendente = true;
      });
    },
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

      let response = await this.$request("post", "/pedidos", pedidoParams);

      this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
      this.dialogRADACriado = true;
    }
  },
  created: async function() {
    let l = await this.$request("get", "/legislacao");
    this.legislacao = l.data;

    let response = await this.$request("get", "/entidades");
    this.entidades = response.data;

    response = await this.$request("get", "/tipologias");
    this.tipologias = response.data;

    let userBD = await this.$request(
      "get",
      "/users/" + this.$store.state.token + "/token"
    );
    this.userEmail = userBD.data.email;

    let userEntidade = await this.$request(
      "get",
      "/entidades/" + userBD.data.entidade
    );

    this.RADA.entRes.push(
      userEntidade.data.sigla + " - " + userEntidade.data.designacao
    );
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

.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  height: 35px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
