<template>
  <v-card :loading="!pedidoCarregado">
    <v-card-title class="indigo darken-4 title white--text" dark>
      Substituir responsável
    </v-card-title>

    <Loading v-if="!pedidoCarregado" :message="'dados'" />

    <div v-else>
      <v-card-text class="mt-2">
        <div v-if="!utilizadorSelecionado">
          <v-alert type="info">
            Clique sobre a linha da tabela para selecionar o utilizador que irá
            substituir <b>{{ responsavelAtual.nome }}</b> no pedido
            <b>{{ pedido.codigo }}</b
            >.
          </v-alert>

          <v-text-field
            filled
            v-model="procuraUtilizador"
            append-icon="search"
            label="Procurar utilizador"
            single-line
            hide-details
          />

          <v-data-table
            :headers="usersHeaders"
            :items="utilizadores"
            :items-per-page="5"
            :search="procuraUtilizador"
            class="elevation-1"
          >
            <template v-slot:item="props">
              <tr @click="utilizadorSelecionado = props.item">
                <td class="subheading">{{ props.item.name }}</td>
                <td class="subheading">
                  {{ props.item.entidade.split("_")[1] }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>

        <div v-else>
          <v-alert type="success">
            Tarefa atribuída a
            <b>
              {{
                `${this.utilizadorSelecionado.name} (${
                  this.utilizadorSelecionado.entidade.split("_")[1]
                })`
              }}
            </b>
          </v-alert>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Mensagem</div>
            </v-col>

            <v-col>
              <v-textarea
                solo
                hide-details
                color="indigo"
                :label="`Mensagem de despacho`"
                v-model="mensagemDespacho"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="red darken-4" text rounded dark @click="cancelar()">
          Cancelar
        </v-btn>

        <v-btn
          :disabled="utilizadorSelecionado === null"
          color="indigo accent-4 white--text"
          rounded
          @click="substituir()"
        >
          Substituir
        </v-btn>
      </v-card-actions>
    </div>

    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </v-card>
</template>

<script>
import Loading from "@/components/generic/Loading";
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";

export default {
  props: ["pedido"],

  components: {
    Loading,
    ErroAPIDialog
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      pedidoCarregado: false,
      responsavelAtual: this.pedido.distribuicao[
        this.pedido.distribuicao.length - 1
      ].proximoResponsavel,
      utilizadores: null,
      procuraUtilizador: null,
      utilizadorSelecionado: null,
      mensagemDespacho: null,
      usersHeaders: [
        { text: "Nome", value: "name", class: "title" },
        { text: "Entidade", value: "entidade", class: "title" }
      ]
    };
  },

  async created() {
    try {
      const response = await this.$request("get", "/users");
      this.utilizadores = response.data;
      this.pedidoCarregado = true;
    } catch (e) {
      console.log("e", e);
    }
  },

  methods: {
    cancelar() {
      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.$emit("fecharDialog");
    },

    fecharErro() {
      this.erroPedido = false;
    },

    async substituir() {
      const distribuicao = JSON.parse(
        JSON.stringify(
          this.pedido.distribuicao[this.pedido.distribuicao.length - 1]
        )
      );

      delete distribuicao.despacho;

      distribuicao.data = new Date().toISOString();
      distribuicao.proximoResponsavel = {
        nome: this.utilizadorSelecionado.name,
        entidade: this.utilizadorSelecionado.entidade,
        email: this.utilizadorSelecionado.email
      };

      if (this.mensagemDespacho !== null)
        distribuicao.despacho = this.mensagemDespacho;

      try {
        await this.$request(
          "post",
          `/pedidos/${this.pedido.codigo}/distribuicao`,
          distribuicao
        );

        this.utilizadorSelecionado = null;
        this.mensagemDespacho = null;

        this.$router.push("/pedidos");
      } catch (err) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, err);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach(erro => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        } else {
          this.erros.push({
            sobre: "Substituição de responsável",
            mensagem: "Ocorreu um erro ao tentar substituir o responsável."
          });
        }
      }
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
