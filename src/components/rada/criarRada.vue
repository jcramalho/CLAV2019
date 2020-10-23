<template>
  <v-card class="ma-4" style="background-color:#fafafa">
    <v-card-title
      class="indigo darken-4 white--text"
    >Criar Relatório de Avaliação de Documentação Acumulada</v-card-title>
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
            @guardar="guardarTrabalho"
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
            @guardar="guardarTrabalho"
            @remover="toDelete = true"
            @validar="validarRADA"
            :legislacao="legislacao"
            :RE="RADA.RE"
            :TS="RADA.tsRada"
            :entidades="entidades"
            :legislacaoProcessada="legislacaoProcessada"
            :loading_circle.sync="loading_circle_ts"
            :pode_remover="pode_remover"
          />
          <v-alert
            width="100%"
            :value="!!erroProdutoras[0] || !!erros_relacoes[0] || !!erros_datas_uis[0] || !existe_serie || !!erros_em_falta[0]"
            outlined
            type="error"
            prominent
            border="left"
          >
            <div v-if="!!erros_em_falta[0]">
              <b>Os seguintes constituintes do RADA estão incompletos ou por preencher:</b>
              <ul>
                <li v-for="(em_falta, i) in erros_em_falta" :key="i">{{em_falta}}</li>
              </ul>
              <br />
            </div>
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
            <div v-if="!existe_serie">
              <b>Deve adicionar séries ao RADA, antes de o submeter. Tem possibilidade de associar unidades de instalação às séries em avaliação.</b>
            </div>
          </v-alert>
          <v-alert
            width="100%"
            :value="alert_valido"
            outlined
            type="success"
            prominent
            border="left"
          >Validação efetuada com sucesso!</v-alert>
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
    InformacaoGeral,
  },
  mixins: [mixin_criacao_rada],
  data() {
    return {
      //loading_circle: false,
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
            //"AAN - Autoridade Aeronáutica Nacional"
            // "ADSE - Instituto de Proteção e Assistência na Doença, IP"
          ],
          tipologiasProd: null,
          // dataInicial: "2020-08-10",
          // dataFinal: "2020-08-12",
          dataInicial: null,
          dataFinal: null,
          dimSuporte: {
            nSeries: null,
            nSubseries: null,
            nUI: null,
            medicaoUI_papel: null,
            medicaoUI_digital: null,
            medicaoUI_outros: null,
          },
          hist_admin: "",
          hist_cust: "",
          sist_org: "",
          localizacao: "",
          est_conser: "",
        },
        tsRada: {
          titulo: "",
          UIs: [
            // {
            //   codigo: "1",
            //   codCota: "3",
            //   titulo: "Unidade de Instalação",
            //   dataInicial: "2020-05-13",
            //   dataFinal: "2020-05-27",
            //   produtor: {
            //     tipologiasProdutoras: [
            //       // "AAGR - Assembleias de apuramento geral dos resultados",
            //       // "ACE - Administração Central do Estado"
            //     ],
            //     entProdutoras: [
            //       // "ACSS - Administração Central do Sistema de Saúde, IP",
            //       // "ADSE - Instituto de Proteção e Assistência na Doença, IP"
            //     ]
            //   },
            //   classesAssociadas: [
            //     { codigo: "01.02", tipo: "Série" },
            //     { codigo: "01.02.01", tipo: "Subsérie" }
            //   ],
            //   descricao: "Descrição da UI 1",
            //   notas: "Sem notas! ",
            //   localizacao: "Felgueiras"
            // }
            // {
            //   codigo: "2",
            //   codCota: "3",
            //   titulo: "Unidade de Instalação bem fixe",
            //   dataInicial: "2020-05-13",
            //   dataFinal: "2020-05-27",
            //   produtor: {
            //     tipologiasProdutoras: [
            //       // "AAGR - Assembleias de apuramento geral dos resultados",
            //       // "ACE - Administração Central do Estado"
            //     ],
            //     entProdutoras: [
            //       // "ACSS - Administração Central do Sistema de Saúde, IP",
            //       // "ADSE - Instituto de Proteção e Assistência na Doença, IP"
            //     ]
            //   },
            //   classesAssociadas: [
            //     { codigo: "01.02", tipo: "Série" },
            //     { codigo: "01.03", tipo: "Subsérie" },
            //     { codigo: "01.02.01", tipo: "Subsérie" },
            //     { codigo: "01.05", tipo: "Série" }
            //   ],
            //   descricao: "Descrição da UI 1",
            //   notas: "Sem notas! ",
            //   localizacao: "Felgueiras"
            // }
          ],
          classes: [
            // {
            //   codigo: "01",
            //   titulo: "Classe 01",
            //   descricao: "Descrição",
            //   eFilhoDe: null,
            //   tipo: "N1",
            // },
            // {
            //   codigo: "01.01",
            //   titulo: "Classe 01.01",
            //   descricao: "Descrição",
            //   eFilhoDe: "01",
            //   tipo: "N2",
            // },
            // {
            //   codigo: "01.01.01",
            //   titulo: "Classe 01.01.01",
            //   descricao: "Descrição 01.01.01",
            //   eFilhoDe: "01.01",
            //   tipo: "N3",
            // },
            // {
            //   codigo: "01.02",
            //   titulo: "Serie 01.02",
            //   descricao: "Descrição 01.02",
            //   dataInicial: "2020-05-01",
            //   dataFinal: "2020-05-28",
            //   tUA: "Coleção",
            //   tSerie: "Aberta",
            //   suporte_e_medicao: [
            //     { suporte: "Eletrónico Digitalizado", medicao: "56" },
            //   ],
            //   UIs: [],
            //   localizacao: ["Lisboa"],
            //   entProdutoras: [
            //     // "ACSS - Administração Central do Sistema de Saúde, IP",
            //     // "ADSE - Instituto de Proteção e Assistência na Doença, IP"
            //   ],
            //   tipologiasProdutoras: [
            //     // "AAGR - Assembleias de apuramento geral dos resultados",
            //     // "ACE - Administração Central do Estado"
            //   ],
            //   legislacao: [],
            //   relacoes: [],
            //   pca: "5",
            //   notaPCA: "Sem notas",
            //   notaDF: "Sem notas DF",
            //   formaContagem: { forma: "vc_pcaFormaContagem_cessacaoVigencia" },
            //   justificacaoPCA: [
            //     {
            //       tipo: "Critério Gestionário",
            //       nota:
            //         "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para a definição do prazo o tempo do mandato de maior duração: 5 anos.",
            //     },
            //   ],
            //   df: null,
            //   justificacaoDF: [],
            //   eFilhoDe: "01",
            //   tipo: "Série",
            // },
            // {
            //   codigo: "01.02.01",
            //   titulo: "Subsérie 01.02.01",
            //   descricao: "Descrição 01.02.01",
            //   dataInicial: "2020-05-01",
            //   dataFinal: "2020-05-28",
            //   relacoes: [],
            //   UIs: ["1"],
            //   pca: "10",
            //   notaPCA: "Sem ntoas PCA",
            //   notaDF: "12",
            //   formaContagem: {
            //     forma: "vc_pcaFormaContagem_disposicaoLegal",
            //     subforma: "vc_pcaSubformaContagem_F01.02",
            //   },
            //   justificacaoPCA: [
            //     {
            //       tipo: "Critério Gestionário",
            //       nota:
            //         "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para a definição do prazo o tempo do mandato de maior duração: 5 anos.",
            //     },
            //   ],
            //   df: null,
            //   justificacaoDF: [],
            //   eFilhoDe: "01.02",
            //   tipo: "Subsérie",
            // },
            // {
            //   codigo: "01.03",
            //   titulo: "Série 01.03",
            //   descricao: "Descrição 01.03",
            //   dataInicial: "2020-05-01",
            //   dataFinal: "2020-05-28",
            //   tUA: "Processo",
            //   tSerie: "Aberta",
            //   suporte_e_medicao: [{ suporte: "Outro", medicao: "12" }],
            //   localizacao: ["Porto"],
            //   entProdutoras: [
            //     // "ACSS - Administração Central do Sistema de Saúde, IP"
            //   ],
            //   tipologiasProdutoras: [
            //     // "AAGR - Assembleias de apuramento geral dos resultados",
            //     // "ACE - Administração Central do Estado"
            //   ],
            //   legislacao: [],
            //   relacoes: [
            //     {
            //       relacao: "Sintetizado por",
            //       serieRelacionada: { codigo: "01.02", tipo: "Série" }
            //     },
            //     {
            //       relacao: "Cruzado de",
            //       serieRelacionada: { codigo: "01.02.01", tipo: "Subsérie" }
            //     }
            //   ],
            //   UIs: [],
            //   pca: null,
            //   notaPCA: null,
            //   notaDF: null,
            //   formaContagem: { forma: null },
            //   justificacaoPCA: [],
            //   df: "Eliminação",
            //   justificacaoDF: [
            //     {
            //       tipo: "Critério de Densidade Informacional",
            //       nota: "Informação sintetizada e recuperável em: ",
            //       relacoes: [{ codigo: "01.02" }]
            //     }
            //   ],
            //   eFilhoDe: "01",
            //   tipo: "Série"
            // },
            // {
            //   codigo: "01.05",
            //   titulo: "Série 01.05",
            //   descricao: "Descrição 01.05",
            //   dataInicial: "2020-05-01",
            //   dataFinal: "2020-05-28",
            //   tUA: "Processo",
            //   tSerie: "Aberta",
            //   suporte_e_medicao: [{ suporte: "Papel", medicao: "90" }],
            //   localizacao: ["Braga"],
            //   entProdutoras: [
            //     // "ADSE - Instituto de Proteção e Assistência na Doença, IP"
            //   ],
            //   tipologiasProdutoras: [
            //     // "AAGR - Assembleias de apuramento geral dos resultados",
            //     // "ACE - Administração Central do Estado"
            //   ],
            //   legislacao: [],
            //   relacoes: [
            //     {
            //       relacao: "Suplemento de",
            //       serieRelacionada: { codigo: "01.02", tipo: "Série" }
            //     }
            //   ],
            //   UIs: [],
            //   pca: null,
            //   notaPCA: "Tem notas porque não tem PCA",
            //   notaDF: "",
            //   formaContagem: { forma: "vc_pcaFormaContagem_cessacaoVigencia" },
            //   justificacaoPCA: [
            //     {
            //       tipo: "Critério Gestionário",
            //       nota:
            //         "Prazo para imputação de responsabilidade pela gestão estratégica, decorrente de escrutínio público (eleições) ou da não recondução no mandato. Considerou-se para a definição do prazo o tempo do mandato de maior duração: 5 anos."
            //     }
            //   ],
            //   df: "Conservação Parcial",
            //   justificacaoDF: [],
            //   eFilhoDe: "01",
            //   tipo: "Série"
            // }
          ],
        },
      },
    };
  },
  watch: {
    e1(v) {
      if (v > 1 && !this.guardar) {
        this.guardar = true;
      }
    },
  },
  methods: {
    eliminarTrabalho() {
      this.$request("delete", "/pendentes/" + this.idPendente).then(
        (response) => {
          this.$router.push("/");
        }
      );
    },
    guardarTrabalho(continuar_ou_nao) {
      //this.loading_circle = true;
      if (this.idPendente != null) {
        let updatePendente = {
          _id: this.idPendente,
          objeto: {
            rada: this.RADA,
            entidades: this.entidades.filter(
              (e) => e.estado_no_sistema == "Nova"
            ),
            legislacao: this.legislacao.filter((e) => e.estado == "Nova"),
          },
        };

        let response = this.$request("put", "/pendentes", updatePendente);

        response.then((resp) => {
          if (continuar_ou_nao == "nao") {
            this.dialogRADAPendente = true;
          } else {
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
            entidades: this.entidades.filter(
              (e) => e.estado_no_sistema == "Nova"
            ),
            legislacao: this.legislacao.filter((e) => e.estado == "Nova"),
          },
          criadoPor: this.userEmail,
          user: { email: this.userEmail },
          token: this.$store.state.token,
        };

        let response = this.$request("post", "/pendentes", pendenteParams);

        response.then((resp) => {
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
        });
      }
    },
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
  },
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
  height: auto;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
