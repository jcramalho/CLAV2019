<template>
  <div>
    <v-card-text class="ma-1">
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.ts"
        :novoHistorico="novoHistorico"
        campoValue="designacao"
        campoText="Designação"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[v => !!v || 'Campo obrigatório']"
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
        v-if="p.objeto.dados.ts.idEntidade != ''"
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico.ts"
        campoValue="entidade"
        campoText="Entidade"
        :permitirEditar="false"
        tipo="string"
      />

      <ValidaCampo
        v-else
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico.ts"
        campoValue="tipologia"
        campoText="Entidade"
        :permitirEditar="false"
        tipo="string"
      />

      <ValidaCampo
        v-if="p.objeto.dados.ts.listaProcessos.procsAselecionar.length > 0"
        :dadosOriginais="p.objeto.dados.ts.listaProcessos"
        :novoHistorico="novoHistorico.ts"
        campoValue="procsAselecionar"
        campoText="Processos por selecionar"
        :permitirEditar="false"
        tipo="procsAselecionar"
      />

      <v-row>
        <v-col xs="2" sm="2" class="mt-3">
          <div class="info-label">Tabela de Seleção</div>
        </v-col>
        <v-col xs="3" sm="3" />

        <v-col xs="5" sm="5">
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
            :items="p.objeto.dados.ts.listaProcessos.procs"
            item-key="chave"
            :search="search"
            class="elevation-1"
            :footer-props="tsFooterProps"
            :page.sync="paginaTabela"
            :expanded="expanded"
            expand-icon="$expand"
            :single-expand="true"
            @click:row="clicked"
            show-expand
          >
            <template v-slot:[`item.dono`]="{ item }">
              <v-icon v-if="item.dono">
                done
              </v-icon>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-card class="ma-1 elevation-0">
                  <v-card-text>
                    <v-expansion-panels>
                      <v-expansion-panel popout>
                        <!-- DESCRITIVO DA CLASSE -->
                        <v-expansion-panel-header
                          class="white--text"
                          color="indigo darken-4"
                        >
                          <div class="separador">
                            <font size="4"><b> Descritivo da Classe</b></font>
                            <InfoBox
                              header="Descritivo da Classe"
                              :text="myhelp.Classe.BlocoDescritivo"
                              helpColor="white"
                            />
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <!-- ESTADO -->
                          <ValidaCampo
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="status"
                            campoText="Estado"
                            :permitirEditar="false"
                            tipo="estado"
                            :info="{
                              header: 'Estado',
                              text: myhelp.Classe.Campos.Estado
                            }"
                          />

                          <ValidaCampo
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="descricao"
                            campoText="Descrição"
                            :permitirEditar="false"
                            tipo="string"
                            :info="{
                              text: myhelp.Classe.Campos.Descricao,
                              header: 'Descrição'
                            }"
                          />
                          <ValidaCampo
                            v-if="item.notasAp.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="notasAp"
                            campoText="Notas de Aplicação"
                            :permitirEditar="false"
                            tipo="array"
                            arrayValue="nota"
                            :info="{
                              header: 'Notas de Aplicação',
                              text: myhelp.Classe.Campos.NotasAp
                            }"
                          />

                          <ValidaCampo
                            v-if="item.exemplosNotasAp.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="exemplosNotasAp"
                            campoText="Exemplos de Notas de Aplicação"
                            :permitirEditar="false"
                            tipo="array"
                            arrayValue="exemplo"
                            :info="{
                              header: 'Exemplos de Notas de Aplicação',
                              text: myhelp.Classe.Campos.ExemplosNotasAp
                            }"
                          />

                          <ValidaCampo
                            v-if="item.notasEx.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="notasEx"
                            campoText="Notas de Exclusão"
                            :permitirEditar="false"
                            tipo="array"
                            arrayValue="nota"
                            :info="{
                              header: 'Notas de Exclusão',
                              text: myhelp.Classe.Campos.NotasEx
                            }"
                          />

                          <ValidaCampo
                            v-if="item.termosInd.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="termosInd"
                            campoText="Termos de indice"
                            :permitirEditar="false"
                            tipo="array"
                            arrayValue="termo"
                            :info="{
                              header: 'Termos de Indice',
                              text: myhelp.Classe.Campos.TermosIndice
                            }"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>

                      <v-expansion-panel popout v-if="item.nivel == 3">
                        <!-- CONTEXTO DA CLASSE -->
                        <v-expansion-panel-header
                          class="white--text"
                          color="indigo darken-4"
                        >
                          <div class="separador">
                            <font size="4"><b> Contexto de Avaliação</b></font>
                            <InfoBox
                              header="Contexto de Avaliação"
                              :text="myhelp.Classe.BlocoContexto"
                              helpColor="white"
                            />
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <!-- TIPO DE PROCESSO -->

                          <ValidaCampo
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="tipoProc"
                            campoText="Tipo de Processo"
                            :permitirEditar="false"
                            tipo="string"
                            :info="{
                              header: 'Tipo de Processo',
                              text: myhelp.Classe.Campos.TipoProcesso
                            }"
                          />

                          <!-- TRANSVERSALIDADE -->

                          <ValidaCampo
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="procTrans"
                            campoText="Processo Transversal"
                            :permitirEditar="false"
                            tipo="procTrans"
                            :info="{
                              header: 'Processo Transversal',
                              text: myhelp.Classe.Campos.ProcessoTransversal
                            }"
                          />
                          <ValidaCampo
                            v-if="item.donos.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="donos"
                            campoText="Donos do processo"
                            :permitirEditar="false"
                            tipo="donos"
                            :info="{
                              header: 'Donos do processo',
                              text: myhelp.Classe.Campos.Donos
                            }"
                          />
                          <ValidaCampo
                            v-if="item.participantes.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="participantes"
                            campoText="Participantes no processo"
                            :permitirEditar="false"
                            tipo="participantes"
                            :info="{
                              header: 'Participantes no processo',
                              text: myhelp.Classe.Campos.Participantes
                            }"
                          />
                          <ValidaCampo
                            v-if="item.processosRelacionados.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="processosRelacionados"
                            campoText="Processos Relacionados"
                            :permitirEditar="false"
                            tipo="procRel"
                            :info="{
                              header: 'Processos Relacionados',
                              text: myhelp.Classe.Campos.ProcessosRelacionados
                            }"
                          />
                          <ValidaCampo
                            v-if="item.legislacao.length > 0"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados
                            "
                            campoValue="legislacao"
                            campoText="Legislação"
                            :permitirEditar="false"
                            tipo="legs"
                            :info="{
                              header: 'Legislação',
                              text: myhelp.Classe.Campos.Legislacao
                            }"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel
                        v-if="
                          (item.nivel == 3 && !item.temSubclasses4Nivel) ||
                            item.nivel == 4
                        "
                      >
                        <v-expansion-panel-header
                          class="white--text"
                          color="indigo darken-4"
                        >
                          <div class="separador">
                            <font size="4"> <b>Decisões de Avaliação</b></font>
                            <InfoBox
                              header="Decisões de Avaliação"
                              :text="myhelp.Classe.BlocoDecisoes"
                              helpColor="white"
                            />
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col xs="12" sm="12">
                              <v-toolbar
                                color="indigo darken-4"
                                class="caption font-weight-regular"
                                dark
                                height="25"
                              >
                                <v-toolbar-title
                                  >Prazo de Conservação
                                  Administrativa</v-toolbar-title
                                >
                              </v-toolbar>
                            </v-col>
                          </v-row>
                          <!-- PRAZO -->

                          <ValidaCampo
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.pca.dados
                            "
                            campoValue="valores"
                            campoText="Prazo"
                            :permitirEditar="false"
                            tipo="prazo"
                            :info="{
                              header: 'Prazo',
                              text: myhelp.Classe.Campos.Prazo
                            }"
                          />
                          <!-- NOTAS -->
                          <ValidaCampo
                            v-if="item.pca.notas != ''"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.pca.dados
                            "
                            campoValue="notas"
                            campoText="Notas"
                            :permitirEditar="false"
                            tipo="string"
                            :info="{
                              header: 'Notas ao PCA',
                              text: myhelp.Classe.Campos.Notas
                            }"
                          />

                          <!-- FORMA DE CONTAGEM -->
                          <ValidaCampo
                            v-if="item.pca.formaContagem != ''"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.pca.dados
                            "
                            campoValue="formaContagem"
                            campoText="Forma de Contagem"
                            :permitirEditar="false"
                            tipo="string"
                            :info="{
                              header: 'Forma de Contagem',
                              text: myhelp.Classe.Campos.FormaContagem
                            }"
                          />

                          <!-- SUBFORMA DE CONTAGEM -->
                          <ValidaCampo
                            v-if="item.pca.subFormaContagem"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.pca.dados
                            "
                            campoValue="subFormaContagem"
                            campoText="Subforma de Contagem"
                            :permitirEditar="false"
                            tipo="string"
                            :info="{
                              header: 'Subforma de Contagem',
                              text: myhelp.Classe.Campos.SubformaContagem
                            }"
                          />
                          <!-- JUSTIFICAÇÂO -->
                          <ValidaCampo
                            v-if="item.pca.justificacao"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.pca.dados
                            "
                            campoValue="justificacao"
                            campoText="Justificação"
                            :permitirEditar="false"
                            tipo="justPCA"
                            :info="{
                              header: 'Justificação do PCA',
                              text: myhelp.Classe.Campos.JustificacaoPCA
                            }"
                          />

                          <!-- DESTINO FINAL ................................................... -->

                          <v-row>
                            <v-col xs="12" sm="12">
                              <v-toolbar
                                color="indigo darken-4"
                                class="caption font-weight-regular"
                                dark
                                height="25"
                              >
                                <v-toolbar-title>Destino Final</v-toolbar-title>
                              </v-toolbar>
                            </v-col>
                          </v-row>

                          <!-- VALOR -->
                          <ValidaCampo
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.df.dados
                            "
                            campoValue="valor"
                            campoText="Destino Final"
                            :permitirEditar="false"
                            tipo="df"
                            :info="{
                              header: 'Destino Final',
                              text: myhelp.Classe.Campos.DF
                            }"
                          />

                          <!-- NOTA ao DF -->

                          <ValidaCampo
                            v-if="item.df.nota"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.df.dados
                            "
                            campoValue="nota"
                            campoText="Nota ao DF"
                            :permitirEditar="false"
                            tipo="string"
                            :info="{
                              header: 'Nota ao DF',
                              text: myhelp.Classe.Campos.NotasDF
                            }"
                          />

                          <!-- JUSTIFICAÇÂO -->
                          <ValidaCampo
                            v-if="item.df.justificacao"
                            :dadosOriginais="item"
                            :novoHistorico="
                              novoHistorico.ts.classes.dados[
                                novoHistorico.ts.classes.dados.findIndex(
                                  e => e.dados.chave.dados === item.chave
                                )
                              ].dados.df.dados
                            "
                            campoValue="justificacao"
                            campoText="Justificação"
                            :permitirEditar="false"
                            tipo="justDF"
                            :info="{
                              header: 'Justificação do DF',
                              text: myhelp.Classe.Campos.JustificacaoDF
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
      <v-row>
        <v-spacer />
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
    </v-card-text>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ValidaCampo from "@/components/pedidos/analise/tabSel/generic/ValidaCampo";
import InfoBox from "@/components/generic/infoBox.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";

export default {
  props: {
    p: {},
    fase: { type: String, required: true }
  },
  components: {
    InfoBox,
    ValidaCampo,
    PO,
    ConfirmacaoOperacao
  },

  data() {
    return {
      search: "",
      paginaTabela: 1,
      expanded: [],
      novoHistorico: null,
      json: null,
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null
      },
      tsHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        { text: "Dono", value: "dono", class: "subtitle-1" },
        { text: "Participante", value: "participante", class: "subtitle-1" },
        {
          text: "",
          value: "data-table-expand",
          width: "5%"
        }
      ],
      tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      },
      myhelp: require("@/config/help").help
    };
  },
  methods: {
    clicked(value) {
      if (
        value.descricao ||
        value.notaDF ||
        value.notaPCA ||
        value.formaContagem ||
        value.subFormaContagem ||
        value.designacaoParticipante ||
        value.designacaoDono
      )
        if (this.expanded[0] == value) this.expanded.pop();
        else this.expanded = [value];
    },
    alterarOriginal() {
      let n_vermelhos = 0;
      Object.keys(this.novoHistorico).map(k => {
        if (k != "ts") {
          this.novoHistorico[k].nota = null;
          n_vermelhos =
            this.novoHistorico[k].cor === "vermelho"
              ? n_vermelhos + 1
              : n_vermelhos;
        }
      });
      Object.keys(this.novoHistorico.ts).map(k => {
        this.novoHistorico.ts[k].nota = null;
        n_vermelhos =
          this.novoHistorico.ts[k].cor === "vermelho"
            ? n_vermelhos + 1
            : n_vermelhos;
      });

      this.novoHistorico.ts.classes.dados.forEach(classe => {
        classe.nota = null;
        Object.keys(classe.dados).map(k => {
          classe.dados[k].nota = null;
          n_vermelhos =
            classe.dados[k].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
        });
      });

      //Falta a edição de campos
      this.p.objeto.dados.ts.designacao = this.novoHistorico.designacao.dados;
      return n_vermelhos;
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

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

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
        let dadosUtilizador = this.$verifyTokenUser();

        await this.alterarOriginal();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

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
          dados: dados
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
          despacho: dados.mensagemDespacho
        };

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
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
            parsedError.data.forEach(erro => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        }
      }
    }
  },
  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
  created() {
    this.novoHistorico = JSON.parse(
      JSON.stringify(this.p.historico[this.p.historico.length - 1])
    );
    Object.keys(this.novoHistorico).map(k => {
      if (k != "ts") {
        this.novoHistorico[k].nota = null;
      }
    });
    Object.keys(this.novoHistorico.ts).map(k => {
      this.novoHistorico.ts[k].nota = null;
    });

    this.novoHistorico.ts.classes.dados.forEach(classe => {
      classe.nota = null;
      Object.keys(classe.dados).map(k => {
        classe.dados[k].nota = null;
        if (k === "pca" || k === "df") {
          Object.keys(classe.dados[k].dados).map(d => {
            classe.dados[k].dados[d].nota = null;
          });
        }
      });
    });
  }
};
</script>
