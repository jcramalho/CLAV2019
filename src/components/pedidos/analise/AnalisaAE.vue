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
          :background-color="cores.legislacao"
          :value="p.objeto.dados.ae.legislacao"
        >
          <template slot="append">
            <v-icon color="green" @click="cores.legislacao='green lighten-3'">check</v-icon>
            <v-icon color="red" @click="cores.legislacao='red lighten-3'">clear</v-icon>
            <!--<v-icon @click="">create</v-icon>-->
            <v-icon>create</v-icon>
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
            :background-color="cores.fundo[i]"
            :value="f"
          >
            <template slot="append">
              <v-icon color="green" @click="colorSwitch++; cores.fundo[i]='green lighten-3'">check</v-icon>
              <v-icon color="red" @click="colorSwitch++; cores.fundo[i]='red lighten-3'">clear</v-icon>
              <!--<v-icon @click="">create</v-icon>-->
              <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].classe"
                        :value="item.codigo"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].classe='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].classe='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].classe"
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
                        :background-color="cores.zonaControlo[index].classe"
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
                        :background-color="cores.zonaControlo[index].classe"
                        :value="item.prazoConservacao+' Ano'"
                      />
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].classe"
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
                        :background-color="cores.zonaControlo[index].classe"
                        value="Eliminação"
                      />
                      <v-text-field
                        v-else-if="item.destino === 'C'"
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].classe"
                        value="Conservação"
                      />
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].classe"
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
                        :background-color="cores.zonaControlo[index].classe"
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
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].dono[i]"
                        :value="d"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].dono[i]='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].dono[i]='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].dataInicio"
                        :value="item.dataInicio"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].dataInicio='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].dataInicio='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].dataFim"
                        :value="item.dataFim"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].dataFim='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].dataFim='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].uiPapel"
                        :value="item.uiPapel"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].uiPapel='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].uiPapel='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
                        </template>
                      </v-text-field>
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].uiPapel"
                        value="0"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].uiPapel='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].uiPapel='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].uiDigital"
                        :value="item.uiDigital"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].uiDigital='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].uiDigital='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
                        </template>
                      </v-text-field>
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].uiDigital"
                        value="0"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].uiDigital='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].uiDigital='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                        :background-color="cores.zonaControlo[index].uiOutros"
                        :value="item.uiOutros"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].uiOutros='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].uiOutros='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
                        </template>
                      </v-text-field>
                      <v-text-field
                        v-else
                        solo
                        readonly
                        hide-details
                        :background-color="cores.zonaControlo[index].uiOutros"
                        value="0"
                      >
                        <template slot="append">
                          <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].uiOutros='green lighten-3'">check</v-icon>
                          <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].uiOutros='red lighten-3'">clear</v-icon>
                          <!--<v-icon @click="">create</v-icon>-->
                          <v-icon>create</v-icon>
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
                      <v-toolbar flat :color="cores.zonaControlo[index].agregacoes">
                        <span style="font-weight: 400; color: #1a237e; font-weight: bold;">Lista de Agregações
                        <v-btn
                          rounded
                          small
                          class="ml-2 indigo accent-4 white--text"
                        >
                          Adicionar Agregação
                        </v-btn>

                        </span>
                        <v-spacer />
                        <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index].agregacoes='green lighten-3'">check</v-icon>
                        <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index].agregacoes='red lighten-3'">clear</v-icon>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Procura"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-toolbar>
                    </template>
                    <template v-slot:item="prop">
                      <tr>
                        <td style=" text-align: left">{{ prop.item.codigo }}</td>
                        <td style=" text-align: left">{{ prop.item.titulo }}</td>
                        <td style=" text-align: center">{{ prop.item.dataContagem }}</td>
                        <td style=" text-align: center">{{ prop.item.ni }}</td>
                        <td style=" text-align: right">
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                v-on="on"
                                color="red"
                                @click="apagarAgregacao(item.agregacoes,prop.item)"
                                >delete</v-icon
                              >
                            </template>
                            <span>Remover Agregação</span>
                          </v-tooltip>
                        </td>
                      </tr>
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
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
export default {
  props: ["p"],

  components: {
    PO
  },

  data() {
    return {
      dialogTipologias: false,
      search: "",
      cores: null,
      colorSwitch: 0,
      cabecalho: [
        { text: "Código", align: "left", sortable: false, value: "codigo", width: "20%"},
        { text: "Título", align: "left", value: "titulo", width: "30%" },
        { text: "Data de Contagem", align: "center", value: "dataContagem", width: "15%"},
        { text: "Natureza de Intervenção", align: "center", value: "ni", width: "25%" },
        { text: "Operações", sortable: false, align: "right", width: "10%" }
      ],
      footer_props: {
        "items-per-page-text": "Mostrar"
      }
    };
  },

  async created() {
    this.cores = {
      legislacao: "white",
      fundo: [],
      zonaControlo: []
    };
    for (var i in this.p.objeto.dados.ae.fundo)
      this.cores.fundo.push("white")
    var index = 0;
    for (var zc of this.p.objeto.dados.ae.zonaControlo) {
      this.cores.zonaControlo[index] = {
        classe: "white",
        dono: [],
        dataInicio: "white",
        dataFim: "white",
        uiPapel: "white",
        uiDigital: "white",
        uiOutros: "white",
        agregacoes: "#e8eaf6"
      };
      for (var d in zc.dono)
        this.cores.zonaControlo[index].dono.push("white")
      index++;
    }
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
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));
        let cores = JSON.parse(JSON.stringify(this.cores));

        pedido.objeto.dados.cores = cores
        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    async encaminharPedido(dados) {
      try {
        const estado = "Apreciado";

        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));
        let cores = JSON.parse(JSON.stringify(this.cores));
        pedido.objeto.dados.cores = cores
        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email
          },
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },

    apagarAgregacao(agregacoes, ag) {
      const index = agregacoes.findIndex(a => a.codigo === ag.codigo)
      if(index!== -1)
        agregacoes.splice(index,1)
    },

    close() {
      this.dialogtipologias = false;
    }
  }
};
</script>

<style>
.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #1a237e;
}

.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}

.panel-info-custom .panel-body {
  font-size: 1pc;
  font-family: "Times New Roman", Times, serif;
}

.panel-noticiabox .panel-body {
  font-size: 1pc;
}

.panel-linkbox .panel-body {
  padding-top: 5px !important;
  padding-left: 30px !important;
  padding-bottom: 10px;
}

li .panel-body {
  padding: 0px;
}

li .panel-body li {
  margin-left: 20px;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
