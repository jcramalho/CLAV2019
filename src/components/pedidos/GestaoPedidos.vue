<template>
  <div>
    <v-card class="ma-2">
      <v-card-title class="indigo darken-4 title white--text" dark>
        Gestão de Pedidos
      </v-card-title>
      <v-card-text>
        <v-expansion-panels>
          <PedidosLista
            :pedidos="pedidosSubmetidos"
            titulo="Pedidos novos"
            @distribuir="distribuiPedido($event)"
          />

          <v-expansion-panel popout>
            <PedidosLista
              :pedidos="pedidosDistribuidos"
              titulo="Pedidos em apreciação técnica"
              @analisar="analisaPedido($event)"
            />
          </v-expansion-panel>

          <v-expansion-panel popout>
            <PedidosLista
              :pedidos="pedidosValidados"
              titulo="Pedidos em validação"
            />
          </v-expansion-panel>

          <v-expansion-panel popout>
            <PedidosLista
              :pedidos="pedidosDevolvidos"
              titulo="Pedidos devolvidos"
            />
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <v-dialog v-model="distribuir" width="60%">
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

            <v-data-table
              :headers="usersHeaders"
              :items="usersRecords"
              class="elevation-1"
              hide-default-footer
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
            <p>
              Tarefa atribuída a:
              <b>{{ selectedUser.name }} ({{ selectedUser.entidade }})</b>.
            </p>
            <div class="info-label">Despacho</div>
            <v-textarea
              v-model="despacho"
              auto-grow
              solo
              label="Introduza o texto para o despacho (opcional)..."
              rows="1"
            ></v-textarea>
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
  </div>
</template>

<script>
import PedidosLista from "@/components/pedidos/PedidosLista.vue";

export default {
  components: { PedidosLista },
  data: () => ({
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
    pedidos: [],
    pedidosSubmetidos: [],
    pedidosDistribuidos: [],
    pedidosValidados: [],
    pedidosDevolvidos: []
  }),
  created: async function() {
    try {
      var response = await this.$request("get", "/api/pedidos");
      this.pedidos = response.data;
      this.pedidosSubmetidos = this.pedidos.filter(
        p => p.estado == "Submetido"
      );
      this.pedidosDistribuidos = this.pedidos.filter(
        p => p.estado == "Distribuído"
      );
      this.pedidosValidados = this.pedidos.filter(p => p.estado == "Validado");
      this.pedidosDevolvidos = this.pedidos.filter(
        p => p.estado == "Devolvido"
      );
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
        var response = await this.$request("get", "/api/users");
        this.usersRecords = response.data;
        this.pedidoParaDistribuir = pedido;
        this.distribuir = true;
      } catch (e) {
        return e;
      }
    },

    analisaPedido: function(pedido) {
      this.$router.push("/pedidos/analisar/" + pedido.codigo);
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

      this.$request("put", "/api/pedidos", {
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
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
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
