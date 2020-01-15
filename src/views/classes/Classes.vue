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
            <v-btn >
              <v-icon left>search</v-icon>Pesquisa Avançada
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-row align="center" no-gutters>
      <v-col>
        <v-card-text>
          <div v-if="classesCarregadas">
            <v-treeview
              hoverable
              multiple-active
              :items="classesTree"
              item-key="id"
              :search="realSearch"
              :filter="filter"
              :open="selectedParents"
              :active="selected"
            >
              <template slot="label" slot-scope="{ item }">
                <v-btn
                  text
                  depressed
                  @click="$router.push('/classes/consultar/c' + item.id)"
                >{{ item.name }}</v-btn>
                <br />
              </template>
            </v-treeview>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    classesTree: [],
    classesCarregadas: false,
    search: null,
    realSearch: null,
    myIndice: [],
    selected: [],
    selectedParents: []
  }),
  mounted: async function() {
    var myClasses = await this.$request("get", "/api/classes");
    var myIndice = await this.$request("get", "/api/indicePesquisa");
    this.classesTree = await this.preparaTree(myClasses.data, myIndice.data);
    this.classesCarregadas = true;
  },
  methods: {
    addActive: function(code) {
      this.selected.push(code);
    },
    buscarpais: function(code) {
      let levelIds = code.split(".");
      let iter = levelIds.length;

      for (let i = 0; i < iter; i++) {
        levelIds.splice(levelIds.length - 1, 1);
        this.selectedParents.push(levelIds.join("."));
      }
    },
    processaPesquisa: function() {
      if (this.search != "" && this.search != null) {
        this.selected = [];
        this.selectedParents = [];
        this.realSearch = this.search;
      } else {
        this.realSearch = null;
      }
    },
    preparaTree: async function(lclasses, linfo) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          var infoIndex = linfo.findIndex(c => c.codigo == lclasses[i].codigo);
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo + " - " + linfo[infoIndex].titulo,
            titulo: linfo[infoIndex].titulo.toLowerCase(),
            notas: linfo[infoIndex].notas.join(" ").toLowerCase(),
            exemplos: linfo[infoIndex].exemplos.join(" ").toLowerCase(),
            tis: linfo[infoIndex].tis.join(" ").toLowerCase(),
            children: await this.preparaTree(lclasses[i].filhos, linfo)
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
        this.realSearch = null;
      }
    }
  },
  computed: {
    filter() {
      return (item, queryText, itemText) => {
        const codigo = item.id;
        const titulo = item.titulo;
        const notas = item.notas;
        const exemplos = item.exemplos;
        const tis = item.tis;
        const searchText = queryText.toLowerCase();

        if (
          codigo.indexOf(searchText) > -1 ||
          titulo.indexOf(searchText) > -1 ||
          notas.indexOf(searchText) > -1 ||
          exemplos.indexOf(searchText) > -1 ||
          tis.indexOf(searchText) > -1
        ) {
          this.addActive(item.id);
          this.buscarpais(item.id);

          if (item.children[0]) {
            return 0;
          } else {
            return 1;
          }
        } else {
          return 0;
        }
      };
    }
  }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>