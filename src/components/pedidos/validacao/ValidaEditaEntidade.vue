<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <v-row v-for="(info, i) in infoPedido" :key="i">
        <!-- Label -->
        <v-col
          cols="2"
          v-if="
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
            info.conteudo !== '' &&
              info.conteudo !== null &&
              info.conteudo !== undefined
          "
        >
          <!-- Se o conteudo for uma lista de tipologias-->
          <v-data-table
            v-if="info.campo === 'Tipologias'"
            :headers="headersTipologias"
            :items="info.conteudo"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:no-data>
              Não existem tipologias selecionadas.
            </template>

            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.sigla }}</td>
                <td>{{ props.item.designacao }}</td>
                <td>
                  <v-icon color="red" @click="removeTipologia(props.item)">
                    delete
                  </v-icon>
                </td>
              </tr>
            </template>

            <template v-slot:top>
              <v-toolbar flat :color="info.cor">
                <v-btn
                  rounded
                  class="indigo accent-4 white--text"
                  @click="abreTipologiasDialog()"
                >
                  Adicionar Tipologias
                </v-btn>

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
              <!--<v-icon @click="">create</v-icon>-->
              <v-icon>create</v-icon>
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
    </div>

    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
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

import Loading from "@/components/generic/Loading";
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";
import ErroDialog from "@/components/generic/ErroDialog";

import { comparaSigla } from "@/utils/utils";

export default {
  props: ["p"],

  components: {
    PO,
    ErroAPIDialog,
    Loading,
    ErroDialog,
    SelecionaAutocomplete,
  },

  data() {
    return {
      loading: true,
      erros: [],
      erroPedido: false,
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      headersTipologias: [
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

      mensagemAutocomplete: {
        titulo: "tipologias",
        autocomplete: "tipologias",
      },
      dialogTipologias: false,
      tipologias: [],
      infoPedido: [],
      pedido: null,
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
    this.infoPedido = [
      {
        campo: "Designação",
        conteudo: this.pedido.objeto.dados.designacao,
        cor: null,
      },
      {
        campo: "Internacional",
        conteudo: this.pedido.objeto.dados.internacional,
        cor: null,
      },
      { campo: "SIOE", conteudo: this.pedido.objeto.dados.sioe, cor: null },
      {
        campo: "Tipologias",
        conteudo: this.pedido.objeto.dados.tipologiasSel,
        cor: null,
      },
      {
        campo: "Data Extinção",
        conteudo: this.pedido.objeto.dados.dataExtincao,
        cor: null,
      },
      {
        campo: "Data Criação",
        conteudo: this.pedido.objeto.dados.dataCriacao,
        cor: null,
      },
    ];
  },

  watch: {
    p: {
      handler(newP, oldP) {
        if (newP !== oldP) {
          this.pedido = JSON.parse(JSON.stringify(this.p));
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    abreTipologiasDialog() {
      this.pedido.objeto.dados.tipologiasSel.forEach((tipSel) => {
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
      const index = this.pedido.objeto.dados.tipologiasSel.findIndex(
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

        this.pedido.objeto.dados.tipologiasSel.splice(index, 1);
      }
    },

    adicionaTipologias(tipologias) {
      this.pedido.objeto.dados.tipologiasSel.push(...tipologias);
      this.dialogTipologias = false;
    },

    async loadTipologias() {
      try {
        let response = await this.$request("get", "/tipologias/");

        this.tipologias = response.data.map((item) => {
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

        let pedido = JSON.parse(JSON.stringify(this.pedido));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

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

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.pedido));

        if (pedido.objeto.acao === "Extinção") {
          await this.$request(
            "put",
            `/entidades/ent_${pedido.objeto.dados.sigla}/extinguir`,
            { dataExtincao: pedido.objeto.dados.dataExtincao }
          );
        } else {
          let numeroErros = 0;
          if (pedido.objeto.dados.hasOwnProperty("designacao")) {
            numeroErros = await this.validar(
              pedido.objeto.acao,
              pedido.objeto.dados
            );
          }

          if (numeroErros === 0) {
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

            await this.$request(
              "put",
              `/entidades/ent_${pedido.objeto.dados.sigla}`,
              pedido.objeto.dados
            );
          }
        }

        const estado = "Validado";

        let dadosUtilizador = this.$verifyTokenUser();

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
            sobre: "Acesso à Ontologia",
            mensagem: "Ocorreu um erro ao aceder à ontologia.",
          });
        }
      }
    },

    async validar(dados) {
      let numeroErros = 0;

      // Designação
      try {
        let existeDesignacao = await this.$request(
          "get",
          "/entidades/designacao?valor=" + encodeURIComponent(dados.designacao)
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
      this.erros = [];
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
