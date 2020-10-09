<template>
  <div>
    <DespachoAprovacao
      v-if="!!sumario"
      @criar="finalizarPedido"
      @devolver="devolverPedido"
      :sumario="sumario"
      :numeroDespacho="numeroDespacho"
    />
    <ConsultaPedido
      :idp="$route.params.idPedido"
      @pedido_original="pedido = $event"
    />
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>
  </div>
</template>

<script>
import ConsultaPedido from "@/components/pedidos/ConsultaPedido.vue"; // @ is an alias to /src
import DespachoAprovacao from "@/components/pedidos/DespachoAprovacao.vue";
import { converterParaTriplosRADA } from "@/utils/conversorTriplosRADA";
import ErroDialog from "@/components/generic/ErroDialog";
const nanoid = require("nanoid");

export default {
  data() {
    return {
      pedido: null,
      sumario: null,
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      numeroDespacho: null
    };
  },
  async created() {
    let res = await this.$request("get", "/contador/despacho");
    this.numeroDespacho = res.data.valor.toString() + '/' + new Date().getFullYear();
  },
  watch: {
    pedido(newValue) {
      this.sumario = newValue.objeto.dados.titulo;
    },
  },
  methods: {
    async finalizarPedido(despacho) {
      try {
        let res = await this.$request("get", "/contador/despacho");

        this.numeroDespacho = res.data.valor.toString() + '/' + new Date().getFullYear();

        const despachoAprovacao = {
          id: "leg_" + nanoid(),
          numero: this.numeroDespacho,
          sumario: despacho.sumario,
          tipo: "Despacho",
          data: despacho.data,
          link: "/rada/" + this.pedido.objeto.dados.id,
          diplomaFonte: "RADA",
          dataRevogacao: "",
          estado: "Ativo",
          entidadesSel: [
            {
              sigla: "DGLAB",
              designacao:
                "Direção-Geral do Livro, dos Arquivos e das Bibliotecas",
              id: "ent_DGLAB",
            },
          ],
          processosSel: [],
        };

        if (this.pedido.objeto.tipo === "RADA") {
          //Isso faz com que tenhamos uma object property ou data property, tendo que se verificar na construção dos triplos;
          let responseSFC = await this.$request(
            "get",
            "/vocabularios/vc_pcaSubformaContagem"
          );

          let subformasContagem = responseSFC.data.map((item) => {
            return {
              label: item.termo.split(": ")[1] + ": " + item.desc,
              value: item.idtermo.split("#")[1],
            };
          });

          let triplos = await converterParaTriplosRADA(
            this.pedido.objeto.dados,
            subformasContagem,
            despachoAprovacao.data,
            despachoAprovacao.id
          );

          await this.$request("post", "/rada", { triplos });
        }

        await this.$request("post", "/legislacao", despachoAprovacao);

        let dadosUtilizador = this.$verifyTokenUser();

        let novaDistribuicao = {
          estado: "Validado",
          responsavel: dadosUtilizador.email,
          data: new Date(),
        };

        if (!!despacho.mensagem) {
          novaDistribuicao["despacho"] = despacho.mensagem;
        }

        this.pedido.estado = "Validado";

        await this.$request("put", "/pedidos", {
          pedido: this.pedido,
          distribuicao: novaDistribuicao,
        });

        await this.$request("put", "/contador/despacho");

        this.$router.push(
          `/pedidos/finalizacao/${this.$route.params.idPedido}`
        );
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao finalizar o pedido!";
      }
    },
    async devolverPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Devolvido",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        this.pedido.estado = "Devolvido";

        await this.$request("put", "/pedidos", {
          pedido: this.pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        console.log(e);
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem = "Erro ao devolver o pedido!";
      }
    },
  },
  components: {
    ConsultaPedido,
    DespachoAprovacao,
    ErroDialog,
  },
};
</script>
