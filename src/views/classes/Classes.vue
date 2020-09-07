<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
      <v-row>
        <v-col class="py-0 my-0">
          <v-row>
            <v-col class="py-0 my-0">
              <v-btn
                @click="goBack"
                rounded
                class="white--text mb-6"
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown
                }"
                id="default-button"
              >
                <unicon
                  name="arrow-back-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.71 37.261"
                  fill="#ffffff"
                />
                <p class="ml-2">Voltar</p>
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="py-0 my-0" style="text-align: right;">
              <v-btn
                @click="advancedSearch = !advancedSearch"
                rounded
                class="white--text mb-6"
                :class="{
                  'px-8': $vuetify.breakpoint.lgAndUp,
                  'px-2': $vuetify.breakpoint.mdAndDown
                }"
                id="default-button"
              >
                <!--falta fazer: search = '' -->
                <v-switch
                  v-model="advancedSearch"
                  color="green lighten-2"
                  disabled
                  hide-details
                  style="opacity: 1 !important;"
                ></v-switch>
                <unicon
                  name="zoom-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.71 20.697"
                  fill="#ffffff"
                />
                <p class="ml-2">Pesquisa Avançada</p>
              </v-btn>
            </v-col>
          </v-row>

          <v-card flat style="border-radius: 10px !important;">
            <p
              class="content-title-1 py-5"
              style="color: #4da0d0 !important;  text-align:center;"
            >
              Consultar Lista Consolidada
            </p>
            <!-- !advancedSearch => Mostrar Classes Tree-->
            <v-row
              v-if="!advancedSearch"
              justify="center"
              class="text-center mx-0"
            >
              <v-col class="mt-4">
                <div
                  class="info-content"
                  :class="{
                    'margin-mdUp': $vuetify.breakpoint.mdAndUp,
                    'margin-smDown': $vuetify.breakpoint.smAndDown
                  }"
                >
                  <v-tooltip top color="info" open-delay="500">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        style="text-align: center !important;"
                        class="centered-input mt-n1 mb-2 px-8"
                        v-model="search"
                        v-on="on"
                        label="Pesquisar por código, título, notas de aplicação, exemplos de notas de aplicação ou termos de índice..."
                        text
                        hide-details
                        single-line
                        clearable
                        @click:clear="classesTree = classesOriginal"
                        v-on:keyup.enter="processaPesquisa()"
                        color="blue darken-3"
                      ></v-text-field>
                    </template>
                    <span
                      >Pesquisar por código, título, notas de aplicação,
                      exemplos de notas de aplicação ou termos de
                      índice...</span
                    >
                  </v-tooltip>
                </div>
                <v-btn
                  @click="processaPesquisa()"
                  rounded
                  class="white--text mt-12 mr-8"
                  :class="{
                    'px-12': $vuetify.breakpoint.lgAndUp,
                    'px-8': $vuetify.breakpoint.mdAndDown
                  }"
                  id="default-button"
                >
                  <unicon
                    name="consultar-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20.71 20.697"
                    fill="#ffffff"
                  />
                  <p class="ml-2">Pesquisar</p>
                </v-btn>
                <v-menu
                  v-if="this.selected.length > 0"
                  class="text-center"
                  offset-y
                  nudge-top="16"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      rounded
                      class="white--text mt-12 ml-8"
                      :class="{
                        'px-12': $vuetify.breakpoint.lgAndUp,
                        'px-8': $vuetify.breakpoint.mdAndDown
                      }"
                      id="default-button"
                    >
                      <unicon
                        name="exportar-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 20.697"
                        fill="#ffffff"
                      />
                      <p class="ml-2">Exportar</p>
                    </v-btn>
                  </template>
                  <v-list rounded dark id="dark-background-list">
                    <v-list-item
                      v-for="tipo in exportTypes"
                      :key="tipo"
                      @click="exportarResultados(tipo)"
                      class="text-center"
                    >
                      <v-list-item-title v-text="tipo"></v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-card-text class="mt-12 text-left" id="treeview-card">
                  <v-card
                    dark
                    class="info-card mb-4"
                    v-if="
                      classesCarregadas &&
                        camposUsados[0].campo &&
                        camposUsados[0].valor
                    "
                  >
                    <v-card-title
                      class="headline mb-4"
                      style="word-break: break-word !important;"
                    >
                      De seguida apresenta-se as classes em que:
                    </v-card-title>
                    <v-card-text class="font-weight-medium">
                      <div v-for="(c, i) in camposUsados" :key="i" class="ma-2">
                        <span v-if="c.campo.label">
                          <v-chip
                            class="ma-2"
                            style="background-color: rgba(0, 0, 0, 0.25) !important;"
                          >
                            <span
                              class="font-weight-medium white--text mx-3"
                              style="font-size: 1.1rem !important;"
                            >
                              {{
                                entidades.filter(e => e.value == c.valor)[0]
                                  .text
                              }}
                            </span>
                            <span
                              v-if="c.not"
                              class="mt-1"
                              style="color: #ff5252; text-shadow: 0px 1px 2px rgba(255, 82, 82, 0.5);"
                            >
                              não é
                            </span>
                            <span
                              class="mt-1"
                              style="color: #00ae07; text-shadow: 0px 1px 2px rgba(0, 174, 7, 0.5);"
                              v-else
                            >
                              é
                            </span>
                            <span
                              class="font-weight-medium white--text mx-3"
                              style="font-size: 1.1rem !important;"
                            >
                              {{
                                c.campo.enum.filter(
                                  e => e.value == c.campo.nome
                                )[0].text
                              }}
                            </span>
                          </v-chip>
                        </span>
                        <span v-else>
                          <v-chip
                            class="ma-2"
                            style="background-color: rgba(0, 0, 0, 0.25) !important;"
                          >
                            <span
                              class="font-weight-medium white--text mx-3"
                              style="font-size: 1.1rem !important;"
                            >
                              {{
                                camposPesquisa.filter(
                                  e => e.value.nome == c.campo.nome
                                )[0].text
                              }}
                            </span>
                            <span
                              v-if="c.not"
                              class="mt-1"
                              style="color: #ff5252; text-shadow: 0px 1px 2px rgba(255, 82, 82, 0.5);"
                            >
                              não é igual a
                            </span>
                            <span
                              class="mt-1"
                              style="color: #00ae07; text-shadow: 0px 1px 2px rgba(0, 174, 7, 0.5);"
                              v-else
                            >
                              é igual a
                            </span>
                            <span
                              class="font-weight-medium white--text mx-3"
                              style="font-size: 1.1rem !important;"
                            >
                              {{
                                c.campo.enum.length > 0
                                  ? c.campo.enum.filter(
                                      e => e.value == c.valor
                                    )[0].text
                                  : c.valor
                              }}
                            </span>
                          </v-chip>
                        </span>
                        <div class="ma-2" v-if="i + 1 < camposUsados.length">
                          <v-chip
                            style="background-color: rgba(0, 0, 0, 0.25) !important; color: #ffc107 !important;"
                            >{{ conetor }}</v-chip
                          >
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                  <div v-if="classesCarregadas">
                    <v-treeview
                      rounded
                      hoverable
                      multiple-active
                      :items="classesTree"
                      item-key="id"
                      :open="selectedParents"
                      :active="selected"
                    >
                      <template slot="label" slot-scope="{ item }">
                        <v-tooltip bottom color="info" open-delay="500">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-on="on"
                              rounded
                              text
                              color="blue"
                              @click="goToClasse(item.id)"
                            >
                              {{ item.name }}
                            </v-btn>
                          </template>
                          <span> {{ item.name }} </span>
                        </v-tooltip>
                        <br />
                      </template>
                    </v-treeview>
                    <v-alert
                      color="error"
                      icon="warning"
                      class="font-weight-medium my-auto"
                      id="alerta-erro"
                      :value="classesTree.length == 0"
                    >
                      Sem resultados. Volte a pesquisar...
                    </v-alert>
                  </div>
                  <Loading v-else :message="'classes'" />
                </v-card-text>
              </v-col>
            </v-row>
            <!-- advancedSearch -->
            <v-row v-else justify="center" class="text-center mx-12">
              <v-col>
                <v-card-text>
                  <v-form
                    v-for="(campo, index) in camposUsados"
                    :key="index"
                    ref="forms"
                    lazy-validation
                    class="mb-5"
                  >
                    <div class="info-content">
                      <v-row class="px-3">
                        <v-col cols="12" md="4">
                          <v-autocomplete
                            :items="camposPesquisa"
                            label="Campo a pesquisar"
                            :rules="regraCampo"
                            v-model="camposUsados[index].campo"
                          />
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-autocomplete
                            :items="notValues"
                            v-model="camposUsados[index].not"
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                          v-if="camposUsados[index].campo"
                        >
                          <div v-if="camposUsados[index].campo.label">
                            <v-autocomplete
                              :items="camposUsados[index].campo.enum"
                              label="É"
                              :rules="regraV"
                              v-model="camposUsados[index].campo.nome"
                            />
                            <v-autocomplete
                              :items="entidades"
                              :label="camposUsados[index].campo.label"
                              :rules="regraV"
                              v-model="camposUsados[index].valor"
                            />
                          </div>
                          <div v-else>
                            <div
                              v-if="camposUsados[index].campo.enum.length > 0"
                            >
                              <v-autocomplete
                                :items="camposUsados[index].campo.enum"
                                label="Valor a pesquisar"
                                :rules="regraValor"
                                v-model="camposUsados[index].valor"
                              />
                            </div>
                            <div v-else>
                              <v-text-field
                                v-if="camposUsados[index].campo.mask"
                                label="Valor a pesquisar"
                                :rules="regraValor"
                                v-mask="camposUsados[index].campo.mask"
                                v-model="camposUsados[index].valor"
                              />
                              <v-text-field
                                v-else
                                label="Valor a pesquisar"
                                :rules="regraValor"
                                v-model="camposUsados[index].valor"
                              />
                            </div>
                          </div>
                        </v-col>
                        <v-col>
                          <v-select
                            :items="opLogicas"
                            v-model="conetor"
                            @input="
                              camposUsados.push({
                                campo: null,
                                valor: '',
                                not: false
                              });
                              opLogicas = [conetor];
                            "
                          />
                        </v-col>
                        <v-col cols="12" md="1" v-if="camposUsados.length > 1">
                          <v-btn
                            align="center"
                            icon
                            color="red"
                            @click="removerCampo(index)"
                          >
                            <unicon
                              name="remove-icon"
                              width="15"
                              height="15"
                              viewBox="0 0 20.71 20.697"
                              fill="#ff5252"
                            />
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </v-form>

                  <v-container fluid class="text-center">
                    <v-row justify="center" align="center">
                      <v-col cols="12" md="4">
                        <v-btn
                          @click="cancelarPesquisa"
                          rounded
                          class="white--text"
                          :class="{
                            'px-12': $vuetify.breakpoint.lgAndUp,
                            'px-8': $vuetify.breakpoint.mdAndDown
                          }"
                          id="default-button"
                        >
                          <unicon
                            name="remove-icon"
                            width="20"
                            height="20"
                            viewBox="0 0 20.71 20.721"
                            fill="#ffffff"
                          />
                          <p class="ml-2">Cancelar</p>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-btn
                          @click="pesquisaAvancada"
                          rounded
                          class="white--text"
                          :class="{
                            'px-12': $vuetify.breakpoint.lgAndUp,
                            'px-8': $vuetify.breakpoint.mdAndDown
                          }"
                          id="default-button"
                        >
                          <unicon
                            name="consultar-icon"
                            width="20"
                            height="20"
                            viewBox="0 0 20.71 20.697"
                            fill="#ffffff"
                          />
                          <p class="ml-2">Pesquisar</p>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import Loading from "@/components/generic/Loading";
export default {
  props: ["savedSearch"],
  components: { Loading },
  data: () => ({
    advancedSearch: false,
    // showClasses: true,
    regraCampo: [v => !!v || "Campo a pesquisar é obrigatório."],
    regraValor: [v => !!v || "Valor a pesquisar é obrigatório."],
    regraV: [v => !!v || "Obrigatório. Escolha um valor."],
    conetor: "E",
    opLogicas: ["E", "OU"],
    camposUsados: [{ campo: null, valor: "", not: false }],
    camposPesquisa: [
      {
        text: "Código",
        value: { nome: "id", mask: "###.##.###.##", enum: [] }
      },
      { text: "Título", value: { nome: "titulo", enum: [] } },
      { text: "Estado", value: { nome: "status", enum: [] } },
      { text: "Descrição", value: { nome: "descricao", enum: [] } },
      { text: "Tipo de processo", value: { nome: "tp", enum: [] } },
      { text: "Processo Transversal", value: { nome: "pt", enum: [] } },
      { text: "Notas de Aplicação", value: { nome: "na", enum: [] } },
      {
        text: "Exemplos de Notas de Aplicação",
        value: { nome: "exemploNa", enum: [] }
      },
      { text: "Notas de Exclusão", value: { nome: "ne", enum: [] } },
      {
        text: "Termos de Índice",
        value: { nome: "ti", enum: [] }
      },
      { text: "PCA", value: { nome: "pca", enum: [] } },
      { text: "Forma de contagem do PCA", value: { nome: "fc_pca", enum: [] } },
      {
        text: "Subforma de contagem do PCA",
        value: { nome: "sfc_pca", enum: [] }
      },
      { text: "Justificação do PCA", value: { nome: "crit_pca", enum: [] } },
      {
        text: "DF",
        value: {
          nome: "df",
          enum: [
            { text: "Conservação", value: "C" },
            { text: "Conservação Parcial", value: "CP" },
            { text: "Eliminação", value: "E" },
            { text: "Não Especificado", value: "NE" }
          ]
        }
      },
      { text: "Justificação do DF", value: { nome: "crit_df", enum: [] } },
      {
        text: "Entidade",
        value: {
          nome: "",
          label: "Entidade a pesquisar",
          enum: [
            { text: "Dona", value: "donos" },
            { text: "Participante", value: "participantes" }
          ]
        }
      }
    ],
    classesTree: [],
    classesOriginal: [],
    entidades: [],
    classesCarregadas: false,
    search: null,
    selected: [],
    selectedParents: [],
    exportTypes: ["JSON", "XML", "CSV"],
    notValues: [
      { text: "é", value: false },
      { text: "não é", value: true }
    ]
  }),
  created: async function() {
    var myClasses = await this.$request("get", "/classes?info=pesquisa");
    this.classesTree = await this.preparaTree(myClasses.data);
    this.classesOriginal = this.classesTree;

    if (this.savedSearch) {
      this.camposUsados = this.savedSearch.camposUsados;
      this.classesTree = this.savedSearch.classesTree;
      this.camposPesquisa = this.savedSearch.camposPesquisa;
      this.selected = this.savedSearch.selected;
      this.selectedParents = this.savedSearch.selectedParents;
      this.conetor = this.savedSearch.conetor;
      this.opLogicas = this.savedSearch.opLogicas;
    } else {
      await this.loadStatus();
      await this.loadTipoProc();
      await this.loadProcTrans();
      await this.loadPCAFormasContagem();
      await this.loadPCASubFormasContagem();
      await this.loadCriterios();
    }

    var entidades = await this.$request("get", "/entidades");
    this.entidades = entidades.data.map(e => {
      return { text: e.designacao, value: e.id };
    });
    this.classesCarregadas = true;
  },
  methods: {
    goBack() {
      this.$router.push("/lcinfo");
    },
    //Necessário para o caso especial de pesquisar com o campo Entidade
    cleanNome: function() {
      for (var i = 0; i < this.camposPesquisa.length; i++) {
        if (this.camposPesquisa[i].text == "Entidade") {
          this.camposPesquisa[i].value.nome = "";
        }
      }
    },
    load: async function(voc, transF, campo) {
      var response = await this.$request("get", "/vocabularios/" + voc);
      var list = response.data.map(transF);

      if (list.length > 0 && typeof list[0] === "object") {
        list = list.sort((a, b) => a.text.localeCompare(b.text));
      } else {
        list = list.sort();
      }

      var found = false;
      for (var i = 0; i < this.camposPesquisa.length && !found; i++) {
        if (this.camposPesquisa[i].text == campo) {
          this.camposPesquisa[i].value.enum = list;
          found = true;
        }
      }
    },
    loadStatus: async function() {
      var transF = item => {
        return {
          text: item.termo,
          value: item.idtermo.split("#vc_status_")[1]
        };
      };

      await this.load("vc_status", transF, "Estado");
    },
    loadTipoProc: async function() {
      await this.load(
        "vc_processoTipo",
        item => item.termo,
        "Tipo de processo"
      );
    },
    loadProcTrans: async function() {
      var transF = item => {
        return {
          text: item.termo,
          value: item.termo.charAt(0)
        };
      };

      await this.load(
        "vc_processoTransversalidade",
        transF,
        "Processo Transversal"
      );
    },
    loadPCAFormasContagem: async function() {
      await this.load(
        "vc_pcaFormaContagem",
        item => item.termo,
        "Forma de contagem do PCA"
      );
    },
    loadPCASubFormasContagem: async function() {
      await this.load(
        "vc_pcaSubformaContagem",
        item => item.desc,
        "Subforma de contagem do PCA"
      );
    },
    loadCriterios: async function() {
      var transF = item => {
        return {
          text: item.termo,
          value:
            "CriterioJustificacao" +
            item.termo
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace("informacional", "Info")
              .replace(" ", "")
        };
      };

      await this.load("vc_pcaCriterios", transF, "Justificação do PCA");
      await this.load("vc_dfCriterios", transF, "Justificação do DF");
    },
    addActive: function(code) {
      if (!this.selected.includes(code)) {
        this.selected.push(code);
      }
    },
    buscarpais: function(code) {
      let levelIds = code.split(".");
      let iter = levelIds.length;

      for (let i = 0; i < iter; i++) {
        levelIds.splice(levelIds.length - 1, 1);
        let levelId = levelIds.join(".");

        if (!this.selectedParents.includes(levelId)) {
          this.selectedParents.push(levelId);
        }
      }
    },

    removerCampo: function(index) {
      this.camposUsados.splice(index, 1);
      if (this.camposUsados.length == 1) {
        this.opLogicas = ["E", "OU"];
      }
    },

    cancelarPesquisa: function() {
      this.classesTree = this.classesOriginal;
      this.selected = [];
      this.selectedParents = [];
      this.camposUsados = [{ campo: null, valor: "", not: false }];
      this.cleanNome();
      this.opLogicas = ["E", "OU"];
      this.conetor = "E";
      this.advancedSearch = false;
      // this.showClasses = true;
    },

    advancedFilter: async function(classes, op) {
      var classesAux = [];

      for (var i = 0; i < classes.length; i++) {
        classes[i].children = await this.advancedFilter(
          classes[i].children,
          op
        );

        var stat = op;
        for (let c of this.camposUsados) {
          var statAux;
          if (c.campo.enum.length > 0) {
            if (classes[i][c.campo.nome] instanceof Array) {
              statAux = classes[i][c.campo.nome].includes(c.valor);
            } else {
              statAux = classes[i][c.campo.nome] == c.valor;
            }
          } else {
            statAux = classes[i][c.campo.nome].indexOf(c.valor) > -1;
          }

          if (c.not) statAux = !statAux;

          if (op) stat = stat && statAux;
          else stat = stat || statAux;
        }

        if (stat) {
          this.addActive(classes[i].id);
          this.buscarpais(classes[i].id);
        }

        if (stat || classes[i].children.length > 0) classesAux.push(classes[i]);
      }

      return classesAux;
    },

    pesquisaAvancada: async function() {
      var valid = true;

      for (var i = 0; i < this.camposUsados.length; i++) {
        if (!this.$refs.forms[i].validate()) {
          valid = false;
        }
      }

      if (valid) {
        var classesFiltradas = JSON.parse(JSON.stringify(this.classesOriginal));
        this.selected = [];
        this.selectedParents = [];

        var backupCaUs = JSON.parse(JSON.stringify(this.camposUsados));
        for (let c of this.camposUsados) {
          c.valor = c.valor.toLowerCase();
        }

        if (this.conetor == "E") {
          classesFiltradas = await this.advancedFilter(classesFiltradas, true);
        } else if (this.conetor == "OU") {
          classesFiltradas = await this.advancedFilter(classesFiltradas, false);
        }

        this.classesTree = classesFiltradas;
        this.camposUsados = backupCaUs;
        this.advancedSearch = false;
        // this.showClasses = true;
      }
    },

    simpleFilter: async function(classes, searchText) {
      var classesAux = [];

      for (var classe of classes) {
        var c = JSON.parse(JSON.stringify(classe));
        c.children = await this.simpleFilter(c.children, searchText);

        if (
          c.id.indexOf(searchText) > -1 ||
          c.titulo.indexOf(searchText) > -1 ||
          c.na.indexOf(searchText) > -1 ||
          c.exemploNa.indexOf(searchText) > -1 ||
          c.ti.indexOf(searchText) > -1
        ) {
          this.addActive(c.id);
          this.buscarpais(c.id);
          if (classe.children.length == 0 && c.children.length == 0)
            classesAux.push(c);
        }

        if (c.children.length > 0) classesAux.push(c);
      }
      return classesAux;
    },

    processaPesquisa: async function() {
      this.classesTree = this.classesOriginal;
      var classesFiltradas = [];
      this.selected = [];
      this.selectedParents = [];

      if (this.search != "" && this.search != null) {
        var searchText = this.search.toLowerCase();

        classesFiltradas = await this.simpleFilter(
          this.classesOriginal,
          searchText
        );
      } else {
        classesFiltradas = this.classesOriginal;
      }

      this.classesTree = classesFiltradas;
      this.advancedSearch = false;
      // this.showClasses = true;
    },
    getTitulo: function(id) {
      var codigos = id.split(".");
      var nivel = codigos.length;
      var found;
      var classes = this.classesTree;

      for (var i = 0; i < nivel; i++) {
        found = null;
        for (var j = 0; j < classes.length && !found; j++) {
          if (classes[j].id == codigos.slice(0, i + 1).join(".")) {
            if (i == nivel - 1) {
              found = classes[j].name.split(" - ")[1];
            } else {
              classes = classes[j].children;
              found = "";
            }
          }
        }
      }

      return found;
    },
    download(filename, content, format) {
      var blob = new Blob([content], {
        type: format + ";charset=utf-8;"
      });

      if (window.navigator.msSaveBlob) {
        // FOR IE BROWSER
        navigator.msSaveBlob(blob, filename);
      } else {
        // FOR OTHER BROWSERS
        var url = URL.createObjectURL(blob);
        var element = document.createElement("a");

        element.setAttribute("href", url);
        element.setAttribute("download", filename);
        element.style.display = "none";

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    },
    toXML: function(e, i) {
      var ret = `\t<item index="${i}" type="object">\n`;
      ret += `\t\t<codigo type="string">${e.codigo}</codigo>\n`;
      ret += `\t\t<titulo type="string">${e.titulo}</titulo>\n`;
      ret += `\t</item>`;
      return ret;
    },
    exportarResultados: function(format) {
      var res = JSON.parse(JSON.stringify(this.selected)).sort();

      res = res.map(c => {
        return {
          codigo: c,
          titulo: this.getTitulo(c)
        };
      });

      var mediatype;
      switch (format) {
        case "JSON":
          res = JSON.stringify(res, null, 4);
          mediatype = "application/json";
          break;
        case "XML":
          res = res.map(this.toXML).join("\n");
          res = "<root>\n" + res;
          res = res + "\n</root>";
          res = `<?xml version="1.0" encoding="utf-8"?>\n` + res;
          mediatype = "application/xml";
          break;
        case "CSV":
          res = res.map(e => `"${e.codigo}","${e.titulo}"`).join("\n");
          res = `"Código","Título"\n` + res;
          mediatype = "text/csv";
          break;
        default:
          res = JSON.stringify(res, null, 4);
          format = "JSON";
          mediatype = "application/json";
          break;
      }
      this.download("classes." + format.toLowerCase(), res, mediatype);
    },
    preparaTree: function(lclasses) {
      var myTree = [];
      for (var i = 0; i < lclasses.length; i++) {
        myTree.push({
          id: lclasses[i].id,
          name: lclasses[i].nome,
          titulo: lclasses[i].titulo.toLowerCase(),
          status: lclasses[i].status.toLowerCase(),
          tp: lclasses[i].tp.toLowerCase(),
          pt: lclasses[i].pt.toLowerCase(),
          na: lclasses[i].na.toLowerCase(),
          exemploNa: lclasses[i].exemploNa.toLowerCase(),
          ne: lclasses[i].ne.toLowerCase(),
          ti: lclasses[i].ti.toLowerCase(),
          pca: lclasses[i].pca.toLowerCase(),
          fc_pca: lclasses[i].fc_pca.toLowerCase(),
          sfc_pca: lclasses[i].sfc_pca.toLowerCase(),
          crit_pca: lclasses[i].crit_pca.map(j => j.toLowerCase()),
          df: lclasses[i].df.toLowerCase(),
          crit_df: lclasses[i].crit_df.map(j => j.toLowerCase()),
          donos: lclasses[i].donos.map(d => d.toLowerCase()),
          participantes: lclasses[i].participantes.map(p => p.toLowerCase()),
          children: this.preparaTree(lclasses[i].filhos)
        });
      }
      return myTree;
    },
    goToClasse: function(id) {
      var ss = undefined;

      if (this.selected.length > 0) {
        ss = {
          camposUsados: this.camposUsados,
          classesTree: this.classesTree,
          selected: this.selected,
          selectedParents: this.selectedParents,
          camposPesquisa: this.camposPesquisa,
          conetor: this.conetor,
          opLogicas: this.opLogicas
        };
      }

      this.$router.push({
        name: "consultaClasse",
        params: {
          idClasse: "c" + id,
          savedSearch: ss
        }
      });
    }
  },
  watch: {
    search: function(newValue) {
      if (newValue == "" || newValue == null) {
        this.selected = [];
        this.selectedParents = [];
        this.classesTree = this.classesOriginal;
      }
    }
  }
};
</script>

<style scoped>
#text-field {
  text-align: center !important;
}
.centered-input >>> input {
  text-align: center;
}
#advanced-search-card {
  padding: 8px;
  background: #dee2f8;
  color: #1a237e;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 0 20px 20px 0;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
#dark-background-list {
  background-color: #0056b6 !important;
}
.v-btn__content {
  color: black !important;
}
.margin-mdUp {
  margin-right: 10% !important;
  margin-left: 10% !important;
}
.margin-smDown {
  margin-right: 2% !important;
  margin-left: 2% !important;
}
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.3);
}
#treeview-card {
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.32);
  border-radius: 10px;
  background-color: #f4f5f7;
}
</style>
