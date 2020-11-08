<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Tabela de Seleção (continuação do trabalho
            guardado)</v-toolbar-title
          >
        </v-app-bar>
        <v-stepper v-model="stepNo" vertical style="background-color:#fafafa">
          <v-stepper-step color="amber accent-3" :complete="stepNo > 1" step="1"
            ><font size="4"
              ><b>
                Identificação da entidade ou tipologia da tabela de seleção:</b
              ></font
            >
            <span v-if="stepNo > 1 && tipoTS != 'tipologia'">
              <v-chip
                class="ma-2"
                color="indigo darken-4"
                text-color="white"
                label
              >
                <v-icon left>account_balance</v-icon>
                {{
                  tabelaSelecao.idEntidade.split("_")[1] +
                    ": " +
                    tabelaSelecao.designacaoEntidade
                }}
              </v-chip>
            </span>
            <span v-else-if="stepNo > 1 && tipoTS == 'tipologia'">
              <v-chip
                class="ma-2"
                color="indigo darken-4"
                text-color="white"
                label
              >
                <v-icon left>account_balance</v-icon>
                {{
                  tabelaSelecao.idTipologia.split("_")[1] +
                    ": " +
                    tabelaSelecao.designacaoTipologia
                }}
              </v-chip>
            </span>
          </v-stepper-step>

          <v-stepper-step color="amber accent-3" :complete="stepNo > 2" step="2"
            ><font size="4"><b> Designação da Tabela de Seleção</b></font>
            <span v-if="stepNo > 1">
              <v-chip
                class="ma-2"
                color="indigo darken-4"
                text-color="white"
                label
              >
                {{ tabelaSelecao.designacao }}
              </v-chip>
            </span>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-flex xs12 sm6 md10>
              <v-form ref="nomeTS">
                <v-text-field
                  :placeholder="tabelaSelecao.designacao"
                  v-model="tabelaSelecao.designacao"
                  :rules="[v => !!v || 'A designação não pode ser vazia']"
                ></v-text-field>
              </v-form>
            </v-flex>
            <v-btn
              color="indigo darken-4"
              class="white--text"
              @click="
                loadProcEspecificos();
                validaTSnome();
              "
              >Continuar</v-btn
            >
          </v-stepper-content>

          <v-stepper-step color="amber accent-3" :complete="stepNo > 3" step="3"
            ><font size="4"><b> Seleção dos Processos</b></font>
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-col v-if="listaProcessosReady">
              <v-card>
                <v-card-text>
                  <ListaProcessos
                    :listaProcs="listaProcessos"
                    :listaCodigosEsp="listaCodigosEsp"
                    :participante="participante"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-else
              >Ainda não foi possível carregar a informação dos
              Processos...</v-col
            >

            <v-card-actions style="margin: 5px">
              <!-- Voltar ao passo anterior ............................................-->
              <v-btn
                v-if="stepNo > 2"
                color="indigo darken-4"
                class="white--text"
                @click="stepNo--"
                >Voltar</v-btn
              >

              <!-- Validar a TS ........................................................-->
              <v-btn
                v-if="stepNo > 2"
                color="indigo darken-4"
                class="white--text"
                @click="validarTS"
              >
                Validar TS

                <DialogValidacaoOK
                  v-if="validacaoTerminada && numeroErros == 0"
                  @continuar="fechoValidacao"
                />

                <DialogValidacaoErros
                  v-if="validacaoTerminada && numeroErros > 0"
                  :erros="mensagensErro"
                  @continuar="fechoValidacao"
                />
              </v-btn>

              <!-- Guardar o trabalho para continuar depois ..........................-->
              <v-btn
                v-if="stepNo > 2"
                color="indigo darken-4"
                class="white--text"
                @click="guardarTrabalho"
                >Guardar trabalho<v-icon right>save</v-icon>

                <DialogPendenteGuardado
                  v-if="pendenteGuardado"
                  :pendente="pendente"
                  @continuar="pendenteGuardado = false"
                />
              </v-btn>

              <!-- Submeter e criar o pedido ............................................-->
              <v-btn
                v-if="stepNo > 2"
                color="indigo darken-4"
                class="white--text"
                @click="verificaTS"
                >Submeter</v-btn
              >

              <!-- Sair da criação da TS sem abortar o processo .........................-->
              <v-btn
                v-if="stepNo > 2"
                color="indigo darken-4"
                class="white--text"
                @click="sairOperacao = true"
                >Sair

                <DialogSair
                  v-if="sairOperacao"
                  @continuar="sairOperacao = false"
                  @sair="sair"
                />
              </v-btn>

              <!-- Abortar a criação da TS ..........................................-->
              <v-btn dark color="red darken-4" @click="eliminarTabela = true"
                >Cancelar

                <DialogCancelar
                  v-if="eliminarTabela"
                  @continuar="eliminarTabela = false"
                  @sair="abortar"
                />
              </v-btn>
            </v-card-actions>
          </v-stepper-content>
        </v-stepper>
        <!-- Dialog de confirmação de operação -->
        <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
          <ConfirmacaoOperacao
            :mensagem="dialogConfirmacao.mensagem"
            @fechar="dialogConfirmacao.visivel = false"
            @confirma="submeterTS()"
          />
        </v-dialog>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSOrg/ListaProcessos.vue";
import DialogPendenteGuardado from "@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue";
import DialogCancelar from "@/components/tabSel/criacaoTSPluri/DialogCancelar.vue";
import DialogValidacaoOK from "@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue";
import DialogValidacaoErros from "@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue";
import DialogSair from "@/components/tabSel/criacaoTSPluri/DialogSair.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";

export default {
  props: ["obj"],

  components: {
    ListaProcessos,
    DialogPendenteGuardado,
    DialogCancelar,
    DialogValidacaoOK,
    DialogValidacaoErros,
    DialogSair,
    ConfirmacaoOperacao
  },
  data() {
    return {
      // Objeto da TS
      tabelaSelecao: {
        idEntidade: "",
        designacaoEntidade: "",
        idTipologia: "",
        designacaoTipologia: "",
        designacaoTS: "",
        tipologias: [],
        listaProcessos: {}
      },

      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null
      },
      // Fecho Transitivo dos processos
      fechoTransitivo: {},

      // Numero do passo da criação de TS
      // Na continuação não se permite alterar a entidade/tipologia alvo
      stepNo: 2,

      entidadeDGLAB: false,
      entidades: [],
      entidadesReady: false,
      ent: "",
      // Estrutura onde se guarda a entidade do utilizador
      entidadeUtilizador: {},
      // Flag de controlo: indica que a TS é para a entidade do utilizador
      tipoTS: "",
      // Flag de controlo: indica se a TS é para uma tipologia
      tipologiaTS: false,
      // Lista de todas as tipologias existentes
      tipologias: [],
      // True quando a lista de tipologias estiver carregada
      tipologiasReady: false,
      // Tipologia ou tipologias selecionadas
      tipSel: [],
      // Lista com todos os processos
      listaProcessos: {},
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcessosReady: false,
      // Lista com os códigos dos processos específicos da entidade selecionada
      listaCodigosEsp: [],
      // Array que determina a seleção de paticipante de cada processo
      participante: [],

      // Tratamento de erros da validação
      mensagensErro: [],
      numeroErros: 0,
      validacaoTerminada: false,
      notasApSet: [],
      exemplosNotasApSet: [],
      termosIndSet: [],

      // Se houver gravações intermédias, há um pendente
      pendente: {},

      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação de abandonar a operação
      sairOperacao: false
    };
  },
  methods: {
    debug: function(obj) {
      alert(JSON.stringify(obj));
    },
    validaTSnome: function() {
      if (this.$refs.nomeTS.validate()) {
        this.stepNo = 3;
      }
    },
    // Vai à API buscar todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        this.entidadesReady = true;
      } catch (err) {
        console.log("Erro ao recuperar a lista de entidades: " + err);
      }
    },

    guardaEntidade: async function() {
      this.tabelaSelecao.designacao =
        "Tabela de Seleção de " + this.ent.designacao;
      this.tabelaSelecao.designacaoEntidade = this.ent.designacao;
      this.tabelaSelecao.idEntidade = "ent_" + this.ent.sigla;
      try {
        await this.loadTipologias();
      } catch (e) {
        console.log("Erro ao carregar as tipologias: " + e);
      }
      this.stepNo = this.stepNo + 1;
    },

    guardaTipologia: function() {
      // id e designação
      this.tabelaSelecao.designacao =
        "Tabela de seleção de " + this.tipSel.designacao;
      this.tabelaSelecao.designacaoTipologia = this.tipSel.designacao;
      this.tabelaSelecao.idTipologia = this.tipSel.id;
      this.stepNo = this.stepNo + 1;
    },

    guardaEntidadeUtilizador: function() {
      // id e designação
      this.tabelaSelecao.designacao =
        "Tabela de seleção de " + this.entidadeUtilizador.designacao;
      this.tabelaSelecao.designacaoEntidade = this.entidadeUtilizador.designacao;
      this.tabelaSelecao.idEntidade = this.entidadeUtilizador.id;
      this.stepNo = this.stepNo + 1;
    },

    // Vai à API buscar todas as tipologias a que pertence a entidade do utilizador
    loadTipologiasUtilizador: async function() {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
      } catch (e) {
        console.log(
          "Erro ao carregar as tipologias da entidade do utilizador: " + e
        );
      }
    },

    // Vai à API buscar todas as tipologias
    loadTipologias: async function() {
      try {
        var response = await this.$request("get", "/tipologias/");
        this.tipologias = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        this.tipologiasReady = true;
      } catch (e) {
        console.log("Erro ao carregar as tipologias: " + e);
      }
    },

    // Carrega apenas as tipologias da entidade selecionada
    loadTipologiasDaEntidade: async function() {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        // Retira da lista de todas as tipologias as que já pertencem à entidade selecionada
        for (var i = 0; i < this.tipSel.length; i++) {
          var index = this.tipologias.findIndex(
            e => e.id === this.tipSel[i].id
          );
          this.tipologias.splice(index, 1);
        }
      } catch (error) {
        return error;
      }
    },

    // Carregamento dos processos
    loadProcessos: async function() {
      try {
        if (!this.listaProcessosReady) {
          this.listaProcessos.numProcessosSelecionados = 0;
          this.listaProcessos.numProcessosPreSelecionados = 0;
          this.listaProcessos.processosPreSelecionados = 0;
          this.listaProcessos.procsAselecionar = [];
          this.listaProcessos.procs = [];
          var response = await this.$request(
            "get",
            "/classes?nivel=3&info=completa"
          );
          for (let i = 0; i < response.data.length; i++) {
            this.listaProcessos.procs.push(response.data[i]);
            this.listaProcessos.procs[i].chave = i;
            this.listaProcessos.procs[i].edited = false;
            this.listaProcessos.procs[i].descriptionEMergedited = false;
            this.listaProcessos.procs[i].preSelected = 0;
            // Para poder ser filtrado na tabela
            this.listaProcessos.procs[i].preSelectedLabel = "";
            this.listaProcessos.procs[i].dono = false;
            this.listaProcessos.procs[i].participante = "NP";
          }
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },

    loadProcessosEspecificos: async function(entidade) {
      try {
        var url = "/classes?nivel=3&tipo=especifico&ents=" + entidade.id;
        var response = await this.$request("get", url);

        for (let j = 0; j < response.data.length; j++) {
          this.listaCodigosEsp.push(response.data[j].codigo);
        }
        // Marcamos os processos que não são específicos desta entidade como restantes
        var index;
        for (let j = 0; j < this.listaProcessos.procs.length; j++) {
          if (this.listaProcessos.procs[j].tipoProc != "Processo Comum") {
            index = this.listaCodigosEsp.indexOf(
              this.listaProcessos.procs[j].codigo
            );
            if (index == -1)
              this.listaProcessos.procs[j].tipoProc = "Processo Restante";
          }
        }
      } catch (e) {
        console.log(
          "Erro ao calcular os processos específicos das entidades: " + e
        );
      }
    },

    // Carrega os processos específicos da entidade e das tipologias em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          var url =
            "/classes?nivel=3&tipo=especifico&ents=" +
            this.tabelaSelecao.idEntidade;
          if (this.tipSel.length || this.tipSel.length) {
            url += "&tips=";
          }
          if (this.tipSel.length) {
            for (var i = 0; i < this.tipSel.length - 1; i++) {
              url += this.tipSel[i].id + ",";
            }
            url += this.tipSel[i].id;
          }
          var response = await this.$request("get", url);
          for (var x = 0; x < response.data.length; x++) {
            if (response.data[x].transversal === "S") {
              this.listaProcEsp.push({
                classe: response.data[x].codigo,
                designacao: response.data[x].titulo,
                dono: false,
                participante: false
              });
            } else {
              this.listaProcEsp.push({
                classe: response.data[x].codigo,
                designacao: response.data[x].titulo,
                dono: true
              });
            }
          }
          this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          return this.listaProcEsp;
        }
      } catch (error) {
        return error;
      }
    },
    criaHistoricoTS: async function(userBD) {
      let historico = [
        {
          designacao: {
            cor: "verde",
            dados: this.tabelaSelecao.designacao,
            nota: null
          },
          data: {
            cor: "verde",
            dados: new Date(),
            nota: null
          },
          entProd: {
            cor: "verde",
            dados: userBD.entidade.split("_")[1] + "(" + userBD.email + ")",
            nota: null
          },
          ts: {
            entidade: {
              cor: "verde",
              dados: this.tabelaSelecao.designacaoEntidade,
              nota: null
            },
            tipologia: {
              cor: "verde",
              dados: this.tabelaSelecao.designacaoTipologia,
              nota: null
            },
            classes: {
              cor: "verde",
              dados: this.tabelaSelecao.listaProcessos.procs.map(c => {
                return {
                  cor: "verde",
                  dados: JSON.parse(JSON.stringify(c)),
                  nota: null
                };
              }),
              nota: null
            }
          }
        }
      ];
      // Cria histórico para cada processo
      for (let i = 0; i < historico[0].ts.classes.dados.length; i++) {
        Object.keys(historico[0].ts.classes.dados[i].dados).map(p => {
          historico[0].ts.classes.dados[i].dados[p] = {
            cor: "verde",
            dados: historico[0].ts.classes.dados[i].dados[p],
            nota: null
          };
          if (p === "pca" || p === "df") {
            Object.keys(historico[0].ts.classes.dados[i].dados[p].dados).map(
              d => {
                historico[0].ts.classes.dados[i].dados[p].dados[d] = {
                  cor: "verde",
                  dados: historico[0].ts.classes.dados[i].dados[p].dados[d],
                  nota: null
                };
              }
            );
          }
        });
      }
      var procs = this.listaProcessos.procs.filter(
        p => p.dono || p.participante != "NP"
      );

      procs.map(p =>
        this.listaProcessos.procsAselecionar.splice(
          this.listaProcessos.procsAselecionar.findIndex(
            c => c.codigo === p.codigo
          ),
          1
        )
      );
      historico[0].ts["procsAselecionar"] = {
        cor: "vermelho",
        dados: this.listaProcessos.procsAselecionar,
        nota: null
      };

      return historico;
    },

    //Verifica a TS antes de submeter
    verificaTS: async function() {
      var procs = this.listaProcessos.procs.filter(
        p => p.dono || p.participante != "NP"
      );
      if (
        procs
          .map(p => p.codigo)
          .sort()
          .join(",") !==
          this.listaProcessos.procsAselecionar
            .map(p => p.codigo)
            .sort()
            .join(",") &&
        this.listaProcessos.numProcessosPreSelecionados -
          this.listaProcessos.processosPreSelecionados !=
          0
      ) {
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem " +
            (this.listaProcessos.numProcessosPreSelecionados -
              this.listaProcessos.processosPreSelecionados) +
            " processos por selecionar, deseja mesmo continuar com a submissão do pedido?"
        };
      } else await this.submeterTS();
    },

    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      // É preciso testar se há um Pendente criado para o apagar
      if (this.pendente._id) {
        try {
          var response = await this.$request(
            "delete",
            "/pendentes/" + this.pendente._id
          );
        } catch (e) {
          console.log("Erro ao remover o pendente na submissão da TS: " + e);
        }
      }
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(
          JSON.stringify(this.listaProcessos)
        );
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
          p => p.dono || p.participante != "NP"
        );

        var tsObj = {
          idEntidade: this.tabelaSelecao.idEntidade,
          designacaoEntidade: this.tabelaSelecao.designacaoEntidade,
          designacao: this.tabelaSelecao.designacao,
          idTipologia: this.tabelaSelecao.idTipologia,
          designacaoTipologia: this.tabelaSelecao.designacaoTipologia,
          listaProcessos: this.tabelaSelecao.listaProcessos
        };

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Organizacional",
          novoObjeto: { ts: tsObj },
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token,
          historico: await this.criaHistoricoTS(userBD)
        };

        var codigoPedido = await this.$request(
          "post",
          "/pedidos",
          pedidoParams
        );
        this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
      } catch (error) {
        console.log("Erro ao criar o pedido: " + error);
      }
    },
    // Guarda o trabalho de criação de uma TS
    guardarTrabalho: async function() {
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(
          JSON.stringify(this.listaProcessos)
        );
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
          p => p.dono || p.participante != "NP"
        );

        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Organizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token
        };

        // É preciso testar se há um Pendente criado para não criar um novo
        if (this.pendente._id) {
          pendenteParams._id = this.pendente._id;
          pendenteParams.numInterv = this.pendente.numInterv++;
          var response = await this.$request(
            "put",
            "/pendentes",
            pendenteParams
          );
        } else {
          pendenteParams.numInterv = 1;
          var response = await this.$request(
            "post",
            "/pendentes",
            pendenteParams
          );
        }

        this.pendente = response.data;
        this.pendenteGuardado = true;
      } catch (e) {
        console.log("Erro ao guardar trabalho: " + e);
      }
    },
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function() {
      this.$router.push("/");
    },

    // Valida a TS construída até ao momento
    validarTS: async function() {
      var procs = this.listaProcessos.procs.filter(
        p => p.dono || p.participante != "NP"
      );

      if (
        procs
          .map(p => p.codigo)
          .sort()
          .join(",") !==
          this.listaProcessos.procsAselecionar
            .map(p => p.codigo)
            .sort()
            .join(",") &&
        this.listaProcessos.numProcessosPreSelecionados -
          this.listaProcessos.processosPreSelecionados !=
          0
      ) {
        this.mensagensErro.push({
          sobre: "Escolha de processos",
          mensagem: `Ainda tem ${this.listaProcessos
            .numProcessosPreSelecionados -
            this.listaProcessos
              .processosPreSelecionados} processos por selecionar`
        });
        this.numeroErros++;
      }
      this.validacaoTerminada = true;
    },

    // Quando a validação termina chama-se esta rotina para fazer reset ao estado da Validação
    fechoValidacao: async function() {
      this.numeroErros = 0;
      this.mensagensErro = [];
      //this.notasApSet = [];
      //this.exemplosNotasApSet = [];
      //this.termosIndSet = [];
      this.validacaoTerminada = false;
    },

    // Abandonar a operação deixando o estado como estiver: se houver pendente não é apagado...
    sair: async function() {
      this.$router.push("/");
    },

    // Abortar a operação apagando o pendente se existir
    abortar: async function() {
      if (this.pendente && this.pendente._id) {
        try {
          var response = await this.$request(
            "delete",
            "/pendentes/" + this.pendente._id
          );
        } catch (e) {
          console.log("Erro ao eliminar o pendente: " + e);
        }
      }
      this.$router.push("/");
    },

    // Carrega os fechos transitivos necessários para os que já estão selecionados
    loadFechoTransitivo: async function() {
      try {
        var response = await this.$request("get", "/travessiaV2");
        this.fechoTransitivo = response.data;
      } catch (e) {
        console.log("Erro ao carregar o fecho transitivo: " + e);
      }
    },

    // Faz a pré-seleção do fecho transitivo dos processos já selecionados
    acrescentaFecho: function(processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcessos.procs.findIndex(
          p => p.codigo == fecho[i]
        );
        //Só acrescenta processos a selecionar que não tenham sido selecionados antes de guardar o trabalho
        if (
          index != -1 &&
          !this.listaProcessos.procs[index].dono &&
          this.listaProcessos.procs[index].participante == "NP"
        ) {
          this.listaProcessos.procs[index].preSelected++;

          if (this.listaProcessos.procs[index].preSelected == 1) {
            this.listaProcessos.numProcessosPreSelecionados++;
            this.listaProcessos.procs[index].preSelectedLabel =
              "Pré-Selecionado";
          }
        }
      }
    },

    // Merge do estado antigo dos processos com os que foram carregados da BD
    mergeProcs: async function() {
      // Merge com os processos que já estavam selecionados
      var index;
      for (let i = 0; i < this.tabelaSelecao.listaProcessos.procs.length; i++) {
        index = this.listaProcessos.procs.findIndex(
          p => p.codigo == this.tabelaSelecao.listaProcessos.procs[i].codigo
        );
        if (index != -1) {
          this.listaProcessos.procs[
            index
          ] = this.tabelaSelecao.listaProcessos.procs[i];
          this.acrescentaFecho(this.listaProcessos.procs[index]);
        }
      }
      this.listaProcessos.numProcessosSelecionados = this.tabelaSelecao.listaProcessos.numProcessosSelecionados;
      this.listaProcessos.numProcessosPreSelecionados = this.tabelaSelecao.listaProcessos.numProcessosPreSelecionados;
      this.listaProcessos.processosPreSelecionados = this.tabelaSelecao.listaProcessos.processosPreSelecionados;
      this.listaProcessos.procsAselecionar = this.tabelaSelecao.listaProcessos.procsAselecionar;
      this.listaProcessosReady = true;
    }
  },
  created: async function() {
    this.pendente = this.obj;
    this.participante = this.obj.objeto.participante;
    delete this.obj.objeto.participante;
    this.tabelaSelecao = this.obj.objeto;

    try {
      await this.loadProcessos();
      await this.loadFechoTransitivo();
      await this.mergeProcs();
    } catch (e) {
      console.log("Erro no carregamento dinicial: " + e);
    }
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
