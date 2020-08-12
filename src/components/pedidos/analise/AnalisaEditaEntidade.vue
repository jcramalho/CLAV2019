<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row
          v-if="campo !== 'sigla' && campo !== 'estado'"
          dense
          class="ma-1"
        >
          <!-- Label -->
          <v-col cols="2">
            <div
              :key="`${novoHistorico[campo].cor}${animacoes[campo]}`"
              class="info-descricao"
              :class="`info-descricao-${novoHistorico[campo].cor}`"
            >
              {{ transformaKeys(campo) }}
            </div>
          </v-col>

          <!-- Conteudo -->
          <v-col>
            <div v-if="!(info instanceof Array)" class="info-conteudo">
              <span v-if="info === '' || info === null">
                [Campo não preenchido na submissão do pedido]
              </span>
              <span v-else>{{ info }}</span>
            </div>

            <div v-else>
              <!-- Se o conteudo for uma lista de tipologias-->
              <v-data-table
                v-if="campo === 'tipologiasSel'"
                :headers="tipologiasHeaders"
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

                <template v-slot:top>
                  <v-toolbar flat>
                    <v-btn
                      rounded
                      class="indigo accent-4 white--text"
                      @click="abreTipologiasDialog()"
                    >
                      Adicionar Tipologias
                    </v-btn>
                  </v-toolbar>
                </template>
              </v-data-table>
            </div>
          </v-col>

          <!-- Operações -->
          <v-col cols="auto">
            <span v-if="!esconderOperacoes[campo]">
              <v-icon class="mr-1" color="green" @click="verifica(campo)">
                check
              </v-icon>
              <v-icon class="mr-1" color="red" @click="anula(campo)">
                clear
              </v-icon>
            </span>
            <v-icon
              v-if="!(info instanceof Array)"
              class="mr-1"
              color="orange"
              @click="edita(campo)"
            >
              create
            </v-icon>

            <v-icon @click="abrirNotaDialog(campo)">
              add_comment
            </v-icon>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-spacer />
        <PO
          operacao="Analisar"
          @avancarPedido="encaminharPedido($event)"
          @devolverPedido="despacharPedido($event)"
        />
      </v-row>
    </div>

    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog.visivel" width="70%" persistent>
      <AdicionarNota
        :campo="notaDialog.campo"
        :notaAtual="notaDialog.nota"
        @fechar="notaDialog.visivel = false"
        @adicionar="adicionarNota($event)"
      />
    </v-dialog>

    <!-- Dialog de edição-->
    <v-dialog v-model="editaCampo.visivel" width="70%" persistent>
      <EditarCamposDialog
        :campo="editaCampo"
        :tipoPedido="p.objeto.tipo"
        @fechar="fechaEditaCampoDialog($event)"
        @editarCampo="editarCampo($event)"
      />
    </v-dialog>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>

    <!-- Dialog de tipologias-->
    <v-dialog v-model="dialogTipologias" width="50%" persistent>
      <SelecionaAutocomplete
        :mensagem="mensagemAutocomplete"
        :dados="tipologias"
        @fechar="fechaTipologiasDialog"
        @selecao="adicionaTipologias"
      />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import SelecionaAutocomplete from "@/components/pedidos/generic/SelecionaAutocomplete";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";

import Loading from "@/components/generic/Loading";
import ErroDialog from "@/components/generic/ErroDialog";

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
    ErroDialog,
    SelecionaAutocomplete,
    EditarCamposDialog,
    AdicionarNota,
  },

  data() {
    return {
      animacoes: {},
      esconderOperacoes: {},
      notaDialog: {
        visivel: false,
        campo: "",
        nota: "",
      },
      novoHistorico: {},
      loading: true,
      editaCampo: {
        visivel: false,
        nome: "",
        key: "",
        valorAtual: "",
      },

      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      tipologiasHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
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

      mensagemAutocomplete: {
        titulo: "tipologias",
        autocomplete: "tipologias",
      },
      dialogTipologias: false,
      tipologias: [],
    };
  },

  computed: {
    dados() {
      return this.p.objeto.dados;
    },

    historico() {
      return this.p.historico;
    },
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
    const copiaHistorico = JSON.parse(
      JSON.stringify(this.historico[this.historico.length - 1])
    );

    Object.keys(copiaHistorico).forEach((h) => (copiaHistorico[h].nota = null));

    this.novoHistorico = copiaHistorico;

    Object.keys(this.dados).forEach((key) => {
      this.esconderOperacoes[key] = false;
      this.animacoes[key] = true;
    });
  },

  methods: {
    novoItemAdicionado(item, lista) {
      return identificaItemAdicionado(
        item,
        lista,
        this.historico[this.historico.length - 1]
      );
    },

    transformaKeys(key) {
      return mapKeys(key);
    },

    abreTipologiasDialog() {
      this.dados.tipologiasSel.forEach((tipSel) => {
        const index = this.tipologias.findIndex(
          (tip) => tip.sigla === tipSel.sigla
        );

        if (index !== -1) this.tipologias.splice(index, 1);
      });

      this.dialogTipologias = true;
    },

    fechaTipologiasDialog() {
      this.dialogTipologias = false;
    },

    removeTipologia(tipologia) {
      const index = this.dados.tipologiasSel.findIndex(
        (tipSel) => tipSel.sigla === tipologia.sigla
      );

      const existe = this.tipologias.some(
        (tip) => tip.sigla === tipologia.sigla
      );

      if (index !== -1) {
        if (!existe) {
          this.tipologias.push(tipologia);
          this.tipologias.sort(comparaSigla);
        }
        this.dados.tipologiasSel.splice(index, 1);
        this.novoHistorico.tipologiasSel = {
          ...this.novoHistorico.tipologiasSel,
          cor: "amarelo",
          dados: this.dados.tipologiasSel,
        };

        this.animacoes.tipologiasSel = !this.animacoes.tipologiasSel;
        this.esconderOperacoes.tipologiasSel = true;
      }
    },

    adicionaTipologias(tipologias) {
      this.dados.tipologiasSel.push(...tipologias);
      this.dialogTipologias = false;
      this.novoHistorico.tipologiasSel = {
        ...this.novoHistorico.tipologiasSel,
        cor: "amarelo",
        dados: this.dados.tipologiasSel,
      };

      this.animacoes.tipologiasSel = !this.animacoes.tipologiasSel;
      this.esconderOperacoes.tipologiasSel = true;
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

        this.novoHistorico = adicionarNotaComRemovidos(
          this.historico[this.historico.length - 1],
          this.novoHistorico
        );

        pedido.historico.push(this.novoHistorico);

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

    async encaminharPedido(dados) {
      try {
        const estado = "Apreciado";

        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

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

    verifica(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "verde",
      };

      this.animacoes[campo] = !this.animacoes[campo];
    },

    anula(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "vermelho",
      };

      this.animacoes[campo] = !this.animacoes[campo];
    },

    edita(campo) {
      this.editaCampo = {
        visivel: true,
        nome: this.transformaKeys(campo),
        key: campo,
        valorAtual: this.dados[campo],
      };
    },

    adicionarNota(dados) {
      this.notaDialog.visivel = false;
      this.novoHistorico[dados.campo] = {
        ...this.novoHistorico[dados.campo],
        nota: dados.nota,
      };
    },

    abrirNotaDialog(campo) {
      this.notaDialog.visivel = true;
      this.notaDialog.campo = campo;
      if (this.novoHistorico[campo].nota !== undefined)
        this.notaDialog.nota = this.novoHistorico[campo].nota;
    },

    fechaEditaCampoDialog(campo) {
      this.editaCampo.visivel = false;
    },

    editarCampo(event) {
      this.editaCampo.visivel = false;

      this.dados[event.campo.key] = event.dados;
      this.novoHistorico[event.campo.key] = {
        ...this.novoHistorico[event.campo.key],
        dados: event.dados,
        cor: "amarelo",
      };

      this.esconderOperacoes[event.campo.key] = true;
      this.animacoes[event.campo.key] = !this.animacoes[event.campo.key];
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
