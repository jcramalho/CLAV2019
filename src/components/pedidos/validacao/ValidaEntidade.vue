<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row
          v-if="
            info !== '' &&
              info !== null &&
              campo !== 'codigo' &&
              campo !== 'estado'
          "
          dense
          class="ma-1"
        >
          <v-col cols="2">
            <div
              :class="[
                'info-descricao',
                `info-descricao-${novoHistorico[campo].cor}`,
              ]"
            >
              {{ transformaKeys(campo) }}
            </div>
          </v-col>

          <v-col>
            <div v-if="!(info instanceof Array)" class="info-conteudo">
              {{ info }}
            </div>

            <div v-else>
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
            <v-icon class="mr-1" color="green" @click="verifica(campo)">
              check
            </v-icon>
            <v-icon class="mr-1" color="red" @click="anula(campo)">
              clear
            </v-icon>
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
          operacao="Validar"
          @finalizarPedido="finalizarPedido($event)"
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
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";
import AdicionarNota from "@/components/pedidos/generic/AdicionarNota";

import Loading from "@/components/generic/Loading";
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";
import ErroDialog from "@/components/generic/ErroDialog";

import { comparaSigla, mapKeys } from "@/utils/utils";

export default {
  props: ["p"],

  components: {
    PO,
    ErroAPIDialog,
    Loading,
    ErroDialog,
    SelecionaAutocomplete,
    EditarCamposDialog,
    AdicionarNota,
  },

  data() {
    return {
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

      erros: [],
      erroPedido: false,
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
  },

  methods: {
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

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let numeroErros = await this.validarEntidade(
          pedido.objeto.acao,
          pedido.objeto.dados
        );

        if (numeroErros === 0) {
          for (const key in pedido.objeto.dados) {
            if (
              pedido.objeto.dados[key] === null ||
              pedido.objeto.dados[key] === ""
            ) {
              delete pedido.objeto.dados[key];
            }
          }

          await this.$request("post", "/entidades", pedido.objeto.dados);

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

          pedido.historico.push(this.novoHistorico);

          await this.$request("put", "/pedidos", {
            pedido: pedido,
            distribuicao: novaDistribuicao,
          });

          this.$router.go(-1);
        } else {
          this.erroPedido = true;
        }
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

    verifica(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "verde",
      };
    },

    anula(campo) {
      this.novoHistorico[campo] = {
        ...this.novoHistorico[campo],
        cor: "vermelho",
      };
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
    },

    fecharErro() {
      this.erros = [];
      this.erroPedido = false;
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
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  background-color: #ffe0b2; /* lighten-4 */
}
</style>
