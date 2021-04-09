<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card width="60%">
        <v-card-title class="justify-center">
          <v-skeleton-loader
            :loading="!pedidoCarregado"
            transition="fade-transition"
            type="card-heading"
            width="75%"
          >
            <span class="clav-content-title-2">Pedido submetido com sucesso!</span>
          </v-skeleton-loader>
        </v-card-title>

        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <v-col>
                <v-skeleton-loader
                  :loading="!pedidoCarregado"
                  transition="fade-transition"
                  type="list-item-two-line"
                >
                  <v-text-field
                    filled
                    :value="pedido.codigo"
                    label="Número do pedido"
                    readonly
                  />
                </v-skeleton-loader>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-skeleton-loader
                  :loading="!pedidoCarregado"
                  transition="fade-transition"
                  type="list-item-two-line"
                >
                  <v-text-field
                    filled
                    :value="pedido.tipoPedido"
                    label="Tipo do pedido"
                    readonly
                  />
                </v-skeleton-loader>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-skeleton-loader
                  :loading="!pedidoCarregado"
                  transition="fade-transition"
                  type="list-item-two-line"
                >
                  <v-text-field
                    filled
                    :value="pedido.data"
                    label="Data de Submissão"
                    readonly
                  />
                </v-skeleton-loader>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-skeleton-loader
                  :loading="!pedidoCarregado"
                  transition="fade-transition"
                  type="list-item-avatar-two-line"
                >
                  <v-alert type="info" border="left" text>
                    Aguarde a notificação de resposta ao seu pedido.
                  </v-alert>
                </v-skeleton-loader>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col align="center">
              <v-skeleton-loader
                :loading="!pedidoCarregado"
                transition="fade-transition"
                type="button"
              >
                <v-btn class="primary" rounded @click="verPedido()">
                  Ver Pedido
                  <v-icon right>search</v-icon>
                </v-btn>
              </v-skeleton-loader>
            </v-col>
            <v-col align="center">
              <v-skeleton-loader
                :loading="!pedidoCarregado"
                transition="fade-transition"
                type="button"
              >
                <v-btn class="primary" rounded @click="$router.push('/users/painel')">
                  Painel de controlo
                  <unicon
                    class="ml-1"
                    name="perfil-icon"
                    width="15"
                    height="15"
                    viewBox="0 0 20.71 23.677"
                    fill="#fff"
                  />
                </v-btn>
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </v-container>
</template>

<script>
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";

export default {
  props: ["idp"],

  components: {
    ErroAPIDialog,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      pedidoCarregado: false,
      pedido: {},
    };
  },

  async created() {
    try {
      const { data } = await this.$request("get", `/pedidos/${this.idp}`);

      this.pedido = {
        codigo: data.codigo,
        data: data.data.split("T")[0],
        tipoPedido: `${data.objeto.acao} - ${data.objeto.tipo}`,
      };

      this.pedidoCarregado = true;
    } catch (e) {
      this.erroPedido = true;

      let parsedError = Object.assign({}, e);
      parsedError = parsedError.response;

      if (parsedError !== undefined) {
        if (parsedError.status === 422) {
          parsedError.data.forEach((erro) => {
            this.erros.push({ parametro: erro.param, mensagem: erro.msg });
          });
        }
      } else {
        this.erros.push({
          parametro: "Acesso à Ontologia",
          mensagem: "Ocorreu um erro ao aceder à ontologia.",
        });
      }
    }
  },

  methods: {
    verPedido() {
      localStorage.setItem("submissao", true);

      this.$router.push(`/users/pedidos/${this.idp}`);
    },

    fecharErro() {
      this.erroPedido = false;
      this.$router.push("/");
    },
  },
};
</script>
