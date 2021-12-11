<template>
  <div>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="nomePPD"
        campoText="Nome do PPD"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="entSel"
        campoText="Entidades"
        tipo="ents"
        arrayValue="label"
        :entidades="entidades"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="mencaoResp"
        campoText="Menção de responsabilidade"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="tipoFonteL"
        campoText="Tipo da fonte de legitimação"
        tipo="tipofl"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="fonteLegitimacao"
        campoText="Fonte de legitimação"
        :permitirEditar="true"
        tipo="fonteLeg"
        :flLista="flLista"
      />
      <ValidaCampo
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico"
        campoValue="sistemasInfo"
        campoText="Sistemas de Informação"
        :permitirEditar="false"
        tipo="sis"
      >
        <v-row>
          <v-col>
            <v-card-title>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Procura filtra sistemas informação"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="p.objeto.dados.sistemasInfo"
              :items-per-page="5"
              item-key="numeroSI"
              :search="search"
              :sort-by="['numeroSI']"
              class="elevation-1"
              :footer-props="footer_props"
            >
              <template v-slot:header="props">
                <tr>
                  <th
                    v-for="h in props.headers"
                    :key="h.text"
                    class="body-2 font-weight-bold"
                    style="color: green;"
                  >{{ h.text }}
                  </th>
                </tr>
              </template>

              <template v-slot:item="props">
                <tr>
                  <td>{{ props.item.numeroSI }}</td>
                  <td>{{ props.item.nomeSI }}</td>
                  <td>
                    <v-btn small color="blue darken-2" dark rounded @click="item2Show(props.item)">
                      <v-icon dark>mdi-wrench</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>

              <template v-slot:footer.page-text="props">
                  Sistemas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <template>
          <div>
            <v-dialog
              :retain-focus="false"
              v-model="verSI"
            >
              <v-card>
                <v-card-title class="expansion-panel-heading">Sitema de informação</v-card-title>
                <div class="v-card__text mt-4">
                  <editarBlocoIdentificacao
                    :siSpec="siSpec"
                    :novoHistorico="this.novoHistorico"
                    :indexSI="indexSI"
                  />
                  <editarBlocoAvaliacao
                    :siSpec="siSpec"
                    :novoHistorico="this.novoHistorico"
                    :classesSI="this.siClassesDisponiveis[this.siEditar]"
                    :classesDaFonteL="this.classesDaFonteL"
                    :listaClasses="this.listaClasses"
                    :indexSI="indexSI"
                  />
                  <editarBlocoCaracterizacao
                    :siSpec="siSpec"
                    :novoHistorico="this.novoHistorico"
                    :indexSI="indexSI"
                  />
                  <editarBlocoEstrategia
                    :siSpec="siSpec"
                    :novoHistorico="this.novoHistorico"
                    :indexSI="indexSI"
                  />
                </div>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-row align="center" justify="space-around">
                    <v-btn
                    color="indigo darken-2"
                    dark
                    class="ma-2"
                    rounded
                    @click="verSI = false"
                    >
                      Fechar
                    </v-btn>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <v-row>
        <Voltar class="ma-5" />
        <v-spacer />

        <v-btn
          @click="test()"
          rounded
          class="mt-5 clav-linear-background accent-4 white--text"
          ><unicon name="guardar-icon" fill="#ffffff" />Guardar Trabalho</v-btn
        >
        <PO
          operacao="Analisar"
          @avancarPedido="encaminharPedido($event)"
          @devolverPedido="despacharPedido($event)"
          v-if="fase == 'analise'"
        />
        <PO
          operacao="Validar"
          @finalizarPedido="verificaVermelhos($event)"
          @devolverPedido="despacharPedido($event)"
          v-else-if="fase == 'validacao'"
          :vai_para_despacho="true"
        />
      </v-row>
      <!-- Dialog de confirmação de operação -->
      <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
        <ConfirmacaoOperacao
          :mensagem="dialogConfirmacao.mensagem"
          @fechar="dialogConfirmacao.visivel = false"
          @confirma="finalizarPedido(dialogConfirmacao.dados)"
        />
      </v-dialog>
      <v-dialog v-model="dialogGuardado" width="50%" persistent>
        <v-card dark class="info-card">
          <v-card-title class="headline mb-2"> Pedido guardado com sucesso!</v-card-title>
          <div class="info-content-card px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
              <p>O seu pedido foi guardado com sucesso. Pode abandonar a página.</p>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="
                {
                  dialogGuardado = false;
                }
              "
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>

import editarBlocoIdentificacao from "@/components/pedidos/analise/ppd/si/editarBlocoIdentificacao";
import editarBlocoAvaliacao from "@/components/pedidos/analise/ppd/si/editarBlocoAvaliacao"
import editarBlocoCaracterizacao from "@/components/pedidos/analise/ppd/si/editarBlocoCaracterizacao.vue"
import editarBlocoEstrategia from "@/components/pedidos/analise/ppd/si/editarBlocoEstrategia.vue"
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ValidaCampo from "@/components/pedidos/analise/ppd/ValidaCampo";
import InfoBox from "@/components/generic/infoBox.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import Voltar from "@/components/generic/Voltar";

export default {
  props: {
    p: {},
    fase: { type: String, required: true },
  },
  components: {
    editarBlocoIdentificacao,
    editarBlocoAvaliacao,
    editarBlocoCaracterizacao,
    editarBlocoEstrategia,
    PO,
    ValidaCampo,
    InfoBox,
    ConfirmacaoOperacao,
    Voltar
  },

  data() {
    return {
      siSpec: {
        numeroSI: [],
          nomeSI: [],
          identificacao:{},
          avaliacao:{},
          caracterizacao:{},
          estrategia:{}
      },
      siClassesDisponiveis: {},
      siEditar: "",
      entidades: "",
      indexSI: "",
      verSI: false,
      search: "",
      paginaTabela: 1,
      expanded: [],
      novoHistorico: null,
      json: null,
      expandedProc: {},
      listaProcs: false,
      dialogGuardado: false,
      flLista: [],
      classesDaFonteL: "",
      classesSI: [],
      listaClasses: [],
      si2show: "",
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
      headers: [
        { text: "Número", value: "numeroSI" },
        { text: "Nome", value: "nomeSI" },
        { text: "Editar", value: ""},
      ],
      footer_props: {
        "items-per-page-text": "Sistemas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      },
      tsHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        { text: "Dono", value: "dono", align: "center", class: "subtitle-1" },
        {
          text: "Participante",
          value: "participante",
          align: "center",
          class: "subtitle-1",
        },
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
        },
      ],
      tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
      myhelp: require("@/config/help").help,
    };
  },
  methods: {
    async test() {
      //alert(JSON.stringify(this.novoHistorico.fonteLegitimacao.dados))
      //alert(JSON.stringify(this.novoHistorico.fonteLegitimacao.dados.length))
      //alert(JSON.stringify(this.p.objeto.dados.geral.fonteLegitimacao))
    },

    consultaFT: async function() {
      try {
        //alert(JSON.stringify( this.novoHistorico.fonteLegitimacao.dados.id))
        var tipo = this.novoHistorico.fonteLegitimacao.dados.id.split("_");
        if(tipo[0] == 'pgd'){
          var response = await this.$request("get", "/pgd/"+this.novoHistorico.fonteLegitimacao.dados.id);
          this.classesDaFonteL = response.data;
          for (var c of response.data) {
            if(c.pca){
              if(c.codigo){
                this.classesSI.push({info:"Cod: " + c.codigo + " - " + c.titulo , classe:c.classe});
              }
              else{
                this.classesSI.push({info:"Ref: " + c.referencia + " - " + c.titulo , classe:c.classe})
              }
            }
          }
        }
      }catch (err) {
        return err;
      }
    },

    async guardarPedido() {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        await this.alterarOriginal();

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.historico[pedido.historico.length - 1] = this.novoHistorico;

        const novaDistribuicao = {
          estado: pedido.estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
        };
        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.dialogGuardado = true;
      } catch (e) {
        //console.log("e :", e);
      }
    },

    item2Show: async function(item){
      //alert(JSON.stringify(item))
      this.siSpec = item;
      this.siEditar = item.nomeSI
      this.indexSI = this.p.objeto.dados.sistemasInfo.findIndex(x => x.nomeSI === this.siEditar)
      this.verSI = true;
      this.listaClasses = item.avaliacao.selecionadosTabelaFL
      this.siClassesDisponiveis[this.siEditar] = JSON.parse(JSON.stringify(this.classesSI))
      for(var i in this.listaClasses){
        var indexAux = this.siClassesDisponiveis[this.siEditar].findIndex(e => e.classe === this.listaClasses[i].classe);
        if(indexAux>=0){
          this.siClassesDisponiveis[this.siEditar].splice(indexAux,1);
        }
      }
    },
    async clicked({ item }) {
      if (!this.expandedProc.codigo || this.expandedProc.codigo != item.codigo) {
        let response = await this.$request("get", "/classes/c" + item.codigo);
        this.expandedProc = response.data;
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
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        var estado;
        if (pedido.estado === "Distribuído" || pedido.estado === "Redistribuído")
          dados.etapa === "Validação 1"
            ? (estado = "Apreciado")
            : (estado = "Apreciado2v");
        else
          dados.etapa === "Validação 1"
            ? (estado = "Reapreciado")
            : (estado = "Reapreciado2v");

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email,
          },
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    alterarOriginal() {
      let n_vermelhos = 0;
      Object.keys(this.novoHistorico).map((k) => {
          this.novoHistorico[k].nota = null;
          n_vermelhos =
            this.novoHistorico[k].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
      });
      Object.keys(this.novoHistorico.sistemasInfo.dados).map((k) => {
         Object.keys(this.novoHistorico.sistemasInfo.dados[k]).map((e) => {
        this.novoHistorico.sistemasInfo.dados[k][e].nota = null;
        n_vermelhos =
          this.novoHistorico.sistemasInfo.dados[k][e].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
      });
      })
      return n_vermelhos;
    },
    async verificaVermelhos(dados) {
      let existem_vermelhos = await this.alterarOriginal();

      // Se existirem abre dialog de confirmação
      if (existem_vermelhos > 0)
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem " +
            existem_vermelhos +
            " campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados,
        };
      // Caso contrário segue para a finalização do pedido
      else await this.finalizarPedido(dados);
    },
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            identificacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
      }
        catch (err) {
          return err;
      }
    },
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push({id: l.idPGD , titulo: l.tipo + " " + l.numero + " - " + l.sumario});
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let dadosUtilizador = this.$verifyTokenUser();
        const estado = "Em Despacho";

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.overlay = false;
        this.sucessDialog = true;
        this.$router.go(-1);
      } catch (e) {
        this.overlay = false;
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        }
      }
    },
  },

  watch:{
    "novoHistorico.fonteLegitimacao.dados": async function(){
      await this.consultaFT()
    },

    "novoHistorico.tipoFonteL.dados": async function(){
      try{
        if(this.novoHistorico.tipoFonteL.dados == "TS/LC"){
          var response = await this.$request("get","/tabelasSelecao")
          this.flLista = response.data.map(ts=>{return {
              titulo: ts.designacao,
              codigo: ts.id.split("clav#")[1]
            }
          });
        }
        if(this.novoHistorico.tipoFonteL.dados == "PGD/LC"){
          var response = await this.$request("get", "/pgd/lc");
          this.flLista = await this.prepararLeg(response.data);
        }
        else if(this.novoHistorico.tipoFonteL.dados == "PGD"){
          var response = await this.$request("get", "/pgd");
          this.flLista = await this.prepararLeg(response.data);
        }
        else if(this.novoHistorico.tipoFonteL.dados == "RADA"){
          var response = await this.$request("get", "/legislacao?fonte=RADA");
          this.flLista = await this.prepararLeg(response.data);
        }
        else{
          var response = await this.$request("get","/rada");
          this.flLista = response.data
        }
      }
       catch(e){
        this.flLista = [];
        console.log('Erro ao carregar a informação inicial: ' + e);
      }
    }
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
  created(){
    //alert(JSON.stringify(this.p.historico))
    //alert(JSON.stringify(this.p.objeto.dados.geral))
    //alert(JSON.stringify(this.p.objeto.dados.geral.fonteLegitimacao))
    //alert(JSON.stringify(this.p.objeto.dados.sistemasInfo))
    //alert(JSON.stringify(this.p.historico))
    this.loadEntidades()
    this.novoHistorico = JSON.parse(
      JSON.stringify(this.p.historico[this.p.historico.length - 1])
    );
    //alert(JSON.stringify(this.novoHistorico))
    //Object.keys(this.novoHistorico.entSel).map((k) => {
    //  if (k != "entSel") this.novoHistorico.entSel[k].nota = null;
    //});

    //alert(JSON.stringify(this.novoHistorico))
    //Object.keys(this.novoHistorico.geral).map((k) => {
    //  if (k != "sistemasInfo") this.novoHistorico.sistemasInfo[k].nota = null;
    //});

    this.novoHistorico.entSel.dados.forEach((e) => {
      e.nota = null;
    });

    //this.novoHistorico.geral.classes.dados.forEach((classe) => {
    //  classe.nota = null;
    //  Object.keys(classe.dados).map((k) => {
    //    classe.dados[k].nota = null;
    //    if (k === "pca" || k === "df") {
    //      Object.keys(classe.dados[k].dados).map((d) => {
    //        classe.dados[k].dados[d].nota = null;
    //      });
    //    }
    //  });
    //});
  },
};
</script>



<style>
.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E;
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separadorMini {
  color: #283593;
  text-align: center;
  padding: 5px;
  font-weight: 400;
  width: 75%;
  background-color: #e8eaf6;
  font-size: 14pt;
  font-weight: bold;
  margin: auto;
  border-radius: 3px;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
