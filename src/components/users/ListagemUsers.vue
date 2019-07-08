<template>
  <v-content>
    <v-card>
      <v-card-title>
        <h1>Listagem de Utilizadores</h1>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="registo">
              <v-icon large color="primary">person_add</v-icon>
            </v-btn>
          </template>
          <span>Adicionar novo utilizador</span>
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
        :items="utilizadores"
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
            <td class="subheading">{{ props.item.name }}</td>
            <td class="subheading">{{format(props.item.entidade)}}</td>
            <td class="subheading">{{ props.item.email }}</td>
            <td class="subheading">{{ props.item.level }}</td>
            <td class="subheading">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="editar(props.item)">
                    <v-icon medium color="primary">edit</v-icon>
                  </v-btn>
                </template>
                <span>Editar utilizador</span>
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
          <span class="headline">Editar utilizador</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="confirmacaoDesativar = true">
                <v-icon color="grey darken-2">lock</v-icon>
                <v-dialog v-model="confirmacaoDesativar" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Confirmar ação</v-card-title>
                    <v-card-text>Tem a certeza que pretende desativar o utilizador?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" flat @click="confirmacaoDesativar = false">Cancelar</v-btn>
                      <v-btn color="primary" flat @click="desativar(editedItem); confirmacaoDesativar=false; dialog = false">Confirmar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </template>
            <span>Desativar utilizador</span>
          </v-tooltip>
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="confirmacaoEliminar = true">
                <v-icon color="red">delete</v-icon>
                <v-dialog v-model="confirmacaoEliminar" persistent max-width="290">
                  <v-card>
                    <v-card-title class="headline">Confirmar ação</v-card-title>
                    <v-card-text>Tem a certeza que pretende eliminar o utilizador?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red" flat @click="confirmacaoEliminar = false">Cancelar</v-btn>
                      <v-btn color="primary" flat @click="eliminar(editedItem); confirmacaoEliminar=false; dialog = false">Confirmar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
              </template>
            <span>Eliminar utilizador</span>
          </v-tooltip> -->
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field prepend-icon="person" v-model="editedItem.name" label="Nome de utilizador" :rules="regraNome" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field prepend-icon="email" v-model="editedItem.email" label="Email" :rules="regraEmail" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-autocomplete
                    item-text="label"
                    item-value="value"
                    :items="entidades"
                    :rules="regraEntidade"
                    prepend-icon="account_balance"
                    v-model="editedItem.entidade"
                    label="Entidade"
                    required
                  >
                  </v-autocomplete>
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
                      'Representante Entidade',
                      'Utilizador desativado'
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
    search: "",
    regraNome: [v => !!v || "Nome é obrigatório."],
    regraEmail: [
      v => !!v || "Email é obrigatório.",
      v => /.+@.+/.test(v) || "Email tem de ser válido."
    ],
    regraTipo: [v => !!v || "Tipo de utilizador é obrigatório."],
    ent_list: [],
    headers: [
      {
        text: "Nome",
        sortable: true,
        value: "name",
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
        sortable: false,
        value: '',
        class: "title"
      }
    ],
    dialog: false,
    confirmacaoDesativar: false,
    confirmacaoEliminar: false,
    editedIndex: -1,
    editedItem: {
      nome: '',
      entidade: '',
      email: '',
      level: ''
    },
    utilizadores: [],
    entidades: [],
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: ""
  }),
  async created() {
    await this.getUtilizadores();
    await this.getEntidades();
  },
  methods: {
    async getEntidades() {
      await axios
        .get(lhost + "/api/entidades")
        .then(res => {
          this.entidades = res.data.map(ent => {
            return {
              label: ent.sigla + " - " + ent.designacao,
              value: ent.sigla
            };
          });
        })
        .catch(error => alert(error));
    },
    async getUtilizadores(){
      try {
        var response = await axios.get(lhost + "/api/users?formato=normalizado");
        this.utilizadores = response.data;
      } catch (e) {
        return e;
      }
    },
    editar(item) {
      this.editedIndex = this.utilizadores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.entidade = this.editedItem.entidade.split('_')[1];
      this.dialog = true;
    },
    desativar(item) {
      axios.post(lhost + "/api/users/desativar", {
        token: this.$store.state.token,
        id: item.id
      }).then(res => {
        if (res.data === "Utilizador desativado com sucesso!") {
          this.text = "Utilizador desativado com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getUtilizadores();
        }else if(res.data === "Não pode desativar o seu próprio utilizador!"){
          this.text = "Não pode desativar o seu próprio utilizador!";
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }else{
          this.text = "Ocorreu um erro ao desativar o utilizador!";
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
      axios.post(lhost + "/api/users/eliminar", {
        token: this.$store.state.token,
        id: item.id
      }).then(res => {
        if (res.data === "Utilizador eliminado com sucesso!") {
          this.text = "Utilizador eliminado com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getUtilizadores();
        }else if(res.data === "Não pode eliminar o seu próprio utilizador!"){
          this.text = "Não pode eliminar o seu próprio utilizador!";
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        }else{
          this.text = "Ocorreu um erro ao eliminar o utilizador!";
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
    guardar(){
      if (this.$refs.form.validate()) {
        var parsedType;
        switch (this.editedItem.level) {
          case "Administrador de Perfil Tecnológico":
            parsedType = 7;
            break;
          case "Administrador de Perfil Funcional":
            parsedType = 6;
            break;
          case "Utilizador Validador":
            parsedType = 5;
            break;
          case "Utilizador Avançado":
            parsedType = 4;
            break;
          case "Utilizador Decisor":
            parsedType = 3;
            break;
          case "Utilizador Simples":
            parsedType = 2;
            break;
          case "Representante Entidade":
            parsedType = 1;
            break;
          case "Utilizador desativado":
            parsedType = -1;
            break;
        }
        axios.put(lhost + "/api/users/atualizarMultiplos", {
          id: this.editedItem.id,
          nome: this.editedItem.name,
          email: this.editedItem.email,
          entidade: 'ent_' + this.editedItem.entidade,
          level: parsedType
        }).then(res => {
          if (res.data === "Utilizador atualizado com sucesso!") {
            this.text = "Utilizador atualizado com sucesso!";
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getUtilizadores();
          }else{
            this.text = "Ocorreu um erro ao atualizar a informação do utilizador!";
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
      if (this.done == true) this.getUtilizadores();
    },
    registo(){
      this.$router.push('/users/registo')
    },
    format(entidade){
      if(entidade!=undefined){
        return entidade.split('_')[1];
      }else{
        return '';
      }
    }
  }
};
</script>