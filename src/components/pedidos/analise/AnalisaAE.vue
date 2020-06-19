<template>
  <div>
    <span style="display:none;">{{colorSwitch}}</span>
    <v-row v-if="p.objeto.dados.ae.legislacao">
      <v-col cols="2">
        <div class="info-label" :key="cores.legislacao" :style="'background-color: '+cores.legislacao">Fonte de Legitimação</div>
      </v-col>
      <v-col class="mt-3">
        {{p.objeto.dados.ae.legislacao}}
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="cores.legislacao='#C8E6C9'">check</v-icon>
        <v-icon color="red" @click="cores.legislacao='#FFCDD2'">clear</v-icon>
        <v-icon @click="abrirEditor('Fonte de Legitimação',-1)">create</v-icon>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="2">
        <div class="info-label" :key="cores.legislacao" :style="'background-color: '+cores.legislacao">Referencial Classificativo</div>
      </v-col>
      <v-col class="mt-3">
        Lista Consolidada
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="cores.legislacao='#C8E6C9'">check</v-icon>
        <v-icon color="red" @click="cores.legislacao='#FFCDD2'">clear</v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <div class="info-label"  :key="cores.fundo" :style="'background-color: '+cores.fundo">Fundo</div>
      </v-col>
      <v-col class="mr-2">
          <div
            v-for="(f, i) in p.objeto.dados.ae.fundo" :key="i"
          >{{f}}
          </div>
      </v-col>
      <v-col cols="1">
              <v-icon color="green" @click="colorSwitch++; cores.fundo='#C8E6C9'">check</v-icon>
              <v-icon color="red" @click="colorSwitch++; cores.fundo='#FFCDD2'">clear</v-icon>
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
                <v-list-item-content class="info-label" :key="cores.zonaControlo[index]" :style="'background-color: '+cores.zonaControlo[index]">
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
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Código da Classe</div>
                      </td>
                      <td style="width:70%;">
                        {{ item.codigo }}
                      </td>
                      <td style="width:10%">
                        <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index]='#C8E6C9'">check</v-icon>
                        <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index]='#FFCDD2'">clear</v-icon>  
                      </td>
                    </tr>
                    <tr v-if="item.referencia">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Referência</div>
                      </td>
                      <td style="width:70%;">
                        {{ item.referencia }}
                      </td>
                      <td v-if="!item.codigo" style="width:10%">
                        <v-icon color="green" @click="colorSwitch++; cores.zonaControlo[index]='#C8E6C9'">check</v-icon>
                        <v-icon color="red" @click="colorSwitch++; cores.zonaControlo[index]='#FFCDD2'">clear</v-icon>  
                      </td>
                    </tr>
                    <tr v-if="item.titulo">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Título</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.titulo }}
                      </td>
                    </tr>
                    <tr v-if="item.prazoConservacao">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Prazo de Conservação Administrativa</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.prazoConservacao }} <span v-if="item.prazoConservacao=='1'">Ano</span><span v-else>Anos</span>
                      </td>
                    </tr>
                    <tr v-if="item.destino">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Destino Final</div>
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
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">
                          Natureza de intervenção
                        </div>
                      </td>
                      <td style="width:80%;">{{ item.ni }}</td>
                    </tr>
                    <tr v-if="item.dono && item.dono.length>0 && item.destino === 'C'">
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Donos do PN</div>
                      </td>
                      <td style="width:80%;"><li v-for="(d,i) in item.dono" :key="i">{{ d }}</li></td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Data de Início</div>
                      </td>
                      <td style="width:80%;">
                        {{ item.dataInicio }}
                      </td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">Data de Fim</div>
                      </td>
                      <td style="width:80%;">{{ item.dataFim }}</td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">
                          Medição das UI em papel (m.l.)
                        </div>
                      </td>
                      <td style="width:70%;" v-if="item.uiPapel">{{ item.uiPapel }}</td>
                      <td style="width:70%;" v-else>0</td>
                      <td style="width:10%;">
                        <v-icon @click="abrirEditor('Medição das UI em papel (m.l.)',index)">create</v-icon>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">
                          Medição das UI em digital (Gb)
                        </div>
                      </td>
                      <td style="width:70%;" v-if="item.uiDigital">{{ item.uiDigital }}</td>
                      <td style="width:70%;" v-else>0</td>
                      <td style="width:10%;">
                        <v-icon @click="abrirEditor('Medição das UI em digital (Gb)',index)">create</v-icon>
                      </td>
                    </tr>
                    <tr>
                      <td style="width:20%;">
                        <div class="info-label" :style="'background-color: '+cores.zonaControlo[index]">
                          Medição das UI noutros suportes
                        </div>
                      </td>
                      <td style="width:70%;" v-if="item.uiOutros">{{ item.uiOutros }}</td>
                      <td style="width:70%;" v-else>0</td>
                      <td style="width:10%;">
                        <v-icon @click="abrirEditor('Medição das UI noutros suportes',index)">create</v-icon>
                      </td>
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
                      <v-toolbar flat :key="cores.zonaControlo[index]" :color="cores.zonaControlo[index]">
                        <span style="font-weight: 400; color: #1a237e; font-weight: bold;">Lista de Agregações
                        
                        </span>
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
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!--Dialog de Edição -->
    <v-dialog v-model="editar" width="60%" hide-overlay>
      <v-card>
        <v-card>
          <v-card-title class="primary darken-3 title white--text" dark>
            <span>Edição do campo: {{editarCampo}}</span> 
          </v-card-title>
          <v-card-text class="mt-4">
            <v-row class="ma-2" v-if="editarCampo=='Fonte de Legitimação'">
              <v-autocomplete
                label="Selecione a fonte de legitimação"
                :items="portaria"
                v-model="legislacao"
                solo
                dense
              ></v-autocomplete>
            </v-row>
            <v-row class="ma-2" v-else>
              <v-text-field
                hint="Exemplo: 11.50"
                label="Insira a medição de UI"
                v-model="medicao"
                solo
                clearable
              />
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text color="red accent-4" @click="close()">
              Voltar
            </v-btn>
            <v-btn class="indigo accent-4" dark @click="adicionar()">
              <span>Alterar</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark
          >Erro: Não foi possível editar o campo {{editarCampo}}</v-card-title
        >

        <v-card-text>
          <span
            class="subtitle-1"
            style="white-space: pre-wrap"
            v-html="erro"
          ></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
const help = require("@/config/help").help;

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
      editar: false,
      editarCampo: "",
      editarIndex: 0,
      codigo: "",
      titulo: "",
      dataContagem: "",
      ni: "",
      natureza: ["Dono","Participante"],
      medicao: "",
      legislacao: "",
      portaria: [],
      erro: null,
      erroDialog: false,
      cabecalho: [
        { text: "Código", align: "left", sortable: false, value: "codigo", width: "20%"},
        { text: "Título", align: "left", value: "titulo", width: "30%" },
        { text: "Data de Contagem", align: "center", value: "dataContagem", width: "15%"},
        { text: "Natureza de Intervenção", align: "center", value: "ni", width: "25%" }
      ],
      footer_props: {
        "items-per-page-text": "Mostrar"
      }
    };
  },

  async created() {
    this.cores = {
      legislacao: "#e8eaf6",
      fundo: "#e8eaf6",
      zonaControlo: []
    };
    for (var zc in this.p.objeto.dados.ae.zonaControlo) {
      this.cores.zonaControlo.push("#e8eaf6")
    }
    try {
      if(this.tipo === "AE PGD")
        var response = await this.$request("get", "/legislacao?fonte=PGD");
      else if(this.tipo === "AE RADA")
        var response = await this.$request("get", "/legislacao?fonte=RADA");
      else
        var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
      this.portaria = await this.prepararLeg(response.data);
    }
    catch (e) {
      this.portaria = [];
    }
  },

  methods: {
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push("Portaria " + l.numero + " - " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },

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

    close() {
      this.editar = false;
    },

    abrirEditor(campo,index) {
      this.editarCampo=campo;
      this.editarIndex=index;
      this.editar=true;
    },

    adicionar() {
      const reUI = /^-?\d*(\.\d\d?)?$/;
      if(this.editarCampo === "Fonte de Legitimação") {
        if(!this.legislacao) {
          this.erro = "O campo da Fonte de Legislação têm de ser preenchido";
          this.erroDialog = true;
        }
        else
          this.p.objeto.dados.ae.legislacao = this.legislacao;
        this.legislacao = "";
        this.editarCampo = "";
        this.editarIndex = -1;
        this.editar = false;
      }
      else if(this.editarCampo === "Medição das UI em papel (m.l.)") {
        if(this.medicao && !reUI.test(this.medicao)) {
          this.erro = help.AutoEliminacao.Erros.MedicaoDigital;
          this.erroDialog = true;
        } else
          this.p.objeto.dados.ae.zonaControlo[this.editarIndex].uiPapel = this.medicao;
        this.medicao = "";
        this.editarCampo = "";
        this.editarIndex = -1;
        this.editar = false;
      }
      else if(this.editarCampo === "Medição das UI em digital (Gb)") {
        if(this.medicao && !reUI.test(this.medicao)) {
          this.erro = help.AutoEliminacao.Erros.MedicaoDigital;
          this.erroDialog = true;
        } else
          this.p.objeto.dados.ae.zonaControlo[this.editarIndex].uiDigital = this.medicao;
        this.medicao = "";
        this.editarCampo = "";
        this.editarIndex = -1;
        this.editar = false;
      }
      else if(this.editarCampo === "Medição das UI noutros suportes") {
        if(this.medicao && !reUI.test(this.medicao)) {
          this.erro = help.AutoEliminacao.Erros.MedicaoDigital;
          this.erroDialog = true;
        } else
          this.p.objeto.dados.ae.zonaControlo[this.editarIndex].uiOutros = this.medicao;
        this.medicao = "";
        this.editarCampo = "";
        this.editarIndex = -1;
        this.editar = false;
      }
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
  /*background-color: #e8eaf6;  indigo lighten-5 */
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
