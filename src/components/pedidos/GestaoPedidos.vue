<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-card-title class="indigo darken-4 title white--text" dark>
          Gestão de Pedidos
        </v-card-title>
        <v-card-text class="mt-4">
          <v-expansion-panels>
            <PedidosNovos
              :pedidos="pedidosSubmetidos"
              @distribuir="distribuiPedido($event)"
            />

            <PedidosAnalise
              :pedidos="pedidosDistribuidos"
              @analisar="analisaPedido($event)"
            />

            <PedidosValidacao
              :pedidos="pedidosValidados"
              @validar="validaPedido($event)"
            />

            <PedidosDevolvidos :pedidos="pedidosDevolvidos" />

            <PedidosProcessados :pedidos="pedidosProcessados" />
          </v-expansion-panels>
        </v-card-text>
      </v-card>

      <v-dialog v-model="distribuir" width="80%">
        <v-card>
          <v-card-title class="indigo darken-4 title white--text" dark>
            Distribuição do pedido
          </v-card-title>

          <v-card-text>
            <div v-if="!selectedUser.name">
              <p>
                Selecione o utilizador a quem deve ser atribuída a análise do
                pedido (basta clicar na linha correspondente):
              </p>

              <v-text-field
                v-model="procuraUtilizador"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>

              <v-data-table
                :headers="usersHeaders"
                :items="usersRecords"
                :search="procuraUtilizador"
                class="elevation-1"
              >
                <template v-slot:item="props">
                  <tr @click="selectedUser = props.item">
                    <td class="subheading">{{ props.item.name }}</td>
                    <td class="subheading">{{ props.item.entidade }}</td>
                  </tr>
                </template>
              </v-data-table>
            </div>

            <div v-else>
              <v-row>
                <p>
                  Tarefa atribuída a: <b>{{ selectedUser.name }}</b> (<b>{{
                    selectedUser.entidade
                  }}</b
                  >)
                </p>
              </v-row>

              <v-row>
                <v-col cols="2">
                  <div class="info-label">Despacho:</div>
                </v-col>
                <v-col>
                  <v-textarea
                    v-model="despacho"
                    auto-grow
                    solo
                    label="Introduza o texto para o despacho (opcional)..."
                    rows="1"
                  ></v-textarea>
                </v-col>
              </v-row>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="indigo darken-4"
              rounded
              dark
              @click="guardarDistribuicao"
            >
              Guardar
            </v-btn>

            <v-btn
              color="red darken-4"
              rounded
              dark
              @click="cancelarDistribuicao"
            >
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import PedidosNovos from "@/components/pedidos/PedidosNovos";
import PedidosAnalise from "@/components/pedidos/PedidosAnalise";
import PedidosValidacao from "@/components/pedidos/PedidosValidacao";
import PedidosDevolvidos from "@/components/pedidos/PedidosDevolvidos";
import PedidosProcessados from "@/components/pedidos/PedidosProcessados";

import { NIVEL_MINIMO_DISTRIBUIR_PEDIDOS_NOVOS } from "@/utils/consts";
import { filtraNivel } from "@/utils/utils";

export default {
  components: {
    PedidosNovos,
    PedidosAnalise,
    PedidosValidacao,
    PedidosDevolvidos,
    PedidosProcessados
  },

  data() {
    return {
      procuraUtilizador: "",
      pedidoParaDistribuir: {},
      distribuir: false,
      show: false,
      pedido: {},
      despacho: "",
      usersHeaders: [
        { text: "Nome", value: "name", class: "title" },
        { text: "Entidade", value: "entidade", class: "title" }
      ],
      usersRecords: [],
      selectedUser: {},
      pedidosSubmetidos: [],
      pedidosDistribuidos: [],
      pedidosValidados: [],
      pedidosDevolvidos: [],
      pedidosProcessados: []
    };
  },

  async created() {
    try {
      let pedidos = await this.$request("get", "/pedidos");
      pedidos = pedidos.data;

      this.pedidosSubmetidos = pedidos.filter(p => p.estado == "Submetido");
      this.pedidosDistribuidos = pedidos.filter(p => p.estado == "Distribuído");
      this.pedidosValidados = pedidos.filter(p => p.estado == "Apreciado");
      this.pedidosDevolvidos = pedidos.filter(p => p.estado == "Devolvido");
      this.pedidosProcessados = pedidos.filter(p => p.estado == "Validado");
    } catch (e) {
      return e;
    }
  },

  methods: {
    rowClicked: function(item) {
      this.$emit("pedidoSelected", item);
    },

    closePedido: function(item) {
      this.show = false;
    },

    distribuiPedido: async function(pedido) {
      try {
        var response = await this.$request("get", "/users");

        const utilizadores = filtraNivel(
          response.data,
          NIVEL_MINIMO_DISTRIBUIR_PEDIDOS_NOVOS,
          ">="
        );

        this.usersRecords = utilizadores;
        this.pedidoParaDistribuir = pedido;
        this.distribuir = true;
      } catch (e) {
        return e;
      }
    },

    analisaPedido(pedido) {
      this.$router.push("/pedidos/analisar/" + pedido.codigo);
    },

    validaPedido(pedido) {
      this.$router.push("/pedidos/validar/" + pedido.codigo);
    },

    cancelarDistribuicao: function() {
      this.distribuir = false;
      this.selectedUser = {};
      this.despacho = "";
    },

    guardarDistribuicao: async function() {
      var novaDistribuicao = {
        estado: "Distribuído",
        responsavel: this.selectedUser.email,
        data: new Date(),
        despacho: this.despacho
      };
      this.pedidoParaDistribuir.estado = "Distribuído";
      this.pedidoParaDistribuir.token = this.$store.state.token;

      this.$request("put", "/pedidos", {
        pedido: this.pedidoParaDistribuir,
        distribuicao: novaDistribuicao
      })
        .then(response => {
          var index = this.pedidosSubmetidos.findIndex(
            p => p.codigo == this.pedidoParaDistribuir.codigo
          );
          if (index != -1) {
            this.pedidosSubmetidos.splice(index, 1);
          }
          this.pedidosDistribuidos.push(this.pedidoParaDistribuir);

          this.distribuir = false;
          this.selectedUser = {};
          this.despacho = "";

          return response.data;
        })
        .catch(e => {
          return e;
        });
    }
  }
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
