<template>
  <v-card flat class="pa-3">
    <v-row>
      <v-col cols="11" align="left">
        <p class="clav-content-title-1" style="text-align: left">{{ tipo }}</p>
      </v-col>
      <v-col cols="1">
        <v-dialog v-if="temPermissao()" v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" class="ml-4" fab dark small color="primary">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              Adicionar um Vocabulário Controlado
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="novoVC.id"
                :rules="[(v) => !!v || 'Identificador Obrigatório']"
                label="Identificador"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="novoVC.label"
                :rules="[(v) => !!v || 'Legenda Obrigatória']"
                label="Legenda"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="novoVC.desc"
                :rules="[(v) => !!v || 'Descrição Obrigatória']"
                label="Descrição"
                type="text"
                required
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="
                  novoVC = {};
                  dialog = false;
                "
              >
                Fechar
              </v-btn>
              <v-btn color="green darken-1" text @click="criarVC">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-card flat class="clav-info-content">
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar"
        single-line
        hide-details
        color="indigo darken-1"
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="lista"
        :search="search"
        class="elevation-1"
        :footer-props="vocabulariosFooterProps"
        v-if="listaReady"
      >
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Não foram encontrados resultados para "{{ search }}" .
          </v-alert>
        </template>
        <template v-slot:item="props">
          <tr>
            <td
              @click="go(props.item.id)"
              v-for="(campo, index) in props.item"
              v-bind:key="index"
            >
              {{ campo }}
            </td>
            <td v-if="temPermissao()">
              <v-icon @click="guardarProp(props.item)" icon> mdi-pencil </v-icon>
            </td>
          </tr>
        </template>
        <template v-slot:pageText="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog2" max-width="600px">
      <v-card>
        <v-card-title class="headline"> Edição de Vocabulário Controlado </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="updateVC.id"
            :rules="[(v) => !!v || 'Identificador Obrigatório']"
            label="Identificador"
            type="text"
            disabled
            required
          ></v-text-field>
          <v-text-field
            v-model="updateVC.label"
            :rules="[(v) => !!v || 'Legenda Obrigatória']"
            label="Legenda"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            v-model="updateVC.desc"
            :rules="[(v) => !!v || 'Descrição Obrigatória']"
            label="Descrição"
            type="text"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="
              updateVC = {};
              dialog2 = false;
            "
          >
            Fechar
          </v-btn>
          <v-btn color="green darken-1" text @click="editarVC(updateVC.id)">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snack" :color="snackColor">
      {{ mess }}
      <v-btn dark text @click="snack = false"> Fechar </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

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
    updateVC: {},
    vocabulariosFooterProps: {
      "items-per-page-text": "Vocabulários por página",
      "items-per-page-options": [5, 10, -1],
      "items-per-page-all-text": "Todos",
    },
    userLevel: 0,
  }),
  methods: {
    go: function (id) {
      switch (this.tipo) {
        case "Vocabulários Controlados":
          this.$router.push("/vocabularios/" + id);
          break;
      }
    },
    guardarProp: function (item) {
      this.updateVC = {
        id: item.id,
        label: item.label,
        desc: item.desc,
      };
      this.dialog2 = true;
    },
    criarVC: async function () {
      await this.$request("post", "/vocabularios/", this.novoVC)
        .then((res) => {
          this.snack = true;
          this.mess = res.data.mensagem;
          this.snackColor = "green";
          this.lista = this.lista.push(this.novoVC);
          this.novoVC = {};
          this.dialog = false;
        })
        .catch((err) => {
          this.snack = true;
          this.mess = "Erro na adição do VC";
          this.snackColor = "red";
          this.novoVC = {};
          this.dialog = false;
        });
    },
    editarVC: async function (id) {
      await this.$request("put", "/vocabularios/" + id, this.updateVC)
        .then((res) => {
          this.snack = true;
          this.mess = res.data.mensagem;
          this.snackColor = "green";
          this.lista[
            this.lista.findIndex((obj) => obj.id == id)
          ].label = this.updateVC.label;
          this.lista[
            this.lista.findIndex((obj) => obj.id == id)
          ].desc = this.updateVC.desc;
          this.updateVC = {};
          this.dialog2 = false;
        })
        .catch((err) => {
          this.snack = true;
          this.mess = "Erro na atualização do VC";
          this.snackColor = "red";
          this.updateVC = {};
          this.dialog2 = false;
        });
    },
    temPermissao: function () {
      return this.userLevel >= NIVEL_MINIMO_ALTERAR;
    },
  },
  mounted: async function () {
    this.userLevel = this.$userLevel();

    try {
      for (var i = 0; i < this.cabecalho.length; i++) {
        this.headers[i] = {
          text: this.cabecalho[i],
          value: this.campos[i],
        };
      }
      if (this.temPermissao()) {
        this.headers[i] = {
          text: "Ação",
        };
      }
    } catch (e) {
      return e;
    }
    this.listaReady = true;
  },
};
</script>
