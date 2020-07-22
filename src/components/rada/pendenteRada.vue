<template>
  <v-card class="ma-4" style="background-color:#fafafa">
    <v-card-title class="indigo darken-4 white--text">
      Criar Relatório de Avaliação de Documentação Acumulada
      <v-spacer />
      <v-btn style="background-color: #1a237e;" dark @click="toSave = true">
        Guardar Trabalho
        <v-icon right>save</v-icon>
      </v-btn>

      <v-icon dark color="red" @click="toDelete = true" right>delete_sweep</v-icon>
    </v-card-title>
    <v-card-text>
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
            :RE="RADA.RE"
            :UIs="RADA.tsRada.UIs"
            :classes="RADA.tsRada.classes"
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
        <v-dialog v-model="dialogRADAPendente" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline">Trabalho pendente guardado</v-card-title>
            <v-card-text>
              <p>
                Os seus dados foram guardados para que possa retomar o trabalho
                mais tarde.
              </p>
              <!-- <p>{{ mensagemPendenteCriadoOK }}</p> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/pendentes')">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
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
  props: ["obj"],
  components: {
    RelatorioExpositivo,
    TSRada,
    InformacaoGeral
  },
  data() {
    return {
      alert_guardar: false,
      user_entidade: null,
      toSave: false,
      toDelete: false,
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
      userEmail: "",
      RADA: this.obj.objeto.rada
    };
  },
  methods: {
    //ATUALIZAR O PENDENTE
    guardarTrabalho: function(continuar_ou_nao) {
      let updatePendente = {
        _id: this.obj._id,
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
    },
    changeE1: function(e) {
      this.e1 = e;
    },
    //ELIMINAR O PENDENTE
    eliminarTrabalho: function() {
      this.$request("delete", "/pendentes/" + this.obj._id).then(response => {
        this.$router.push("/pendentes");
      });
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
      let series = this.RADA.tsRada.classes
        // adicionar os IDS às classes
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

      // ELIMINAR O PENDENTE DEPOIS DE FAZER O PEDIDO
      await this.$request("delete", "/pendentes/" + this.obj._id);

      this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
      this.dialogRADACriado = true;
    }
  },
  created: async function() {
    // Pedido para a legislação e processamento para formulários!
    let l = await this.$request("get", "/legislacao");
    this.legislacao = l.data;
    // Inserir as legislações que foram criadas na sessão antiga, verificando se já não foram aprovadas!
    for (let i = 0; i < this.obj.objeto.legislacao.length; i++) {
      if (
        !this.legislacao.some(
          e =>
            e.tipo == this.obj.objeto.legislacao[i].tipo &&
            e.numero == this.obj.objeto.legislacao[i].numero
        )
      ) {
        this.legislacao.push(this.obj.objeto.legislacao[i]);
      }
    }
    // Processamento para formulários
    this.legislacaoProcessada = this.legislacao.map(item => {
      return {
        id: item.id,
        legislacao: item.tipo + " " + item.numero + " - " + item.sumario
      };
    });

    // Pedido para as entidades e processamento para formulários!
    let response = await this.$request("get", "/entidades");
    this.entidades = response.data;

    // Inserir as entidades que foram criadas na sessão antiga
    for (let j = 0; j < this.obj.objeto.entidades.length; j++) {
      if (
        !this.entidades.some(
          e =>
            e.sigla == this.obj.objeto.entidades[j].sigla &&
            e.designacao == this.obj.objeto.entidades[j].designacao
        )
      ) {
        this.entidades.push(this.obj.objeto.entidades[j]);
      }
    }
    // Processamento para formulários
    this.entidadesProcessadas = this.entidades.map(item => {
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
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
</style>
