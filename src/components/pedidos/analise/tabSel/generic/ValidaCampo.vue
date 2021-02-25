<template>
  <div>
    <v-row dense class="ma-1">
      <v-col cols="2">
        <div
          :class="[
            'info-descricao',
            `info-descricao-${novoHistorico[campoValue].cor}`,
          ]"
        >
          {{ campoText }}
          <InfoBox
            v-if="!!info"
            :header="info.header"
            :text="info.text"
            helpColor="indigo darken-4"
          />
        </div>
      </v-col>
      <v-col>
        <div v-if="editaCampo == campoValue">
          <v-form ref="form">
            <slot
              name="input"
              v-bind:items="{ campoEditado, updateValue }"
            ></slot>
          </v-form>
        </div>
        <div class="info-conteudo" v-else>
          <slot name="campo">
            <span
              v-if="tipo == 'string' && !!novoHistorico[campoValue].dados"
              >{{ novoHistorico[campoValue].dados }}</span
            >
            <span
              v-else-if="tipo == 'estado' && !!novoHistorico[campoValue].dados"
            >
              <div v-if="novoHistorico[campoValue].dados == 'A'">Ativa</div>
              <div v-else-if="novoHistorico[campoValue].dados == 'H'">
                Em revisão...
              </div>
              <div v-else>Inativa</div>
            </span>
            <span
              v-else-if="
                tipo == 'procTrans' && !!novoHistorico[campoValue].dados
              "
            >
              {{ novoHistorico[campoValue].dados == "S" ? "Sim" : "Não" }}
            </span>

            <span
              v-else-if="tipo == 'justPCA' && !!novoHistorico[campoValue].dados"
            >
              <div v-for="c in novoHistorico[campoValue].dados" :key="c.tipoId">
                <!-- Critério Gestionário ...............................-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoGestionario'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">Critério Gestionário</div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{
                        /* texto normalizado:
                                          mylabels.textoCriterioJustificacaoGestionario
                                          texto proveniente da FRD: */
                        c.conteudo
                      }}
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério Utilidade Administrativa .................-->
                <v-row
                  v-if="
                    c.tipoId == 'CriterioJustificacaoUtilidadeAdministrativa'
                  "
                >
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério de Utilidade Administrativa
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{ c.conteudo }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="p in c.processos" :key="p.procId">
                          <a :href="'/classes/consultar/' + p.procId">
                            {{ p.procId.split("c")[1] }} -
                            {{ p.nome }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério Legal ...................................-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">Critério Legal</div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{ c.conteudo }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="l in c.legislacao" :key="l.legId">
                          <a :href="'/legislacao/' + l.legId"
                            >{{ l.tipo }} {{ l.numero }}</a
                          >
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </span>
            <span
              v-else-if="tipo == 'prazo' && !!novoHistorico[campoValue].dados"
            >
              <div v-if="novoHistorico[campoValue].dados > 1">
                {{ novoHistorico[campoValue].dados }} anos
              </div>
              <div v-else-if="novoHistorico[campoValue].dados == 1">
                {{ novoHistorico[campoValue].dados }} ano
              </div>
              <div v-else>Não específicado</div>
            </span>
            <span v-else-if="tipo == 'df' && !!novoHistorico[campoValue].dados">
              <span v-if="novoHistorico[campoValue].dados == 'E'"
                >Eliminação</span
              >
              <span v-else-if="novoHistorico[campoValue].dados == 'C'"
                >Conservação</span
              >
              <span v-else-if="novoHistorico[campoValue].dados == 'CP'"
                >Conservação Parcial</span
              >
              <span v-else>Não Especificado</span>
            </span>
            <span
              v-else-if="tipo == 'justDF' && !!novoHistorico[campoValue].dados"
            >
              <div v-for="c in novoHistorico[campoValue].dados" :key="c.tipoId">
                <!-- Critério Legal ...................................-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoLegal'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">Critério Legal</div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{ c.conteudo }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="l in c.legislacao" :key="l.legId">
                          <a :href="'/legislacao/' + l.legId"
                            >{{ l.tipo }} {{ l.numero }}</a
                          >
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério de Densidade Informacional ..............-->
                <v-row v-if="c.tipoId == 'CriterioJustificacaoDensidadeInfo'">
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério de Densidade Informacional
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{
                        /* texto normalizado:
                                          mylabels.textoCriterioDensidadeInfo
                                          texto proveniente da FRD: */
                        c.conteudo
                      }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="p in c.processos" :key="p.procId">
                          <a :href="'/classes/consultar/' + p.procId">
                            {{ p.procId.split("c")[1] }} -
                            {{ p.nome }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>

                <!-- Critério de Complementaridade Informacional ..............-->
                <v-row
                  v-if="c.tipoId == 'CriterioJustificacaoComplementaridadeInfo'"
                >
                  <v-col xs="2" sm="2">
                    <div class="info-label">
                      Critério de Complementaridade Informacional
                    </div>
                  </v-col>
                  <v-col xs="10" sm="10">
                    <div class="info-content">
                      {{
                        /* texto normalizado:
                                          mylabels.textoCriterioComplementaridade
                                          texto proveniente da FRD: */
                        c.conteudo
                      }}
                      <br />
                      <br />
                      <ul>
                        <li v-for="p in c.processos" :key="p.procId">
                          <a :href="'/classes/consultar/' + p.procId">
                            {{ p.procId.split("c")[1] }} -
                            {{ p.nome }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </span>
            <span
              v-else-if="
                tipo == 'array' && !!novoHistorico[campoValue].dados[0]
              "
            >
              <ul>
                <li v-for="(v, i) in novoHistorico[campoValue].dados" :key="i">
                  {{ v[arrayValue] }}
                  <v-badge
                    v-if="!dadosOriginais[campoValue].some((e) => e == v)"
                    right
                    dot
                    inline
                  ></v-badge>
                </li>
              </ul>
            </span>
            <span v-else-if="tipo == 'procsAselecionar'">
              <ul>
                <li v-for="(v, i) in novoHistorico[campoValue].dados" :key="i">
                  {{ v.codigo }} - {{ v.titulo }}
                  <v-badge
                    v-if="
                      dadosOriginais[campoValue].some(
                        (e) => e.codigo == v.codigo
                      )
                    "
                    right
                    dot
                    inline
                  ></v-badge>
                  <v-icon v-else class="mr-1" color="green">check</v-icon>
                </li>
              </ul>
            </span>
            <span
              v-else-if="
                tipo == 'participantes' && !!novoHistorico[campoValue].dados[0]
              "
            >
              <Participantes
                :entidades="novoHistorico[campoValue].dados"
                :valida="true"
              />
            </span>
            <span
              v-else-if="
                tipo == 'donos' && !!novoHistorico[campoValue].dados[0]
              "
            >
              <Donos
                :entidades="novoHistorico[campoValue].dados"
                :valida="true"
              />
            </span>
            <span
              v-else-if="
                tipo == 'procRel' && !!novoHistorico[campoValue].dados[0]
              "
            >
              <ProcessosRelacionados
                :processos="novoHistorico[campoValue].dados"
                :valida="true"
              />
            </span>
            <span
              v-else-if="tipo == 'legs' && !!novoHistorico[campoValue].dados[0]"
            >
              <Legislacao
                :legs="novoHistorico[campoValue].dados"
                :valida="true"
              />
            </span>
            <span v-else>[Campo não preenchido na submissão do pedido]</span>
          </slot>
        </div>
      </v-col>
      <v-col cols="auto" v-if="editaCampo != campoValue">
        <span v-if="!foiEditado">
          <v-icon class="mr-1" color="green" @click="verifica(campoValue)"
            >check</v-icon
          >
          <v-icon class="mr-1" color="red" @click="anula(campoValue)"
            >clear</v-icon
          >
        </span>
        <!-- Ver como vai ser a edição. -->
        <v-icon
          v-if="permitirEditar && tipo != 'procsAselecionar'"
          class="mr-1"
          color="orange"
          @click="
            editaCampo = campoValue;
            campoEditado = novoHistorico[campoValue].dados;
          "
          >create</v-icon
        >
        <v-icon
          v-if="permitirEditar && tipo == 'procsAselecionar'"
          class="mr-1"
          color="orange"
          @click="loadSelecao()"
          >create</v-icon
        >

        <v-badge
          color="indigo darken-4"
          content="1"
          :value="!!novoHistorico[campoValue].nota"
          overlap
        >
          <v-icon @click="abrirNotaDialog">add_comment</v-icon>
        </v-badge>
      </v-col>
      <v-col cols="auto" v-else>
        <span>
          <v-icon class="mr-1" color="green" @click="editarCampo">check</v-icon>
          <v-icon
            class="mr-1"
            color="red"
            @click="
              editaCampo = null;
              campoEditado = null;
            "
            >clear</v-icon
          >
        </span>
      </v-col>
    </v-row>

    <AdicionarNota
      :dialog="notaVisivel"
      v-if="notaVisivel"
      :campoText="campoText"
      :notaAtual="this.novoHistorico[this.campoValue].nota"
      @fechar="notaVisivel = false"
      @adicionar="adicionarNota"
    ></AdicionarNota>

    <v-dialog v-model="verListaProcessos" persistent>
      <v-card>
        <ListaProcessos
          :key="listaProcessosKey"
          :listaProcs="listaProcessos"
          :listaCodigosEsp="listaCodigosEsp"
          :participante="participante"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text ma-2"
            color="red darken-4"
            @click="cancelar()"
            >Cancelar</v-btn
          >
          <v-btn
            class="white--text ma-2"
            color="success darken-1"
            @click="confirmaProcs()"
            >Confirmar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AdicionarNota from "@/components/pedidos/analise/rada/generic/AdicionarNota";
import InfoBox from "@/components/generic/infoBox.vue";
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";
import ListaProcessos from "@/components/tabSel/criacaoTSOrg/ListaProcessos.vue";

export default {
  props: {
    permitirEditar: {
      type: Boolean,
      default: true,
    },
    tipo: {},
    dadosOriginais: {},
    novoHistorico: {},
    campoValue: {},
    campoText: {},
    arrayValue: {},
    info: { text: "", header: "" },
    tabelaSelecao: {},
  },

  components: {
    AdicionarNota,
    InfoBox,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao,
    ListaProcessos,
  },
  data: () => ({
    campoEditado: null,
    editaCampo: null,
    foiEditado: false,
    notaVisivel: false,
    notaCampo: null,
    verListaProcessos: false,
    listaProcessos: {},
    listaProcessosReady: false,
    participante: [],
    listaCodigosEsp: [],
    fechoTransitivo: {},
    listaProcessosKey: 0,
  }),
  methods: {
    forceRender() {
      this.listaProcessosKey += 1;
    },
    updateValue(e) {
      this.campoEditado = e;
    },
    editarCampo() {
      if (this.$refs.form.validate()) {
        switch (this.tipo) {
          case "string":
            if (
              this.campoEditado !== this.novoHistorico[this.campoValue].dados
            ) {
              this.novoHistorico[this.campoValue].dados = this.campoEditado;
              if (this.campoEditado !== this.dadosOriginais[this.campoValue]) {
                this.novoHistorico[this.campoValue].cor = "amarelo";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = true;
              } else {
                this.novoHistorico[this.campoValue].cor = "verde";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = false;
              }
              this.editaCampo = null;
              this.campoEditado = null;
            }

            break;
          case "array":
            if (
              !(
                this.campoEditado.length ==
                  this.novoHistorico[this.campoValue].dados.length &&
                this.campoEditado.every(
                  (val, index) =>
                    val === this.novoHistorico[this.campoValue].dados[index]
                )
              )
            ) {
              this.novoHistorico[this.campoValue].dados = this.campoEditado;
              if (
                this.campoEditado.length ==
                  this.dadosOriginais[this.campoValue].length &&
                this.campoEditado.every(
                  (val, index) =>
                    val === this.dadosOriginais[this.campoValue][index]
                )
              ) {
                this.novoHistorico[this.campoValue].cor = "verde";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = false;
              } else {
                this.novoHistorico[this.campoValue].cor = "amarelo";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = true;
              }
              this.editaCampo = null;
              this.campoEditado = null;
            }
            break;
        }
      }
    },
    abrirNotaDialog() {
      this.notaVisivel = true;
      this.notaCampo = this.campoText;
    },
    verifica(campo) {
      this.novoHistorico[campo].cor = "verde";
      this.$emit("corAlterada", this.novoHistorico[campo].cor);
    },
    anula(campo) {
      this.novoHistorico[campo].cor = "vermelho";
      this.$emit("corAlterada", this.novoHistorico[campo].cor);
    },
    adicionarNota(nota) {
      this.novoHistorico[this.campoValue].nota = nota;
      this.notaVisivel = false;
    },
    loadProcessos: async function () {
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
            this.listaProcessos.procs[i].descriptionEdited = false;
            this.listaProcessos.procs[i].preSelected = 0;
            // Para poder ser filtrado na tabela
            this.listaProcessos.procs[i].preSelectedLabel = "";
            this.listaProcessos.procs[i].dono = false;
            this.listaProcessos.procs[i].participante = "NP";
          }
          this.participante = new Array(this.listaProcessos.procs.length).fill(
            "NP"
          );
          this.tabelaSelecao.listaProcessos.procs.map((p) => {
            let index = this.listaProcessos.procs.findIndex(
              (e) => p.codigo == e.codigo
            );
            this.participante[index] = p.participante;
          });
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
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
          this.listaProcessos.procs[
            index
          ] = this.tabelaSelecao.listaProcessos.procs[i];
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
    },
    // Faz a pré-seleção do fecho transitivo dos processos já selecionados
    acrescentaFecho: function (processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcessos.procs.findIndex(
          (p) => p.codigo == fecho[i]
        );
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
            this.listaProcessos.procs[index].preSelectedLabel =
              "Pré-Selecionado";
          }
        }
      }
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
    loadSelecao: async function () {
      this.$emit("listaProcessos", true);
      await this.loadProcessos();
      await this.loadFechoTransitivo();
      await this.mergeProcs();
      this.forceRender();
      this.verListaProcessos = true;
    },
    confirmaProcs: function () {
      this.listaProcessos.procs = this.listaProcessos.procs.filter(
        (p) => p.dono || p.participante != "NP"
      );
      this.listaProcessos.procsAselecionar = this.listaProcessos.procsAselecionar.filter(
        (p) => !this.listaProcessos.procs.some((c) => p.codigo == c.codigo)
      );
      this.tabelaSelecao.listaProcessos.procs = this.listaProcessos.procs;
      this.tabelaSelecao.listaProcessos.procsAselecionar = this.listaProcessos.procsAselecionar;
      this.tabelaSelecao.listaProcessos.numProcessosSelecionados = this.listaProcessos.numProcessosSelecionados;
      this.tabelaSelecao.listaProcessos.numProcessosPreSelecionados = this.listaProcessos.numProcessosPreSelecionados;
      this.tabelaSelecao.listaProcessos.processosPreSelecionados = this.listaProcessos.processosPreSelecionados;
      this.tabelaSelecao.listaProcessos.procsAselecionar = this.listaProcessos.procsAselecionar;

      this.dadosOriginais.procs = this.listaProcessos.procs;
      this.dadosOriginais.procsAselecionar = this.listaProcessos.procsAselecionar;
      this.dadosOriginais.numProcessosSelecionados = this.listaProcessos.numProcessosSelecionados;
      this.dadosOriginais.numProcessosPreSelecionados = this.listaProcessos.numProcessosPreSelecionados;
      this.dadosOriginais.processosPreSelecionados = this.listaProcessos.processosPreSelecionados;
      this.dadosOriginais.procsAselecionar = this.listaProcessos.procsAselecionar;

      this.novoHistorico.classes.dados = JSON.parse(
        JSON.stringify(this.listaProcessos.procs)
      );
      this.novoHistorico.classes.dados = this.novoHistorico.classes.dados.map(
        (p) => {
          return { cor: "verde", dados: p, nota: null };
        }
      );

      this.novoHistorico.classes.dados.map((p) => {
        Object.keys(p.dados).map((e) => {
          p.dados[e] = { cor: "verde", dados: p.dados[e], nota: null };
          if (e === "pca" || e === "df") {
            Object.keys(p.dados[e].dados).map((k) => {
              p.dados[e].dados[k] = {
                cor: "verde",
                dados: p.dados[e].dados[k],
                nota: null,
              };
            });
          }
        });
      });

      this.novoHistorico[this.campoValue].cor = "amarelo";
      this.verListaProcessos = false;
      this.listaProcessosReady = false;
    },
    cancelar: function () {
      this.verListaProcessos = false;
    },
  },
};
</script>
