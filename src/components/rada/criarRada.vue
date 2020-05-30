<template>
  <v-card class="ma-4" style="background-color:#fafafa">
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
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1">
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral @seguinte="changeE1" :RADA="RADA" :entidades="entidades" />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2">
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
            :entidadesProcessadas="entidadesProcessadas"
            :tipologias="tipologias"
          />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step color="amber accent-3" :key="3" :complete="e1 > 3" :step="3">
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada
            @done="concluir(idPendente)"
            @voltar="changeE1"
            :legislacao="legislacao"
            :RE="RADA.RE"
            :TS="RADA.tsRada"
            :entidades="entidades"
            :legislacaoProcessada="legislacaoProcessada"
            :loading_circle.sync="loading_circle_ts"
          />
          <v-alert
            width="100%"
            :value="!!erroProdutoras[0] || !!erros_relacoes[0] || !!erros_datas_uis[0]"
            outlined
            type="error"
            prominent
            border="left"
          >
            <div v-if="!!erroProdutoras[0]">
              <b>As seguintes tipologias/entidades produtoras não foram adicionadas a nenhuma série:</b>
              <ul>
                <li v-for="(produtora, i) in erroProdutoras" :key="i">{{produtora}}</li>
              </ul>
              <br />
            </div>
            <div v-if="!!erros_relacoes[0]">
              <b>As seguintes relações entre classes são inválidas devido às datas:</b>
              <ul>
                <li
                  v-for="(erro_rel, i) in erros_relacoes"
                  :key="i"
                >{{erro_rel[0] + " " + erro_rel[2].toLowerCase().trim() + " " + erro_rel[1] + ";"}}</li>
              </ul>
            </div>
            <div v-if="!!erros_datas_uis[0]">
              <b>As seguintes associações entre classes e unidades de instalação são inválidas devido às datas:</b>
              <ul>
                <li
                  v-for="(erro_uis, i) in erros_datas_uis"
                  :key="i"
                >{{"Classe " + erro_uis.codigoClasse + " e UI " + erro_uis.codigoUI + ";"}}</li>
              </ul>
            </div>
          </v-alert>
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
              <v-progress-circular
                v-if="loading_circle"
                :size="70"
                :width="7"
                color="amber accent-3"
                indeterminate
              ></v-progress-circular>
              <div v-else>
                <v-spacer></v-spacer>
                <v-btn
                  class="ma-3 pa-3"
                  color="indigo lighten-3"
                  @click="guardarTrabalho('nao')"
                >Não, pretendo continuar depois</v-btn>
                <v-btn
                  class="ma-3 pa-3"
                  color="indigo lighten-3"
                  @click="guardarTrabalho('sim')"
                >Sim</v-btn>
              </div>
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
const nanoid = require("nanoid");

import RelatorioExpositivo from "@/components/rada/criacao/RelatorioExpositivo.vue";
import TSRada from "@/components/rada/criacao/TSRadaManual.vue";
import InformacaoGeral from "@/components/rada/criacao/InformacaoGeral";

import mixin_criacao_rada from "@/mixins/rada/mixin_criacao_rada";

export default {
  components: {
    RelatorioExpositivo,
    TSRada,
    InformacaoGeral
  },
  mixins: [mixin_criacao_rada],
  data() {
    return {
      loading_circle: false,
      pode_remover: false,
      idPendente: null,
      RADA: {
        id: nanoid(),
        titulo: "",
        despachoAprovacao: null,
        dataAprovacao: null,
        despachoRevogacao: null,
        dataRevogacao: null,
        entRes: [],
        RE: {
          entidadesProd: [
            // "ACSS - Administração Central do Sistema de Saúde, IP",
            // "ADSE - Instituto de Proteção e Assistência na Doença, I.P."
          ],
          tipologiasProd: [],
          // dataInicial: "2020-01-02",
          // dataFinal: "2020-06-01",
          dataInicial: null,
          dataFinal: null,
          dimSuporte: {
            nSeries: null,
            nSubseries: null,
            nUI: null,
            medicaoUI_papel: null,
            medicaoUI_digital: null,
            medicaoUI_outros: null
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
            //   titulo: "Classe N1 (01)",
            //   descricao: "Descrição Classe N1 (01)",
            //   eFilhoDe: null,
            //   tipo: "N1"
            // },
            // {
            //   codigo: "04",
            //   titulo: "Classe N1 (04)",
            //   descricao: "Descrição Classe N1 (04)",
            //   eFilhoDe: null,
            //   tipo: "N1"
            // },
            // {
            //   codigo: "02",
            //   titulo: "Classe N1 (02)",
            //   descricao: "Descrição Classe N1 (02)",
            //   tipo: "N1"
            // },
            // {
            //   codigo: "03",
            //   titulo: "Classe N1 (03)",
            //   descricao: "Descrição Classe N1 (01)",
            //   tipo: "N1"
            // },
            // {
            //   codigo: "01.02",
            //   titulo: "Classe N2 (01.02)",
            //   descricao: "Descrição Classe N2 (01.02)",
            //   eFilhoDe: "01",
            //   tipo: "N2"
            // },
            // {
            //   codigo: "01.01",
            //   titulo: "Classe N2 (01.01)",
            //   descricao: "Descrição Classe N2 (01.01)",
            //   eFilhoDe: "01",
            //   tipo: "N2"
            // },
            // {
            //   codigo: "01.01.01",
            //   titulo: "Classe N3 (01.01.01)",
            //   descricao: "Descrição Classe N3 (01.01.01)",
            //   eFilhoDe: "01.01",
            //   tipo: "N3"
            // },
            // {
            //   codigo: "02.01",
            //   titulo: "Classe N2 (02.01)",
            //   descricao: "Descrição Classe N2 (02.01)",
            //   eFilhoDe: "02",
            //   tipo: "N2"
            // },
            // {
            //   codigo: "03.01",
            //   titulo: "Classe N2 (03.01)",
            //   descricao: "Descrição Classe N2 (03.01)",
            //   eFilhoDe: "03",
            //   tipo: "N2"
            // },
            // {
            //   codigo: "01.04",
            //   titulo: "Série (01.04)",
            //   descricao: "Descrição Série (01.04)",
            //   dataInicial: "2020-04-11",
            //   dataFinal: "2020-04-13",
            //   tUA: "Coleção",
            //   tSerie: "Fechada",
            //   suporte: "Papel",
            //   medicao: "35",
            //   UIs: [],
            //   localizacao: ["Localização a definir..."],
            //   entProdutoras: [],
            //   tipologiasProdutoras: [],
            //   legislacao: [],
            //   relacoes: [
            //     {
            //       relacao: "Complementar de",
            //       serieRelacionada: { codigo: "01.03", tipo: "Série" }
            //     },
            //     {
            //       relacao: "Complementar de",
            //       serieRelacionada: { codigo: "01.04.01", tipo: "Subsérie" }
            //     }
            //   ],
            //   pca: null,
            //   formaContagem: { forma: null },
            //   justificacaoPCA: [],
            //   df: "Conservação",
            //   justificacaoDF: [
            //     {
            //       tipo: "Critério de Complementaridade Informacional",
            //       nota: "É complementar de: ",
            //       relacoes: [{ codigo: "01.03" }, { codigo: "01.04.01" }]
            //     }
            //   ],
            //   notaPCA: null,
            //   notaDF: null,
            //   eFilhoDe: "01",
            //   tipo: "Série"
            // },
            // {
            //   codigo: "01.03",
            //   titulo: "Série (01.03)",
            //   descricao: "Descrição Série (01.03)",
            //   dataInicial: null,
            //   dataFinal: null,
            //   tUA: "Processo",
            //   tSerie: "Aberta",
            //   suporte: "Eletrónico Nativo",
            //   UIs: ["01"],
            //   medicao: "12",
            //   localizacao: ["Torre do Tombo"],
            //   entProdutoras: [],
            //   tipologiasProdutoras: [],
            //   legislacao: [],
            //   relacoes: [
            //     {
            //       relacao: "Complementar de",
            //       serieRelacionada: { codigo: "01.04", tipo: "Série" }
            //     }
            //   ],
            //   pca: "",
            //   formaContagem: {
            //     forma: "vc_pcaFormaContagem_extincaoDireito"
            //   },
            //   justificacaoPCA: [],
            //   df: "Conservação",
            //   justificacaoDF: [
            //     {
            //       tipo: "Critério de Complementaridade Informacional",
            //       nota: "É complementar de: ",
            //       relacoes: [{ codigo: "01.04" }]
            //     }
            //   ],
            //   notaPCA: null,
            //   notaDF: null,
            //   eFilhoDe: "01",
            //   tipo: "Série"
            // },
            // {
            //   codigo: "01.04.01",
            //   titulo: "Subsérie (01.04.01)",
            //   descricao: "Descrição Subsérie (01.04.01)",
            //   dataInicial: null,
            //   dataFinal: null,
            //   relacoes: [
            //     {
            //       relacao: "Complementar de",
            //       serieRelacionada: { codigo: "01.04", tipo: "Série" }
            //     }
            //   ],
            //   UIs: ["02"],
            //   pca: "Conservação",
            //   formaContagem: {
            //     forma: "vc_pcaFormaContagem_extincaoDireito"
            //   },
            //   justificacaoPCA: [
            //     {
            //       tipo: "Critério Gestionário",
            //       nota:
            //         "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para a definição do prazo o tempo do mandato de maior duração: 5 anos."
            //     }
            //   ],
            //   df: null,
            //   justificacaoDF: [
            //     {
            //       tipo: "Critério de Complementaridade Informacional",
            //       nota: "É complementar de: ",
            //       relacoes: [{ codigo: "01.04" }]
            //     }
            //   ],
            //   notaPCA: null,
            //   notaDF: null,
            //   eFilhoDe: "01.04",
            //   tipo: "Subsérie"
            // }
          ],
          UIs: [
            // {
            //   codigo: "01",
            //   codCota: "1",
            //   titulo: "1",
            //   dataInicial: "2020-03-01",
            //   dataFinal: "2020-03-03",
            //   produtor: { tipologiasProdutoras: [], entProdutoras: [] },
            //   classesAssociadas: [{ codigo: "01.03", tipo: "Série" }],
            //   descricao: "1",
            //   notas: "1",
            //   localizacao: "1"
            // },
            // {
            //   codigo: "02",
            //   codCota: "2",
            //   titulo: "2",
            //   dataInicial: "2020-04-20",
            //   dataFinal: "2020-04-21",
            //   produtor: { tipologiasProdutoras: [], entProdutoras: [] },
            //   classesAssociadas: [{ codigo: "01.04.01", tipo: "Subsérie" }],
            //   descricao: "2",
            //   notas: "2",
            //   localizacao: "2"
            // }
          ]
        }
      }
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
      this.loading_circle = true;
      if (this.idPendente != null) {
        let updatePendente = {
          _id: this.idPendente,
          objeto: {
            rada: this.RADA,
            entidades: this.entidades.filter(e => e.estado_no_sistema == "Nova"),
            legislacao: this.legislacao.filter(e => e.estado_no_sistema == "Nova")
          }
        };

        let response = this.$request("put", "/pendentes", updatePendente);

        response.then(resp => {
          if (continuar_ou_nao == "nao") {
            this.dialogRADAPendente = true;
          } else {
            this.alert_guardar = true;

            setTimeout(() => {
              this.alert_guardar = false;
            }, 5000);
          }
          this.loading_circle = false;
          this.toSave = false;
        });
      } else {
        let pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "RADA",
          objeto: {
            rada: this.RADA,
            entidades: this.entidades.filter(e => e.estado_no_sistema == "Nova"),
            legislacao: this.legislacao.filter(e => e.estado_no_sistema == "Nova")
          },
          criadoPor: this.userEmail,
          user: { email: this.userEmail },
          token: this.$store.state.token
        };

        let response = this.$request("post", "/pendentes", pendenteParams);

        response.then(resp => {
          if (continuar_ou_nao == "sim") {
            this.idPendente = resp.data._id;
            this.pode_remover = true;
            this.alert_guardar = true;

            setTimeout(() => {
              this.alert_guardar = false;
            }, 5000);
          } else {
            this.dialogRADAPendente = true;
          }

          this.toSave = false;
          this.loading_circle = false;
        });
      }
    }
  },
  async created() {
    let userBD = this.$verifyTokenUser();

    let user_entidade_completa = await this.$request(
      "get",
      "/entidades/" + userBD.entidade
    );

    this.RADA.entRes.push(
      user_entidade_completa.data.sigla +
        " - " +
        user_entidade_completa.data.designacao
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
