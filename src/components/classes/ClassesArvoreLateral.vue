<template>
  <v-card>
    <v-sheet class="indigo lighten-2">
      <v-text-field
        v-model="search"
        label="Pesquisa por código ou título"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <div v-if="classesCarregadas">
        <v-treeview
          :items="classesTree"
          item-key="id"
          :search="search"
          :filter="filter"
        >
          <template slot="label" slot-scope="{ item }">
            <a @click="go(item.id)"> {{ item.name }} </a>
          </template>
        </v-treeview>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    classesTree: [],
    classesCarregadas: false,
    search: null
  }),

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/classes");
      this.classesTree = await this.preparaTree(response.data);
      this.classesCarregadas = true;
    } catch (e) {
      console.log(e);
    }
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/classes/consultar/c" + idClasse);
      this.$router.go();
    },
    preparaTree: async function(lclasses) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo,
            children: await this.preparaTree(lclasses[i].filhos)
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
      return (item, search, textKey) => item[textKey].indexOf(search) > -1;
    }
  }
};
</script>
