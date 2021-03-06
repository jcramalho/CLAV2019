<template>
  <div class="ma-1">
    <v-row justify="space-between" class="info-label">
      <v-col>Lista de Agregações</v-col>
      <v-col>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procura"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="tipo == 'TS_LC' || tipo == 'PGD_LC' ? cabecalhoLC : cabecalho"
      :items="agregacoes"
      item-key="codigo"
      :items-per-page="5"
      class="elevation-1 ml-2 mt-3"
      :footer-props="footer_props"
      :search="search"
    >
      <template v-slot:no-data>
        <tr>
          <td>
            <v-text-field
              :class="!(tipo == 'TS_LC' || tipo == 'PGD_LC') ? 'codigo' : ''"
              hint="Exemplo: AS_DGLAB_1/2019"
              label="Insira um código para a agregação"
              v-model="codigo"
              clearable
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :class="
                tipo == 'TS_LC' || tipo == 'PGD_LC' ? 'tituloLC' : 'titulo'
              "
              hint="Exemplo: Auditoria à Entidade A"
              label="Insira um título para a agregação"
              v-model="titulo"
              clearable
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :class="tipo == 'TS_LC' || tipo == 'PGD_LC' ? 'pcaLC' : 'pca'"
              hint="Exemplo: 2009"
              label="Insira o ano de contagem do PCA"
              v-model="dataContagem"
              clearable
            ></v-text-field>
          </td>
          <td v-if="tipo == 'TS_LC' || tipo == 'PGD_LC'">
            <v-select
              class="naturezaLC mt-5"
              :items="natureza"
              v-model="ni"
              dense
            ></v-select>
          </td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  :class="!(tipo == 'TS_LC' || tipo == 'PGD_LC') ? 'acoes' : ''"
                  v-on="on"
                  small
                  @click="addAgregacao"
                  >check</v-icon
                >
              </template>
              <span>Adicionar Agregação</span>
            </v-tooltip>
          </td>
        </tr>
      </template>

      <template v-slot:item="prop">
        <tr v-if="agregacoes.indexOf(prop.item) === 0">
          <td>
            <v-text-field
              hint="Exemplo: AS_DGLAB_1/2019"
              label="Insira um código para a agregação"
              v-model="codigo"
              clearable
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              hint="Exemplo: Auditoria à Entidade A"
              label="Insira um título para a agregação"
              v-model="titulo"
              clearable
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              hint="Exemplo: 2009"
              label="Insira o ano de contagem do PCA"
              v-model="dataContagem"
              clearable
            ></v-text-field>
          </td>
          <td v-if="tipo == 'TS_LC' || tipo == 'PGD_LC'">
            <v-select
              class="mt-5"
              :items="natureza"
              v-model="ni"
              dense
            ></v-select>
          </td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon class="mx-2" v-on="on" small @click="limparAG"
                  >clear</v-icon
                >
              </template>
              <span>Limpar Agregação</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small @click="addAgregacao">check</v-icon>
              </template>
              <span>Adicionar Agregação</span>
            </v-tooltip>
          </td>
        </tr>
        <tr>
          <td>{{ prop.item.codigo }}</td>
          <td>{{ prop.item.titulo }}</td>
          <td>{{ prop.item.dataContagem }}</td>
          <td v-if="tipo == 'TS_LC' || tipo == 'PGD_LC'">{{ prop.item.ni }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  class="mr-2"
                  @click="upAgregacao(prop.item)"
                  >arrow_upward</v-icon
                >
              </template>
              <span>Duplicar Agregação</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon
                  v-on="on"
                  small
                  @click="
                    deleteObj = prop.item;
                    deleteDialog = true;
                  "
                  >delete</v-icon
                >
              </template>
              <span>Remover Agregação</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" color="success">
      Agregação editada com sucesso!
      <v-btn dark text @click="snackbar = false"> Fechar </v-btn>
    </v-snackbar>
    <v-dialog v-model="deleteDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark
          >Eliminação de agregação</v-card-title
        >

        <v-card-text>
          <div class="subtitle-1" style="white-space: pre-wrap">
            Esta ação vai <strong>eliminar permanentemente</strong> a agregação.
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="deleteDialog = false"
            >Fechar</v-btn
          >
          <v-btn color="red darken-4" text @click="deleteAG">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark
          >Erro: Não foi possível adicionar Agregação</v-card-title
        >

        <v-card-text>
          <span
            class="subtitle-1"
            style="white-space: pre-wrap"
            v-html="erro"
          ></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
const help = require("@/config/help").help;

export default {
  props: ["auto", "index", "agregacoes", "tipo"],

  components: {},

  data: () => ({
    codigo: null,
    titulo: null,
    dataContagem: null,
    ni: "Dono",
    natureza: ["Dono", "Participante"],
    changeSwitch: 0,
    snackbar: false,
    search: "",
    deleteDialog: false,
    deleteObj: null,
    cabecalhoLC: [
      {
        text: "Código",
        sortable: false,
        value: "codigo",
        width: "20%",
      },
      { text: "Título", align: "left", value: "titulo", width: "30%" },
      {
        text: "Data de início de contagem do PCA",
        value: "dataContagem",
        width: "25%",
      },
      {
        text: "Natureza de intervenção",
        value: "ni",
        width: "20%",
      },
      {
        text: "Ações",
        sortable: false,
        value: "action",
        width: "5%",
      },
    ],
    cabecalho: [
      {
        text: "Código",
        sortable: false,
        value: "codigo",
        width: "20%",
      },
      { text: "Título", align: "left", value: "titulo", width: "25%" },
      {
        text: "Data de início de contagem do PCA",
        value: "dataContagem",
        width: "25%",
      },
      {
        text: "Ações",
        sortable: false,
        value: "action",
        width: "5%",
      },
    ],
    footer_props: {
      "items-per-page-text": "Mostrar",
    },

    erro: null,
    erroDialog: false,
  }),
  created: function () {
    if (
      this.auto.zonaControlo[this.index].destino == "C" ||
      this.auto.zonaControlo[this.index].destino == "Conservação"
    ) {
      this.ni = "Participante";
      this.natureza = ["Participante"];
    }
  },
  methods: {
    limparAG: function () {
      this.codigo = null;
      this.titulo = null;
      this.dataContagem = null;
      this.editAG = null;
    },
    deleteAG: function () {
      var indexAG = this.agregacoes
        .map(function (x) {
          return x.codigo;
        })
        .indexOf(this.deleteObj.codigo);
      this.agregacoes.splice(indexAG, 1);
      this.deleteDialog = false;
      this.limparAG();
    },
    addAgregacao: function () {
      const re = /\d{4}/;
      var currentTime = new Date();
      var result = this.agregacoes.filter((ag) => ag.codigo == this.codigo);
      if (!this.codigo || !this.titulo || !this.dataContagem) {
        this.erro = help.AutoEliminacao.Erros.FaltaCamposAg;
        this.erroDialog = true;
      } else if (result.length > 0) {
        this.erro = help.AutoEliminacao.Erros.CodigoAg;
        this.erroDialog = true;
      } else if (!re.test(this.dataContagem)) {
        this.erro = help.AutoEliminacao.Erros.DataContagemP;
        this.erroDialog = true;
      } else {
        var res =
          parseInt(this.auto.zonaControlo[this.index].prazoConservacao) +
          parseInt(this.dataContagem) +
          1;
        //var res2 = parseInt(this.dataContagem) - parseInt(this.auto.zonaControlo[this.index].dataFim)
        var res2 =
          parseInt(this.dataContagem) -
          parseInt(this.auto.zonaControlo[this.index].dataInicio);
        if (res > currentTime.getFullYear()) {
          this.erro = help.AutoEliminacao.Erros.DataContagem;
          this.erroDialog = true;
        } else if (res2 < 0) {
          this.erro = help.AutoEliminacao.Erros.DataContagemInicio;
          this.erroDialog = true;
        } else {
          this.agregacoes.unshift({
            codigo: this.codigo,
            titulo: this.titulo,
            dataContagem: this.dataContagem,
            ni: this.ni,
          });
          this.limparAG();
        }
      }
    },
    upAgregacao: function (item) {
      this.codigo = item.codigo;
      this.titulo = item.titulo;
      this.dataContagem = item.dataContagem;
      this.ni = item.ni;
    },
  },
};
</script>
<style>
.tituloLC {
  margin-left: 80px;
  width: 100%;
}
.pcaLC {
  margin-left: 230px;
  width: 70%;
}
.naturezaLC {
  margin-left: 150px;
  width: 50%;
}
.codigo {
  width: 310px;
}
.titulo {
  margin-left: 105px;
  width: 100%;
}
.pca {
  margin-left: 280px;
  width: 70%;
}
.acoes {
  margin-left: 290px;
}
</style>
