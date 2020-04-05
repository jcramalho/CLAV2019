<template>
  <div>
    <v-row v-for="(info, i) in infoPedido" :key="i">
      <!-- Label -->
      <v-col
        cols="2"
        v-if="info.conteudo !== '' && info.conteudo !== undefined"
      >
        <div class="info-label">{{ info.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col v-if="info.conteudo !== '' && info.conteudo !== undefined">
        <!-- Se o conteudo for uma lista de tipologias-->
        <v-data-table
          v-if="info.campo == 'Tipologias'"
          :headers="headersTipologias"
          :items="info.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat :color="info.cor">
              <v-spacer />
              <v-icon color="green" @click="verifica(info)">check</v-icon>
              <v-icon color="red" @click="anula(info)">clear</v-icon>
            </v-toolbar>
          </template>
        </v-data-table>

        <!-- Se o conteudo for texto -->
        <v-text-field
          v-else
          solo
          readonly
          hide-details
          :background-color="info.cor"
          :value="info.conteudo"
        >
          <template slot="append">
            <v-icon color="green" @click="verifica(info)">check</v-icon>
            <v-icon color="red" @click="anula(info)">clear</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <!-- Dialog se existir erros no pedido à API -->
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";

export default {
  props: ["p"],

  components: {
    PO,
    ErroDialog,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      dialogTipologias: false,
      infoPedido: [
        {
          campo: "Sigla",
          conteudo: this.p.objeto.dados.sigla,
          cor: null,
        },
        {
          campo: "Designação",
          conteudo: this.p.objeto.dados.designacao,
          cor: null,
        },
        {
          campo: "Internacional",
          conteudo: this.p.objeto.dados.internacional,
          cor: null,
        },
        { campo: "SIOE", conteudo: this.p.objeto.dados.sioe, cor: null },
        {
          campo: "Tipologias",
          conteudo: this.p.objeto.dados.tipologiasSel,
          cor: null,
        },
        {
          campo: "Data Extinção",
          conteudo: this.p.objeto.dados.dataExtincao,
          cor: null,
        },
      ],
      headersTipologias: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
    };
  },

  methods: {
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = await this.$request(
          "get",
          "/users/" + this.$store.state.token + "/token"
        );

        dadosUtilizador = dadosUtilizador.data;
        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho,
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        console.log("e :", e);
      }
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let numeroErros = await this.validarEntidade(
          pedido.objeto.acao,
          pedido.objeto.dados
        );

        if (numeroErros > 0) {
          this.erroPedido = true;
        } else {
          for (const key in pedido.objeto.dados) {
            if (
              pedido.objeto.dados[key] === undefined ||
              pedido.objeto.dados[key] === null ||
              pedido.objeto.dados[key] === ""
            ) {
              delete pedido.objeto.dados[key];
            }
          }

          await this.$request("post", "/entidades", pedido.objeto.dados);

          const estado = "Validado";

          let dadosUtilizador = await this.$request(
            "get",
            "/users/" + this.$store.state.token + "/token"
          );
          dadosUtilizador = dadosUtilizador.data;

          const novaDistribuicao = {
            estado: estado,
            responsavel: dadosUtilizador.email,
            data: new Date(),
            despacho: dados.mensagemDespacho,
          };

          pedido.estado = estado;
          pedido.token = this.$store.state.token;

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });

          this.$router.go(-1);
        }
      } catch (e) {
        this.erros.push({
          sobre: "Acesso à Ontologia",
          mensagem: "Ocorreu um erro ao aceder à ontologia.",
        });
        this.erroPedido = true;
        console.log("e :", e);
      }
    },

    verifica(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "red lighten-3";
    },

    fecharErro() {
      this.erroPedido = false;
    },

    close() {
      this.dialogTipologias = false;
    },

    async validarEntidade(acao, dados) {
      let numeroErros = 0;

      // Designação
      if (
        (dados.designacao === "" || dados.designacao === null) &&
        acao === "Criação"
      ) {
        this.erros.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio.",
        });
        numeroErros++;
      } else if (acao === "Criação") {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/entidades/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            this.erros.push({
              sobre: "Nome da Entidade",
              mensagem: "Nome da entidade já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação.",
          });
        }
      }

      // Sigla
      if ((dados.sigla === "" || dados.sigla === null) && acao === "Criação") {
        this.erros.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia.",
        });
        numeroErros++;
      } else if (acao === "Criação") {
        try {
          let existeSigla = await this.$request(
            "get",
            "/entidades/sigla?valor=" + encodeURIComponent(dados.sigla)
          );
          if (existeSigla.data) {
            this.erros.push({
              sobre: "Sigla",
              mensagem: "Sigla já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da sigla.",
          });
        }
      }

      // Internacional
      if (dados.internacional === "" || dados.internacional === null) {
        this.erros.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção.",
        });
        numeroErros++;
      }

      // SIOE
      if (dados.sioe !== "" && dados.sioe !== null) {
        if (dados.sioe.length > 12) {
          this.erros.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
          });
          numeroErros++;
        }
      }

      return numeroErros;
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
