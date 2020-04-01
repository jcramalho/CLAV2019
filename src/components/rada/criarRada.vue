<template>
  <v-card flat class="ma-4" style="background-color:#fafafa">
    <v-card-title class="indigo darken-4 white--text">
      Criar Relatório de Avaliação de Documentação Acumulada
      <v-spacer />
      <v-btn v-if="guardar" color="indigo darken-4" dark @click="toSave = true">
        Guardar Trabalho
        <v-icon right>save</v-icon>
      </v-btn>
      <v-icon v-if="pode_remover" dark color="red" @click="toDelete = true" right>delete_sweep</v-icon>
    </v-card-title>
    <v-card-text>
      <br />
      <v-alert :value="alert_guardar" outlined type="success" text dismissible border="left">
        <b>Trabalho guardado com sucesso!</b>
      </v-alert>
      <v-stepper v-model="e1" vertical class="elevation-0" style="background-color:#fafafa">
        <!-- Informação Geral -->
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1" editable>
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral @seguinte="changeE1" :RADA="RADA" :entidades="entidades" />
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
        <v-dialog v-model="dialogRADAPendente" persistent width="50%">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>Trabalho pendente guardado</v-card-title>
            <v-card-text>
              <br />
              <p>
                Os seus dados foram guardados para que possa retomar o trabalho
                mais tarde. Aceda aos pendentes para continuar.
              </p>
              <!-- <p>{{ mensagemPendenteCriadoOK }}</p> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify-center>
        <v-dialog v-model="dialogRADACriado" persistent width="50%">
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >Pedido de Criação do RADA Submetido.</v-card-title>
            <v-card-text>
              <br />
              {{ mensagemPedidoCriadoOK }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify-center>
        <v-dialog v-model="toSave" width="50%">
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >Pretende continuar o trabalho neste momento?</v-card-title>

            <v-card-text align="center">
              <br />
              <v-spacer></v-spacer>

              <v-btn
                class="ma-3 pa-3"
                color="indigo lighten-3"
                @click="guardarTrabalho('nao')"
              >Não, pretendo continuar depois.</v-btn>
              <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="guardarTrabalho('sim')">Sim.</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row>
        <v-dialog v-model="toDelete" width="50%">
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >Pretende mesmo eliminar o trabalho?</v-card-title>

            <v-card-text align="center">
              <br />
              <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
              <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarTrabalho">Sim</v-btn>
            </v-card-text>
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
      user_entidade: null,
      alert_guardar: false,
      pode_remover: false,
      idPendente: null,
      toDelete: false,
      toSave: false,
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
            //   // UIs: [{ codigo: "UI - 01" }],
            //   UIs: [],
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
            // },
            // {
            //   codigo: "UI - 02",
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
            // },
            // {
            //   codigo: "UI - 03",
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
            // },
            // {
            //   codigo: "UI - 04",
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
    eliminarTrabalho() {
      this.$request("delete", "/pendentes/" + this.idPendente).then(
        response => {
          this.$router.push("/");
        }
      );
    },
    guardarTrabalho(continuar_ou_nao) {
      if (this.idPendente != null) {
        let updatePendente = {
          _id: this.idPendente,
          objeto: {
            rada: this.RADA,
            entidades: this.entidades.filter(e => e.estado == "Nova"),
            legislacao: this.legislacao.filter(e => e.estado == "Nova")
          }
        };

        let response = this.$request("put", "/pendentes", updatePendente);

        response.then(resp => {
          if (continuar_ou_nao == "nao") {
            this.toSave = false;
            this.dialogRADAPendente = true;
          } else {
            this.toSave = false;
            this.alert_guardar = true;

            setTimeout(() => {
              this.alert_guardar = false;
            }, 5000);
          }
        });
      } else {
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
          if (continuar_ou_nao == "sim") {
            this.idPendente = resp.data._id;
            this.toSave = false;
            this.pode_remover = true;
            this.alert_guardar = true;

            setTimeout(() => {
              this.alert_guardar = false;
            }, 5000);
          } else {
            this.toSave = false;
            this.dialogRADAPendente = true;
          }
        });
      }
    },
    // guardarTrabalho: function() {
    //   let pendenteParams = {
    //     numInterv: 1,
    //     acao: "Criação",
    //     tipo: "RADA",
    //     objeto: {
    //       rada: this.RADA,
    //       entidades: this.entidades.filter(e => e.estado == "Nova"),
    //       legislacao: this.legislacao.filter(e => e.estado == "Nova")
    //     },
    //     criadoPor: this.userEmail,
    //     user: { email: this.userEmail },
    //     token: this.$store.state.token
    //   };

    //   let response = this.$request("post", "/pendentes", pendenteParams);

    //   response.then(resp => {
    //     console.log(resp.data);
    //     this.dialogRADAPendente = true;
    //   });
    // },
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
        criadoPor: this.userEmail,
        entidade: this.user_entidade
      };

      let response = await this.$request("post", "/pedidos", pedidoParams);

      if (this.idPendente != null) {
        // ELIMINAR O PENDENTE DEPOIS DE FAZER O PEDIDO
        await this.$request("delete", "/pendentes/" + this.idPendente);
      }
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

    this.user_entidade = "ent_" + userEntidade.data.sigla;

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
