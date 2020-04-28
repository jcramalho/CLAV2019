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
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1" >
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral @seguinte="changeE1" :RADA="RADA" :entidades="entidades" />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2" >
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
        <v-stepper-step color="amber accent-3" :key="3" :complete="e1 > 3" :step="3" >
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada
            @done="concluir"
            @voltar="changeE1"
            :legislacao="legislacao"
            :RE="RADA.RE"
            :TS="RADA.tsRada"
            :entidades="entidades"
            :legislacaoProcessada="legislacaoProcessada"
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
                >Não, pretendo continuar depois.</v-btn>
                <v-btn
                  class="ma-3 pa-3"
                  color="indigo lighten-3"
                  @click="guardarTrabalho('sim')"
                >Sim.</v-btn>
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

export default {
  components: {
    RelatorioExpositivo,
    TSRada,
    InformacaoGeral
  },
  data() {
    return {
      loading_circle: false,
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
      legislacaoProcessada: [],
      entidadesProcessadas: [],
      e1: 1,
      titulo: "",
      guardar: false,
      RADA: {
        id: nanoid(),
        titulo: "",
        despachoAprovacao: null,
        dataAprovacao: null,
        despachoRevogacao: null,
        dataRevogacao: null,
        entRes: [],
        pedidosLegislacao: [],
        pedidosEntidades: [],
        RE: {
          entidadesProd: [
            "ACSS - Administração Central do Sistema de Saúde, IP",
            "ADSE - Instituto de Proteção e Assistência na Doença, I.P."
          ],
          tipologiasProd: [],
          dataInicial: "2020-02-27",
          dataFinal: "2020-05-01",
          // dataInicial: null,
          // dataFinal: null,
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
            //   notas: "Notas da Série (01.04)",
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
            //   pca: 2,
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
            //   notas: "",
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
            //   pca: "2",
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
            //   df: "Conservação",
            //   justificacaoDF: [
            //     {
            //       tipo: "Critério de Complementaridade Informacional",
            //       nota: "É complementar de: ",
            //       relacoes: [{ codigo: "01.04" }]
            //     }
            //   ],
            //   notas: "Notas do Destino Final",
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
      this.loading_circle = true;
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
    },
    changeE1: function(e) {
      this.e1 = e;
    },
    calcular_dimensao_suporte(series) {
      this.RADA.RE.dimSuporte.nSeries = series.length;
      this.RADA.RE.dimSuporte.nSubseries = this.RADA.tsRada.classes.filter(
        e => e.tipo == "Subsérie"
      ).length;
      // adicionar ids às UIs
      this.RADA.RE.dimSuporte.nUI = this.RADA.tsRada.UIs.map(ui => {
        ui["id"] = "rada_" + this.RADA.id + "_ui_" + ui.codigo;
        return ui;
      }).length;
      this.RADA.RE.dimSuporte.medicaoUI_papel = series
        .filter(e => e.suporte == "Papel")
        .reduce((acc, a) => {
          return acc + Number(a.medicao);
        }, 0);
      this.RADA.RE.dimSuporte.medicaoUI_digital = series
        .filter(
          e =>
            e.suporte == "Eletrónico Digitalizado" ||
            e.suporte == "Eletrónico Nativo"
        )
        .reduce((acc, a) => {
          return acc + Number(a.medicao);
        }, 0);

      this.RADA.RE.dimSuporte.medicaoUI_outros = series
        .filter(e => e.suporte == "Outro")
        .reduce((acc, a) => {
          return acc + Number(a.medicao);
        }, 0);
    },
    // Fazer pedidos para as entidades
    async fazer_pedidos_entidades(series) {
      //  filtrar as novas entidaaddes criadas e que estão associadas a classes ou UIs
      let entidades = this.entidades.filter(
        e =>
          e.estado == "Nova" &&
          (series.some(cl =>
            cl.entProdutoras.some(ent => ent == e.sigla + " - " + e.designacao)
          ) ||
            this.RADA.tsRada.UIs.some(ui =>
              ui.produtor.entProdutoras.some(
                ent => ent == e.sigla + " - " + e.designacao
              )
            ))
      );

      for (let i = 0; i < entidades.length; i++) {
        let pedidoEntidades = {
          tipoPedido: "Criação",
          tipoObjeto: "Entidade",
          novoObjeto: {
            estado: "Ativa",
            designacao: entidades[i].designacao,
            internacional: entidades[i].internacional,
            sigla: entidades[i].sigla,
            sioe: entidades[i].sioe,
            tipologiasSel: entidades[i].tipologiasSel.map(tipologia => {
              let tip = tipologia.split(" - ");
              return {
                sigla: tip[0],
                designacao: tip[1],
                id: "tip_" + tip[0]
              };
            }),
            dataCriacao: entidades[i].dataCriacao,
            codigo: ""
          },
          user: {
            email: this.userEmail
          },
          token: this.$store.state.token,
          criadoPor: this.userEmail,
          entidade: this.user_entidade
        };

        let response = await this.$request("post", "/pedidos", pedidoEntidades);

        this.RADA.pedidosEntidades.push(response.data);
      }
    },
    async fazer_pedidos_legislacao(series) {
      let legislacao = this.legislacao
        .filter(
          e =>
            e.estado == "Nova" &&
            series.some(cl =>
              cl.legislacao.some(
                legis =>
                  legis.legislacao ==
                  e.tipo + " " + e.numero + " - " + e.sumario
              )
            )
        )
        .map(leg => {
          leg["codigo"] = "";
          leg["diplomaFonte"] = "RADA";
          leg["estado"] = "Ativo";
          leg["processosSel"] = [];
          if (leg.link == null) {
            leg["link"] = "";
          }
          // Adicionar série à qual está relacionada;
          leg["processosSel"] = series
            .filter(cl =>
              cl.legislacao.some(
                legis =>
                  legis.legislacao ==
                  leg.tipo + " " + leg.numero + " - " + leg.sumario
              )
            )
            .map(cl => {
              return {
                codigo: cl.codigo,
                titulo: cl.titulo,
                id: cl.id,
                tituloRada: this.RADA.titulo
              };
            });
          // Adicionar entidades relacionadas com a criação legislação
          leg["entidadesSel"] = this.RADA.entRes.map(entidade => {
            let ent = entidade.split(" - ");

            return {
              designacao: ent[1],
              sigla: ent[0],
              id: "ent_" + ent[0]
            };
          });

          return leg;
        });

      for (let i = 0; i < legislacao.length; i++) {
        let pedidoLegis = {
          tipoPedido: "Criação",
          tipoObjeto: "Legislação",
          novoObjeto: legislacao[i],
          user: {
            email: this.userEmail
          },
          token: this.$store.state.token,
          criadoPor: this.userEmail,
          entidade: this.user_entidade
        };

        let response = await this.$request("post", "/pedidos", pedidoLegis);

        this.RADA.pedidosLegislacao.push(response.data);
      }
    },
    concluir: async function() {
      //  Filtrar as entidades produtoras ou tipologias produtoras para verificar o invariante
      //  em que as produtoras tem que estar associadas pelo menos a uma série ou ui
      if (!!this.RADA.RE.entidadesProd[0]) {
        this.RADA.RE.entidadesProd = this.entidadesProcessadas
          .filter(e => e.disabled == true)
          .map(e => e.entidade);
      } else {
        this.RADA.RE.tipologiasProd = this.tipologias
          .filter(t => t.disabled == true)
          .map(t => t.tipologia);
      }

      let series = this.RADA.tsRada.classes
        // adicionar os IDS a todas as classes
        .map(e => {
          let tipo = null;

          switch (e.tipo) {
            case "Série":
              tipo = "serie";
              break;
            case "Subsérie":
              tipo = "subserie";
              break;
            default:
              tipo = "organico_funcional";
              break;
          }

          e["id"] = "rada_" + this.RADA.id + "_" + tipo + "_" + e.codigo;

          return e;
        })
        .filter(e => e.tipo == "Série");

      // Calcular os valores de dimensão e suporte no relatório expositivo
      this.calcular_dimensao_suporte(series);

      // Tratar dos pedidos das novas legislações
      await this.fazer_pedidos_legislacao(series);

      // Tratar dos pedidos da novas entidades
      await this.fazer_pedidos_entidades(series);

      // Fazer pedido do RADA
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
    // Pedido para a legislação e processamento para formulários!
    let l = await this.$request("get", "/legislacao");
    this.legislacao = l.data;

    this.legislacaoProcessada = l.data.map(item => {
      return {
        id: item.id,
        legislacao: item.tipo + " " + item.numero + " - " + item.sumario
      };
    });

    // Pedido para as entidades e processamento para formulários!
    let response = await this.$request("get", "/entidades");
    this.entidades = response.data;

    this.entidadesProcessadas = response.data.map(item => {
      return {
        entidade: item.sigla + " - " + item.designacao,
        disabled: false
      };
    });

    // Pedido para tipologias e seu processamento para formulários!
    response = await this.$request("get", "/tipologias");
    this.tipologias = response.data.map(item => {
      return {
        tipologia: item.sigla + " - " + item.designacao,
        disabled: false
      };
    });

    let userBD = this.$verifyTokenUser();
    this.userEmail = userBD.email;

    this.user_entidade = userBD.entidade;

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
