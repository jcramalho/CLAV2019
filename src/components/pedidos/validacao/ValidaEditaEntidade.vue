<template>
  <div>
    <v-row v-for="(info, i) in infoPedido" :key="i">
      <!-- Label -->
      <v-col
        cols="2"
        v-if="
          info.campo !== 'Sigla' &&
            info.conteudo !== '' &&
            info.conteudo !== undefined
        "
      >
        <div class="info-label">{{ info.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col
        v-if="
          info.campo !== 'Sigla' &&
            info.conteudo !== '' &&
            info.conteudo !== undefined
        "
      >
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

        // TODO: Adicionar validação para a designação
        // Se for extinção não valida

        if (pedido.objeto.acao === "Extinção") {
          await this.$request(
            "put",
            `/entidades/ent_${pedido.objeto.dados.sigla}/extinguir`,
            { dataExtincao: pedido.objeto.dados.dataExtincao }
          );
        } else {
          for (const key in pedido.objeto.dadosOriginais) {
            if (!pedido.objeto.dados.hasOwnProperty(key)) {
              pedido.objeto.dados[key] = pedido.objeto.dadosOriginais[key];
            }
          }

          await this.$request(
            "put",
            `/entidades/ent_${pedido.objeto.dados.sigla}`,
            pedido.objeto.dados
          );
        }

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
