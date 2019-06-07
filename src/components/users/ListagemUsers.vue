<template>
  <v-content>
    <v-card>
      <v-card-title>
        <h1>Listagem de Utilizadores</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filtrar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="utilizadores"
        :search="search"
        class="elevation-1"
        :rows-per-page-items="[10, 20, 100]"
        rows-per-page-text="Mostrar"
        :disable-initial-sort="true"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Não foram encontrados resultados para "{{ search }}" .
          </v-alert>
        </template>
        <template v-slot:items="props">
          <tr>
              <td class="subheading">{{ props.item.name }}</td>
              <td class="subheading">{{ props.item.entidade }}</td>
              <td class="subheading">{{ props.item.email }}</td>
              <td class="subheading">{{ props.item.level }}</td>
              <td class="subheading">
                <v-btn icon @click="editItem(props.item)">
                  <v-icon color="primary">edit</v-icon>
                </v-btn>
                <v-btn icon @click="deleteItem(props.item)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
              </td>
          </tr>
        </template>
        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="primary" >
          <span class="headline">Editar utilizador</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md12>
                <v-text-field prepend-icon="person" v-model="editedItem.name" label="Nome de utilizador" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md12>
                <v-text-field prepend-icon="email" v-model="editedItem.email" label="Email" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md12>
                <v-select
                  item-text="label"
                  item-value="value"
                  :items="ent_list"
                  :rules="regraEntidade"
                  prepend-icon="account_balance"
                  v-model="editedItem.entidade"
                  label="Entidade"
                  required
                >
                </v-select>
              </v-flex>
              <v-flex xs12 sm6 md12>
                <v-select
                  :items="[
                    'Administrador de Perfil Tecnológico',
                    'Administrador de Perfil Funcional',
                    'Utilizador Validador',
                    'Utilizador Avançado',
                    'Utilizador Decisor',
                    'Utilizador Simples',
                    'Representante Entidade'
                  ]"
                  :rules="regraTipo"
                  prepend-icon="assignment"
                  v-model="editedItem.level"
                  label="Nível de utilizador"
                  required
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" flat>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    search: "",
    regraNome: [v => !!v || "Nome é obrigatório."],
    regraEmail: [
      v => !!v || "Email é obrigatório.",
      v => /.+@.+/.test(v) || "Email tem de ser válido."
    ],
    regraEntidade: [v => !!v || "Entidade é obrigatório."],
    regraPassword: [v => !!v || "Password é obrigatório."],
    regraTipo: [v => !!v || "Tipo de utilizador é obrigatório."],
    ent_list: [],
    headers: [
      {
        text: "Nome",
        sortable: true,
        value: "nome",
        class: "title"
      },
      {
        text: "Entidade",
        sortable: true,
        value: "entidade",
        class: "title"
      },
      {
        text: "Email",
        sortable: true,
        value: "email",
        class: "title"
      },
      {
        text: "Nível de utilizador",
        sortable: true,
        value: "level",
        class: "title"
      },
      { 
        text: "Ações", 
        class: "title" 
      }
    ],
    dialog: false,
    editedIndex: -1,
    editedItem: {
      nome: '',
      entidade: '',
      email: '',
      level: ''
    },
    utilizadores: [],
  }),
  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/users?formato=normalizado");
      this.utilizadores = response.data;
    } catch (e) {
      return e;
    }
    await axios.get(lhost + "/api/entidades").then(res => {
      this.ent_list = res.data.map(ent => {
        return {
          label: ent.sigla + " - " + ent.designacao,
          value: ent.sigla
        };
      });
    }).catch(error => alert(error));
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.utilizadores.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    }
  }
};
</script>

<style></style>
