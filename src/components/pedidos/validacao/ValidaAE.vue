<template>
  <div>
    <span style="display:none;">{{colorSwitch}}</span>
    <v-row>
      <v-col cols="2">
        <div class="info-label" :key="p.objeto.dados.cores.legislacao" :style="'background-color: '+p.objeto.dados.cores.legislacao">Fonte de Legitimação</div>
      </v-col>
      <v-col class="mt-3">
        {{p.objeto.dados.ae.legislacao}}
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="p.objeto.dados.cores.legislacao='#C8E6C9'">check</v-icon>
        <v-icon color="red" @click="p.objeto.dados.cores.legislacao='#FFCDD2'">clear</v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div class="info-label"  :key="p.objeto.dados.cores.fundo" :style="'background-color: '+p.objeto.dados.cores.fundo">Fundo</div>
      </v-col>
      <v-col class="mr-2">
          <div
            v-for="(f, i) in p.objeto.dados.ae.fundo" :key="i"
          >{{f}}
          </div>
      </v-col>
      <v-col cols="1">
              <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.fundo='#C8E6C9'">check</v-icon>
              <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.fundo='#FFCDD2'">clear</v-icon>
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
                <v-list-item-content class="info-label" :key="p.objeto.dados.cores.zonaControlo[index]" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">
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
                  <table class="consulta mx-5">
                    <tr v-if="item.codigo">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Código da Classe</div>
                      </td>
                      <td style="width:70%;">
                        {{ item.codigo }}
                      </td>
                      <td style="width:10%">
                        <v-icon color="green" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index]='#C8E6C9'">check</v-icon>
                        <v-icon color="red" @click="colorSwitch++; p.objeto.dados.cores.zonaControlo[index]='#FFCDD2'">clear</v-icon>  
                      </td>
                    </tr>
                    <tr v-if="item.referencia">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Referência</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.referencia }}
                      </td>
                    </tr>
                    <tr v-if="item.titulo">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Título</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.titulo }}
                      </td>
                    </tr>
                    <tr v-if="item.prazoConservacao">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Prazo de Conservação Administrativa</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.prazoConservacao }} <span v-if="item.prazoConservacao=='1'">Ano</span><span v-else>Anos</span>
                      </td>
                    </tr>
                    <tr v-if="item.destino">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Destino Final</div>
                      </td>
                      <td v-if="item.destino === 'E'" style="width:80%;">
                        Eliminação
                      </td>
                      <td v-else-if="item.destino === 'C'" style="width:80%;">
                        Conservação
                      </td>
                      <td v-else style="width:80%;">
                        {{ item.destino }}
                      </td>
                    </tr>
                    <tr v-if="item.ni && item.destino === 'C'">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">
                          Natureza de intervenção
                        </div>
                      </td>
                      <td style="width:80%;">{{ item.ni }}</td>
                    </tr>
                    <tr v-if="item.dono && item.destino === 'C'">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Donos do PN</div>
                      </td>
                      <td style="width:80%;"><li v-for="(d,i) in item.dono" :key="i">{{ d }}</li></td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Data de Início</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.dataInicio }}
                      </td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">Data de Fim</div>
                      </td>
                      <td style="width:80%;">{{ item.dataFim }}</td>
                    </tr>
                    <tr v-if="item.uiPapel">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">
                          Medição das UI em papel (m.l.)
                        </div>
                      </td>
                      <td style="width:80%;" v-if="item.uiPapel">{{ item.uiPapel }}</td>
                    </tr>
                    <tr v-if="item.uiDigital">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">
                          Medição das UI em digital (Gb)
                        </div>
                      </td>
                      <td style="width:80%;" v-if="item.uiDigital">{{ item.uiDigital }}</td>
                    </tr>
                    <tr v-if="item.uiOutros">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+p.objeto.dados.cores.zonaControlo[index]">
                          Medição das UI noutros suportes
                        </div>
                      </td>
                      <td style="width:80%;" v-if="item.uiOutros">{{ item.uiOutros }}</td>
                    </tr>
                  </table>
                  
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
                      <v-toolbar flat :key="p.objeto.dados.cores.zonaControlo[index]" :color="p.objeto.dados.cores.zonaControlo[index]">
                        <span style="font-weight: 400; color: #1a237e; font-weight: bold;">Lista de Agregações</span>
                        <v-spacer />
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
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog se existir erros no pedido à API -->
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>

    <v-dialog v-model="sucessDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="success darken-4 title white--text"
          dark
        >Auto de Eliminação adicionado com sucesso!</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap">
            O Pedido de criação do Auto de Eliminação foi efetuado com sucesso...
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="$router.go(-1)">Fechar</v-btn>
        </v-card-actions>
      </v-card>
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
      sucessDialog: false,
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
            this.sucessDialog = true;
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
</style>
