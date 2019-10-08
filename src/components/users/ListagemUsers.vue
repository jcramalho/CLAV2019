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
        :footer-props="usersFooterProps"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Não foram encontrados resultados para "{{ search }}" .
          </v-alert>
        </template>
        <template v-slot:item="props">
          <tr>
            <td class="subheading">{{ props.item.name }}</td>
            <td class="subheading">{{ format(props.item.entidade) }}</td>
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                    @click="alterarPasswordId = props.item.id"
                  >
                    <v-icon medium color="yellow">vpn_key</v-icon>
                  </v-btn>
                </template>
                <span>Alterar password do utilizador</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="desativarId = props.item.id">
                    <v-icon color="grey darken-2">lock</v-icon>
                  </v-btn>
                </template>
                <span>Desativar utilizador</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="eliminarId = props.item.id">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar utilizador</span>
              </v-tooltip>
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
        <v-card-title class="headline">
          <span class="headline">Editar utilizador</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="person"
                    v-model="editedItem.name"
                    label="Nome de utilizador"
                    :rules="regraNome"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="email"
                    v-model="editedItem.email"
                    label="Email"
                    :rules="regraEmail"
                    required
                  ></v-text-field>
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
                      'Utilizador Decisor',
                      'Utilizador Validador',
                      'Utilizador Validador (AD)',
                      'Utilizador Avançado',
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
          <v-btn color="red" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" text @click="guardar">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="alterarPasswordId != ''" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <span class="headline">Alterar password do utilizador</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form2" lazy-validation>
            <v-text-field
              id="password"
              prepend-icon="lock"
              name="password"
              v-model="password"
              label="Nova Password"
              type="password"
              :rules="regraPassword"
              @input="verificaPassword()"
              required
            />
            <v-text-field
              id="rep_password"
              prepend-icon="lock"
              name="rep_password"
              v-model="rep_password"
              label="Repita a Password"
              type="password"
              :rules="regraPassword"
              @input="verificaPassword()"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="alterarPasswordId = ''">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="alterarPassword()">
            Alterar Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="desativarId != ''" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende desativar o utilizador?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="desativarId = ''">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="desativar(desativarId)">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="eliminarId != ''" persistent max-width="290px">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text>
          Tem a certeza que pretende eliminar o utilizador?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="eliminarId = ''">
            Cancelar
          </v-btn>
          <v-btn color="primary" text @click="eliminar(eliminarId)">
            Confirmar
          </v-btn>
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
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-content>
</template>

<script>
export default {
  data: () => ({
    search: "",
    regraNome: [v => !!v || "Nome é obrigatório."],
    regraEntidade: [v => !!v || "Entidade é obrigatório."],
    regraEmail: [
      v => !!v || "Email é obrigatório.",
      v => /^.+@.+\..+$/.test(v) || "Email tem de ser válido."
    ],
    regraTipo: [v => !!v || "Tipo de utilizador é obrigatório."],
    regraPassword: [v => !!v || "Password é obrigatório."],
    ent_list: [],
    usersFooterProps: {
      "items-per-page-text": "Pedidos por página",
      "items-per-page-options": [5, 10, -1],
      "items-per-page-all-text": "Todos"
    },
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
        value: "",
        class: "title"
      }
    ],
    dialog: false,
    alterarPasswordId: "",
    desativarId: "",
    eliminarId: "",
    editedIndex: -1,
    editedItem: {
      nome: "",
      entidade: "",
      email: "",
      level: ""
    },
    password: "",
    rep_password: "",
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
      this.$request("get", "/api/entidades")
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
    async getUtilizadores() {
      try {
        var response = await this.$request(
          "get",
          "/api/users?formato=normalizado"
        );
        this.utilizadores = response.data;
      } catch (e) {
        return e;
      }
    },
    verificaPassword() {
      if (this.password != this.rep_password) {
        if (this.regraPassword.length == 1) {
          this.regraPassword = this.regraPassword.concat([
            "A password deve ser igual!"
          ]);
        }
      } else {
        if (this.regraPassword.length == 2) {
          this.regraPassword = this.regraPassword.slice(0, 1);
        }
      }
    },
    editar(item) {
      this.editedIndex = this.utilizadores.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.entidade = this.editedItem.entidade.split("_")[1];
      this.dialog = true;
    },
    alterarPassword() {
      if (this.$refs.form2.validate()) {
        this.$request(
          "put",
          "/api/users/alterarPassword/" + this.alterarPasswordId,
          {
            password: this.password
          }
        )
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.alterarPasswordId = "";
            this.done = true;
          })
          .catch(err => {
            this.text = "Ocorreu um erro ao atualizar a password.";
            this.color = "error";
            this.snackbar = true;
            this.done = false;
          });
      } else {
        this.text = "Por favor preencha todos os campos!";
        this.color = "error";
        this.snackbar = true;
        this.done = false;
      }
    },
    desativar(id) {
      this.$request("put", "/api/users/desativar/" + id)
        .then(res => {
          this.text = res.data;
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.desativarId = "";
          this.getUtilizadores();
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    eliminar(id) {
      this.$request("delete", "/api/users/eliminar/" + id)
        .then(res => {
          this.text = res.data;
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.eliminarId = "";
          this.getUtilizadores();
        })
        .catch(err => {
          this.text = err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    guardar() {
      if (this.$refs.form.validate()) {
        var parsedType;
        switch (this.editedItem.level) {
          case "Administrador de Perfil Tecnológico":
            parsedType = 7;
            break;
          case "Administrador de Perfil Funcional":
            parsedType = 6;
            break;
          case "Utilizador Decisor":
            parsedType = 5;
            break;
          case "Utilizador Validador":
            parsedType = 4;
            break;
          case "Utilizador Validador (AD)":
            parsedType = 3.5;
            break;
          case "Utilizador Avançado":
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
        this.$request(
          "put",
          "/api/users/atualizarMultiplos/" + this.editedItem.id,
          {
            nome: this.editedItem.name,
            email: this.editedItem.email,
            entidade: "ent_" + this.editedItem.entidade,
            level: parsedType
          }
        )
          .then(res => {
            this.text = res.data;
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getUtilizadores();
          })
          .catch(err => {
            this.text = err.response.data;
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
    registo() {
      this.$router.push("/users/registo");
    },
    format(entidade) {
      if (entidade != undefined) {
        return entidade.split("_")[1];
      } else {
        return "";
      }
    }
  }
};
</script>
