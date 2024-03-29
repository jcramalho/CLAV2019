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

            <template v-slot:no-results>
              <v-alert
                type="info"
                width="50%"
                class="m-auto mb-2 mt-2"
                outlined
              >
                Sem resultados para "<strong>{{ procuraUtilizador }}</strong
                >".
              </v-alert>
            </template>

            <template v-slot:no-data>
              <v-alert
                type="error"
                width="50%"
                class="m-auto mb-2 mt-2"
                outlined
              >
                Não existem utilizadores disponíveis...
              </v-alert>
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
import { filtraNivel } from "@/utils/permissoes";
import { NIVEIS_ANALISAR_PEDIDO, NIVEIS_VALIDAR_PEDIDO } from "@/utils/consts";

export default {
  props: ["pedido"],

  components: {
    Loading,
    ErroAPIDialog,
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
        { text: "Entidade", value: "entidade", class: "title" },
      ],
    };
  },

  async created() {
    try {
      await this.preparaUtilizadores(this.pedido.estado);
      this.pedidoCarregado = true;
    } catch (e) {
      console.log("e", e);
    }
  },

  methods: {
    async preparaUtilizadores(etapa) {
      const { data } = await this.$request("get", "/users");

      let utilizadoresFiltrados = [];

      switch (etapa) {
        case "Distribuído":
        case "Redistribuído":
          utilizadoresFiltrados = filtraNivel(data, NIVEIS_ANALISAR_PEDIDO);
          break;

        case "Apreciado":
        case "Reapreciado":
          utilizadoresFiltrados = filtraNivel(data, NIVEIS_VALIDAR_PEDIDO);
          break;

        default:
          utilizadoresFiltrados = data;
          break;
      }

      const responsavelAtual = this.pedido.distribuicao[
        this.pedido.distribuicao.length - 1
      ].proximoResponsavel;

      const utilizadoresSemAtual = utilizadoresFiltrados.filter(
        (utilizador) => utilizador.email !== responsavelAtual.email
      );

      this.utilizadores = utilizadoresSemAtual;
    },

    cancelar() {
      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.$emit("fecharDialog");
    },

    fecharErro() {
      this.erroPedido = false;
    },

    async substituir() {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedido));

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.historico.push(pedido.historico[pedido.historico.length - 1]);

        const novaDistribuicao = {
          estado: pedido.estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: this.utilizadorSelecionado.name,
            entidade: this.utilizadorSelecionado.entidade,
            email: this.utilizadorSelecionado.email,
          },
          data: new Date().toISOString(),
          despacho: this.mensagemDespacho
            ? `#Responsável substituído.\n${this.mensagemDespacho}`
            : "#Responsável substituído.",
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.utilizadorSelecionado = null;
        this.mensagemDespacho = null;

        this.$router.push("/pedidos");
      } catch (err) {
        this.erroPedido = true;

        let parsedError = Object.assign({}, err);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach((erro) => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        } else {
          this.erros.push({
            parametro: "Substituição de responsável",
            mensagem: "Ocorreu um erro ao tentar substituir o responsável.",
          });
        }
      }
    },
  },
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
