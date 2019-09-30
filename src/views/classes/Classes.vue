<template>
  <v-card class="mx-auto">
    <v-sheet class="pa-3 indigo lighten-2">
      <v-row v-if="!searchType" align="center" no-gutters>
        <v-col xs="12" md="12" sm="12" lg="12" xl="12">
          <v-text-field
            v-model="searchName"
            label="Filtrar por código e título..."
            dark
            solo-inverted
            hide-details
            clearable
            clear-icon="delete_forever"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-else align="center" no-gutters>
        <v-col xs="12" md="10" sm="10" lg="10" xl="10">
          <v-text-field
            v-model="search"
            label="Pesquisar por notas de aplicação, exemplos de notas de aplicação ou termos de índice..."
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
            <v-btn @click="procuraProcesso()">
              <v-icon left>search</v-icon>Pesquisar
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-row align="center" no-gutters>
      <v-col>
        <v-card-text>
          <div v-if="classesCarregadas">
            <v-switch
              @change="changeSearch()"
              v-model="searchType"
              class="ma-1"
              :label="switchLabel"
            ></v-switch>

            <v-treeview :items="classesTree" item-key="id" :search="searchName" hoverable>
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
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    switchLabel: "Pesquisar por NA, ENA ou TI.",
    searchType: false,
    classesTree: [],
    classesCarregadas: false,
    search: null,
    searchName: null
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
    preparaTree: async function(lclasses) {
      try {
        var myTree = [];
        for (var i = 0; i < lclasses.length; i++) {
          myTree.push({
            id: lclasses[i].codigo,
            name: lclasses[i].codigo + " - " + lclasses[i].titulo,
            children: await this.preparaTree(lclasses[i].filhos)
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
    },
    procuraProcesso: function() {
      if (this.search != null && this.search != "") {
        this.$router.push("/classes/procurar/" + this.search);
      }
    },
    changeSearch: function() {
      if (this.searchType) {
        this.searchName = null;
      } else {
        this.search = null;
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
