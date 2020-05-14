<template>
  <div>
    <span style="display:none;">{{colorSwitch}}</span>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Fonte de Legitimação</div>
      </v-col>
      <v-col class="mr-2">
        <v-text-field
          solo
          readonly
          hide-details
          :background-color="p.objeto.dados.cores.legislacao"
          :value="p.objeto.dados.ae.legislacao"
        >
          <template slot="append">
            <v-icon color="green" @click="p.objeto.dados.cores.legislacao='green lighten-3'">check</v-icon>
            <v-icon color="red" @click="p.objeto.dados.cores.legislacao='red lighten-3'">clear</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div class="info-label">Fundo</div>
      </v-col>
      <v-col class="mr-2">
          <v-text-field
            v-for="(f, i) in p.objeto.dados.ae.fundo" :key="i"
            class="mb-1"
            solo
            readonly
            hide-details
            :background-color="p.objeto.dados.cores.fundo[i]"
            :value="f"
          >
            <template slot="append">
              <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.fundo[i]='green lighten-3'">check</v-icon>
              <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.fundo[i]='red lighten-3'">clear</v-icon>
            </template>
          </v-text-field>
      </v-col>
    </v-row>
    <v-expansion-panels popout>
      <v-expansion-panel class="ma-1">
        <v-expansion-panel-header class="pa-2 indigo darken-4 title white--text">Classes</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-group
              v-for="(item,index) in p.objeto.dados.ae.zonaControlo"
              :key="item.codigo"
              color="grey darken-1"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content class="info-label">
                  <v-list-item-title
                    v-if="item.codigo && item.referencia"
                    v-text="
                        item.codigo +
                        ', ' +
                        item.referencia +
                        ' - ' +
                        item.titulo
                    "
                  ></v-list-item-title>
                  <v-list-item-title
                    v-else-if="item.codigo"
                    v-text="item.codigo+ ' - ' + item.titulo"
                  ></v-list-item-title>
                  <v-list-item-title v-else v-text="item.referencia+ ' - ' + item.titulo"></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item-content>
                <v-list-item-title>
                  <v-row v-if="item.codigo">
                    <v-col cols="4">
                      <div class="info-label">Código da Classe</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.codigo"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].classe='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].classe='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row v-if="item.referencia">
                    <v-col cols="4">
                      <div class="info-label">Referência</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.referencia"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="item.titulo">
                    <v-col cols="4">
                      <div class="info-label">Título</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.titulo"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="item.prazoConservacao">
                    <v-col cols="4">
                      <div class="info-label">Prazo de Conservação Administrativa</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        v-if="item.prazoConservacao=='1'"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.prazoConservacao+' Ano'"
                      />
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.prazoConservacao+' Anos'"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="item.destino">
                    <v-col cols="4">
                      <div class="info-label">Destino Final</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        v-if="item.destino === 'E'"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        value="Eliminação"
                      />
                      <v-text-field
                        v-else-if="item.destino === 'C'"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        value="Conservação"
                      />
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.destino"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="item.ni">
                    <v-col cols="4">
                      <div class="info-label">Natureza de intervenção</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].classe"
                        :value="item.ni"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="item.dono">
                    <v-col cols="4">
                      <div class="info-label">Donos do PN</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        v-for="(d, i) in item.dono"
                        :key="i"
                        class="mb-1"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].dono[i]"
                        :value="d"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].dono[i]='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].dono[i]='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Data de Início</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].dataInicio"
                        :value="item.dataInicio"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].dataInicio='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].dataInicio='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Data de Fim</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].dataFim"
                        :value="item.dataFim"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].dataFim='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].dataFim='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Medição das UI em papel (m.l.)</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        v-if="item.uiPapel"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].uiPapel"
                        :value="item.uiPapel"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiPapel='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiPapel='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].uiPapel"
                        value="0"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiPapel='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiPapel='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Medição das UI em digital (Gb)</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        v-if="item.uiDigital"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].uiDigital"
                        :value="item.uiDigital"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiDigital='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiDigital='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].uiDigital"
                        value="0"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiDigital='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiDigital='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <div class="info-label">Medição das UI noutros suportes</div>
                    </v-col>
                    <v-col class="mr-2">
                      <v-text-field
                        v-if="item.uiOutros"
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].uiOutros"
                        :value="item.uiOutros"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiOutros='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiOutros='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="p.objeto.dados.cores.zonaControlo[index].uiOutros"
                        value="0"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiOutros='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].uiOutros='red lighten-3'">clear</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <div class="ma-1">
                    <v-data-table
                      :headers="cabecalho"
                      :items="item.agregacoes"
                      :items-per-page="5"
                      class="elevation-1 mt-3"
                      :footer-props="footer_props"
                      :search="search"
                    >
                    <template v-slot:top>
                      <v-toolbar flat :color="p.objeto.dados.cores.zonaControlo[index].agregacoes">
                        <span style="font-weight: 400; color: #1a237e; font-weight: bold;">Lista de Agregações

                        </span>
                        <v-spacer />
                        <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].agregacoes='green lighten-3'">check</v-icon>
                        <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index].agregacoes='red lighten-3'">clear</v-icon>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Procura"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-toolbar>
                    </template>
                    </v-data-table>
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-group>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog se existir erros no pedido à API -->
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";

export default {
  props: ["p","tipo"],

  components: {
    PO,
    ErroDialog,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      dialogTipologias: false,
      search: "",
      colorSwitch: 0,
      cabecalho: [
        { text: "Código", align: "left", sortable: false, value: "codigo" },
        { text: "Título", align: "left", value: "titulo" },
        { text: "Data de Contagem", align: "center", value: "dataContagem" },
        { text: "Natureza de Intervenção", align: "center", value: "ni" },
      ],
      footer_props: {
        "items-per-page-text": "Mostrar",
      },
    };
  },

  methods: {
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    async finalizarPedido(dados) {
      try {
        if(this.tipo!="AE RADA" || this.tipo!="AE PGD") {
          let pedido = JSON.parse(JSON.stringify(this.p));

          var numeroErros = 0;

          if (numeroErros > 0) {
            this.erroPedido = true;
          } else {
            for (const key in pedido.objeto.dados) {
              if (
                pedido.objeto.dados[key] === undefined ||
                pedido.objeto.dados[key] === null ||
                pedido.objeto.dados[key] === ""
              ) {
                delete pedido.objeto.dados[key];
              }
            }

            await this.$request("post", "/autosEliminacao", {
              auto: pedido.objeto.dados.ae,
            });

            const estado = "Validado";

            let dadosUtilizador = this.$verifyTokenUser();

            const novaDistribuicao = {
              estado: estado,
              responsavel: dadosUtilizador.email,
              data: new Date(),
              despacho: dados.mensagemDespacho,
            };

            pedido.estado = estado;
            pedido.token = this.$store.state.token;

            await this.$request("put", "/pedidos", {
              pedido: pedido,
              distribuicao: novaDistribuicao,
            });

            this.$router.go(-1);
          }
        } else {
          this.erroPedido = true;
          
          this.erros.push({
            sobre: "RADA e PGD",
            mensagem: "Importação de Autos Eliminação para RADA e PGD temporáriamente indisponivel",
          });
        }
      } catch (e) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
        //console.log("e :", e);
        }
      }
    },

    fecharErro() {
      this.erroPedido = false;
    },

    close() {
      this.dialogTipologias = false;
    },

  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
