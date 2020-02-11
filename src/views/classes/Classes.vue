<template>
  <v-card class="mx-auto">
    <v-sheet class="pa-3 indigo lighten-2">
      <v-row align="center" no-gutters>
        <v-col xs="12" md="7" sm="7" lg="7" xl="7">
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
        <v-col xs="12" md="2" sm="2" lg="2" xl="2">
          <div class="text-center">
            <v-btn @click="processaPesquisa()">
              <v-icon left>search</v-icon>Pesquisar
            </v-btn>
          </div>
        </v-col>
        <v-col xs="12" md="3" sm="3" lg="3" xl="3">
          <div class="text-center">
            <v-btn
              @click="
                search = '';
                showClasses = false;
              "
            >
              <v-icon left>filter_list</v-icon>Pesquisa Avançada
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-row align="center" no-gutters v-if="showClasses">
      <v-col>
        <v-card-text>
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
                <v-btn
                  text
                  depressed
                  @click="$router.push('/classes/consultar/c' + item.id)"
                >
                  {{ item.name }}
                </v-btn>
                <br />
              </template>
            </v-treeview>
          </div>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-card-text>
          <v-row v-for="(campo, index) in camposUsados" :key="index">
            <v-col cols="5">
              <v-autocomplete
                :items="camposPesquisa"
                label="Campo a pesquisar"
                v-model="camposUsados[index].campo"
              />
            </v-col>
            <v-col cols="5" v-if="camposUsados[index].campo">
              <div v-if="camposUsados[index].campo.enum.length > 0">
                <v-autocomplete
                  :items="camposUsados[index].campo.enum"
                  label="Valor a pesquisar"
                  v-model="camposUsados[index].valor"
                />
              </div>
              <div v-else>
                <v-text-field
                  label="Valor a pesquisar"
                  v-model="camposUsados[index].valor"
                />
              </div>
            </v-col>
            <v-col>
              <v-select
                :items="opLogicas"
                v-model="conetor"
                @input="
                  camposUsados.push({ campo: null, valor: '' });
                  opLogicas = [conetor];
                "
              />
            </v-col>
            <v-col cols="1" v-if="camposUsados.length > 1">
              <v-btn text @click="camposUsados.splice(index, 1)">
                <v-icon dark color="error">remove_circle_outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer />
            <v-btn
              class="mx-2"
              dark
              color="indigo accent-4"
              @click="cancelarPesquisa"
            >
              Cancelar
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
export default {
  data: () => ({
    showClasses: true,
    conetor: "E",
    opLogicas: ["E", "OU"],
    camposUsados: [{ campo: null, valor: "" }],
    camposPesquisa: [
      { text: "Código", value: { nome: "id", enum: [] } },
      { text: "Título", value: { nome: "titulo", enum: [] } },
      {
        text: "Estado",
        value: {
          nome: "status",
          enum: [
            { text: "Ativa", value: "A" },
            { text: "Inativa", value: "I" },
            { text: "Harmonização", value: "H" }
          ]
        }
      },
      { text: "Descrição", value: { nome: "descricao", enum: [] } },
      { text: "Notas de Aplicação", value: { nome: "na", enum: [] } },
      {
        text: "Exemplos de Notas de Aplicação",
        value: { nome: "exemploNa", enum: [] }
      },
      { text: "Notas de Exclusão", value: { nome: "ne", enum: [] } },
      { text: "Termos de Índice", value: { nome: "ti", enum: [] } },
      { text: "PCA", value: { nome: "pca", enum: [] } },
      {
        text: "DF",
        value: {
          nome: "df",
          enum: [
            { text: "Conservação", value: "C" },
            { text: "Conservação Parcial", value: "CP" },
            { text: "Eliminação", value: "E" }
          ]
        }
      }
    ],
    classesTree: [],
    classesOriginal: [],
    classesCarregadas: false,
    search: null,
    selected: [],
    selectedParents: []
  }),
  created: async function() {
    var myClasses = await this.$request("get", "/api/classes?info=completa");
    this.classesTree = await this.preparaTree(myClasses.data);
    this.classesOriginal = this.classesTree;
    this.classesCarregadas = true;
  },
  methods: {
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

    cancelarPesquisa: function() {
      this.classesTree = this.classesOriginal;
      this.selected = [];
      this.selectedParents = [];
      this.camposUsados = [{ campo: null, valor: "" }];
      this.opLogicas = ["E", "OU"];
      this.conetor = "E";
      this.showClasses = true;
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
            statAux = classes[i][c.campo.nome] == c.valor;
          } else {
            statAux = classes[i][c.campo.nome].indexOf(c.valor) > -1;
          }

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
      var classesFiltradas = JSON.parse(JSON.stringify(this.classesOriginal));
      this.selected = [];
      this.selectedParents = [];

      for (let c of this.camposUsados) {
        c.valor = c.valor.toLowerCase();
      }

      if (this.conetor == "E") {
        classesFiltradas = await this.advancedFilter(classesFiltradas, true);
      } else if (this.conetor == "OU") {
        classesFiltradas = await this.advancedFilter(classesFiltradas, false);
      }

      this.classesTree = classesFiltradas;
      this.camposUsados = [{ campo: null, valor: "" }];
      this.opLogicas = ["E", "OU"];
      this.conetor = "E";
      this.showClasses = true;
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
    preparaTree: async function(lclasses) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo + " - " + lclasses[i].titulo,
            titulo: lclasses[i].titulo.toLowerCase(),
            status: lclasses[i].status.toLowerCase(),
            na: lclasses[i].notasAp
              .map(n => n.nota)
              .join(" ")
              .toLowerCase(),
            exemploNa: lclasses[i].exemplosNotasAp
              .map(e => e.exemplo)
              .join(" ")
              .toLowerCase(),
            ne: lclasses[i].notasEx
              .map(n => n.nota)
              .join(" ")
              .toLowerCase(),
            ti: lclasses[i].termosInd
              .map(t => t.termo)
              .join(" ")
              .toLowerCase(),
            pca: lclasses[i].pca.valores.toLowerCase(),
            df: lclasses[i].df.valor.toLowerCase(),
            children: await this.preparaTree(lclasses[i].filhos)
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
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
