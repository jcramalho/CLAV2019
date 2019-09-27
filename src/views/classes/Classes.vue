<template>
  <v-card class="mx-auto">
    <v-sheet class="pa-3 indigo lighten-2">
      <v-row align="center" no-gutters>
        <v-col cols="12" xs="12" md="10" sm="10" lg="10" xl="10">
          <v-text-field
            v-model="search"
            label="Pesquisa por código, título, notas de aplicação, exemplos de notas de aplicação ou termos de índice"
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
    <v-card-text>
      <div v-if="classesCarregadas">
        <v-treeview :items="classesTree" item-key="id" hoverable>
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
  </v-card>
</template>

<script>
export default {
  data: () => ({
    classesTree: [],
    classesCarregadas: false,
    search: null
  }),

  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/classes");
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
    }
  }
};
</script>

<style scoped>
.v-btn:hover:before {
  opacity: 0;
}
</style>
