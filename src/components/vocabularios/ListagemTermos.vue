<template>
  <v-card>
    <v-card-title>
      <h1>{{ tipo }}</h1>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar"
        single-line
        hide-details
      ></v-text-field>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="ml-4" fab dark small color="indigo">
            <v-icon dark>add</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Adicionar novo Termo a Vocabulário Controlado ({{this.$route.params.idVC}})
          </v-card-title>
          <v-card-text>
            <v-text-field
                    v-model="novoTermo.idtermo"
                    :rules="[v => !!v || 'Nome do Identificador Obrigatório']"
                    label="Nome para Identificador"
                    type="text"
                    required
                  ></v-text-field>
            <v-text-field
                    v-model="novoTermo.termo"
                    :rules="[v => !!v || 'Termo Obrigatória']"
                    label="Termo"
                    type="text"
                    required
                  ></v-text-field>
            <v-text-field
                    v-model="novoTermo.desc"
                    :rules="[v => !!v || 'Descrição Obrigatória']"
                    label="Descrição"
                    type="text"
                    required
                  ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="novoTermo={}; dialog = false">Fechar</v-btn>
            <v-btn color="green darken-1" text @click="criarTermo">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="lista"
      :search="search"
      class="elevation-1"
      :rows-per-page-items="[10, 20, 100]"
      rows-per-page-text="Mostrar"
      v-if="listaReady"
      :disable-initial-sort="true"
    >
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Não foram encontrados resultados para "{{ search }}" .
        </v-alert>
      </template>
      <template v-slot:items="props">
        <tr>
          <td @click="go(props.item.id)" v-for="(campo, index) in props.item" v-bind:key="index">
            {{ campo }}
          </td>
          <td>
            <v-btn @click="eliminarProp(props.item)" text>Apagar</v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:pageText="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
    <v-dialog v-model="dialog2" max-width="600px">
        <v-card>
          <v-card-title class="headline">Remover Termo de Vocabulário Controlado</v-card-title>
          <v-card-text>
            O termo <b>{{deleteTerm}}</b> será permanentemente apagado do Vocabulário Controlado.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteTerm=''; deleteIdTerm=''; dialog2 = false">Fechar</v-btn>
            <v-btn color="red darken-1" text @click="apagarTermo(deleteIdTerm)">Apagar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    <v-snackbar
      v-model="snack"
      :color="snackColor"
    >
      {{ mess }}
      <v-btn
        dark
        text
        @click="snack = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  props: ["lista", "tipo", "cabecalho", "campos", "ids"],
  data: () => ({
    search: "",
    listaReady: false,
    headers: [],
    dialog: false,
    dialog2: false,
    novoTermo: {},
    snack: false,
    mess: "",
    snackColor: "",
    deleteTerm: "",
    deleteIdTerm: ""
  }),
  methods: {
    eliminarProp: function(item) {
      this.deleteTerm = item.termo
      this.deleteIdTerm = item.idtermo
      this.dialog2 = true
    },
    criarTermo: async function() {
      await axios.post(lhost + "/api/vocabularios/termo/"+this.$route.params.idVC, this.novoTermo)
        .then(res => {
          this.snack = true
          this.mess = res.data.mensagem
          this.snackColor = "green"
          this.novoTermo.idtermo = this.$route.params.idVC+"_"+this.novoTermo.idtermo
          this.lista = this.lista.push({
            termo: this.novoTermo.termo,
            desc: this.novoTermo.desc,
            idtermo: this.novoTermo.idtermo
          })
          this.novoTermo = {}
          this.dialog = false
        })
        .catch((err) => {
          this.snack = true
          this.mess = "Erro na adição do "+this.novoTermo.termo+" ao Vocabulário Controlado "+this.$router.params.idVC
          this.snackColor = "red"
          this.novoTermo = {}
          this.dialog = false
        })
    },
    apagarTermo: async function(id) {
      await axios.delete(lhost + "/api/vocabularios/termo/"+id)
        .then(res => {
          this.snack = true
          this.mess = res.data.mensagem
          this.snackColor = "green"
          this.updateVC = {}
          this.dialog2 = false
          this.lista = this.lista.filter(function(obj){ return obj.idtermo != id})
        })
        .catch((err) => {
          this.snack = true
          this.mess = "Erro na remoção do Termo de VC"
          this.snackColor = "red"
          this.updateVC = {}
          this.dialog2 = false
        })
    }
  },
  mounted: async function() {
    try {
      for (var i = 0; i < this.cabecalho.length; i++) {
        this.headers[i] = {
          text: this.cabecalho[i],
          value: this.campos[i]
        };
      }
      this.headers[i] = {
        text: "Ação"
      }
    } catch (e) {
      return e;
    }
    this.listaReady = true;
  }
};
</script>
