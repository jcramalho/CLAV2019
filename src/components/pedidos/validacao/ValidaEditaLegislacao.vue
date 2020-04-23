<template>
  <div>
    <v-row v-for="(info, i) in infoPedido" :key="i">
      <!-- Label -->
      <v-col
        cols="2"
        v-if="
          info.campo !== 'Código' &&
            info.conteudo !== '' &&
            info.conteudo !== null &&
            info.conteudo !== undefined
        "
      >
        <div class="info-label">{{ info.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col
        v-if="
          info.campo !== 'Código' &&
            info.conteudo !== '' &&
            info.conteudo !== null &&
            info.conteudo !== undefined
        "
      >
        <!-- Se o conteudo for uma lista de entidades -->
        <v-data-table
          v-if="info.campo === 'Entidades'"
          :headers="headersEntidades"
          :items="info.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td><v-icon color="red">delete</v-icon></td>
            </tr>
          </template>

          <template v-slot:top>
            <v-toolbar flat :color="info.cor">
              <v-spacer />
              <v-icon color="green" @click="verifica(info)">check</v-icon>
              <v-icon color="red" @click="anula(info)">clear</v-icon>
            </v-toolbar>
          </template>
        </v-data-table>

        <!-- Se o conteudo for uma lista de processos -->
        <v-data-table
          v-else-if="info.campo === 'Processos'"
          :headers="headersProcessos"
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

        <!-- Se o contudo for texto -->
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
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";

export default {
  props: ["p"],

  components: {
    PO,
    ErroAPIDialog,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      dialogEnditades: false,
      dialogProcessos: false,
      infoPedido: [
        { campo: "Data", conteudo: this.p.objeto.dados.data, cor: null },
        { campo: "Sumário", conteudo: this.p.objeto.dados.sumario, cor: null },
        { campo: "Link", conteudo: this.p.objeto.dados.link, cor: null },
        {
          campo: "Entidades",
          conteudo: this.p.objeto.dados.entidadesSel,
          cor: null,
        },
        {
          campo: "Processos",
          conteudo: this.p.objeto.dados.processosSel,
          cor: null,
        },
      ],
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
      ],
    };
  },

  methods: {
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

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
        //console.log("e :", e);
      }
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        if (pedido.objeto.dados.hasOwnProperty("designacao")) {
          let numeroErros = await this.validar(
            pedido.objeto.acao,
            pedido.objeto.dados
          );

          if (numeroErros > 0) this.erroPedido = true;
        }

        for (const key in pedido.objeto.dadosOriginais) {
          if (!pedido.objeto.dados.hasOwnProperty(key)) {
            pedido.objeto.dados[key] = pedido.objeto.dadosOriginais[key];
          }

          if (
            pedido.objeto.dados[key] === "" ||
            pedido.objeto.dados[key] === null
          )
            delete pedido.objeto.dados[key];
        }

        if (pedido.objeto.dados.diplomaFonte === "Não especificada")
          delete pedido.objeto.dados.diplomaFonte;

        await this.$request(
          "put",
          `/legislacao/${pedido.objeto.dados.id}`,
          pedido.objeto.dados
        );

        const estado = "Validado";

        let dadosUtilizador = this.$verifyTokenUser();

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

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError.status === 422) {
          parsedError.data.forEach((erro) => {
            this.erros.push({ parametro: erro.param, mensagem: erro.msg });
          });
        } else {
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
        }

        this.erroPedido = true;
      }
    },

    async validar(dados) {
      let numeroErros = 0;

      // Designação
      try {
        let existeDesignacao = await this.$request(
          "get",
          "/legislacao/designacao?valor=" + encodeURIComponent(dados.designacao)
        );

        if (existeDesignacao.data) {
          this.erros.push({
            sobre: "Nome da Legislçrão",
            mensagem: "Nome da legislação já existente na BD.",
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

      return numeroErros;
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
      this.dialogEnditades = false;
      this.dialogProcessos = false;
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
