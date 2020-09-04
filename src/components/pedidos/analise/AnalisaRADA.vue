<template>
  <div>
    <v-row>
      <v-col cols="12">
        <!-- <p>{{ "P: " + JSON.stringify(this.p.historico) }}</p>
        <br />
        <p>{{ "DADOS: " + JSON.stringify(this.p) }}</p>-->
        <!-- <br />
        <p>{{ "novoHistorico: " + JSON.stringify(novoHistorico) }}</p>-->
        <!-- <br />
        <p>{{ "animacoes: " + JSON.stringify(animacoes) }}</p>-->
        <v-stepper vertical class="elevation-0">
          <v-stepper-step color="amber accent-3" step="1" editable>
            <font size="4">
              <b>Informação Geral</b>
            </font>
          </v-stepper-step>
          <v-stepper-content step="1">
            <AnalisaInformacaoGeral
              :entidades="entidades"
              :RADA="p.objeto.dados"
              :novoHistorico="novoHistorico"
            />
          </v-stepper-content>
          <v-stepper-step color="amber accent-3" step="2" editable>
            <font size="4">
              <b>Relatório Expositivo</b>
            </font>
          </v-stepper-step>
          <v-stepper-content step="2">
            <AnalisaRE :RADA="p.objeto.dados" :novoHistorico="novoHistorico" />
          </v-stepper-content>
          <v-stepper-step color="amber accent-3" step="3" editable>
            <font size="4">
              <b>Tabela de Seleção</b>
            </font>
          </v-stepper-step>
          <v-stepper-content step="3">
            <AnalisaTS :RADA="p.objeto.dados" :novoHistorico="novoHistorico" />
          </v-stepper-content>
        </v-stepper>
        <!-- <h1>RADAAA</h1>
        <p>{{ p.objeto }}</p>-->
      </v-col>
    </v-row>
    <v-row>
      <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
        <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
      </v-dialog>
    </v-row>
    <v-row>
      <v-spacer />
      <PO
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
  </div>
</template>

<script>
import AnalisaInformacaoGeral from "@/components/pedidos/analise/rada/AnalisaInformacaoGeral";
import AnalisaRE from "@/components/pedidos/analise/rada/AnalisaRE";
import AnalisaTS from "@/components/pedidos/analise/rada/AnalisaTS";
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/generic/ErroDialog";

export default {
  props: ["p"],
  components: {
    PO,
    ErroDialog,
    AnalisaInformacaoGeral,
    AnalisaRE,
    AnalisaTS,
  },
  data() {
    return {
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      novoHistorico: null,
      entidades: [],
    };
  },
  async created() {
    this.novoHistorico = JSON.parse(
      JSON.stringify(this.p.historico[this.p.historico.length - 1])
    );

    Object.keys(this.novoHistorico).forEach((chave) => {
      if (chave == "RE") {
        Object.keys(this.novoHistorico["RE"]).forEach((chaveRE) => {
          this.novoHistorico["RE"][chaveRE].nota = null;
        });
      } else {
        this.novoHistorico[chave].nota = null;
      }
    });

    // pedido para entidades
    let response = await this.$request("get", "/entidades");
    this.entidades = response.data.map((item) => {
      return item.sigla + " - " + item.designacao;
    });
  },
  methods: {
    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email,
          },
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao distribuir o pedido, por favor tente novamente";
      }
    },
    async despacharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: "Devolvido",
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = "Devolvido";

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },
  },
};
</script>

<style>
.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-verde {
  opacity: 1;
  height: auto;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  opacity: 1;
  height: auto;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #ffe0b2; /* lighten-4 */
}
</style>