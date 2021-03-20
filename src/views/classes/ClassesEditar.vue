<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <v-container fluid class="pa-0 ma-0" style="max-width: 100%">
      <v-row>
        <v-col class="pt-0">
          <v-card flat style="border-radius: 10px !important">
            <p
              class="content-title-1 py-5"
              style="color: #4da0d0 !important; text-align: center"
            >
              Alterar Classe
            </p>
            <v-row justify="center" class="text-center mx-0">
              <v-col class="mt-4">
                <div
                  class="info-content"
                  :class="{
                    'margin-mdUp': $vuetify.breakpoint.mdAndUp,
                    'margin-smDown': $vuetify.breakpoint.smAndDown,
                  }"
                >
                  <v-tooltip top color="info" open-delay="500">
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        style="text-align: center !important"
                        class="centered-input mt-n1 mb-2 px-8"
                        v-model="search"
                        v-on="on"
                        label="Pesquisar por código, título, notas de aplicação, exemplos de notas de aplicação ou termos de índice..."
                        text
                        hide-details
                        single-line
                        clearable
                        v-on:keyup.enter="processaPesquisa()"
                        color="blue darken-3"
                      ></v-text-field>
                    </template>
                    <span
                      >Pesquisar por código, título, notas de aplicação, exemplos de notas
                      de aplicação ou termos de índice...</span
                    >
                  </v-tooltip>
                </div>
                <v-btn
                  @click="processaPesquisa()"
                  rounded
                  class="white--text clav-linear-background"
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
                <v-card-text class="mt-12 text-left" id="treeview-card">
                  <div v-if="classesCarregadas">
                    <v-treeview
                      rounded
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
                        <v-tooltip bottom color="info" open-delay="500">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              v-on="on"
                              rounded
                              text
                              color="blue"
                              @click="$router.push('/classes/editar/c' + item.id)"
                            >
                              {{ item.name }}
                            </v-btn>
                          </template>
                          <span> {{ item.name }} </span>
                        </v-tooltip>
                        <br />
                      </template>
                    </v-treeview>
                    <!--
                    <v-alert
                      type="info"
                      class="font-weight-medium my-auto"
                      style="background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;"
                      :value="classesTree.length == 0"
                    >
                      Sem resultados. Volte a pesquisar...
                    </v-alert>-->
                  </div>
                  <Loading v-else :message="'classes'" />
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
  components: { Loading },
  data: () => ({
    classesTree: [],
    classesCarregadas: false,
    search: null,
    realSearch: null,
    myIndice: [],
    selected: [],
    selectedParents: [],
  }),
  mounted: async function () {
    var myClasses = await this.$request("get", "/classes");
    var myIndice = await this.$request("get", "/indicePesquisa");
    this.classesTree = await this.preparaTree(myClasses.data, myIndice.data);
    this.classesCarregadas = true;
  },
  methods: {
    addActive: function (code) {
      this.selected.push(code);
    },
    buscarpais: function (code) {
      let levelIds = code.split(".");
      let iter = levelIds.length;

      for (let i = 0; i < iter; i++) {
        levelIds.splice(levelIds.length - 1, 1);
        this.selectedParents.push(levelIds.join("."));
      }
    },
    processaPesquisa: function () {
      if (this.search != "" && this.search != null) {
        this.selected = [];
        this.selectedParents = [];
        this.realSearch = this.search;
      } else {
        this.realSearch = null;
      }
    },
    preparaTree: async function (lclasses, linfo) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          var infoIndex = linfo.findIndex((c) => c.codigo == lclasses[i].codigo);
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo + " - " + linfo[infoIndex].titulo,
            titulo: linfo[infoIndex].titulo.toLowerCase(),
            notas: linfo[infoIndex].notas.join(" ").toLowerCase(),
            exemplos: linfo[infoIndex].exemplos.join(" ").toLowerCase(),
            tis: linfo[infoIndex].tis.join(" ").toLowerCase(),
            children: await this.preparaTree(lclasses[i].filhos, linfo),
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
    },
  },
  watch: {
    search: function (newValue) {
      if (newValue == "" || newValue == null) {
        this.selected = [];
        this.selectedParents = [];
        this.realSearch = null;
      }
    },
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
    },
  },
};
</script>

<style scoped>
#text-field {
  text-align: center !important;
}
.centered-input >>> input {
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
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
#treeview-card {
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.32);
  border-radius: 10px;
  background-color: #f4f5f7;
}
</style>
