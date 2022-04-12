<template>
  <v-card flat class="pa-3">
    <!-- HEADER -->
    <v-row align="center" justify="center">
      <v-col cols="12" align="center">
        <p class="clav-content-title-1">Nova Tabela de Seleção Organizacional</p>
      </v-col>
    </v-row>
    <!-- CONTENT -->

    <v-stepper v-model="stepNo" vertical style="background-color: #f3f7fc">
      <v-stepper-step :complete="stepNo > 1" step="1">
        <b>Identificação da entidade ou tipologia da Tabela de Seleção</b>
      </v-stepper-step>
      <v-row class="ml-12">
        <v-col cols="auto">
          <div
            v-if="tabelaSelecao.idEntidade != ''"
            class="rounded-pill px-3 py-1 my-2 mx-4 clav-linear-background white--text"
          >
            <unicon
              name="entidade-icon"
              width="20"
              height="20"
              viewBox="0 0 20.711 21.105"
              fill="#ffffff"
              class="mr-3"
            />
            <!-- {{ tabelaSelecao }} -->
            {{ tabelaSelecao.idEntidade.split("_")[1] }} -
            {{ tabelaSelecao.designacaoEntidade }}
          </div>
          <div
            v-else-if="tabelaSelecao.idTipologia != ''"
            class="rounded-pill px-3 py-1 my-2 mx-4 clav-linear-background white--text"
          >
            <unicon
              name="entidade-icon"
              width="20"
              height="20"
              viewBox="0 0 20.711 21.105"
              fill="#ffffff"
              class="mr-3"
            />
            {{ tabelaSelecao.idTipologia.split("_")[1] }} -
            {{ tabelaSelecao.designacaoTipologia }}
          </div>
        </v-col>
        <v-col></v-col>
      </v-row>

      <v-stepper-step :complete="stepNo > 2" step="2">
        <b>Designação da Tabela de Seleção</b>
      </v-stepper-step>
      <span v-if="stepNo > 1" class="mt-1">
        <v-row class="ml-12">
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
              {{ designacao }}
            </div>
          </v-col>
          <v-col></v-col>
        </v-row>
      </span>

      <v-stepper-content step="2" class="pt-0">
        <v-form ref="nomeTS" :lazy-validation="false" class="px-4">
          <span class="subtitle-2 pb-3">Insira a designação para a tabela:</span>
          <div class="py-2 pl-6 pr-3 mt-2" style="min-height: 50px">
            <v-tooltip top color="info" open-delay="1000">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  class="mt-n3"
                  :rules="[(v) => !!v || 'A designação não pode ser vazia']"
                  :placeholder="designacao"
                  v-model="designacao"
                  color="blue darken-3"
                  clearable
                ></v-text-field>
              </template>
              <span> Designação para a Tabela de Seleção</span>
            </v-tooltip>
          </div>
        </v-form>

        <v-btn
          @click="
            loadProcEspecificos();
            validaTSnome();
          "
          rounded
          class="white--text my-5 ml-4"
          color="clav-linear-background"
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
      </v-stepper-content>

      <v-stepper-step :complete="stepNo > 3" step="3">
        <b>Seleção dos Processos</b>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-col cols="12" v-if="listaProcessosReady">
          <div>
            <ListaProcessos
              v-if="!importadoFlag"
              :listaProcs="listaProcessos"
              :listaCodigosEsp="listaCodigosEsp"
              :participante="participante"
            />
            <ListaProcessosImportados v-else :procs="listaProcessos.procs" />
          </div>
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
              @click="stepNo--"
              rounded
              class="white--text"
              color="clav-linear-background"
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

          <!-- Guardar o trabalho para continuar depois ..........................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              @click="guardarTrabalho(false)"
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
              :loading="loading"
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

          <!-- Sair da criação da TS sem abortar o processo .........................-->
          <v-col cols="12" md="4" lg="2">
            <v-btn
              v-if="stepNo > 2"
              @click="sair"
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
                @fechar="sair2"
              />
              <p class="ml-2">Sair</p>
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
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Não foi possível importar os processos
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"> </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false"> Fechar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSOrg/ListaProcessos.vue";
import ListaProcessosImportados from "@/components/tabSel/criacaoTSOrg/ListaProcessosImportados.vue";
import DialogPendenteGuardado from "@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue";
import DialogCancelar from "@/components/tabSel/criacaoTSPluri/DialogCancelar.vue";
import DialogValidacaoOK from "@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue";
import DialogValidacaoErros from "@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue";
import DialogSair from "@/components/tabSel/criacaoTSOrg/DialogSair.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";
import Voltar from "@/components/generic/Voltar";
export default {
  props: ["obj"],

  components: {
    ListaProcessos,
    ListaProcessosImportados,
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
      // Objeto da TS
      tabelaSelecao: {
        idEntidade: "",
        designacaoEntidade: "",
        idTipologia: "",
        designacaoTipologia: "",
        designacaoTS: "",
        tipologias: [],
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
      // Na continuação não se permite alterar a entidade/tipologia alvo
      stepNo: 2,

      entidadeDGLAB: false,
      entidades: [],
      entidadesReady: false,
      ent: "",
      designacao: "",
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
      erro: "",
      erroDialog: false,
      success: "",
      successDialog: false,

      // Se houver gravações intermédias, há um pendente
      pendente: {},

      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação de abandonar a operação
      sairOperacao: false,
      //Verificação de ficheiro importado
      importadoFlag: false,
      //Loading do botão de submeter impedindo múltiplos cliques
      loading: false,
    };
  },
  methods: {
    goBack() {
      this.$router.push("/ts/criar");
    },
    debug: function (obj) {
      alert(JSON.stringify(obj));
    },
    validaTSnome: function () {
      if (this.$refs.nomeTS.validate()) {
        this.tabelaSelecao.designacao = this.designacao;
        this.stepNo = 3;
      }
    },
    // Vai à API buscar todas as entidades
    loadEntidades: async function () {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao,
          };
        });
        this.entidadesReady = true;
      } catch (err) {
        console.log("Erro ao recuperar a lista de entidades: " + err);
      }
    },
    guardaEntidade: async function () {
      this.tabelaSelecao.designacao = "Tabela de Seleção de " + this.ent.designacao;
      this.tabelaSelecao.designacaoEntidade = this.ent.designacao;
      this.tabelaSelecao.idEntidade = "ent_" + this.ent.sigla;
      try {
        await this.loadTipologias();
      } catch (e) {
        console.log("Erro ao carregar as tipologias: " + e);
      }
      this.stepNo = this.stepNo + 1;
    },
    guardaTipologia: function () {
      // id e designação
      this.tabelaSelecao.designacao = "Tabela de seleção de " + this.tipSel.designacao;
      this.tabelaSelecao.designacaoTipologia = this.tipSel.designacao;
      this.tabelaSelecao.idTipologia = this.tipSel.id;
      this.stepNo = this.stepNo + 1;
    },
    guardaEntidadeUtilizador: function () {
      // id e designação
      this.tabelaSelecao.designacao =
        "Tabela de seleção de " + this.entidadeUtilizador.designacao;
      this.tabelaSelecao.designacaoEntidade = this.entidadeUtilizador.designacao;
      this.tabelaSelecao.idEntidade = this.entidadeUtilizador.id;
      this.stepNo = this.stepNo + 1;
    },
    // Vai à API buscar todas as tipologias a que pertence a entidade do utilizador
    loadTipologiasUtilizador: async function () {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao,
          };
        });
      } catch (e) {
        console.log("Erro ao carregar as tipologias da entidade do utilizador: " + e);
      }
    },
    // Vai à API buscar todas as tipologias
    loadTipologias: async function () {
      try {
        var response = await this.$request("get", "/tipologias/");
        this.tipologias = response.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao,
          };
        });
        this.tipologiasReady = true;
      } catch (e) {
        console.log("Erro ao carregar as tipologias: " + e);
      }
    },
    // Carrega apenas as tipologias da entidade selecionada
    loadTipologiasDaEntidade: async function () {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao,
          };
        });
        // Retira da lista de todas as tipologias as que já pertencem à entidade selecionada
        for (var i = 0; i < this.tipSel.length; i++) {
          var index = this.tipologias.findIndex((e) => e.id === this.tipSel[i].id);
          this.tipologias.splice(index, 1);
        }
      } catch (error) {
        return error;
      }
    },
    // Carregamento dos processos
    loadProcessos: async function () {
      try {
        if (!this.listaProcessosReady) {
          this.listaProcessos.numProcessosSelecionados = 0;
          this.listaProcessos.numProcessosPreSelecionados = 0;
          this.listaProcessos.processosPreSelecionados = 0;
          this.listaProcessos.procsAselecionar = [];
          this.listaProcessos.procs = [];
          var response = await this.$request("get", "/classes?nivel=3&info=completa");

          var p = -1
          for (let i = 0; i < response.data.length; i++) {
            if(response.data[i].status == 'A'){
              this.listaProcessos.procs.push(response.data[i]);
              p ++;
              this.listaProcessos.procs[p].chave = i;
              this.listaProcessos.procs[p].edited = false;
              this.listaProcessos.procs[p].descriptionEMergedited = false;
              this.listaProcessos.procs[p].preSelected = 0;
              // Para poder ser filtrado na tabela
              this.listaProcessos.procs[p].preSelectedLabel = "";
              this.listaProcessos.procs[p].dono = false;
              this.listaProcessos.procs[p].participante = "NP";
              this.listaProcessos.procs[p].notasAp = this.listaProcessos.procs[
                p
              ].notasAp.filter((n) => n.nota.replace(" ", "") != "");
              this.listaProcessos.procs[p].notasEx = this.listaProcessos.procs[
                p
              ].notasEx.filter((n) => n.nota.replace(" ", "") != "");
              this.listaProcessos.procs[p].exemplosNotasAp = this.listaProcessos.procs[
                p
              ].exemplosNotasAp.filter((n) => n.exemplo.replace(" ", "") != "");
              this.listaProcessos.procs[p].termosInd = this.listaProcessos.procs[
                p
              ].termosInd.filter((n) => n.termo.replace(" ", "") != "");
            }
          }
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },
    loadProcessosEspecificos: async function (entidade) {
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
            index = this.listaCodigosEsp.indexOf(this.listaProcessos.procs[j].codigo);
            if (index == -1) this.listaProcessos.procs[j].tipoProc = "Processo Restante";
          }
        }
      } catch (e) {
        console.log("Erro ao calcular os processos específicos das entidades: " + e);
      }
    },
    // Carrega os processos específicos da entidade e das tipologias em causa
    loadProcEspecificos: async function () {
      try {
        if (!this.listaProcEspReady) {
          var url =
            "/classes?nivel=3&tipo=especifico&ents=" + this.tabelaSelecao.idEntidade;
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
                participante: false,
              });
            } else {
              this.listaProcEsp.push({
                classe: response.data[x].codigo,
                designacao: response.data[x].titulo,
                dono: true,
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
    criaHistoricoTS: async function (userBD) {
      var response = await this.$request("get", "/classes?nivel=3&info=completa");
      let historico = [
        {
          designacao: {
            cor: "verde",
            dados: this.tabelaSelecao.designacao,
            nota: null,
          },
          data: {
            cor: "verde",
            dados: new Date(),
            nota: null,
          },
          entProd: {
            cor: "verde",
            dados: userBD.entidade.split("_")[1],
            nota: null,
          },
          ts: {
            entidade: {
              cor: "verde",
              dados: this.tabelaSelecao.designacaoEntidade,
              nota: null,
            },
            tipologia: {
              cor: "verde",
              dados: this.tabelaSelecao.designacaoTipologia,
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
            Object.keys(historico[0].ts.classes.dados[i].dados[p].dados).map((d) => {
              historico[0].ts.classes.dados[i].dados[p].dados[d] = {
                cor: "verde",
                dados: historico[0].ts.classes.dados[i].dados[p].dados[d],
                nota: null,
              };
            });
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
      var procs = this.listaProcessos.procs.filter(
        (p) => p.dono || p.participante != "NP"
      );
      procs.map((p) =>
        this.listaProcessos.procsAselecionar.splice(
          this.listaProcessos.procsAselecionar.findIndex((c) => c.codigo === p.codigo),
          1
        )
      );
      if (this.listaProcessos.procsAselecionar > 0) {
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
    //Verifica a TS antes de submeter
    verificaTS: async function () {
      var procs = this.listaProcessos.procs.filter(
        (p) => p.dono || p.participante != "NP"
      );
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
          var response = await this.$request("delete", "/pendentes/" + this.pendente._id);
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
        if (!this.importadoFlag) {
          this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
            (p) => p.dono || p.participante != "NP"
          );
          this.tabelaSelecao.listaProcessos.procs.map((p) =>
            this.tabelaSelecao.listaProcessos.procsAselecionar.splice(
              this.tabelaSelecao.listaProcessos.procsAselecionar.findIndex(
                (c) => c.codigo === p.codigo
              ),
              1
            )
          );
        }
        this.tabelaSelecao.listaProcessos["importadoFlag"] = this.importadoFlag;
        var tsObj = {
          idEntidade: this.tabelaSelecao.idEntidade,
          designacaoEntidade: this.tabelaSelecao.designacaoEntidade,
          designacao: this.tabelaSelecao.designacao,
          idTipologia: this.tabelaSelecao.idTipologia,
          designacaoTipologia: this.tabelaSelecao.designacaoTipologia,
          listaProcessos: this.tabelaSelecao.listaProcessos,
        };
        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Organizacional",
          novoObjeto: { ts: tsObj },
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token,
          historico: await this.criaHistoricoTS(userBD),
        };
        var codigoPedido = await this.$request("post", "/pedidos", pedidoParams);
        this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
      } catch (error) {
        console.log("Erro ao criar o pedido: " + error);
      }
    },
    // Guarda o trabalho de criação de uma TS
    // Se saida = true vai sair a seguir, não abre dialog de gravação
    guardarTrabalho: async function (saida) {
      try {
        var response;
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(
          JSON.stringify(this.listaProcessos)
        );
        if (!this.importadoFlag) {
          this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
            (p) => p.dono || p.participante != "NP" || p.descriptionEdited
          );
          this.tabelaSelecao.participante = this.participante;
        }
        this.tabelaSelecao.listaProcessos["importadoFlag"] = this.importadoFlag;
        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Organizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token,
        };
        // É preciso testar se há um Pendente criado para não criar um novo
        if (this.pendente._id) {
          pendenteParams._id = this.pendente._id;
          pendenteParams.numInterv = ++this.pendente.numInterv;
          var response = await this.$request("put", "/pendentes", pendenteParams);
        } else {
          pendenteParams.numInterv = 1;
          var response = await this.$request("post", "/pendentes", pendenteParams);
        }
        this.pendente = response.data;
        if(!saida)
          this.pendenteGuardado = true;
      } catch (e) {
        console.log("Erro ao guardar trabalho: " + e);
      }
    },
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function () {
      this.$router.push("/");
    },
    // Valida a TS construída até ao momento
    validarTS: async function () {
      var procs = this.listaProcessos.procs.filter(
        (p) => p.dono || p.participante != "NP"
      );
      if (procs.length < 1) {
        this.mensagensErro.push({
          sobre: "Escolha de processos",
          mensagem: `Não tem nenhum processo selecionado`,
        });
        this.numeroErros++;
      }
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
      this.validacaoTerminada = true;
    },
    // Quando a validação termina chama-se esta rotina para fazer reset ao estado da Validação
    fechoValidacao: async function () {
      this.numeroErros = 0;
      this.mensagensErro = [];
      //this.notasApSet = [];
      //this.exemplosNotasApSet = [];
      //this.termosIndSet = [];
      this.validacaoTerminada = false;
    },
    // Abandonar a operação gravando o trabalho...
    sair: async function () {
      try{
        await this.guardarTrabalho(true);
        this.sairOperacao = true;
      }
      catch(e){
        console.log("Erro ao gravar trabalho para sair...")
      }
    },

    sair2: function (){
      this.sairOperacao = false;
      this.$router.push("/");
    },
    // Abortar a operação apagando o pendente se existir
    abortar: async function () {
      if (this.pendente && this.pendente._id) {
        try {
          var response = await this.$request("delete", "/pendentes/" + this.pendente._id);
        } catch (e) {
          console.log("Erro ao eliminar o pendente: " + e);
        }
      }
      this.$router.push("/");
    },
    // Carrega os fechos transitivos necessários para os que já estão selecionados
    loadFechoTransitivo: async function () {
      try {
        var response = await this.$request("get", "/travessiaV2");
        this.fechoTransitivo = response.data;
      } catch (e) {
        console.log("Erro ao carregar o fecho transitivo: " + e);
      }
    },
    // Faz a pré-seleção do fecho transitivo dos processos já selecionados
    acrescentaFecho: function (processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcessos.procs.findIndex((p) => p.codigo == fecho[i]);
        //Só acrescenta processos a selecionar que não tenham sido selecionados antes de guardar o trabalho
        if (
          index != -1 &&
          !this.listaProcessos.procs[index].dono &&
          this.listaProcessos.procs[index].participante == "NP" &&
          !this.listaProcessos.procs[index].descriptionEdited
        ) {
          this.listaProcessos.procs[index].preSelected++;
          if (this.listaProcessos.procs[index].preSelected == 1) {
            this.listaProcessos.numProcessosPreSelecionados++;
            this.listaProcessos.procs[index].preSelectedLabel = "Pré-Selecionado";
          }
        }
      }
    },
    // Merge do estado antigo dos processos com os que foram carregados da BD
    mergeProcs: async function () {
      // Merge com os processos que já estavam selecionados
      var index;
      for (let i = 0; i < this.tabelaSelecao.listaProcessos.procs.length; i++) {
        index = this.listaProcessos.procs.findIndex(
          (p) => p.codigo == this.tabelaSelecao.listaProcessos.procs[i].codigo
        );
        if (index != -1) {
          this.listaProcessos.procs[index] = this.tabelaSelecao.listaProcessos.procs[i];
          if (
            this.tabelaSelecao.listaProcessos.procs[i].dono ||
            this.tabelaSelecao.listaProcessos.procs[i].participante != "NP"
          )
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
  created: async function () {
    this.pendente = this.obj;
    this.participante = this.obj.objeto.participante ? this.obj.objeto.participante : [];
    delete this.obj.objeto.participante;
    this.tabelaSelecao = this.obj.objeto;
    this.designacao = this.tabelaSelecao.designacao;
    console.log(this.tabelaSelecao);
    if (this.tabelaSelecao.listaProcessos.importadoFlag) {
      this.importadoFlag = true;
      this.listaProcessos = this.tabelaSelecao.listaProcessos;
      this.listaProcessosReady = true;
    } else {
      try {
        await this.loadProcessos();
        await this.loadFechoTransitivo();
        await this.mergeProcs();
      } catch (e) {
        console.log("Erro no carregamento dinicial: " + e);
      }
    }
  },
};
</script>

<style scoped>
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

.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
