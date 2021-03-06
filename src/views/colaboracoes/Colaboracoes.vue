<template>
  <div>
    <Loading v-if="!colaboracoesReady" :message="'colaborações'" />
    <v-card v-else flat class="pa-3">
      <v-row justify="center">
        <v-col cols="6" align="center">
          <span class="clav-content-title-1">{{ tipo }}</span>
        </v-col>
      </v-row>

      <v-text-field
        v-model="search"
        append-icon="search"
        label="Filtrar"
        single-line
        hide-details
        class="mx-5"
      ></v-text-field>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="colaboracoes"
          :search="search"
          :footer-props="footer_props"
          v-if="this.headers[this.cabecalhos.length - 1]"
        >
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning"
              >Não foram encontrados resultados para "{{ search }}".</v-alert
            >
          </template>

          <template v-slot:item="props">
            <ListagemColaboracao
              :item="props.item"
              @rowClicked="go($event.id)"
              @iconClicked="switchOperacao($event.operacao.descricao, props.item.id)"
            />
          </template>

          <template v-slot:pageText="props">
            Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card-text>
      <v-dialog :value="eliminarId != ''" persistent max-width="290px">
        <v-card>
          <v-card-title class="headline">Confirmar ação</v-card-title>
          <v-card-text> Tem a certeza que pretende eliminar o crédito? </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="eliminarId = ''"> Cancelar </v-btn>
            <v-btn color="primary" text @click="remover(eliminarId)"> Confirmar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" :top="true">
        {{ text }}
        <v-btn text @click="fecharSnackbar">Fechar</v-btn>
      </v-snackbar>
    </v-card>
  </div>
</template>

<script>
import Loading from "@/components/generic/Loading";
import ListagemColaboracao from "@/components/colaboracoes/ListagemColaboracao";
import { NIVEL_MINIMO_DOC } from "@/utils/consts";

export default {
  data: () => ({
    tipo: "Colaborações",
    colaboracoes: [],
    campos: [],
    cabecalhos: [],
    operacoes: [],
    colaboracoesReady: false,
    search: "",
    headers: [],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar",
    },
    snackbar: false,
    text: "",
    color: "",
    timeout: 4000,
    eliminarId: "",
    done: false,
  }),

  components: {
    Loading,
    ListagemColaboracao,
  },

  methods: {
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_DOC) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração", cor: "indigo darken-2" },
          { icon: "delete", descricao: "Remoção", cor: "red" },
        ];
      }
    },

    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_DOC) {
        this.cabecalhos = ["Nome", "Filiação", "Função", "Operações"];
        this.campos = ["nome", "filiacao", "funcao", "operacoes"];
      } else {
        this.cabecalhos = ["Nome", "Filiação", "Função"];
        this.campos = ["nome", "filiacao", "funcao"];
      }

      for (let i = 0; i < this.cabecalhos.length; i++) {
        if (this.campos[i] === "operacoes")
          this.headers[i] = {
            text: this.cabecalhos[i],
            value: this.campos[i],
            align: "end",
            width: "10%",
            class: ["table-header", "subtitle-2", "font-weight-bold"],
          };
        else
          this.headers[i] = {
            text: this.cabecalhos[i],
            value: this.campos[i],
            class: ["table-header", "subtitle-2", "font-weight-bold"],
          };
      }
    },

    preparaLista(level, listaNoticias) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaNoticias.length; i++) {
          if (level >= NIVEL_MINIMO_DOC) {
            myTree.push({
              nome: listaNoticias[i].nome,
              filiacao: listaNoticias[i].filiacao,
              funcao: listaNoticias[i].funcao,
              operacoes: this.operacoes,
              id: listaNoticias[i]._id,
            });
          } else {
            myTree.push({
              nome: listaNoticias[i].nome,
              filiacao: listaNoticias[i].filiacao,
              funcao: listaNoticias[i].funcao,
              operacoes: this.operacoes,
              id: listaNoticias[i]._id,
            });
          }
        }
      } else {
        for (let i = 0; i < listaNoticias.length; i++) {
          myTree.push({
            nome: listaNoticias[i].nome,
            filiacao: listaNoticias[i].filiacao,
            funcao: listaNoticias[i].funcao,
            id: listaNoticias[i]._id,
          });
        }
      }
      return myTree;
    },

    go(id) {
      this.$router.push("/colaboracoes/" + id);
    },

    goEditar(id) {
      this.$router.push("/colaboracoes/editar/" + id);
    },

    remover(id) {
      this.$request("delete", "/colaboracoes/" + id)
        .then((res) => {
          this.text = res.data;
          this.color = "success";
          this.snackbar = true;
          this.eliminarId = "";
          this.done = true;
          this.getColaboracoes();
        })
        .catch((e) => {
          this.text = e.response.data[0].msg || e.response.data;
          this.color = "error";
          this.snackbar = true;
          this.eliminarId = "";
          this.done = false;
        });
    },

    async switchOperacao(op, id) {
      switch (op) {
        case "Alteração":
          this.goEditar(id);
          break;

        case "Remoção":
          this.eliminarId = id;
          break;

        default:
          break;
      }
    },

    fecharSnackbar() {
      this.snackbar = false;
      if (this.done == true) this.getColaboracoes();
    },

    async getColaboracoes() {
      try {
        let response = await this.$request("get", "/colaboracoes");

        let level = this.$userLevel();

        this.preparaCabecalhos(level);

        this.preparaOperacoes(level);

        this.colaboracoes = await this.preparaLista(level, response.data);

        this.colaboracoesReady = true;
      } catch (e) {
        return e;
      }
    },
  },

  created: async function () {
    try {
      let response = await this.$request("get", "/colaboracoes");

      let level = this.$userLevel();

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.colaboracoes = await this.preparaLista(level, response.data);

      this.colaboracoesReady = true;
    } catch (e) {
      return e;
    }
  },
};
</script>
