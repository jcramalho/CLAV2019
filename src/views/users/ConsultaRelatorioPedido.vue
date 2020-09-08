<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <ConsultaRelatorioPedido v-else :pedido="pedido" />

    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";
import Loading from "@/components/generic/Loading";
import ConsultaRelatorioPedido from "@/components/users/ConsultaRelatorioPedido.vue"; // @ is an alias to /src

export default {
  components: {
    Loading,
    ConsultaRelatorioPedido,
    ErroAPIDialog,
  },

  data() {
    return {
      loading: true,
      pedido: {},
      erroPedido: false,
      erros: [],
    };
  },

  async created() {
    try {
      const { data } = await this.$request(
        "get",
        `/pedidos/${this.$route.params.numeroPedido}`
      );

      this.pedido = data;
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

    if (!["Validado", "Devolvido"].includes(this.pedido.estado)) {
      this.erros.push({
        parametro: "Estado do pedido",
        mensagem:
          "O pedido encontra-se num estado onde ainda não pode ser gerado um relatório. Espere que o pedido chegue ao fim para consultar o relatório.",
      });
      this.erroPedido = true;
    } else {
      this.loading = false;
    }
  },

  methods: {
    fecharErro() {
      this.erroPedido = false;
      this.$router.push("/users/pedidos");
    },
  },
};
</script>
