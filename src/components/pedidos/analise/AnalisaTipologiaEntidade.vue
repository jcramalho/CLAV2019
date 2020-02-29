<template>
  <div>
    <v-row v-for="(t, i) in tipologiaInfo" :key="i">
      <!-- Label -->
      <v-col cols="2" v-if="t.conteudo !== '' && t.conteudo !== undefined">
        <div class="info-label">{{ t.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col v-if="t.conteudo !== '' && t.conteudo !== undefined">
        <!-- Se o conteudo for uma lista de tipologias-->
        <v-data-table
          v-if="t.campo == 'Entidades'"
          :headers="headersTipologias"
          :items="t.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.operacao="{ item }">
            <v-icon color="red" @click="">delete</v-icon>
          </template>

          <template v-slot:top>
            <v-toolbar flat :color="t.cor">
              <v-dialog v-model="dialogTipologias" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn rounded class="indigo accent-4 white--text" v-on="on">
                    Adicionar em Falta
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Selecione uma Tipologia</span>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="indigo darken-1" text @click="close"
                      >Fechar</v-btn
                    >
                    <!-- <v-btn color="blue darken-1" text @click="save">Save</v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer />
              <v-icon color="green" @click="verifica(t)">check</v-icon>
            </v-toolbar>
          </template>
        </v-data-table>

        <!-- Se o conteudo for texto -->
        <v-text-field
          v-else
          solo
          readonly
          hide-details
          :background-color="t.cor"
          :value="t.conteudo"
        >
          <template slot="append">
            <v-icon color="green" @click="verifica(t)">check</v-icon>
            <v-icon color="red" @click="anula(t)">clear</v-icon>
            <v-icon @click="">create</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <PO
        @avancarPedido="despacho($event)"
        @mensagemDespacho="despacho($event)"
      />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/analise/PainelOperacoes";
export default {
  props: ["p"],

  components: {
    PO
  },

  data() {
    return {
      dialogTipologias: false,
      tipologiaInfo: [
        {
          campo: "Sigla",
          conteudo: this.p.objeto.dados.sigla,
          cor: null
        },
        {
          campo: "Designação",
          conteudo: this.p.objeto.dados.designacao,
          cor: null
        },
        {
          campo: "Entidades",
          conteudo: this.p.objeto.dados.entidadesSel,
          cor: null
        },
        {
          campo: "Código",
          conteudo: this.p.objeto.dados.codigo,
          cor: null
        }
      ],
      headersTipologias: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center"
        }
      ]
    };
  },

  methods: {
    async despacho(evento) {
      switch (evento.tipoOperacao) {
        case "Devolver":
          await this.despacharPedido("Devolvido", evento.mensagem);
          break;

        case "Encaminhar":
          await this.encaminharPedido("Apreciado", evento);
          break;

        default:
          break;
      }
    },

    async despacharPedido(estado, mensagem) {
      try {
        let dadosUtilizador = await this.$request(
          "get",
          "/users/" + this.$store.state.token + "/token"
        );

        dadosUtilizador = dadosUtilizador.data;
        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: mensagem
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log("e :", e);
      }
    },

    async encaminharPedido(estado, dados) {
      console.log("estado :", estado);
      try {
        let dadosUtilizador = dados.utilizadorSelecionado;

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));
        pedido.estado = estado;
        pedido.token = this.$store.state.token;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        console.log("e :", e);
      }
    },

    verifica(obj) {
      const i = this.tipologiaInfo.findIndex(o => o.campo == obj.campo);
      this.tipologiaInfo[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.tipologiaInfo.findIndex(o => o.campo == obj.campo);
      this.tipologiaInfo[i].cor = "red lighten-3";
    },

    close() {
      this.dialogtipologias = false;
    }
  }
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
