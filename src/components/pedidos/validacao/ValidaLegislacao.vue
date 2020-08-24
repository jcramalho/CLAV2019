<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in dados" :key="campo">
        <v-row v-if="campo !== 'estado'" dense class="ma-1">
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
              <!-- Se o conteudo for uma lista de entidades -->
              <v-data-table
                v-if="campo === 'entidadesSel'"
                :headers="entidadesHeaders"
                :items="info"
                class="elevation-1"
                :footer-props="footerPropsEntidades"
              >
                <template v-slot:no-data>
                  <v-alert
                    type="error"
                    width="100%"
                    class="m-auto mb-2 mt-2"
                    outlined
                  >
                    Nenhuma entidade selecionada...
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
                  <v-icon color="red" @click="removeEntidade(item)">
                    delete
                  </v-icon>
                </template>

                <template v-slot:top>
                  <v-toolbar flat>
                    <v-btn
                      rounded
                      class="indigo accent-4 white--text"
                      @click="abreEntidadesDialog()"
                    >
                      Adicionar Entidades
                    </v-btn>
                  </v-toolbar>
                </template>
              </v-data-table>

              <!-- Se o conteudo for uma lista de processos -->
              <v-data-table
                v-else-if="campo === 'processosSel'"
                :headers="processosHeaders"
                :items="info"
                class="elevation-1"
                :footer-props="footerPropsProcessos"
              >
                <template v-slot:no-data>
                  <v-alert
                    type="error"
                    width="100%"
                    class="m-auto mb-2 mt-2"
                    outlined
                  >
                    Nenhum processo selecionado...
                  </v-alert>
                </template>

                <template v-slot:item.codigo="{ item }">
                  <v-badge
                    v-if="novoItemAdicionado(item, campo)"
                    right
                    dot
                    inline
                    >{{ item.codigo }}</v-badge
                  >

                  <span v-else>
                    {{ item.codigo }}
                  </span>
                </template>

                <template v-slot:item.operacao="{ item }">
                  <v-icon color="red" @click="removeProcesso(item)"
                    >delete</v-icon
                  >
                </template>

                <template v-slot:top>
                  <v-toolbar flat>
                    <v-btn
                      rounded
                      class="indigo accent-4 white--text"
                      @click="abreProcessosDialog()"
                    >
                      Adicionar Processos
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
          operacao="Validar"
          @finalizarPedido="verificaEstadoCampos($event)"
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

    <!-- Dialog de entidades-->
    <v-dialog v-model="dialogEntidades" width="50%" persistent>
      <SelecionaAutocomplete
        :mensagem="mensagemAutocompleteEntidades"
        :dados="entidades"
        @fechar="fechaEntidadesDialog"
        @selecao="adicionaEntidades"
      />
    </v-dialog>

    <!-- Dialog de processos-->
    <v-dialog v-model="dialogProcessos" width="50%" persistent>
      <SelecionaAutocomplete
        :mensagem="mensagemAutocompleteProcessos"
        :dados="processos"
        @fechar="fechaProcessosDialog"
        @selecao="adicionaProcessos"
      />
    </v-dialog>

    <!-- Dialog de confirmação de operação -->
    <v-dialog v-model="dialogConfirmacao.visivel" width="50%" persistent>
      <ConfirmacaoOperacao
        :mensagem="dialogConfirmacao.mensagem"
        @fechar="fechaDialogConfirmacao()"
        @confirma="finalizarPedido(dialogConfirmacao.dados)"
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
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";

import nanoid from "nanoid";

import {
  comparaSigla,
  comparaCodigo,
  mapKeys,
  identificaItemAdicionado,
  adicionarNotaComRemovidos,
} from "@/utils/utils";

import { eNUV, eNV, eDataFormatoErrado } from "@/utils/validadores";

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
    ConfirmacaoOperacao,
  },

  data() {
    return {
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
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

      erros: [],
      erroPedido: false,
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      entidadesHeaders: [
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
      footerPropsEntidades: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
      processosHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center",
        },
      ],
      footerPropsProcessos: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },

      mensagemAutocompleteEntidades: {
        titulo: "entidades",
        autocomplete: "entidades",
      },
      mensagemAutocompleteProcessos: {
        titulo: "processos",
        autocomplete: "processos",
      },
      dialogEntidades: false,
      dialogProcessos: false,
      entidades: [],
      processos: [],
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
      await this.loadEntidades();
      await this.loadProcessos();

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

    abreEntidadesDialog() {
      this.dados.entidadesSel.forEach((entSel) => {
        const index = this.entidades.findIndex(
          (ent) => ent.sigla === entSel.sigla
        );

        if (index !== -1) this.entidades.splice(index, 1);
      });

      this.dialogEntidades = true;
    },

    abreProcessosDialog() {
      this.dados.processosSel.forEach((procSel) => {
        const index = this.processos.findIndex(
          (proc) => proc.codigo === procSel.codigo
        );

        if (index !== -1) this.processos.splice(index, 1);
      });

      this.dialogProcessos = true;
    },

    fechaEntidadesDialog() {
      this.dialogEntidades = false;
    },

    fechaProcessosDialog() {
      this.dialogProcessos = false;
    },

    removeEntidade(entidade) {
      const index = this.dados.entidadesSel.findIndex(
        (entSel) => entSel.sigla === entidade.sigla
      );

      const existe = this.entidades.some((ent) => ent.sigla === entidade.sigla);

      if (index !== -1) {
        if (!existe) {
          this.entidades.push(entidade);
          this.entidades.sort(comparaSigla);
        }
        this.dados.entidadesSel.splice(index, 1);
        this.novoHistorico.entidadesSel = {
          ...this.novoHistorico.entidadesSel,
          cor: "amarelo",
          dados: this.dados.entidadesSel,
        };

        this.animacoes.entidadesSel = !this.animacoes.entidadesSel;
        this.esconderOperacoes.entidadesSel = true;
      }
    },

    removeProcesso(processo) {
      const index = this.dados.processosSel.findIndex(
        (procSel) => procSel.codigo === processo.codigo
      );

      const existe = this.processos.some(
        (proc) => proc.codigo === processo.codigo
      );

      if (index !== -1) {
        if (!existe) {
          this.processos.push(processo);
          this.processos.sort(comparaCodigo);
        }
        this.dados.processosSel.splice(index, 1);
        this.novoHistorico.processosSel = {
          ...this.novoHistorico.processosSel,
          cor: "amarelo",
          dados: this.dados.processosSel,
        };

        this.animacoes.processosSel = !this.animacoes.processosSel;
        this.esconderOperacoes.processosSel = true;
      }
    },

    adicionaEntidades(entidades) {
      this.dados.entidadesSel.push(...entidades);
      this.dialogEntidades = false;
      this.novoHistorico.entidadesSel = {
        ...this.novoHistorico.entidadesSel,
        cor: "amarelo",
        dados: this.dados.entidadesSel,
      };

      this.animacoes.entidadesSel = !this.animacoes.entidadesSel;
      this.esconderOperacoes.entidadesSel = true;
    },

    adicionaProcessos(processos) {
      this.dados.processosSel.push(...processos);
      this.dialogProcessos = false;
      this.novoHistorico.processosSel = {
        ...this.novoHistorico.processosSel,
        cor: "amarelo",
        dados: this.dados.processosSel,
      };

      this.animacoes.processosSel = !this.animacoes.processosSel;
      this.esconderOperacoes.processosSel = true;
    },

    async loadEntidades() {
      try {
        const { data } = await this.$request("get", "/entidades");
        this.entidades = data.map((ent) => {
          return {
            sigla: ent.sigla,
            designacao: ent.designacao,
            id: ent.id,
          };
        });
      } catch (err) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao carregar os dados, por favor tente novamente";
      }
    },

    async loadProcessos() {
      try {
        const { data } = await this.$request("get", "/classes?nivel=3");
        this.processos = data.map((proc) => {
          return {
            codigo: proc.codigo,
            titulo: proc.titulo,
            id: proc.codigo,
          };
        });
      } catch (err) {
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

    async validarLegislacao(dados) {
      let numeroErros = 0;

      //Tipo
      if (eNUV(dados.tipo)) {
        this.erros.push({
          sobre: "Tipo de Diploma",
          mensagem: "O tipo de diploma não pode ser vazio.",
        });

        numeroErros++;
      }

      // Número Diploma
      if (eNUV(dados.numero)) {
        this.erros.push({
          sobre: "Número de Diploma",
          mensagem: "O número de diploma não pode ser vazio.",
        });

        numeroErros++;
      } else {
        try {
          const existeNumero = await this.$request(
            "get",
            "/legislacao/numero?valor=" + encodeURIComponent(dados.numero)
          );

          if (existeNumero.data) {
            this.erros.push({
              sobre: "Número de Diploma",
              mensagem: "O número de diploma já existente na BD.",
            });

            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.erros.push({
            sobre: "Acesso à Ontologia",
            mensagem:
              "Não consegui verificar a existência do número do diploma.",
          });
        }
      }

      // Data
      if (eNV(dados.data)) {
        this.erros.push({
          sobre: "Data do Diploma",
          mensagem: "A data do diploma não pode ser vazia.",
        });

        numeroErros++;
      } else if (eDataFormatoErrado(dados.data)) {
        this.erros.push({
          sobre: "Data do Diploma",
          mensagem: "A data do diploma está no formato errado.",
        });

        numeroErros++;
      }

      // Sumário
      if (eNUV(dados.sumario)) {
        this.erros.push({
          sobre: "Sumário",
          mensagem: "O sumário não pode ser vazio.",
        });

        numeroErros++;
      }

      // Data Revogação
      if (!eNUV(dados.data) && !eNUV(dados.dataRevogacao)) {
        if (eDataFormatoErrado(dados.dataRevogacao)) {
          this.erros.push({
            sobre: "Data de Revogação",
            mensagem: "A data de revogação está no formato errado.",
          });
          numeroErros++;
        } else if (new Date(dados.data) >= new Date(dados.dataRevogacao)) {
          this.erros.push({
            sobre: "Data de Revogação",
            mensagem:
              "A data de revogação tem de ser superior à data do diploma.",
          });
          numeroErros++;
        }
      }

      return numeroErros;
    },

    fechaDialogConfirmacao() {
      this.dialogConfirmacao = {
        visivel: false,
        mensagem: "",
        dados: null,
      };
    },

    async verificaEstadoCampos(dados) {
      // procura campos a vermelho
      const haVermelhos = Object.keys(this.novoHistorico).some(
        (key) => this.novoHistorico[key].cor === "vermelho"
      );
      // Se existirem abre dialog de confirmação
      if (haVermelhos)
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem um ou mais campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados,
        };
      // Caso contrário segue para a finalização do pedido
      else await this.finalizarPedido(dados);
    },

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let numeroErros = await this.validarLegislacao(pedido.objeto.dados);

        if (numeroErros === 0) {
          for (const key in pedido.objeto.dados) {
            if (
              pedido.objeto.dados[key] === null ||
              pedido.objeto.dados[key] === ""
            ) {
              delete pedido.objeto.dados[key];
            }
          }

          if (pedido.objeto.dados.diplomaFonte === "Não especificada")
            delete pedido.objeto.dados.diplomaFonte;

          const id = `leg_${nanoid()}`;

          pedido.objeto.dados.id = id;

          const { data } = await this.$request(
            "post",
            "/legislacao",
            pedido.objeto.dados
          );

          if (pedido.objeto.dados.dataRevogacao) {
            await this.$request("put", `/legislacao/${id}/revogar`, {
              dataRevogacao: pedido.objeto.dados.dataRevogacao,
            });
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
