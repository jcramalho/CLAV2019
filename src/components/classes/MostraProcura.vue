<template>
  <v-card class="mx-auto" v-if="this.search != null">
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
      <div>
        <v-toolbar flat>
          <v-toolbar-title><h4>Resultados da pesquisa para "<i>{{this.searchword}}</i>":</h4></v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list>
          <v-list-item-group color="primary" v-if="searchResult[0]">
            <v-list-item v-for="(item, i) in this.searchResult" :key="i">
              <v-list-item-content @click="$router.push('/classes/consultar/' + item.codigo)">
                <v-list-item-title><span class="indigo--text">{{item.codigo.split('c')[1]}}</span> - {{item.titulo}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-item-group color="primary" v-else>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><br>Não foram encontrados resultados para a pesquisa...<br><br></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <br>
      </div>
      <div class="text-center">
        <v-btn class="mx-2" dark medium color="indigo darken-4" @click="$router.go(-1);$router.go()">Voltar</v-btn>
        <v-btn class="mx-2" dark medium color="indigo darken-4" @click="$router.push('/classes')">Consultar a Lista Consolidada</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>        

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    motorBusca: [],
    searchResult: [],
    search: null,
    searchword: "",
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    }
  }),

  mounted: async function() {
      
    await axios.get(lhost + "/api/indiceInvertido").then(response => {
      this.motorBusca = response.data;
    });

    
    this.search = this.$route.params.id;
    this.searchword = this.search

    this.searchResult = [];

    for (let i = 0; i < this.motorBusca.length; i++) {
      let found = this.searchResult.find(element => {
        if (this.motorBusca[i].processo.codigo == element.codigo) {
          return 1;
        }
      });

      if (
        found == undefined &&
        this.motorBusca[i].chave.includes(this.$route.params.id)
      ) {
        this.searchResult.push(this.motorBusca[i].processo);
      }
    }
    
  },
  methods: {
    procuraProcesso: function() {
      if (this.search != "" && this.search != null) {
  
        this.searchResult = [];

        for (let i = 0; i < this.motorBusca.length; i++) {
          let found = this.searchResult.find(element => {
            if (this.motorBusca[i].processo.codigo == element.codigo) {
              return 1;
            }
          });

          if (
            found == undefined &&
            this.motorBusca[i].chave.includes(this.search)
          ) {
            this.searchResult.push(this.motorBusca[i].processo);
          }
        }
        this.searchword = this.search
        this.$router.push('/classes/procurar/' + this.search)
        
      } else {
        this.$router.push('/classes')
      }
      
    }
  }
};
</script>