<template>
  <div>
    <v-card flat class="ma-1">
      <ValidaCampo
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico.ts"
        campoValue="designacao"
        campoText="Designação"
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
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico"
        campoValue="data"
        campoText="Data de Submissão"
        :permitirEditar="false"
        tipo="string"
      />

      <ValidaCampo
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico"
        campoValue="entProd"
        campoText="Entidade Produtora"
        :permitirEditar="false"
        tipo="string"
      />

      <ValidaCampo
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico.ts"
        campoValue="entidades"
        campoText="Entidades"
        :permitirEditar="false"
        tipo="array"
        arrayValue="label"
      />

      <ValidaCampo
        v-if="
          p.objeto.dados.listaProcessos.procsAselecionar.length > 0 || listaProcs == true
        "
        :dadosOriginais="p.objeto.dados.listaProcessos"
        :novoHistorico="novoHistorico.ts"
        campoValue="procsAselecionar"
        campoText="Processos por selecionar"
        :permitirEditar="true"
        tipo="procsAselecionar"
        :tabelaSelecao="p.objeto.dados"
        tipoTS="Pluriorganizacional"
        @listaProcessos="listaProcs = true"
      />

      <ValidaCampo
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico.ts"
        campoValue="classes"
        campoText="Tabela de Seleção"
        :permitirEditar="true"
        tipo="classes"
        :tabelaSelecao="p.objeto.dados"
        tipoTS="Pluriorganizacional"
        @listaProcessos="listaProcs = true"
      >
        <v-row>
          <v-col xs="4" sm="4" class="mt-3" />

          <v-col xs="4" sm="4">
            <v-text-field
              label="Procurar"
              v-model="search"
              append-icon="search"
              single-line
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="tsHeaders"
              :items="p.objeto.dados.listaProcessos.procs"
              item-key="chave"
              :search="search"
              class="elevation-1"
              :footer-props="tsFooterProps"
              :page.sync="paginaTabela"
              expand-icon="$expand"
              single-expand
              @item-expanded="clicked"
              show-expand
            >
              <template v-slot:[`item.dono`]="{ item }">
                <div v-for="e in item.entidades" :key="e.sigla">
                  <v-chip
                    v-if="e.dono"
                    class="ma-2"
                    color="indigo darken-4"
                    outlined
                    label
                  >
                    {{ e.sigla }}
                  </v-chip>
                </div>
              </template>
              <template v-slot:[`item.participante`]="{ item }">
                <div v-for="e in item.entidades" :key="e.sigla">
                  <v-chip
                    v-if="e.participante != 'NP'"
                    class="ma-2"
                    color="indigo darken-4"
                    outlined
                    label
                  >
                    {{ e.sigla }} - {{ e.participante }}
                  </v-chip>
                </div>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-card class="ma-1 elevation-0">
                    <v-card-text>
                      <v-expansion-panels>
                        <v-expansion-panel popout>
                          <!-- DESCRITIVO DA CLASSE -->
                          <v-expansion-panel-header
                            class="clav-linear-background white--text"
                          >
                            <div>
                              <font size="4"><b> Descritivo da Classe</b></font>
                              <InfoBox
                                header="Descritivo da Classe"
                                :text="myhelp.Classe.BlocoDescritivo"
                                helpColor="white"
                              />
                            </div>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <ValidaCampo
                              :dadosOriginais="item"
                              :novoHistorico="
                                novoHistorico.ts.classes.dados[
                                  novoHistorico.ts.classes.dados.findIndex(
                                    (e) => e.dados.chave.dados === item.chave
                                  )
                                ].dados
                              "
                              campoValue="notasAp"
                              campoText="Notas de Aplicação"
                              :permitirEditar="true"
                              tipo="notasAp"
                              arrayValue="nota"
                              :notas="expandedProc.notasAp"
                              :info="{
                                header: 'Notas de Aplicação',
                                text: myhelp.Classe.Campos.NotasAp,
                              }"
                            />

                            <ValidaCampo
                              :dadosOriginais="item"
                              :novoHistorico="
                                novoHistorico.ts.classes.dados[
                                  novoHistorico.ts.classes.dados.findIndex(
                                    (e) => e.dados.chave.dados === item.chave
                                  )
                                ].dados
                              "
                              campoValue="exemplosNotasAp"
                              campoText="Exemplos de Notas de Aplicação"
                              :permitirEditar="true"
                              tipo="exemplosNotasAp"
                              arrayValue="exemplo"
                              :notas="expandedProc.exemplosNotasAp"
                              :info="{
                                header: 'Exemplos de Notas de Aplicação',
                                text: myhelp.Classe.Campos.ExemplosNotasAp,
                              }"
                            />

                            <ValidaCampo
                              :dadosOriginais="item"
                              :novoHistorico="
                                novoHistorico.ts.classes.dados[
                                  novoHistorico.ts.classes.dados.findIndex(
                                    (e) => e.dados.chave.dados === item.chave
                                  )
                                ].dados
                              "
                              campoValue="notasEx"
                              campoText="Notas de Exclusão"
                              :permitirEditar="true"
                              tipo="notasEx"
                              arrayValue="nota"
                              :notas="expandedProc.notasEx"
                              :info="{
                                header: 'Notas de Exclusão',
                                text: myhelp.Classe.Campos.NotasEx,
                              }"
                            />

                            <ValidaCampo
                              :dadosOriginais="item"
                              :novoHistorico="
                                novoHistorico.ts.classes.dados[
                                  novoHistorico.ts.classes.dados.findIndex(
                                    (e) => e.dados.chave.dados === item.chave
                                  )
                                ].dados
                              "
                              campoValue="termosInd"
                              campoText="Termos de indice"
                              :permitirEditar="true"
                              tipo="termosInd"
                              arrayValue="termo"
                              :notas="expandedProc.termosInd"
                              :info="{
                                header: 'Termos de Indice',
                                text: myhelp.Classe.Campos.TermosIndice,
                              }"
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </ValidaCampo>
      <v-row>
        <v-spacer />
        <!--
        <v-btn
          @click="guardarPedido()"
          rounded
          class="mt-5 clav-linear-background accent-4 white--text"
          ><unicon name="guardar-icon" fill="#ffffff" />Guardar Trabalho</v-btn
        > -->
        <PO
          operacao="Analisar"
          :pedido="p"
          :options="o"
          :historico="novoHistorico"
          @avancarPedido="encaminharPedido($event)"
          @devolverPedido="despacharPedido($event)"
          v-if="fase == 'analise'"
        />
        <PO
          operacao="Validar"
          :pedido="p"
          :options="o"
          :historico="novoHistorico"
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
            <v-spacer />
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
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ValidaCampo from "@/components/pedidos/analise/tabSel/generic/ValidaCampo";
import InfoBox from "@/components/generic/infoBox.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import Voltar from "@/components/generic/Voltar";

export default {
  props: {
    p: {},
    o: {},
    fase: { type: String, required: true },
  },
  components: {
    PO,
    ValidaCampo,
    InfoBox,
    ConfirmacaoOperacao,
    Voltar,
  },

  data() {
    return {
      search: "",
      paginaTabela: 1,
      expanded: [],
      novoHistorico: null,
      json: null,
      expandedProc: {},
      listaProcs: false,
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
      dialogGuardado: false,
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
    alterarOriginal() {
      let n_vermelhos = 0;
      Object.keys(this.novoHistorico).map((k) => {
        if (k != "ts") {
          n_vermelhos =
            this.novoHistorico[k].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
        }
      });
      Object.keys(this.novoHistorico.ts).map((k) => {
        n_vermelhos =
          this.novoHistorico.ts[k].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
      });

      this.novoHistorico.ts.classes.dados.forEach((classe) => {
        Object.keys(classe.dados).map((k) => {
          classe.dados[k].nota = null;
          n_vermelhos =
            classe.dados[k].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
        });
      });

      //Falta a edição de campos
      this.p.objeto.dados.designacao = this.novoHistorico.ts.designacao.dados;
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

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
  created() {
    //alert(JSON.stringify(this.p.objeto.dados.entidades));
    this.novoHistorico = JSON.parse(
      JSON.stringify(this.p.historico[this.p.historico.length - 1])
    );
  },
};
</script>
