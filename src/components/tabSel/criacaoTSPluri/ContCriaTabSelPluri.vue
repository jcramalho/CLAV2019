<template>
  <v-card flat class="pa-3">
    <!-- HEADER -->
    <v-row align="center" justify="center">
      <v-col cols="12" md="3" align="center"> <Voltar /> </v-col>
      <v-col cols="12" md="6" align="center">
        <p class="clav-content-title-1">
          Nova Tabela de Seleção Pluriorganizacional (Continuação)
        </p>
      </v-col>
      <v-col cols="0" md="3"> </v-col>
    </v-row>

    <v-stepper v-model="stepNo" vertical style="background-color: #f3f7fc">
      <v-stepper-step :complete="stepNo > 1" step="1"
        ><b> Identificação das entidades da Tabela de Seleção</b>
      </v-stepper-step>
      <span v-if="stepNo > 1">
        <v-row
          v-for="(e, i) in tabelaSelecao.entidades"
          :key="i"
          class="mx-16 mb-n10"
        >
          <v-col cols="auto">
            <div
              class="rounded-pill px-3 py-1 my-2 mx-4 clav-linear-background white--text"
              label
            >
              <unicon
                name="entidade-icon"
                width="20"
                height="20"
                viewBox="0 0 20.711 21.105"
                fill="#ffffff"
                class="mr-3"
              />
              {{ e.label }}
            </div>
          </v-col>
        </v-row>
      </span>

      <v-stepper-step :complete="stepNo > 2" step="2" class="mt-5"
        ><b> Designação da Tabela de Seleção</b>
      </v-stepper-step>
      <v-row class="ml-16">
        <v-col cols="auto">
          <div
            class="rounded-pill px-3 py-1 my-2 mx-4 clav-linear-background white--text"
          >
            <unicon
              class="mr-3"
              name="ts-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 23.668"
              fill="#ffffff"
            />
            {{ tabelaSelecao.designacao }}
          </div>
        </v-col>
      </v-row>
      <v-stepper-content step="2">
        <v-col xs12 sm6 md10>
          <v-form ref="nomeTS" :lazy-validation="false">
            <span class="subtitle-2 ml-16 pb-3"
              >Insira a designação para a tabela:</span
            >
            <div class="py-2 pl-6 pr-3 ml-16 mt-2" style="min-height: 50px">
              <v-tooltip top color="info" open-delay="1000">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    class="mt-n3"
                    :rules="[(v) => !!v || 'A designação não pode ser vazia']"
                    :placeholder="tabelaSelecao.designacao"
                    v-model="tabelaSelecao.designacao"
                    color="blue darken-3"
                    clearable
                  ></v-text-field>
                </template>
                <span> Designação para a Tabela de Seleção</span>
              </v-tooltip>
            </div>
          </v-form>
          <v-btn
            @click="validaTSnome"
            rounded
            class="white--text mt-5 mb-2"
            color="success darken-1"
          >
            <unicon
              name="continuar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 37.261"
              fill="#ffffff"
            />
            <p class="ml-2">Continuar</p>
          </v-btn>
        </v-col>
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 3" step="3"
        ><font size="4"><b> Seleção dos Processos</b></font>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-col v-if="listaProcessosReady">
          <ListaProcessos
            :listaProcs="listaProcessos"
            :listaCodigosEsp="listaCodigosEsp"
          />
        </v-col>

        <v-col v-else
          >Ainda não foi possível carregar a informação dos Processos...</v-col
        >

        <v-row class="align-center mb-1 mt-2" style="text-align: center">
          <!-- Voltar ao passo anterior ............................................-->
          <v-col cols="14" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              block
              @click="stepNo = 2"
              rounded
              class="white--text"
              color="error darken-1"
            >
              <unicon
                name="arrow-back-icon"
                width="20"
                height="20"
                viewBox="0 0 20.71 37.261"
                fill="#ffffff"
              />
              <p>Retroceder</p>
            </v-btn>
          </v-col>

          <!-- Sair da criação da TS sem abortar o processo .........................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              @click="sairOperacao = true"
              block
              rounded
              class="clav-linear-background white--text"
            >
              <unicon
                name="relogio-icon"
                width="20"
                height="20"
                viewBox="0 0 20.71 20.71"
                fill="#ffffff"
              />
              <DialogSair
                v-if="sairOperacao"
                @continuar="sairOperacao = false"
                @sair="sair"
              />
              <p class="ml-2">Sair</p>
            </v-btn>
          </v-col>

          <!-- Guardar o trabalho para continuar depois ..........................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              @click="guardarTrabalho()"
              block
              rounded
              class="clav-linear-background white--text"
            >
              <unicon name="guardar-icon" fill="#ffffff" />
              <DialogPendenteGuardado
                v-if="pendenteGuardado"
                :pendente="pendente"
                @continuar="pendenteGuardado = false"
              />
              <p class="ml-2">Guardar</p>
            </v-btn>
          </v-col>

          <!-- Validar a TS ........................................................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              @click="validarTS"
              block
              rounded
              class="clav-linear-background white--text"
            >
              <unicon
                name="validar-icon"
                width="20"
                height="20"
                viewBox="0 0 20.709 20.696"
                fill="#ffffff"
              />
              <DialogValidacaoOK
                v-if="validacaoTerminada && numeroErros == 0"
                @continuar="fechoValidacao"
              />
              <DialogValidacaoErros
                v-if="validacaoTerminada && numeroErros > 0"
                :erros="mensagensErro"
                @continuar="fechoValidacao"
              />
              <p class="ml-2">Validar</p>
            </v-btn>
          </v-col>

          <!-- Submeter e criar o pedido ............................................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              @click="
                loading = true;
                verificaTS();
              "
              block
              color="success darken-1"
              rounded
              class="white--text"
              style="width: 100%"
            >
              <unicon
                name="adicionar-icon"
                width="20"
                height="20"
                viewBox="0 0 20.71 20.71"
                fill="#ffffff"
              />
              <p class="ml-2">Submeter</p>
            </v-btn>
          </v-col>

          <!-- Abortar a criação da TS ..........................................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              @click="eliminarTabela = true"
              color="error"
              rounded
              block
              class="white--text"
            >
              <unicon
                name="eliminar-icon"
                width="20"
                height="20"
                viewBox="0 0 20.71 20.71"
                fill="#ffffff"
              />
              <DialogCancelar
                v-if="eliminarTabela"
                @continuar="eliminarTabela = false"
                @sair="abortar"
              />
              <p class="ml-2">Eliminar</p>
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>
    </v-stepper>
    <!-- Dialog de confirmação de operação -->
    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="
          loading = false;
          dialogConfirmacao.visivel = false;
        "
        @confirma="
          dialogConfirmacao.visivel = false;
          submeterTS();
        "
      />
    </v-dialog>
  </v-card>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSPluri/ListaProcessos.vue";
import DialogPendenteGuardado from "@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue";
import DialogCancelar from "@/components/tabSel/criacaoTSPluri/DialogCancelar.vue";
import DialogValidacaoOK from "@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue";
import DialogValidacaoErros from "@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue";
import DialogSair from "@/components/tabSel/criacaoTSPluri/DialogSair.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import Voltar from "@/components/generic/Voltar";

export default {
  props: ["obj"],

  components: {
    ListaProcessos,
    DialogPendenteGuardado,
    DialogCancelar,
    DialogValidacaoOK,
    DialogValidacaoErros,
    DialogSair,
    ConfirmacaoOperacao,
    Voltar,
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {
        designacao: "",
        entidades: [],
        listaProcessos: {},
      },

      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },

      // Fecho Transitivo dos processos
      fechoTransitivo: {},

      // Numero do passo da criação de TS
      stepNo: 2,

      // Lista de todas as entidades existentes
      entidades: [],
      // True quando a lista de entidades estiver carregada
      entidadesReady: false,

      // Flag de controlo do carregamento dos processos
      listaProcessosReady: false,
      // Lista com todos os processos e com a informação necessária à criação da TS
      listaProcessos: {},
      // Lista com os códigos dos processos específicos das entidades selecionadas
      listaCodigosEsp: [],

      // Tratamento de erros da validação
      mensagensErro: [],
      numeroErros: 0,
      validacaoTerminada: false,
      notasApSet: [],
      exemplosNotasApSet: [],
      termosIndSet: [],

      // Pendente criado na BD
      pendente: {},
      // Dialog de confirmação da gravação do Pendente
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação de abandonar a operação
      sairOperacao: false,
      //Loading do botão de submeter impedindo múltiplos cliques
      loading: false,
    };
  },

  created: async function () {
    this.pendente = this.obj;
    this.tabelaSelecao = this.obj.objeto;
    try {
      await this.loadFechoTransitivo();
      await this.loadProcessos();
      await this.entidadesSelecionadas();
      await this.loadProcessosEspecificos(this.tabelaSelecao.entidades);
      // Merge com os processos que já estavam selecionados
      var index;
      for (let i = 0; i < this.tabelaSelecao.listaProcessos.procs.length; i++) {
        index = this.listaProcessos.procs.findIndex(
          (p) => p.codigo == this.tabelaSelecao.listaProcessos.procs[i].codigo
        );
        if (index != -1) {
          this.listaProcessos.procs[
            index
          ] = this.tabelaSelecao.listaProcessos.procs[i];

          if (
            this.tabelaSelecao.listaProcessos.procs[i].entidades.filter(
              (e) => e.dono || e.participante != "NP"
            ).length > 0
          )
            this.acrescentaFecho(this.listaProcessos.procs[index]);
        }
      }
      this.listaProcessos.numProcessosSelecionados = this.tabelaSelecao.listaProcessos.numProcessosSelecionados;
      this.listaProcessos.numProcessosPreSelecionados = this.tabelaSelecao.listaProcessos.numProcessosPreSelecionados;
      this.listaProcessos.processosPreSelecionados = this.tabelaSelecao.listaProcessos.processosPreSelecionados;
      this.listaProcessos.procsAselecionar = this.tabelaSelecao.listaProcessos.procsAselecionar;

      this.listaProcessosReady = true;
    } catch (e) {
      console.log("Erro ao carregar a informação inicial: " + e);
    }
  },

  methods: {
    debug: function (data) {
      alert(JSON.stringify(data));
    },

    validaTSnome: function () {
      if (this.$refs.nomeTS.validate()) {
        this.stepNo = 3;
      }
    },

    // Faz a pré-seleção do fecho transitivo dos processos já selecionados
    acrescentaFecho: function (processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcessos.procs.findIndex(
          (p) => p.codigo == fecho[i]
        );

        if (
          index != -1 &&
          this.listaProcessos.procs[index].entidades.every(
            (e) => !e.dono && e.participante == "NP"
          ) &&
          !this.listaProcessos.procs[index].descriptionEdited
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

    loadFechoTransitivo: async function () {
      try {
        var response = await this.$request("get", "/travessiaV2");
        this.fechoTransitivo = response.data;
      } catch (e) {
        console.log("Erro ao carregar o fecho transitivo: " + e);
      }
    },

    // Carregamento dos processos
    loadProcessos: async function () {
      try {
        if (!this.listaProcessosReady) {
          this.listaProcessos.numProcessosSelecionados = 0;
          this.listaProcessos.numProcessosPreSelecionados = 0;
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
            this.listaProcessos.procs[i].descriptionEdited = false;
            this.listaProcessos.procs[i].preSelected = 0;
            // Para poder ser filtrado na tabela
            this.listaProcessos.procs[i].preSelectedLabel = "";
            this.listaProcessos.procs[i].entidades = [];
          }
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },

    // Quando se termina a seleção das entidades
    entidadesSelecionadas: async function () {
      try {
        for (let i = 0; i < this.listaProcessos.procs.length; i++) {
          for (let j = 0; j < this.tabelaSelecao.entidades.length; j++) {
            this.listaProcessos.procs[i].entidades.push({
              sigla: this.tabelaSelecao.entidades[j].sigla,
              designacao: this.tabelaSelecao.entidades[j].designacao,
              id: this.tabelaSelecao.entidades[j].id,
              label: this.tabelaSelecao.entidades[j].label,
              dono: false,
              participante: "NP",
            });
          }
        }
      } catch (e) {
        console.log("Erro ao fundir as entidades nos processos: " + e);
      }
    },

    loadProcessosEspecificos: async function (entidades) {
      try {
        var url = "/classes?nivel=3&tipo=especifico&ents=";
        for (var i = 0; i < entidades.length - 1; i++) {
          url += this.tabelaSelecao.entidades[i].id + ",";
        }
        url += this.tabelaSelecao.entidades[i].id;

        var response = await this.$request("get", url);
        this.listaProcessos.numProcessosSelecionados = this.tabelaSelecao.listaProcessos.numProcessosSelecionados;

        for (let j = 0; j < response.data.length; j++) {
          this.listaCodigosEsp.push(response.data[j].codigo);
        }
        // Marcamos os processos que não são específicos destas entidades como restantes
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

    // Guarda a estrutura criada até ao momento nos Pendentes
    guardarTrabalho: async function () {
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(
          JSON.stringify(this.listaProcessos)
        );
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
          (p) => p.edited || p.descriptionEdited
        );

        var pendenteParams = {
          acao: "Criação",
          tipo: "TS Pluriorganizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token,
        };

        // É preciso testar se há um Pendente criado para não criar um novo
        if (this.pendente._id) {
          pendenteParams._id = this.pendente._id;
          pendenteParams.numInterv = ++this.pendente.numInterv;
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
      } catch (err) {
        console.log("Erro ao guardar trabalho: " + err);
      }
    },

    //Verifica a TS antes de submeter
    verificaTS: async function () {
      var procs = this.listaProcessos.procs.filter((p) => p.edited);
      if (procs.length < 1) {
        this.mensagensErro.push({
          sobre: "Escolha de processos",
          mensagem: `Não tem nenhum processo selecionado`,
        });
        this.numeroErros++;
      } else if (
        procs
          .map((p) => p.codigo)
          .sort()
          .join(",") !==
          this.listaProcessos.procsAselecionar
            .map((p) => p.codigo)
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
            " processos por selecionar, deseja mesmo continuar com a submissão do pedido?",
        };
      } else await this.submeterTS();
      if (this.numeroErros > 0) {
        this.loading = false;
        this.validacaoTerminada = true;
      }
    },

    // Lança o pedido de submissão de uma TS
    submeterTS: async function () {
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
        this.tabelaSelecao.listaProcessos = this.listaProcessos;
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
          (p) => p.edited
        );
        this.tabelaSelecao.listaProcessos.procs.map((p) =>
          this.tabelaSelecao.listaProcessos.procsAselecionar.splice(
            this.tabelaSelecao.listaProcessos.procsAselecionar.findIndex(
              (c) => c.codigo === p.codigo
            ),
            1
          )
        );

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Pluriorganizacional",
          novoObjeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token,
          historico: await this.criaHistoricoTS(userBD),
        };

        var response = await this.$request("post", "/pedidos", pedidoParams);
        this.$router.push("/pedidos/submissao/" + response.data);
      } catch (error) {
        console.log("Erro no POST da TS: " + error);
      }
    },

    sair: async function () {
      this.$router.push("/");
    },

    abortar: async function () {
      try {
        if (this.pendente._id) {
          var response = await this.$request(
            "delete",
            "/pendentes/" + this.pendente._id
          );
        }
        this.$router.push("/");
      } catch (e) {
        console.log("Erro ao eliminar o pendente: " + e);
      }
    },
    criaHistoricoTS: async function (userBD) {
      var response = await this.$request(
        "get",
        "/classes?nivel=3&info=completa"
      );
      let historico = [
        {
          data: {
            cor: "verde",
            dados: new Date(),
            nota: null,
          },
          entProd: {
            cor: "verde",
            dados: userBD.entidade.split("_")[1] + "(" + userBD.email + ")",
            nota: null,
          },
          ts: {
            designacao: {
              cor: "verde",
              dados: this.tabelaSelecao.designacao,
              nota: null,
            },
            entidades: {
              cor: "verde",
              dados: this.tabelaSelecao.entidades.map((e) => {
                return JSON.parse(JSON.stringify(e));
              }),
              nota: null,
            },
            classes: {
              cor: "verde",
              dados: this.tabelaSelecao.listaProcessos.procs.map((c) => {
                return {
                  cor: "verde",
                  dados: JSON.parse(JSON.stringify(c)),
                  nota: null,
                };
              }),
              nota: null,
            },
          },
        },
      ];
      // Cria histórico para cada processo
      for (let i = 0; i < historico[0].ts.classes.dados.length; i++) {
        let codigo;
        Object.keys(historico[0].ts.classes.dados[i].dados).map((p) => {
          historico[0].ts.classes.dados[i].dados[p] = {
            cor: "verde",
            dados: historico[0].ts.classes.dados[i].dados[p],
            nota: null,
          };
          if (p === "pca" || p === "df") {
            Object.keys(historico[0].ts.classes.dados[i].dados[p].dados).map(
              (d) => {
                historico[0].ts.classes.dados[i].dados[p].dados[d] = {
                  cor: "verde",
                  dados: historico[0].ts.classes.dados[i].dados[p].dados[d],
                  nota: null,
                };
              }
            );
          }
          if (p == "notasAp") {
            let index = response.data.findIndex((p) => p.codigo == codigo);

            !(
              response.data[index].notasAp.length ===
                historico[0].ts.classes.dados[i].dados[p].dados.length &&
              response.data[index].notasAp
                .filter((n) => n.nota.replace(" ", "") != "")
                .every((n) =>
                  historico[0].ts.classes.dados[i].dados[p].dados.some(
                    (n1) => n.nota == n1.nota
                  )
                )
            )
              ? (historico[0].ts.classes.dados[i].dados[p].cor = "amarelo")
              : "";
          }
          if (p == "exemplosNotasAp") {
            let index = response.data.findIndex((p) => p.codigo == codigo);
            !(
              response.data[index].exemplosNotasAp.length ===
                historico[0].ts.classes.dados[i].dados[p].dados.length &&
              response.data[index].exemplosNotasAp
                .filter((n) => n.exemplo.replace(" ", "") != "")
                .every((n) =>
                  historico[0].ts.classes.dados[i].dados[p].dados.some(
                    (n1) => n.exemplo == n1.exemplo
                  )
                )
            )
              ? (historico[0].ts.classes.dados[i].dados[p].cor = "amarelo")
              : "";
          }
          if (p == "notasEx") {
            let index = response.data.findIndex((p) => p.codigo == codigo);
            !(
              response.data[index].notasEx.length ===
                historico[0].ts.classes.dados[i].dados[p].dados.length &&
              response.data[index].notasEx
                .filter((n) => n.nota.replace(" ", "") != "")
                .every((n) =>
                  historico[0].ts.classes.dados[i].dados[p].dados.some(
                    (n1) => n.nota == n1.nota
                  )
                )
            )
              ? (historico[0].ts.classes.dados[i].dados[p].cor = "amarelo")
              : "";
          }
          if (p == "termosInd") {
            let index = response.data.findIndex((p) => p.codigo == codigo);
            !(
              response.data[index].termosInd.length ===
                historico[0].ts.classes.dados[i].dados[p].dados.length &&
              response.data[index].termosInd
                .filter((n) => n.termo.replace(" ", "") != "")
                .every((n) =>
                  historico[0].ts.classes.dados[i].dados[p].dados.some(
                    (n1) => n.termo == n1.termo
                  )
                )
            )
              ? (historico[0].ts.classes.dados[i].dados[p].cor = "amarelo")
              : "";
          }

          if (p == "codigo") {
            codigo = historico[0].ts.classes.dados[i].dados[p].dados;
          }
        });
      }
      var procs = this.tabelaSelecao.listaProcessos.procs.filter(
        (p) => p.edited
      );

      procs.map((p) =>
        this.listaProcessos.procsAselecionar.splice(
          this.listaProcessos.procsAselecionar.findIndex(
            (c) => c.codigo === p.codigo
          ),
          1
        )
      );
      if (this.listaProcessos.procsAselecionar.length > 0) {
        historico[0].ts["procsAselecionar"] = {
          cor: "vermelho",
          dados: this.listaProcessos.procsAselecionar,
          nota: null,
        };
      } else {
        historico[0].ts["procsAselecionar"] = {
          cor: "verde",
          dados: [],
          nota: null,
        };
      }

      return historico;
    },

    // Funções de validação
    // Validação da TS
    validarTS: async function () {
      var procs = this.tabelaSelecao.listaProcessos.procs.filter(
        (p) => p.edited
      );

      if (procs.length < 1) {
        this.mensagensErro.push({
          sobre: "Escolha de processos",
          mensagem: `Não tem nenhum processo selecionado`,
        });
        this.numeroErros++;
      }

      //Valida se os processos a selecionar estão todos selecionados
      if (
        procs
          .map((p) => p.codigo)
          .sort()
          .join(",") !==
          this.listaProcessos.procsAselecionar
            .map((p) => p.codigo)
            .sort()
            .join(",") &&
        this.listaProcessos.numProcessosPreSelecionados -
          this.listaProcessos.processosPreSelecionados !=
          0
      ) {
        this.mensagensErro.push({
          sobre: "Escolha de processos",
          mensagem: `Ainda tem ${
            this.listaProcessos.numProcessosPreSelecionados -
            this.listaProcessos.processosPreSelecionados
          } processos por selecionar`,
        });
        this.numeroErros++;
      }
      var processosSelecionados = this.listaProcessos.procs.filter(
        (p) => p.edited
      );
      // Criação das estruturas auxiliares para a validação
      for (let i = 0; i < processosSelecionados.length; i++) {
        this.notasApSet = this.notasApSet.concat(
          processosSelecionados[i].notasAp
        );
        this.exemplosNotasApSet = this.exemplosNotasApSet.concat(
          processosSelecionados[i].exemplosNotasAp
        );
        this.termosIndSet = this.termosIndSet.concat(
          processosSelecionados[i].termosInd
        );
      }
      // Valida-se agora o bloco descritivo
      for (let i = 0; i < processosSelecionados.length; i++) {
        await this.validaBlocoDescritivo(processosSelecionados[i]);
      }
      this.validacaoTerminada = true;
    },

    fechoValidacao: function () {
      this.numeroErros = 0;
      this.mensagensErro = [];
      this.notasApSet = [];
      this.exemplosNotasApSet = [];
      this.termosIndSet = [];
      this.validacaoTerminada = false;
    },

    validaBlocoDescritivo: async function (p) {
      this.validaDescricao(p);
      this.validaNotasAp(p);
      this.validaExemplosNotasAp(p);
      this.validaNotasEx(p);
      this.validaTIs(p);
    },

    validaDescricao: function (p) {
      // Descrição
      if (p.descricao == "") {
        this.mensagensErro.push({
          sobre: "Descrição",
          mensagem: "A descrição não pode ser vazia.",
        });
        this.numeroErros++;
      }
    },

    validaNotasAp: async function (p) {
      var filtradas;
      for (let i = 0; i < p.notasAp.length; i++) {
        filtradas = this.notasApSet.filter((n) => n.nota == p.notasAp[i].nota);

        if (filtradas.length > 1) {
          this.mensagensErro.push({
            sobre: "Nota de Aplicação(" + (i + 1) + ")",
            mensagem:
              "[" +
              p.notasAp[i].nota +
              "] já existente noutro processo selecionado.",
          });
          this.numeroErros++;
        }
      }
      if (this.notaDuplicada(p.notasAp)) {
        this.mensagensErro.push({
          sobre: "Nota de Aplicação(" + (i + 1) + ")",
          mensagem: "A última nota encontra-se duplicada.",
        });
        this.numeroErros++;
      }
    },

    notaDuplicada: function (notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1].nota;
        var duplicados = notas.filter((n) => n.nota == lastNota);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    exemploDuplicado: function (exemplos) {
      if (exemplos.length > 1) {
        var lastExemplo = exemplos[exemplos.length - 1].exemplo;
        var duplicados = exemplos.filter((e) => e.exemplo == lastExemplo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    tiDuplicado: function (termos) {
      if (termos.length > 1) {
        var lastTermo = termos[termos.length - 1].termo;
        var duplicados = termos.filter((t) => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    validaExemplosNotasAp: async function (p) {
      var filtrados;
      for (let i = 0; i < p.exemplosNotasAp.length; i++) {
        filtrados = this.exemplosNotasApSet.filter(
          (e) => e.exemplo == p.exemplosNotasAp[i].exemplo
        );
        if (filtrados.length > 1) {
          this.mensagensErro.push({
            sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
            mensagem:
              "[" +
              p.exemplosNotasAp[i].exemplo +
              "] noutro processo selecionado.",
          });
          this.numeroErros++;
        }
      }
      if (this.exemploDuplicado(p.exemplosNotasAp)) {
        this.mensagensErro.push({
          sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
          mensagem: "O último exemplo encontra-se duplicado.",
        });
        this.numeroErros++;
      }
    },

    validaNotasEx: async function (p) {
      // Notas de Exclusão
      if (this.notaDuplicada(p.notasEx)) {
        this.mensagensErro.push({
          sobre: "Nota de Exclusão(" + p.notasEx.length + ")",
          mensagem: "A última nota encontra-se duplicada.",
        });
        this.numeroErros++;
      }
    },

    validaTIs: async function (p) {
      // Termos de Índice
      var filtrados;
      for (let i = 0; i < p.termosInd.length; i++) {
        filtrados = this.termosIndSet.filter(
          (t) => t.termo == p.termosInd[i].termo
        );
        if (filtrados.length > 1) {
          this.mensagensErro.push({
            sobre: "Termo de Índice(" + (i + 1) + ")",
            mensagem:
              "[" + p.termosInd[i].termo + "] noutro processo selecionado.",
          });
          this.numeroErros++;
        }
      }
      if (this.tiDuplicado(p.termosInd)) {
        this.numeroErros++;
        this.mensagensErro.push({
          sobre: "Termo de Índice(" + (i + 1) + ")",
          mensagem: "O último ti encontra-se duplicado.",
        });
      }
    },
    // ----------Fim da validação ----------------------------
  },
};
</script>

<style scoped>
.expansion-panel-heading {
  color: white !important;
  background-color: #1565c0;
}

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
