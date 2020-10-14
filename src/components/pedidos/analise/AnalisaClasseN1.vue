<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row v-if="allowedInfo.includes(campo)" dense class="ma-1">
          <v-col cols="2">
            <div
              :key="campo"
              class="info-descricao"
              :class="`info-descricao-verde`"
            >
              {{ transformaKeys(campo) }}
            </div>
          </v-col>

          <v-col>
            <div v-if="!(info instanceof Array)" class="info-conteudo">
              <span v-if="info === '' || info === null">
                [Campo não preenchido na submissão do pedido]
              </span>
              <span v-else>{{ info }}</span>
            </div>

            <div v-else>
              <v-data-table
                v-if="campo === 'notasAp' || campo === 'notasEx'"
                :headers="notasAppHeader"
                :items="info"
                class="elevation-1"
                :footer-props="footerProps"
              >
                <template v-slot:no-data>
                  <v-alert
                    type="error"
                    width="100%"
                    class="m-auto mb-2 mt-2"
                    outlined
                  >
                    Nenhuma tipologia selecionada...
                  </v-alert>
                </template>

                <template v-slot:top>
                  <v-toolbar flat>
                    <v-btn rounded class="indigo accent-4 white--text">
                      Adicionar Notas
                    </v-btn>
                  </v-toolbar>
                </template>

                <template v-slot:item.sigla="{ item }">
                  <v-badge
                    v-if="novoItemAdicionado(item, campo)"
                    right
                    dot
                    inline
                    >{{ item.sigla }}</v-badge
                  >

                  <span v-else>
                    {{ item.sigla }}
                  </span>
                </template>

                <template v-slot:item.operacao="{ item }">
                  <v-icon color="red" @click="removeTipologia(item)">
                    delete
                  </v-icon>
                </template>
              </v-data-table>
            </div>
          </v-col>

          <!-- Operações -->
          <v-col cols="auto">
            <span v-if="!(info instanceof Array)">
              <v-icon class="mr-1" color="green"> check </v-icon>
              <v-icon class="mr-1" color="red"> clear </v-icon>
            </span>
            <v-icon v-if="!(info instanceof Array)" class="mr-1" color="orange">
              create
            </v-icon>

            <v-icon v-if="!(info instanceof Array)"> add_comment </v-icon>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row>
      <v-spacer />
      <PO operacao="Analisar" @avancarPedido="encaminharPedido($event)" />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import Loading from "@/components/generic/Loading";

import {
  comparaSigla,
  mapKeys,
  identificaItemAdicionado,
  adicionarNotaComRemovidos,
} from "@/utils/utils";

export default {
  props: ["p"],

  components: {
    PO,
    Loading,
  },

  data() {
    return {
      loading: true,
      json: null,
      animacoes: {},
      esconderOperacoes: {},
      allowedInfo: ["nivel", "codigo", "titulo", "notasAp", "notasEx"],
      novoHistorico: {},
      notasAppHeader: [
        { text: "Notas de Aplicação", value: "nota", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center",
        },
      ],
      footerProps: {
        "items-per-page-text": "Tipologias por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
      tipologias: [],
    };
  },

  async created() {
    try {
      await this.loadTipologias();

      this.loading = false;
    } catch (e) {
      this.erroDialog.visivel = true;
      this.erroDialog.mensagem =
        "Erro ao carregar os dados, por favor tente novamente";
    }
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);

    const copiaHistorico = JSON.parse(
      JSON.stringify(this.historico[this.historico.length - 1])
    );
    Object.keys(copiaHistorico).forEach((h) => (copiaHistorico[h].nota = null));

    this.novoHistorico = copiaHistorico;

    Object.keys(this.dados).forEach((key) => {
      this.esconderOperacoes[key] = false;
      this.animacoes[key] = true;
    });

    console.log(this.novoHistorico["nivel"].cor);
    console.log(copiaHistorico["nivel"].cor);

    console.log("donedone");
  },

  computed: {
    dados() {
      return this.p.objeto.dados;
    },

    historico() {
      return this.p.historico;
    },
  },

  methods: {
    transformaKeys(key) {
      return mapKeys(key);
    },
    async loadTipologias() {
      try {
        let { data } = await this.$request("get", "/tipologias/");

        this.tipologias = data.map((item) => {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
          };
        });
      } catch (error) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao carregar os dados, por favor tente novamente";
      }
    },

    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;

        this.novoHistorico = adicionarNotaComRemovidos(
          this.historico[this.historico.length - 1],
          this.novoHistorico
        );

        pedido.historico.push(this.novoHistorico);

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
  },
};
</script>

<style scoped>
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
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 1s;
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  opacity: 1;
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

@keyframes fadeInOpacity {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
