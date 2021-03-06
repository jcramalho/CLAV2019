<template>
  <v-card flat class="pa-3">
    <v-card-title>
      <p class="clav-content-title-1">Listagem de Chaves API</p>
      <v-spacer></v-spacer>
      <v-tooltip top color="info" open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" v-on="on" @click="registo">
            <v-icon large>person_add</v-icon>
          </v-btn>
        </template>
        <span>Adicionar nova chave API</span>
      </v-tooltip>
    </v-card-title>
    <v-card flat class="clav-info-content">
      <v-tooltip top color="info" open-delay="500">
        <template v-slot:activator="{ on }">
          <v-text-field
            v-on="on"
            v-model="search"
            append-icon="search"
            label="Procurar / filtrar tabela"
            text
            single-line
            hide-details
            clearable
            color="blue darken-3"
            class="mt-n2 mb-3 mx-6 font-weight-medium"
          ></v-text-field>
        </template>

        <span> Filtrar tabela</span>
      </v-tooltip>
      <v-data-table
        :headers="headers"
        :items="chaves"
        :search="search"
        footer-props.items-per-page-options="[10, 20, 50]"
        footer-props.items-per-page-text="Mostrar"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Não foram encontrados resultados para "{{ search }}" .
          </v-alert>
        </template>
        <template v-slot:item="props">
          <tr>
            <td class="subheading">{{ format(props.item.key) }}</td>
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="renovarId = props.item.contactInfo">
                    <v-icon medium color="primary">refresh</v-icon>
                  </v-btn>
                </template>
                <span>Renovar chave API</span>
              </v-tooltip>
              <v-tooltip bottom v-if="props.item.active == 'Não'">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="ativarId = props.item.id">
                    <v-icon medium color="grey darken-2">lock_open</v-icon>
                  </v-btn>
                </template>
                <span>Ativar chave API</span>
              </v-tooltip>
              <v-tooltip bottom v-if="props.item.active == 'Sim'">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="desativarId = props.item.id">
                    <v-icon medium color="grey darken-2">lock</v-icon>
                  </v-btn>
                </template>
                <span>Desativar chave API</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="eliminarId = props.item.id">
                    <v-icon medium color="red">delete</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar chave API</span>
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
          <span class="headline">Editar Chave API</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="vpn_key"
                    v-model="editedItem.key"
                    label="Chave API"
                    disabled
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="person"
                    v-model="editedItem.name"
                    label="Nome"
                    :rules="regraNome"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field
                    prepend-icon="email"
                    v-model="editedItem.contactInfo"
                    label="Email"
                    :rules="regraEmail"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-autocomplete
                    item-text="label"
                    item-value="value"
                    :items="ent_list"
                    :rules="regraEntidade"
                    prepend-icon="account_balance"
                    v-model="editedItem.entity"
                    label="Entidade"
                    required
                  >
                  </v-autocomplete>
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
    <v-dialog :value="renovarId != ''" max-width="290">
      <v-card v-if="apikey == ''">
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende renovar a chave API? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="renovarId = ''"> Cancelar </v-btn>
          <v-btn color="primary" text @click="renovar(renovarId)"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title class="headline">Chave API renovada</v-card-title>
        <v-card-text>
          <p>A chave API com email igual a '{{ renovarId }}' foi renovada com sucesso!</p>
          <p>O valor da chave API agora é:</p>
          <span class="subtitle-2" style="color: green">
            <b>
              {{ apikey }}
            </b>
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="
              apikey = '';
              renovarId = '';
            "
          >
            Fechar
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="desativarId != ''" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende desativar a chave API? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="desativarId = ''"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              desativar(desativarId);
              desativarId = '';
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="ativarId != ''" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende ativar a chave API? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="ativarId = ''"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              ativar(ativarId);
              ativarId = '';
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="eliminarId != ''" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirmar ação</v-card-title>
        <v-card-text> Tem a certeza que pretende eliminar a chave API? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="eliminarId = ''"> Cancelar </v-btn>
          <v-btn
            color="primary"
            text
            @click="
              eliminar(eliminarId);
              eliminarId = '';
            "
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    regraNome: [(v) => !!v || "Nome é obrigatório."],
    regraEntidade: [(v) => !!v || "Entidade é obrigatório."],
    regraEmail: [
      (v) => !!v || "Email é obrigatório.",
      (v) => /.+@.+/.test(v) || "Email tem de ser válido.",
    ],
    search: "",
    editedIndex: -1,
    editedItem: {
      key: "",
      name: "",
      contactInfo: "",
      entity: "",
      active: "",
    },
    headers: [
      {
        text: "Chave",
        sortable: true,
        value: "key",
        class: "title",
      },
      {
        text: "Nome",
        sortable: true,
        value: "name",
        class: "title",
      },
      {
        text: "Entidade",
        sortable: true,
        value: "entity",
        class: "title",
      },
      {
        text: "Contacto",
        sortable: true,
        value: "contactInfo",
        class: "title",
      },
      {
        text: "Ativa?",
        sortable: true,
        value: "active",
        class: "title",
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
        class: "title",
      },
      {
        text: "Data Expiração",
        sortable: true,
        value: "expiration",
        class: "title",
      },
      {
        text: "Ações",
        sortable: false,
        value: "",
        class: "title",
      },
    ],
    dialog: false,
    ativarId: "",
    desativarId: "",
    eliminarId: "",
    renovarId: "",
    apikey: "",
    chaves: [],
    ent_list: [],
    snackbar: false,
    color: "",
    done: false,
    timeout: 4000,
    text: "",
  }),
  async created() {
    await this.getChavesApi();
    await this.getEntidades();
  },
  methods: {
    async getChavesApi() {
      try {
        var response = await this.$request("get", "/chaves");
        this.chaves = response.data;
      } catch (e) {
        return e;
      }
    },
    async getEntidades() {
      await this.$request("get", "/entidades")
        .then((res) => {
          this.ent_list = res.data.map((ent) => {
            return {
              label: ent.sigla + " - " + ent.designacao,
              value: "ent_" + ent.sigla,
            };
          });
        })
        .catch((error) => alert(error));
    },
    editar(item) {
      this.editedIndex = this.chaves.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    desativar(id) {
      this.$request("put", "/chaves/" + id + "/desativar")
        .then((res) => {
          this.text = "Chave API desativada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getChavesApi();
        })
        .catch((err) => {
          this.text = err.response.data[0].msg || err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    ativar(id) {
      this.$request("put", "/chaves/" + id + "/ativar")
        .then((res) => {
          this.text = "Chave API ativada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getChavesApi();
        })
        .catch((err) => {
          this.text = err.response.data[0].msg || err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    eliminar(id) {
      this.$request("delete", "/chaves/" + id)
        .then((res) => {
          this.text = "Chave API eliminada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.getChavesApi();
        })
        .catch((err) => {
          this.text = err.response.data[0].msg || err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    renovar(email) {
      this.$request("put", "/chaves/renovar?email=" + email, {
        headers: {
          "Content-length": 0,
        },
      })
        .then((res) => {
          this.text = "Chave API renovada com sucesso!";
          this.color = "success";
          this.snackbar = true;
          this.done = true;
          this.apikey = res.data.apikey;
          this.getChavesApi();
        })
        .catch((err) => {
          this.text = err.response.data[0].msg || err.response.data;
          this.color = "error";
          this.snackbar = true;
          this.done = false;
        });
    },
    guardar() {
      if (this.$refs.form.validate()) {
        this.$request("put", "/chaves/" + this.editedItem.id + "/atualizar/", {
          name: this.editedItem.name,
          contactInfo: this.editedItem.contactInfo,
          entity: this.editedItem.entity,
        })
          .then((res) => {
            this.text = "Chave API atualizada com sucesso!";
            this.color = "success";
            this.snackbar = true;
            this.done = true;
            this.dialog = false;
            this.getChavesApi();
          })
          .catch((err) => {
            this.text = err.response.data[0].msg || err.response.data;
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
    registo() {
      this.$router.push("/gestao/api/registo");
    },
    format(key) {
      return key.substring(15, 25) + "...";
    },
  },
};
</script>
