<template>
  <PainelCLAV titulo="Pedidos Novos" infoHeader="Pedidos Novos">
    <template v-slot:icon>
      <v-badge color="red" overlap offset-x="9" offset-y="20">
        <unicon
          class="mt-3"
          name="pedido-novo-icon"
          width="20"
          height="20"
          viewBox="0 0 20.71 20.709"
          fill="#ffffff"
        />
        <template v-slot:badge>
          {{ pedidos.length }}
        </template>
      </v-badge>
    </template>
    <template v-slot:conteudo>
      <v-row>
        <v-col>
          <div class="info-content pa-4">
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  v-model="procurar"
                  append-icon="search"
                  label="Procurar pedido"
                  text
                  single-line
                  hide-details
                  clearable
                  color="blue darken-3"
                  class="mt-n2 mb-3 mx-6 font-weight-medium"
                ></v-text-field>
              </template>

              <span> Procurar pedido</span>
            </v-tooltip>

            <v-data-table
              class="content-table"
              :headers="headers"
              :items="dadosTabela"
              :search.sync="procurar"
              sortDesc
              sort-by="data"
              :custom-sort="ordenaTabela"
              :footer-props="footer_props"
              :page.sync="paginaTabela"
            >
              <template v-slot:no-data>
                <v-alert
                  :value="true"
                  color="error"
                  icon="warning"
                  class="font-weight-medium my-3"
                  id="alerta-erro"
                  >Não existem pedidos neste estado.
                </v-alert>
              </template>

              <template v-slot:no-results>
                <v-alert
                  :value="true"
                  color="error"
                  icon="warning"
                  class="font-weight-medium my-3"
                  id="alerta-erro"
                  >Não foram encontrados resultados para "{{ procurar }}".</v-alert
                >
              </template>

              <template v-slot:[`footer.page-text`]="props">
                {{ props.pageStart }} - {{ props.pageStop }} de
                {{ props.itemsLength }}
              </template>

              <template slot="headerCell" slot-scope="props">
                <span style="color: blue">
                  {{ props.header.text }}
                </span>
              </template>

              <template v-slot:[`item.tarefa`]="{ item }">
                <v-tooltip top color="info" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small text rounded @click="showPedido(item)">
                      <unicon
                        name="look-icon"
                        width="25"
                        height="25"
                        viewBox="0 0 20.71 15.574"
                        fill="#0D47A1"
                      />
                    </v-btn>
                  </template>
                  <span>Ver Pedido</span>
                </v-tooltip>

                <v-tooltip
                  top
                  color="info"
                  open-delay="500"
                  v-if="temPermissaoDistribuir()"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small text rounded @click="distribuiPedido(item)">
                      <unicon
                        name="participacao-icon"
                        width="25"
                        height="25"
                        viewBox="0 0 20.71 17.678"
                        fill="#0D47A1"
                      />
                    </v-btn>
                  </template>
                  <span>Distribuir Pedido</span>
                </v-tooltip>

                <v-tooltip
                  top
                  color="info"
                  open-delay="500"
                  v-if="temPermissaoDevolver()"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small text rounded @click="devolverPedido(item)">
                      <unicon
                        name="devolver-icon"
                        width="25"
                        height="25"
                        viewBox="0 0 20.71 12.943"
                        fill="#0D47A1"
                      />
                    </v-btn>
                  </template>
                  <span>Devolver Pedido</span>
                </v-tooltip>
              </template>

              <template v-slot:pageText="props">
                Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
                {{ props.itemsLength }}
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>

      <!-- Campo despacho -->
      <v-dialog v-model="devolverPedidoDialog" width="60%" persistent>
        <DevolverPedido
          @fecharDialog="fecharDialog()"
          @devolverPedido="despacharPedido($event)"
        />
      </v-dialog>

      <!-- Dialog de erros -->
      <v-dialog v-model="erroDialog.visivel" width="60%" persistent>
        <ErroDialog :erros="erroDialog.mensagem" uri="/" />
      </v-dialog>
    </template>
  </PainelCLAV>
</template>

<script>
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import ErroDialog from "@/components/generic/ErroDialog";
import { NIVEIS_DISTRIBUIR_PEDIDO, NIVEIS_DEVOLVER_PEDIDO } from "@/utils/consts";
import PainelCLAV from "@/components/generic/PainelCLAV";

export default {
  props: ["pedidos", "pesquisaPedidos"],

  components: {
    DevolverPedido,
    ErroDialog,
    PainelCLAV,
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
          align: "center",
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
        if (pedido.entidade !== undefined) dados.entidade = pedido.entidade.split("_")[1];
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
            const dataA = a[index].split("-").reverse().join("");

            const dataB = b[index].split("-").reverse().join("");

            return dataB.localeCompare(dataA);
          } else {
            const dataA = a[index].split("-").reverse().join("");

            const dataB = b[index].split("-").reverse().join("");

            return dataA.localeCompare(dataB);
          }
        } else {
          if (typeof a[index] !== "undefined" && typeof b[index] !== "undefined") {
            if (!isDesc[0]) {
              return a[index].toLowerCase().localeCompare(b[index].toLowerCase());
            } else {
              return b[index].toLowerCase().localeCompare(a[index].toLowerCase());
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
      const pedidoEncontrado = this.pedidos.find((p) => p.codigo === pedido.codigo);

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
        this.erroDialog.mensagem = "Erro ao devolver o pedido, por favor tente novamente";
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
<style scoped>
.separador {
  color: white;
  padding: 5px;
  margin: 5px;
  font-weight: 400;
  width: 100%;
  min-height: 50px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
#expanded-content {
  margin-right: 12px !important;
  margin-left: 17px !important;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px 10px 0 0;
}
</style>
