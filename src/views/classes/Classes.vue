<template>
  <v-card class="mx-auto fill-height">
    <v-sheet class="indigo lighten-2">
      <v-row align="center" no-gutters>
        <v-col class="ml-4" xs="7" md="7" sm="7" lg="7" xl="7">
          <v-text-field
            v-model="search"
            label="Pesquisar por código, título, notas de aplicação, exemplos de notas de aplicação ou termos de índice..."
            text
            dark
            solo-inverted
            hide-details
            clearable
            @click:clear="classesTree = classesOriginal"
            clear-icon="delete_forever"
          ></v-text-field>
        </v-col>
        <v-col class="text-center">
          <v-btn @click="processaPesquisa()">
            <v-icon left>search</v-icon>Pesquisar
          </v-btn>
        </v-col>
        <v-divider
          style="height: 50px;"
          class="mr-10 grey lighten-4"
          vertical
        />
        <v-col class="text-center">
          <v-btn
            @click="
              search = '';
              showClasses = !showClasses;
            "
          >
            <v-icon left>filter_list</v-icon>Pesquisa Avançada
          </v-btn>
        </v-col>
        <v-col v-if="this.selected.length > 0" class="text-center">
          <v-menu transition="fade-transition">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on"><v-icon left>get_app</v-icon>Exportar</v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="type in exportTypes"
                :key="type"
                @click="exportarResultados(type)"
              >
                <v-list-item-title v-text="type"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-sheet>

    <v-row align="center" no-gutters v-if="showClasses">
      <v-col>
        <v-card-text>
          <v-card
            class="mx-auto mb-4"
            max-width="1200"
            v-if="
              classesCarregadas &&
                camposUsados[0].campo &&
                camposUsados[0].valor
            "
          >
            <v-card-title
              class="white--text title font-weight-black indigo accent-4"
            >
              De seguida apresenta-se as classes em que:
            </v-card-title>
            <v-card-text>
              <div
                v-for="(c, i) in camposUsados"
                :key="i"
                class="text-center ma-2"
              >
                <span v-if="c.campo.label">
                  <v-chip dark color="indigo darken-4">
                    {{
                      get(c.campo.nome + "s").filter(e => e.value == c.valor)[0].text
                    }}
                  </v-chip>
                  <span v-if="c.not">
                    <v-chip dark color="indigo lighten-2">não</v-chip> é
                  </span>
                  <span v-else>
                    é
                  </span>
                  <v-chip dark label color="indigo accent-4">
                    {{
                      c.campo.enum.filter(
                        e => e.value == c.campo.nome || e.value == c.subcampo
                      )[0].text
                    }}
                  </v-chip>
                </span>
                <span v-else>
                  <v-chip dark color="indigo darken-4">
                    {{
                      camposPesquisa.filter(
                        e =>
                          e.value.nome == c.campo.nome ||
                          e.value.nome == c.subcampo
                      )[0].text
                    }}
                  </v-chip>
                  <span v-if="c.not">
                    <v-chip dark color="indigo lighten-2">não</v-chip> é igual a
                  </span>
                  <span v-else>
                    é igual a
                  </span>
                  <v-chip dark label color="indigo accent-4">
                    {{
                      c.campo.enum.length > 0
                        ? c.campo.enum.filter(e => e.value == c.valor)[0].text
                        : c.valor
                    }}
                  </v-chip>
                </span>
                <div class="ma-2" v-if="i + 1 < camposUsados.length">
                  <v-chip dark color="indigo lighten-2">{{ conetor }}</v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <div v-if="classesCarregadas">
            <v-treeview
              hoverable
              multiple-active
              :items="classesTree"
              item-key="id"
              :open="selectedParents"
              :active="selected"
            >
              <template slot="label" slot-scope="{ item }">
                <v-btn text depressed @click="goToClasse(item.id)">
                  {{ item.name }}
                </v-btn>
                <br />
              </template>
            </v-treeview>
            <v-alert type="info" :value="classesTree.length == 0">
              Sem resultados. Volte a pesquisar...
            </v-alert>
          </div>
          <Loading v-else :message="'classes'" />
        </v-card-text>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-card-text>
          <v-form
            v-for="(campo, index) in camposUsados"
            :key="index"
            ref="forms"
            lazy-validation
          >
            <v-row>
              <v-col cols="4">
                <v-autocomplete
                  :items="camposPesquisa"
                  label="Campo a pesquisar"
                  :rules="regraCampo"
                  v-model="camposUsados[index].campo"
                />
              </v-col>
              <v-col cols="1">
                <v-autocomplete
                  :items="notValues"
                  v-model="camposUsados[index].not"
                />
              </v-col>
              <v-col cols="5" v-if="camposUsados[index].campo">
                <div v-if="camposUsados[index].campo.label">
                  <v-autocomplete
                    :items="camposUsados[index].campo.enum"
                    label="Tipo de Intervenção"
                    :rules="regraV"
                    v-model="camposUsados[index].subcampo"
                  />
                  <v-autocomplete
                    :items="get(camposUsados[index].campo.nome + 's')"
                    :label="camposUsados[index].campo.label"
                    :rules="regraV"
                    v-model="camposUsados[index].valor"
                  />
                </div>
                <div v-else>
                  <div v-if="camposUsados[index].campo.enum.length > 0">
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
                    camposUsados.push({ campo: null, valor: '', not: false });
                    opLogicas = [conetor];
                  "
                />
              </v-col>
              <v-col cols="1" v-if="camposUsados.length > 1">
                <v-btn text @click="removerCampo(index)">
                  <v-icon dark color="error">remove_circle_outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-row>
            <v-spacer />
            <v-btn
              class="mx-2"
              dark
              color="indigo accent-4"
              @click="showClasses = true"
            >
              Voltar
            </v-btn>
            <v-btn
              class="mx-2"
              dark
              color="red"
              @click="cancelarPesquisa"
            >
              Limpar
            </v-btn>
            <v-btn
              class="mx-2"
              dark
              color="indigo accent-4"
              @click="pesquisaAvancada"
            >
              <v-icon left>search</v-icon>Pesquisar
            </v-btn>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";

export default {
  props: ["savedSearch"],
  components: { Loading },
  data: () => ({
    showClasses: true,
    regraCampo: [v => !!v || "Campo a pesquisar é obrigatório."],
    regraValor: [v => !!v || "Valor a pesquisar é obrigatório."],
    regraV: [v => !!v || "Obrigatório. Escolha um valor."],
    conetor: "E",
    opLogicas: ["E", "OU"],
    camposUsados: [{ campo: null, subcampo: null, valor: "", not: false }],
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
          nome: "entidade",
          label: "Entidade a pesquisar",
          enum: [
            { text: "Dona", value: "donos" },
            { text: "Participante", value: "participantes" }
          ]
        }
      },
      {
        text: "Tipologia",
        value: {
          nome: "tipologia",
          label: "Tipologia a pesquisar",
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
    tipologias: [],
    classesCarregadas: false,
    search: null,
    selected: [],
    selectedParents: [],
    exportTypes: ["JSON", "XML", "CSV"],
    notValues: [{ text: "é", value: false }, { text: "não é", value: true }]
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

    var tipologias = await this.$request("get", "/tipologias");
    this.tipologias = tipologias.data.map(e => {
      return { text: e.designacao, value: e.id };
    });
    this.classesCarregadas = true;
  },
  methods: {
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
      var transF = item => {
        return {
          text: item.termo,
          value: item.termo.toLowerCase()
        };
      };

      await this.load(
        "vc_processoTipo",
        transF,
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
      var transF = item => {
        return {
          text: item.termo,
          value: item.termo.toLowerCase()
        };
      };

      await this.load(
        "vc_pcaFormaContagem",
        transF,
        "Forma de contagem do PCA"
      );
    },
    loadPCASubFormasContagem: async function() {
      var transF = item => {
        return {
          text: item.desc,
          value: item.desc.toLowerCase()
        };
      };

      await this.load(
        "vc_pcaSubformaContagem",
        transF,
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
      //this.showClasses = true;
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
          let campo = "";

          if (c.subcampo) {
            campo = c.subcampo;
          } else {
            campo = c.campo.nome;
          }

          if (c.campo.enum.length > 0) {
            if (classes[i][campo] instanceof Array) {
              statAux = classes[i][campo].includes(c.valor);
            } else {
              statAux = classes[i][campo] == c.valor;
            }
          } else {
            statAux = classes[i][campo].indexOf(c.valor) > -1;
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
        this.showClasses = true;
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
      this.showClasses = true;
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
          descricao: lclasses[i].descricao.toLowerCase(),
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
    },
    get: function(name) {
      return this[name];
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
.v-btn:hover:before {
  opacity: 0;
}
</style>
