<template>
  <v-card class="mx-auto">
    <v-sheet class="pa-3 indigo lighten-2">
      <v-row align="center" no-gutters>
        <v-col xs="12" md="10" sm="10" lg="10" xl="10">
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
            <v-treeview
              multiple-active
              :open="selectedParents"
              :items="classesTree"
              item-key="id"
              hoverable
              :active="this.searchResult"
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
    searchResult: [],
    motorBusca: [],
    selectedParents: []
  }),
  mounted: async function() {
    var response = await this.$request("get", "/api/classes");
    this.classesTree = await this.preparaTree(response.data);

    this.classesCarregadas = true;
  },
  methods: {
    buscarpais: function(code) {
      let levelIds = code.split(".");
      let iter = levelIds.length;

      for (let i = 0; i < iter; i++) {
        levelIds.splice(levelIds.length - 1, 1);
        this.selectedParents.push(levelIds.join("."));
      }
    },
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
    procuraProcesso: async function() {
      if (this.search != "" && this.search != null) {
        
        if (!this.motorBusca[0]) {
          await this.$request("get", "/api/indiceInvertido").then(response => {
            this.motorBusca = response.data;
          });
        }
        this.searchResult = [];
        this.selectedParents = [];

        for (let i = 0; i < this.motorBusca.length; i++) {
          
          if (this.motorBusca[i].chave.toLowerCase().includes(this.search.toLowerCase())) {
            
            let code = this.motorBusca[i].processo.codigo.split("c");
            
            if (code[1]) {
              this.searchResult.push(code[1]);
              this.buscarpais(code[1]);
            } else {
              this.searchResult.push(code[0]);
              this.buscarpais(code[0]);
            }
          }
        }
        
      } else {
        this.selectedParents = [];
        this.searchResult = [];
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