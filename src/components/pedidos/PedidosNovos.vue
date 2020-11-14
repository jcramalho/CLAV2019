<template>
  <v-expansion-panel popout focusable>
    <v-expansion-panel-header class="indigo darken-3 white--text">
      <div>
        <b>Pedidos Novos</b>
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

            <v-tooltip v-if="temPermissaoDistribuir()" bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="distribuiPedido(item)"
                  color="indigo darken-2"
                  v-on="on"
                >
                  person
                </v-icon>
              </template>
              <span>Distribuir pedido...</span>
            </v-tooltip>

            <v-tooltip v-if="temPermissaoDevolver()" bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  @click="devolverPedido(item)"
                  color="indigo darken-2"
                  v-on="on"
                >
                  assignment_return
                </v-icon>
              </template>
              <span>Devolver pedido...</span>
            </v-tooltip>
          </template>

          <template v-slot:pageText="props">
            Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card>
    </v-expansion-panel-content>

    <!-- Campo despacho -->
    <v-dialog v-model="devolverPedidoDialog" width="60%">
      <DevolverPedido
        @fecharDialog="fecharDialog()"
        @devolverPedido="despacharPedido($event)"
      />
    </v-dialog>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/" />
    </v-dialog>
  </v-expansion-panel>
</template>

<script>
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import ErroDialog from "@/components/generic/ErroDialog";
import {
  NIVEIS_DISTRIBUIR_PEDIDO,
  NIVEIS_DEVOLVER_PEDIDO,
} from "@/utils/consts";

export default {
  props: ["pedidos", "pesquisaPedidos"],

  components: {
    DevolverPedido,
    ErroDialog,
  },

  data: () => {
    return {
      devolverPedidoDialog: false,
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      pedidoADevolver: "",
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
          text: "Criador",
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
    temPermissaoDistribuir() {
      return NIVEIS_DISTRIBUIR_PEDIDO.includes(this.$userLevel());
    },

    temPermissaoDevolver() {
      return NIVEIS_DEVOLVER_PEDIDO.includes(this.$userLevel());
    },

    atualizaPedidos() {
      this.dadosTabela = this.pedidos.map((pedido) => {
        const dados = {};
        dados.codigo = pedido.codigo;
        dados.tipo = `${pedido.objeto.tipo} - ${pedido.objeto.acao}`;
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

    distribuiPedido(pedido) {
      const pedidoProps = this.pedidos.find((p) => p.codigo === pedido.codigo);
      this.$emit("distribuir", pedidoProps);
    },

    fecharDialog() {
      this.devolverPedidoDialog = false;
      this.pedidoADevolver = "";
    },

    devolverPedido(pedido) {
      const pedidoEncontrado = this.pedidos.find(
        (p) => p.codigo === pedido.codigo
      );

      this.pedidoADevolver = pedidoEncontrado;
      this.devolverPedidoDialog = true;
    },

    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.pedidoADevolver));

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.fecharDialog();
        location.reload();
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },

    showPedido(pedido) {
      localStorage.setItem(
        "pesquisa-pedidos",
        JSON.stringify({
          painel: 0,
          pesquisa: this.procurar,
          pagina: this.paginaTabela,
          limpar: true,
        })
      );

      this.$router.push("/pedidos/novos/" + pedido.codigo);
    },
  },
};
</script>
