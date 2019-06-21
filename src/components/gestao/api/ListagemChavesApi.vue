<template>
  <v-content>
    <v-card>
      <v-card-title>
        <h1>Listagem de Chaves API</h1>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="registo">
              <v-icon large color="primary">person_add</v-icon>
            </v-btn>
          </template>
          <span>Adicionar nova chave API</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filtrar"
          single-line
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="chaves"
        :search="search"
        class="elevation-1"
        :rows-per-page-items="[10, 20, 50]"
        rows-per-page-text="Mostrar"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Não foram encontrados resultados para "{{ search }}" .
          </v-alert>
        </template>
        <template v-slot:items="props">
          <tr>
            <td class="subheading">{{format(props.item.key)}}</td>
            <td class="subheading">{{ props.item.name }}</td>
            <td class="subheading">{{ props.item.entity }}</td>
            <td class="subheading">{{ props.item.contactInfo }}</td>
            <td class="subheading">{{ props.item.active }}</td>
            <!-- <td class="subheading">{{ props.item.nCalls }}</td> -->
            <!-- <td class="subheading">{{ props.item.lastUsed }}</td> -->
            <td class="subheading">{{ props.item.created }}</td>
            <td class="subheading">{{ props.item.expiration }}</td>
            <td class="subheading">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="editar(props.item)">
                    <v-icon medium color="primary">edit</v-icon>
                  </v-btn>
                </template>
                <span>Editar chave API</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Editar Chave API</span>
          <v-spacer></v-spacer><v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="confirmacaoRenovar = true" disabled>
                <v-icon color="primary">refresh</v-icon>
                <v-dialog v-model="confirmacaoRenovar" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Confirmar ação</v-card-title>
                    <v-card-text>Tem a certeza que pretende renovar a chave API?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" flat @click="confirmacaoRenovar = false">Cancelar</v-btn>
                      <v-btn color="primary" flat @click="renovar(editedItem); confirmacaoRenovar=false; dialog = false">Confirmar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
              </template>
            <span>Renovar chave API</span>
          </v-tooltip>
          <v-tooltip bottom v-if="editedItem.active=='Sim'">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="confirmacaoDesativar = true">
                <v-icon color="grey darken-2">lock</v-icon>
                <v-dialog v-model="confirmacaoDesativar" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Confirmar ação</v-card-title>
                    <v-card-text>Tem a certeza que pretende desativar a chave API?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" flat @click="confirmacaoDesativar = false">Cancelar</v-btn>
                      <v-btn color="primary" flat @click="desativar(editedItem); confirmacaoDesativar=false; dialog = false">Confirmar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </template>
            <span>Desativar chave API</span>
          </v-tooltip>
          <v-tooltip bottom v-if="editedItem.active=='Não'">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="confirmacaoDesativar = true">
                <v-icon color="grey darken-2">lock_open</v-icon>
                <v-dialog v-model="confirmacaoDesativar" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Confirmar ação</v-card-title>
                    <v-card-text>Tem a certeza que pretende ativar a chave API?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" flat @click="confirmacaoDesativar = false">Cancelar</v-btn>
                      <v-btn color="primary" flat @click="ativar(editedItem); confirmacaoDesativar=false; dialog = false">Confirmar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </template>
            <span>Ativar chave API</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="confirmacaoEliminar = true">
                <v-icon color="red">delete</v-icon>
                <v-dialog v-model="confirmacaoEliminar" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Confirmar ação</v-card-title>
                    <v-card-text>Tem a certeza que pretende eliminar a chave API?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" flat @click="confirmacaoEliminar = false">Cancelar</v-btn>
                      <v-btn color="primary" flat @click="eliminar(editedItem); confirmacaoEliminar=false; dialog = false">Confirmar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
              </template>
            <span>Eliminar chave API</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field prepend-icon="vpn_key" v-model="editedItem.key" label="Chave API" disabled></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field prepend-icon="person" v-model="editedItem.name" label="Nome" :rules="regraNome" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field prepend-icon="email" v-model="editedItem.contactInfo" label="Email" :rules="regraEmail" required></v-text-field>
                </v-flex>
                 <v-flex xs12 sm6 md12>
                  <v-text-field prepend-icon="account_balance" v-model="editedItem.entity" label="Entidade" :rules="regraEntidade" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" flat @click="guardar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      :top="true"
      >
      {{ text }}
      <v-btn flat @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    regraNome: [v => !!v || "Nome é obrigatório."],
    regraEntidade: [v => !!v || "Entidade é obrigatório."],
    regraEmail: [
      v => !!v || "Email é obrigatório.",
      v => /.+@.+/.test(v) || "Email tem de ser válido."
    ],
    search: "",
    editedIndex: -1,
    editedItem: {
      key: '',
      name: '',
      contactInfo: '',
      entity: '',
      active: ''
    },
    headers: [
      {
        text: "Chave",
        sortable: true,
        value: "key",
        class: "title"
      },
      {
        text: "Nome",
        sortable: true,
        value: "name",
        class: "title"
      },
      {
        text: "Entidade",
        sortable: true,
        value: "entity",
        class: "title"
      },
      {
        text: "Contacto",
        sortable: true,
        value: "contactInfo",
        class: "title"
      },
      {
        text: "Ativa?",
        sortable: true,
        value: "active",
        class: "title"
      },
      // {
      //   text: "Utilizações",
      //   sortable: true,
      //   value: "nCalls",
      //   class: "title"
      // },
      // { 
      //   text: "Ultima utilização", 
      //   sortable: true,
      //   value: "lastUsed",
      //   class: "title"
      // },
      { 
        text: "Data Criação", 
        sortable: true,
        value: "created",
        class: "title"
      },
      { 
        text: "Data Expiração", 
        sortable: true,
        value: "expiration",
        class: "title"
      },
      { 
        text: "Ações", 
        sortable: false,
        value: '',
        class: "title"
      }
    ],
    dialog: false,
    confirmacaoDesativar: false,
    confirmacaoEliminar: false,
    confirmacaoRenovar: false,
    chaves: [],
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: ""
  }),
  async created() {
    await this.getChavesApi();
  },
  methods: {
    async getChavesApi(){
      try {
        var response = await axios.get(lhost + "/api/chaves/listagem");
        this.chaves = response.data;
      } catch (e) {
        return e;
      }
    },
    editar(item) {
      this.editedIndex = this.chaves.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    desativar(item) {
      axios.post(lhost + "/api/chaves/desativar", {
        id: item.id
      }).then(res => {
        if (res.data === "Chave API desativada com sucesso!") {
          this.text = "Chave API desativada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getChavesApi();
        }else{
          this.text = "Ocorreu um erro ao desativar a chave API!";
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }
      }).catch(function(err) {
        this.text = err;
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      });
    },
    ativar(item) {
      axios.post(lhost + "/api/chaves/ativar", {
        id: item.id
      }).then(res => {
        if (res.data === "Chave API ativada com sucesso!") {
          this.text = "Chave API ativada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getChavesApi();
        }else{
          this.text = "Ocorreu um erro ao ativar a chave API!";
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }
      }).catch(function(err) {
        this.text = err;
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      });
    },
    eliminar(item) {
      axios.post(lhost + "/api/chaves/eliminar", {
        id: item.id
      }).then(res => {
        if (res.data === "Chave API eliminada com sucesso!") {
          this.text = "Chave API eliminada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getChavesApi();
        }else{
          this.text = "Ocorreu um erro ao eliminar a chave API!";
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }
      }).catch(function(err) {
        this.text = err;
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      });
    },
    renovar(item) {
      alert("TODO")
    },
    guardar(){
      if (this.$refs.form.validate()) {
        axios.put(lhost + "/api/chaves/atualizarMultiplos", {
          id: this.editedItem.id,
          name: this.editedItem.name,
          contactInfo: this.editedItem.contactInfo,
          entity: this.editedItem.entity
        }).then(res => {
          if (res.data === "Chave API atualizada com sucesso!") {
            this.text = "Chave API atualizada com sucesso!";
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getChavesApi();
          }else{
            this.text = "Ocorreu um erro ao atualizar a chave API!";
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          }
        }).catch(function(err) {
          this.text = err;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
      } else {
        this.text = "Por favor verifique se preencheu todos os campos!";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getChavesApi();
    },
    registo(){
      this.$router.push('/gestao/api/registo')
    },
    format(key){
      return key.substring(15, 25)+'...';
    }
  }
};
</script>