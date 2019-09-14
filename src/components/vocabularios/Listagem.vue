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
            Adicionar um Vocabulário Controlado
          </v-card-title>
          <v-card-text>
            <v-text-field
                    v-model="novoVC.id"
                    :rules="[v => !!v || 'Identificador Obrigatório']"
                    label="Identificador"
                    type="text"
                    required
                  ></v-text-field>
            <v-text-field
                    v-model="novoVC.label"
                    :rules="[v => !!v || 'Legenda Obrigatória']"
                    label="Legenda"
                    type="text"
                    required
                  ></v-text-field>
            <v-text-field
                    v-model="novoVC.desc"
                    :rules="[v => !!v || 'Descrição Obrigatória']"
                    label="Descrição"
                    type="text"
                    required
                  ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="novoVC= {}; dialog = false">Fechar</v-btn>
            <v-btn color="green darken-1" text @click="criarVC">Guardar</v-btn>
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
            <v-btn @click="guardarProp(props.item)" text>Editar</v-btn>
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
          <v-card-title class="headline">Edição de Vocabulário Controlado</v-card-title>
          <v-card-text>
            <v-text-field
                    v-model="updateVC.id"
                    :rules="[v => !!v || 'Identificador Obrigatório']"
                    label="Identificador"
                    type="text"
                    disabled
                    required
                  ></v-text-field>
            <v-text-field
                    v-model="updateVC.label"
                    :rules="[v => !!v || 'Legenda Obrigatória']"
                    label="Legenda"
                    type="text"
                    required
                  ></v-text-field>
            <v-text-field
                    v-model="updateVC.desc"
                    :rules="[v => !!v || 'Descrição Obrigatória']"
                    label="Descrição"
                    type="text"
                    required
                  ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="updateVC= {}; dialog2 = false">Fechar</v-btn>
            <v-btn color="green darken-1" text @click="editarVC(updateVC.id)">Guardar</v-btn>
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
        @click="snack = false;"
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
    novoVC: {},
    snack: false,
    mess: "",
    snackColor: "",
    updateVC: {}
  }),
  methods: {
    go: function(id) {
      switch (this.tipo) {
        case "Vocabulários Controlados":
          this.$router.push("/vocabularios/" + id);
          break;
      }
    },
    guardarProp: function(item) {
      this.updateVC = {
        id: item.id,
        label: item.label,
        desc: item.desc
      }
      this.dialog2 = true
    },
    criarVC: async function() {
      await axios.post(lhost + "/api/vocabularios/", this.novoVC)
        .then(res => {
          this.snack = true
          this.mess = res.data.mensagem
          this.snackColor = "green"
          this.lista = this.lista.push(this.novoVC)
          this.novoVC = {}
          this.dialog = false
        })
        .catch((err) => {
          this.snack = true
          this.mess = "Erro na adição do VC"
          this.snackColor = "red"
          this.novoVC = {}
          this.dialog = false
        })
    },
    editarVC: async function(id) {
      await axios.put(lhost + "/api/vocabularios/"+id, this.updateVC)
        .then(res => {
          this.snack = true
          this.mess = res.data.mensagem
          this.snackColor = "green"
          this.lista[this.lista.findIndex(obj => obj.id == id)].label = this.updateVC.label
          this.lista[this.lista.findIndex(obj => obj.id == id)].desc = this.updateVC.desc
          this.updateVC = {}
          this.dialog2 = false
        })
        .catch((err) => {
          this.snack = true
          this.mess = "Erro na atualização do VC"
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
