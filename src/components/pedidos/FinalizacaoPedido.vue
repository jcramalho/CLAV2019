<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card width="60%">
        <v-card-title class="blue white--text" dark>
          <v-skeleton-loader
            :loading="!pedidoCarregado"
            transition="fade-transition"
            type="card-heading"
            width="100%"
          >
            <span>Pedido finalizado com sucesso!</span>
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
                    Será enviada uma notificação ao criador do pedido.
                  </v-alert>
                </v-skeleton-loader>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-skeleton-loader
            :loading="!pedidoCarregado"
            transition="fade-transition"
            type="button"
          >
            <v-btn class="blue" dark @click="consultar()">
              Consultar
              <v-icon right>search</v-icon>
            </v-btn>
          </v-skeleton-loader>
          <v-spacer />
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
    ErroAPIDialog
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      pedidoCarregado: false,
      pedido: {},
      objetoPedido: {}
    };
  },

  async created() {
    try {
      const { data } = await this.$request("get", `/pedidos/${this.idp}`);

      this.pedido = {
        codigo: data.codigo,
        data: data.data.split("T")[0],
        tipoPedido: `${data.objeto.acao} - ${data.objeto.tipo}`
      };

      this.objetoPedido = data.objeto;

      this.pedidoCarregado = true;
    } catch (e) {
      this.erroPedido = true;

      let parsedError = Object.assign({}, e);
      parsedError = parsedError.response;

      if (parsedError !== undefined) {
        if (parsedError.status === 422) {
          parsedError.data.forEach(erro => {
            this.erros.push({ parametro: erro.param, mensagem: erro.msg });
          });
        }
      } else {
        this.erros.push({
          parametro: "Acesso à Ontologia",
          mensagem: "Ocorreu um erro ao aceder à ontologia."
        });
      }
    }
  },

  methods: {
    identificador() {
      let id =
        this.objetoPedido.dados.id ||
        this.objetoPedido.dados.sigla ||
        this.objetoPedido.dados.codigo;

      if (id === undefined)
        id =
          this.objetoPedido.dadosOriginais.id ||
          this.objetoPedido.dadosOriginais.sigla ||
          this.objetoPedido.dadosOriginais.codigo;

      return id;
    },

    consultar() {
      const id = this.identificador();

      switch (this.objetoPedido.tipo) {
        case "RADA":
          this.$router.push(`/rada/${this.objetoPedido.dados.id}`);
          break;
        case "Tipologia":
          this.$router.push(`/tipologias/tip_${id}`);
          break;

        case "Entidade":
          this.$router.push(`/entidades/ent_${id}`);
          break;

        case "Legislação":
          this.$router.push(`/legislacao/${id}`);
          break;

        case "TS Organizacional":
          this.$router.push(`/ts/${id}`);
          break;

        case "TS Pluriorganizacional":
          this.$router.push(`/ts/${id}`);
          break;

        default:
          this.$router.push("/");
          break;
      }
    },

    fecharErro() {
      this.erroPedido = false;
      this.$router.push("/");
    }
  }
};
</script>
