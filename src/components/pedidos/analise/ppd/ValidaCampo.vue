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
              v-if="(tipo == 'string' || tipo == 'tipofl' || tipo == 'classe')  && !!novoHistorico[campoValue].dados"
              >{{ novoHistorico[campoValue].dados }}</span
            >
            <span
              v-else-if="(tipo == 'object' || tipo == 'fonteLeg') && !!novoHistorico[campoValue].dados.titulo"
              >{{ novoHistorico[campoValue].dados.titulo }}</span
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
              v-else-if="tipo == 'classes' && !!novoHistorico[campoValue].dados"
              ><slot></slot>
            </span>
            <span
              v-else-if="tipo == 'classeFL' && !!novoHistorico[campoValue].dados"
              ><slot></slot>
            </span>
            <span
              v-else-if="
                (tipo == 'array' || tipo == 'ents') && !!novoHistorico[campoValue].dados
              "
            >
              <ul>
                <li v-for="(v, i) in novoHistorico[campoValue].dados" :key="i">
                  {{ v.label }}
                  <v-badge
                    v-if="!dadosOriginais[campoValue].some((e) => e == v)"
                    right
                    dot
                    inline
                  ></v-badge>
                </li>
              </ul>
            </span>
            <span
              v-else-if="
                tipo == 'si' && !!novoHistorico[campoValue].dados
              "
            >
              <ul>
                <li v-for="(v, i) in novoHistorico[campoValue].dados" :key="i">
                  {{ v.dados.numeroSI + " - "+ v.dados.nomeSI }}
                  <v-badge
                    v-if="!dadosOriginais[campoValue].some((e) => e == v)"
                    right
                    dot
                    inline
                  ></v-badge>
                </li>
              </ul>
            </span>
            <span
              v-else-if="
                (tipo == 'notasAp' || tipo == 'notasEx') &&
                (!!novoHistorico[campoValue].dados[0] || loadNotas().length > 0)
              "
            >
              <ul>
                <li v-for="(v, i) in loadNotas()" :key="i">
                  <span
                    v-if="
                      !dadosOriginais[campoValue].some((e) => e.nota == v.nota)
                    "
                    class="text-decoration-line-through"
                  >
                    {{ v[arrayValue] }}
                    <v-btn
                      icon
                      x-small
                      color="error"
                      @click="dadosOriginais[campoValue].push(v)"
                      ><v-icon>done</v-icon></v-btn
                    >
                  </span>
                  <span
                    v-else-if="
                      !notas.some((n) => n.nota == v[arrayValue]) ||
                      (dadosOriginais[campoValue].some(
                        (e) => e.nota == v.nota
                      ) &&
                        !novoHistorico[campoValue].dados.some(
                          (e) => e.nota == v.nota
                        ))
                    "
                    >{{ v[arrayValue] }}
                    <v-badge right dot inline color="orange"></v-badge>
                  </span>
                  <span
                    v-else-if="
                      dadosOriginais[campoValue].some((e) => e.nota == v.nota)
                    "
                    >{{ v[arrayValue] }}</span
                  >
                  <span v-else-if="notas.some((e) => e.nota == v.nota)">{{
                    v[arrayValue]
                  }}</span>
                </li>
              </ul>
            </span>
            <span
              v-else-if="
                tipo == 'exemplosNotasAp' &&
                (!!novoHistorico[campoValue].dados[0] ||
                  loadExemplos().length > 0)
              "
            >
              <ul>
                <li v-for="(v, i) in loadExemplos()" :key="i">
                  <span
                    v-if="
                      !dadosOriginais[campoValue].some(
                        (e) => e.exemplo == v.exemplo
                      )
                    "
                    class="text-decoration-line-through"
                  >
                    {{ v[arrayValue] }}
                    <v-btn
                      icon
                      x-small
                      color="error"
                      @click="dadosOriginais[campoValue].push(v)"
                      ><v-icon>done</v-icon></v-btn
                    >
                  </span>
                  <span
                    v-else-if="
                      !notas.some((n) => n.exemplo == v[arrayValue]) ||
                      (dadosOriginais[campoValue].some(
                        (e) => e.exemplo == v.exemplo
                      ) &&
                        !novoHistorico[campoValue].dados.some(
                          (e) => e.exemplo == v.exemplo
                        ))
                    "
                    >{{ v[arrayValue] }}
                    <v-badge right dot inline color="orange"></v-badge>
                  </span>
                  <span
                    v-else-if="
                      dadosOriginais[campoValue].some(
                        (e) => e.exemplo == v.exemplo
                      )
                    "
                    >{{ v[arrayValue] }}</span
                  >
                  <span v-else-if="notas.some((e) => e.exemplo == v.exemplo)">{{
                    v[arrayValue]
                  }}</span>
                </li>
              </ul>
            </span>
            <span
              v-else-if="
                tipo == 'termosInd' &&
                (!!novoHistorico[campoValue].dados[0] ||
                  loadTermosInd().length > 0)
              "
            >
              <ul>
                <li v-for="(v, i) in loadTermosInd()" :key="i">
                  <span
                    v-if="
                      !dadosOriginais[campoValue].some(
                        (e) => e.termo == v.termo
                      )
                    "
                    class="text-decoration-line-through"
                  >
                    {{ v[arrayValue] }}
                    <v-btn
                      icon
                      x-small
                      color="error"
                      @click="dadosOriginais[campoValue].push(v)"
                      ><v-icon>done</v-icon></v-btn
                    >
                  </span>
                  <span
                    v-else-if="
                      !notas.some((n) => n.termo == v[arrayValue]) ||
                      (dadosOriginais[campoValue].some(
                        (e) => e.termo == v.termo
                      ) &&
                        !novoHistorico[campoValue].dados.some(
                          (e) => e.termo == v.termo
                        ))
                    "
                    >{{ v[arrayValue] }}
                    <v-badge right dot inline color="orange"></v-badge>
                  </span>
                  <span
                    v-else-if="
                      dadosOriginais[campoValue].some((e) => e.termo == v.termo)
                    "
                    >{{ v[arrayValue] }}</span
                  >
                  <span v-else-if="notas.some((e) => e.termo == v.termo)">{{
                    v[arrayValue]
                  }}</span>
                </li>
              </ul>
            </span>
            <span v-else-if="tipo == 'procsAselecionar'">
              <ul v-if="novoHistorico[campoValue].dados.length > 0">
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
                    color="error"
                  ></v-badge>
                  <v-icon v-else class="mr-1" color="green">check</v-icon>
                </li>
              </ul>
              <span v-else>[Sem processos a selecionar]</span>
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
          v-if="permitirEditar && (tipo == 'array' || tipo == 'string' || tipo == 'si')"
          class="mr-1"
          color="orange"
          @click="edita()"
          >create</v-icon
        >
        <v-icon
          v-if="permitirEditar && (tipo == 'ents')"
          class="mr-1"
          color="orange"
          @click="verEntidades = true"
          >create</v-icon
        >
        <v-icon
          v-if="permitirEditar && (tipo == 'tipofl')"
          class="mr-1"
          color="orange"
          @click="verTipoFontesLeg = true"
          >create</v-icon
        >
        <v-icon
          v-if="permitirEditar && (tipo == 'classe')"
          class="mr-1"
          color="orange"
          @click="verClasses = true"
          >create</v-icon
        >
        <v-icon
          v-if="permitirEditar && (tipo == 'object')"
          class="mr-1"
          color="orange"
          @click="edita()"
          >create</v-icon
        >
        <v-icon
          v-if="permitirEditar && (tipo == 'classeFL')"
          class="mr-1"
          color="orange"
          @click="modelClasses()"
          >create</v-icon
        >
        <v-icon
          v-if="
            permitirEditar && (tipo == 'fonteLeg')
          "
          class="mr-1"
          color="orange"
          @click="loadFonteLegitimacao()"
          >create</v-icon
        >
        <v-icon
          v-if="
            permitirEditar && (tipo == 'procsAselecionar' || tipo == 'classes')
          "
          class="mr-1"
          color="orange"
          @click="loadSelecao()"
          >create</v-icon
        >
        <v-icon
          v-if="
            permitirEditar &&
            (tipo == 'notasAp' ||
              tipo == 'exemplosNotasAp' ||
              tipo == 'notasEx' ||
              tipo == 'termosInd')
          "
          class="mr-1"
          color="orange"
          @click="editaBlocoDescritivoFlag = true"
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
        <ListaProcessosOrg
          v-if="tipoTS == 'Organizacional'"
          :key="listaProcessosKey"
          :listaProcs="listaProcessos"
          :listaCodigosEsp="listaCodigosEsp"
          :participante="participante"
        />
        <ListaProcessosPluri
          v-else-if="tipoTS == 'Pluriorganizacional'"
          :key="listaProcessosKey"
          :listaProcs="listaProcessos"
          :listaCodigosEsp="listaCodigosEsp"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text ma-2"
            rounded
            color="red darken-4"
            @click="cancelar()"
            >Cancelar</v-btn
          >
          <v-btn
            class="white--text ma-2"
            rounded
            color="success darken-1"
            @click="confirmaProcs()"
            >Confirmar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="verClasses" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar
              color="primary"
              dark
            >Classes</v-toolbar>
            <v-card-text>
              <v-data-table
                :headers="headersSelecionados"
                :items="dadosOriginais.avaliacao"
                class="elevation-1"
                :footer-props="footer_Classes"
                :page.sync="paginaSelect"
                >
                  <template v-slot:header="props">
                      <tr>
                      <th v-for="h in props.headers" :key="h.text" class="subtitle-2">{{ h.text }}</th>
                      </tr>
                  </template>

                  <template v-slot:item="props">
                    <tr>
                    <td>{{ props.item.codigo}}</td>
                    <td>{{ props.item.referencia}}</td>
                    <td>{{ props.item.titulo}}</td>
                    <td>
                      <v-btn small color="red darken-2" dark rounded @click="">
                      <v-icon dark>remove_circle_outline</v-icon>
                      </v-btn>
                    </td>
                    </tr>
                  </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="verClasses = false"
              >Cancelar</v-btn>
              <v-btn
                text
                @click="confirmaClasses"
              >Confirmar</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="verEntidades" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar
              color="primary"
              dark
            >Selecione as entidades</v-toolbar>
            <v-card-text>
              <v-autocomplete
                label="Selecione as entidades abrangidas pelo PPD"
                :items="entidades"
                item-text="label"
                return-object
                v-model="entSel"
                placeholder="Selecione as entidades abrangidas pelo PPD"
                multiple
                chips
                deletable-chips
                :rules="[(v) => !!v || 'Tem de escolher pelo menos uma entidade']"
              >
              </v-autocomplete>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="verEntidades = false"
              >Cancelar</v-btn>
              <v-btn
                text
                @click="confirmaEntidades"
              >Confirmar</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="verTipoFontesLeg" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar
              color="primary"
              dark
            >Selecione o tipo da fonte de legitimação</v-toolbar>
            <v-card-text>
              <v-autocomplete
                label="Selecione o tipo da fonte de legitimação"
                :items="this.tiposFL"
                item-text="titulo"
                return-object
                v-model="tipoFonteLegSelected"
                solo
                dense
                :rules="[(v) => !!v || 'Tem de escolher um tipo de fonte de legitimação']"
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="verTipoFontesLeg = false"
              >Cancelar</v-btn>
              <v-btn
                text
                @click="confirmaTipoFonteLeg"
              >Confirmar</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="verFontesLeg" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar
              color="primary"
              dark
            >Selecione a fonte de legitimação</v-toolbar>
            <v-card-text>
              <v-autocomplete
                label="Selecione a fonte de legitimação"
                :items="this.flLista"
                item-text="titulo"
                return-object
                v-model="fonteLegitimacaoSelected"
                solo
                dense
                :rules="[(v) => !!v || 'Tem de escolher uma fonte de legitimação']"
              ></v-autocomplete>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="verFontesLeg = false"
              >Cancelar</v-btn>
              <v-btn
                text
                @click="confirmaFonteLeg"
              >Confirmar</v-btn>
            </v-card-actions>
      </v-card>
    </v-dialog>
    <EditDescritivo
      v-if="editaBlocoDescritivoFlag"
      :p="dadosOriginais"
      @editado="blocoDescritivoEditado($event)"
      @cancelado="blocoDescritivoCancelado($event)"
    />
  </div>
</template>

<script>
import AdicionarNota from "@/components/pedidos/analise/rada/generic/AdicionarNota";
import InfoBox from "@/components/generic/infoBox.vue";
import Donos from "@/components/classes/consulta/Donos.vue";
import Participantes from "@/components/classes/consulta/Participantes.vue";
import ProcessosRelacionados from "@/components/classes/consulta/ProcessosRelacionados.vue";
import Legislacao from "@/components/classes/consulta/Legislacao.vue";
import ListaProcessosOrg from "@/components/tabSel/criacaoTSOrg/ListaProcessos.vue";
import ListaProcessosPluri from "@/components/tabSel/criacaoTSPluri/ListaProcessos.vue";
import EditDescritivo from "@/components/tabSel/parteDescritiva/EditDescritivo.vue";

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
    flLista: {},
    entidades: {},
    arrayValue: {},
    info: { text: "", header: "" },
    tabelaSelecao: {},
    tipoTS: {},
    notas: {},
  },

  components: {
    AdicionarNota,
    InfoBox,
    Donos,
    Participantes,
    ProcessosRelacionados,
    Legislacao,
    ListaProcessosOrg,
    ListaProcessosPluri,
    EditDescritivo,
  },
  data: () => ({
    campoEditado: null,
    verFontesLeg: false,
    verTipoFontesLeg: false,
    verEntidades: false,
    verClasses: false,
    tipoFonteLegSelected: "",
    fonteLegitimacaoSelected: "",
    editaCampo: null,
    foiEditado: false,
    notaVisivel: false,
    notaCampo: null,
    verListaProcessos: false,
    entSel: [],
    listaProcessos: {},
    listaProcessosReady: false,
    participante: [],
    listaCodigosEsp: [],
    fechoTransitivo: {},
    listaProcessosKey: 0,
    editaBlocoDescritivoFlag: false,
    tiposFL: ["TS/LC", "PGD/LC", "PGD", "RADA", "RADA/CLAV"],
    paginaSelect: 1,
    headersSelecionados:[
        {text: "Código", sortable: false, value: "codigo"},
        {text: "Referência", sortable: false, value: "referencia"},
        {text: "Título", sortable: false, value: "titulo"},
        {text: "Remover", align: "left", sortable: false, value: "" },
    ],
    footer_Classes: {
        "items-per-page-text": "Classes por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
    },
  }),

  created() {
    //alert(JSON.stringify(this.dadosOriginais))
  },

  methods: {
    confirmaClasses(){
      alert(JSON.stringify(this.dadosOriginais))
      this.verClasses = false
    },
    confirmaEntidades(){
      this.novoHistorico[this.campoValue].dados = this.entSel
      this.novoHistorico[this.campoValue].cor = "amarelo"
      this.verEntidades = false
    },
    confirmaTipoFonteLeg(){
      this.novoHistorico[this.campoValue].dados = this.tipoFonteLegSelected
      this.novoHistorico[this.campoValue].cor = "amarelo"
      this.verTipoFontesLeg = false
    },
    confirmaFonteLeg(){
      this.novoHistorico[this.campoValue].dados = this.fonteLegitimacaoSelected
      this.novoHistorico[this.campoValue].cor = "amarelo"
      this.verFontesLeg = false
    },

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
          case "tipofl":
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
            if (this.arrayValue == "") {
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
            } else {
              if (
                !(
                  this.campoEditado.length ==
                    this.novoHistorico[this.campoValue].dados.length &&
                  this.campoEditado.every((val, index) => {
                    val ===
                      this.novoHistorico[this.campoValue].dados[index][
                        this.arrayValue
                      ];
                  })
                )
              ) {
                this.novoHistorico[this.campoValue].dados = this.campoEditado;
                this.editaCampo = null;
                this.campoEditado = null;
              }
            }
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
    loadProcessosPluri: async function () {
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

          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },
    loadProcessosEspecificosPluri: async function (entidades) {
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
    loadProcessosOrg: async function () {
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
            this.listaProcessos.procs[i].notasAp = this.listaProcessos.procs[
              i
            ].notasAp.filter((n) => n.nota.replace(" ", "") != "");
            this.listaProcessos.procs[i].notasEx = this.listaProcessos.procs[
              i
            ].notasEx.filter((n) => n.nota.replace(" ", "") != "");
            this.listaProcessos.procs[
              i
            ].exemplosNotasAp = this.listaProcessos.procs[
              i
            ].exemplosNotasAp.filter((n) => n.exemplo.replace(" ", "") != "");
            this.listaProcessos.procs[i].termosInd = this.listaProcessos.procs[
              i
            ].termosInd.filter((n) => n.termo.replace(" ", "") != "");
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
    mergeProcsPluri: async function () {
      try {
        var index;
        for (
          let i = 0;
          i < this.tabelaSelecao.listaProcessos.procs.length;
          i++
        ) {
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
    // Merge do estado antigo dos processos com os que foram carregados da BD
    mergeProcsOrg: async function () {
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
          (this.tipoTS == "Organizacional" &&
            index != -1 &&
            !this.listaProcessos.procs[index].dono &&
            this.listaProcessos.procs[index].participante == "NP" &&
            !this.listaProcessos.procs[index].descriptionEdited) ||
          (this.tipoTS == "Pluriorganizacional" &&
            index != -1 &&
            this.listaProcessos.procs[index].entidades.every(
              (e) => !e.dono && e.participante == "NP"
            ) &&
            !this.listaProcessos.procs[index].descriptionEdited)
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

    loadFonteLegitimacao: async function () {
      this.verFontesLeg = true;
    },
    loadSelecao: async function () {
      this.$emit("listaProcessos", true);
      if (this.tipoTS == "Organizacional") {
        await this.loadProcessosOrg();
        await this.loadFechoTransitivo();
        await this.mergeProcsOrg();
      } else {
        await this.loadFechoTransitivo();
        await this.loadProcessosPluri();
        await this.loadProcessosEspecificosPluri(this.tabelaSelecao.entidades);
        await this.mergeProcsPluri();
      }

      this.forceRender();
      this.verListaProcessos = true;
    },
    confirmaProcs: function () {
      if (this.tipoTS == "Organizacional") {
        this.listaProcessos.procsAselecionar = this.listaProcessos.procs.filter(
          (p) => !p.dono && p.participante == "NP" && p.preSelected > 0
        );

        this.listaProcessos.procs = this.listaProcessos.procs.filter(
          (p) => p.dono || p.participante != "NP"
        );
      } else {
        this.listaProcessos.procsAselecionar = this.listaProcessos.procs.filter(
          (p) => !p.edited && p.preSelected > 0
        );
        this.listaProcessos.procs = this.listaProcessos.procs.filter(
          (p) => p.edited
        );
      }

      this.novoHistorico.procsAselecionar.dados = this.novoHistorico.procsAselecionar.dados
        .concat(
          this.listaProcessos.procsAselecionar
            .filter(
              (p) =>
                !this.novoHistorico.procsAselecionar.dados.some(
                  (c) => c.codigo == p.codigo
                )
            )
            .map((p) => {
              return { codigo: p.codigo, titulo: p.titulo };
            })
        )
        .sort((p1, p2) => p2.codigo < p1.codigo);
      if (
        this.tabelaSelecao.listaProcessos.procsAselecionar.length !==
          this.listaProcessos.procsAselecionar.length &&
        this.listaProcessos.procsAselecionar.length > 0
      ) {
        this.novoHistorico.procsAselecionar.cor = "amarelo";
      }

      this.tabelaSelecao.listaProcessos.procs = this.listaProcessos.procs;

      this.tabelaSelecao.listaProcessos.procsAselecionar = this.listaProcessos.procsAselecionar;
      this.tabelaSelecao.listaProcessos.numProcessosSelecionados = this.listaProcessos.numProcessosSelecionados;
      this.tabelaSelecao.listaProcessos.numProcessosPreSelecionados = this.listaProcessos.numProcessosPreSelecionados;
      this.tabelaSelecao.listaProcessos.processosPreSelecionados = this.listaProcessos.processosPreSelecionados;

      this.dadosOriginais.procs = this.listaProcessos.procs;
      this.dadosOriginais.procsAselecionar = this.listaProcessos.procsAselecionar;
      this.dadosOriginais.numProcessosSelecionados = this.listaProcessos.numProcessosSelecionados;
      this.dadosOriginais.numProcessosPreSelecionados = this.listaProcessos.numProcessosPreSelecionados;
      this.dadosOriginais.processosPreSelecionados = this.listaProcessos.processosPreSelecionados;
      this.dadosOriginais.procsAselecionar = this.listaProcessos.procsAselecionar;

      let aux = this.novoHistorico.classes.dados;

      this.novoHistorico.classes.dados = JSON.parse(
        JSON.stringify(this.listaProcessos.procs)
      );
      this.novoHistorico.classes.dados = this.novoHistorico.classes.dados.map(
        (p) => {
          return { cor: "verde", dados: p, nota: null };
        }
      );

      this.novoHistorico.classes.dados.map((p) => {
        let i = aux.findIndex(
          (proc) => proc.dados.codigo.dados == p.dados.codigo
        );

        Object.keys(p.dados).map((e) => {
          p.dados[e] = {
            cor: i > -1 ? aux[i].dados[e].cor : "verde",
            dados: p.dados[e],
            nota: null,
          };

          if (e === "pca" || e === "df") {
            Object.keys(p.dados[e].dados).map((d) => {
              p.dados[e].dados[d] = {
                cor: "verde",
                dados: p.dados[e].dados[d],
                nota: null,
              };
            });
          }
        });
      });

      this.novoHistorico.classes.cor = "amarelo";
      this.verListaProcessos = false;
      this.listaProcessosReady = false;
    },

    // Função de retorno do processo de edição do Bloco Descritivo
    blocoDescritivoEditado: function (p) {
      this.dadosOriginais.notasAp = p.notasAp;
      this.dadosOriginais.exemplosNotasAp = p.exemplosNotasAp;
      this.dadosOriginais.notasEx = p.notasEx;
      this.dadosOriginais.termosInd = p.termosInd;

      !(
        this.novoHistorico.notasAp.dados.length ===
          this.dadosOriginais.notasAp.length &&
        this.novoHistorico.notasAp.dados.every((n) =>
          this.dadosOriginais.notasAp.some((nota) => nota.nota == n.nota)
        )
      )
        ? (this.novoHistorico.notasAp.cor = "amarelo")
        : "";

      !(
        this.novoHistorico.exemplosNotasAp.dados.length ===
          this.dadosOriginais.exemplosNotasAp.length &&
        this.novoHistorico.exemplosNotasAp.dados.every((n) =>
          this.dadosOriginais.exemplosNotasAp.some(
            (nota) => nota.exemplo == n.exemplo
          )
        )
      )
        ? (this.novoHistorico.exemplosNotasAp.cor = "amarelo")
        : "";

      !(
        this.novoHistorico.notasEx.dados.length ===
          this.dadosOriginais.notasEx.length &&
        this.novoHistorico.notasEx.dados.every((n) =>
          this.dadosOriginais.notasEx.some((nota) => nota.nota == n.nota)
        )
      )
        ? (this.novoHistorico.notasEx.cor = "amarelo")
        : "";

      !(
        this.novoHistorico.termosInd.dados.length ===
          this.dadosOriginais.termosInd.length &&
        this.novoHistorico.termosInd.dados.every((n) =>
          this.dadosOriginais.termosInd.some((nota) => nota.termo == n.termo)
        )
      )
        ? (this.novoHistorico.termosInd.cor = "amarelo")
        : "";

      this.editaBlocoDescritivoFlag = false;
    },
    // Função de cancelamento do processo de edição do Bloco Descritivo
    blocoDescritivoCancelado: function (p) {
      this.editaBlocoDescritivoFlag = false;
    },
    cancelar: function () {
      this.verListaProcessos = false;
    },
    edita: function () {
      this.editaCampo = this.campoValue;
      this.campoEditado = this.novoHistorico[this.campoValue].dados;
    },
    loadNotas: function () {
      let array = this.notas.filter(
        (n) =>
          n.nota.replace(" ", "") != "" &&
          !this.dadosOriginais[this.campoValue].some((n1) => n1.nota == n.nota)
      );
      return array.concat(this.dadosOriginais[this.campoValue]);
    },
    loadExemplos: function () {
      let array = this.notas.filter(
        (n) =>
          n.exemplo.replace(" ", "") != "" &&
          !this.dadosOriginais[this.campoValue].some(
            (n1) => n1.exemplo == n.exemplo
          )
      );
      return array.concat(this.dadosOriginais[this.campoValue]);
    },
    loadTermosInd: function () {
      let array = this.notas.filter(
        (n) =>
          n.termo.replace(" ", "") != "" &&
          !this.dadosOriginais[this.campoValue].some(
            (n1) => n1.termo == n.termo
          )
      );
      return array.concat(this.dadosOriginais[this.campoValue]);
    },
  },
};
</script>
