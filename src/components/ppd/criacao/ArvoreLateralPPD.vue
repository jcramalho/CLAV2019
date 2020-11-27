<template>
  <v-card>
    <v-sheet class="indigo lighten-2">
      <v-text-field
        v-model="search"
        label="Filtrar por código, título, notas aplic., exemplos de notas ou termos de índice"
        dark
        text
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <div>
        <v-treeview
          dense
          hoverable
          activatable
          :items="arvore"
          :search="search"
          :filter="filter"
        >
          <template slot="label" slot-scope="{ item }">
            <v-btn text depressed @click="go(item.numeroSI)">{{ item.name }}</v-btn>
            <br />
          </template>
        </v-treeview>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["arvore","ppd"],
  data: () => ({
    classesTree: [],
    indiceClasses: [],
    classesCarregadas: false,
    indiceCarregado: false,
    search: null,
    selectedParents: [],

    items: [],

  }),

  created: function() {

  },


  mounted: async function() {
    try {
      var myClasses = await this.$request("get", "/classes");
      var myIndice = await this.$request("get", "/indicePesquisa");
      this.classesTree = await this.preparaTree(myClasses.data, myIndice.data);
      this.classesCarregadas = true;
    } catch (e) {
      //console.log(e);
    }
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/classes/consultar/c" + idClasse);
      this.$router.go();
    },
    preparaTree: async function(lclasses, linfo) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          var infoIndex = linfo.findIndex(c => c.codigo == lclasses[i].codigo);
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo,
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

  computed: {
    filter() {
      return (item, queryText, itemText) => {
        const codigo = item.id;
        const titulo = item.titulo;
        const notas = item.notas;
        const exemplos = item.exemplos;
        const tis = item.tis;
        const searchText = queryText.toLowerCase();

        return (
          codigo.indexOf(searchText) > -1 ||
          titulo.indexOf(searchText) > -1 ||
          notas.indexOf(searchText) > -1 ||
          exemplos.indexOf(searchText) > -1 ||
          tis.indexOf(searchText) > -1
        );
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