<template>
  <v-expansion-panel popout focusable>
    <v-expansion-panel-header
      class="indigo darken-3 bold--text white--text"
      dark
    >
      <div>
        <b>Pedidos Devolvidos</b>
        <sup class="ml-1">
          <v-badge color="red">
            <template v-slot:badge>
              {{ pedidos.length }}
            </template>
          </v-badge>
        </sup>
      </div>

      <template v-slot:actions>
        <v-icon color="white">expand_more</v-icon>
      </template>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="procurar"
            append-icon="search"
            label="Procurar pedido"
            single-line
            hide-details
            filled
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="dadosTabela"
          :search.sync="procurar"
          class="elevation-1"
          sortDesc
          sort-by="data"
          :custom-sort="ordenaTabela"
          :footer-props="footer_props"
          :page.sync="paginaTabela"
        >
          <template v-slot:no-data>
            <v-alert type="error" width="50%" class="m-auto mb-2 mt-2" outlined>
              Não existem pedidos neste estado...
            </v-alert>
          </template>

          <template v-slot:no-results>
            <v-alert type="info" width="50%" class="m-auto mb-2 mt-2" outlined>
              Sem resultados para "<strong>{{ procurar }}</strong
              >".
            </v-alert>
          </template>

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>

          <template slot="headerCell" slot-scope="props">
            <span style="color: blue;">
              {{ props.header.text }}
            </span>
          </template>

          <template v-slot:item.tarefa="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="showPedido(item)"
                  color="indigo darken-2"
                  v-on="on"
                >
                  visibility
                </v-icon>
              </template>
              <span>Ver pedido...</span>
            </v-tooltip>
          </template>

          <template v-slot:pageText="props">
            Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: ["pedidos", "pesquisaPedidos"],

  data: () => {
    return {
      procurar: "",
      paginaTabela: 1,
      headers: [
        {
          text: "Código",
          value: "codigo",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Tipo",
          value: "tipo",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Entidade",
          value: "entidade",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Responsável",
          value: "responsavel",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Data",
          align: "left",
          value: "data",
          class: "title",
          sortable: true,
          filterable: true,
        },
        {
          text: "Tarefa",
          value: "tarefa",
          sortable: false,
          class: "title",
          filterable: false,
        },
      ],
      dadosTabela: [],

      footer_props: {
        "items-per-page-text": "Pedidos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },

  watch: {
    pedidos() {
      this.atualizaPedidos();
    },

    pesquisaPedidos() {
      if (this.pesquisaPedidos.painel !== undefined) {
        this.paginaTabela = this.pesquisaPedidos.pagina;
        this.procurar = this.pesquisaPedidos.pesquisa;
      }
    },
  },

  methods: {
    atualizaPedidos() {
      this.dadosTabela = this.pedidos.map((pedido) => {
        const dados = {};
        dados.codigo = pedido.codigo;
        dados.tipo = `${pedido.objeto.acao} - ${pedido.objeto.tipo}`;
        if (pedido.entidade !== undefined)
          dados.entidade = pedido.entidade.split("_")[1];
        dados.responsavel = pedido.criadoPor;
        dados.data = this.converteData(pedido.data);

        return dados;
      });
    },

    ordenaTabela(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === "codigo") {
          if (!isDesc[0]) {
            return (
              parseInt(b[index].split("-")[0].concat(b[index].split("-")[1])) -
              parseInt(a[index].split("-")[0].concat(a[index].split("-")[1]))
            );
          } else {
            return (
              parseInt(a[index].split("-")[0].concat(a[index].split("-")[1])) -
              parseInt(b[index].split("-")[0].concat(b[index].split("-")[1]))
            );
          }
        } else if (index[0] === "data") {
          if (!isDesc[0]) {
            const dataA = a[index]
              .split("-")
              .reverse()
              .join("");

            const dataB = b[index]
              .split("-")
              .reverse()
              .join("");

            return dataB.localeCompare(dataA);
          } else {
            const dataA = a[index]
              .split("-")
              .reverse()
              .join("");

            const dataB = b[index]
              .split("-")
              .reverse()
              .join("");

            return dataA.localeCompare(dataB);
          }
        } else {
          if (
            typeof a[index] !== "undefined" &&
            typeof b[index] !== "undefined"
          ) {
            if (!isDesc[0]) {
              return a[index]
                .toLowerCase()
                .localeCompare(b[index].toLowerCase());
            } else {
              return b[index]
                .toLowerCase()
                .localeCompare(a[index].toLowerCase());
            }
          }
        }
      });
      return items;
    },

    converteData(data) {
      let novaData = new Date(data);

      let ano = novaData.getFullYear();
      let mes = novaData.getMonth() + 1;
      let dia = novaData.getDate();

      if (dia < 10) {
        dia = "0" + dia;
      }
      if (mes < 10) {
        mes = "0" + mes;
      }

      return `${dia}-${mes}-${ano}`;
    },

    showPedido(pedido) {
      localStorage.setItem(
        "pesquisa-pedidos",
        JSON.stringify({
          painel: 3,
          pesquisa: this.procurar,
          pagina: this.paginaTabela,
          limpar: true,
        })
      );

      this.$router.push("/pedidos/" + pedido.codigo);
    },
  },
};
</script>
