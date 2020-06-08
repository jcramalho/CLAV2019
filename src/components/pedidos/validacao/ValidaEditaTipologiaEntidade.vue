<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
      <div v-for="(info, campo) in tipologia" :key="campo">
        <v-row
          v-if="
            info !== '' &&
              info !== null &&
              campo !== 'sigla' &&
              campo !== 'codigo'
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
                v-if="campo === 'entidadesSel'"
                :headers="entidadesHeaders"
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
                    Nenhuma entidade selecionada...
                  </v-alert>
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
            </div>
          </v-col>

          <!-- Operações -->
          <v-col cols="1">
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
    <v-dialog v-model="dialogEntidades" width="50%" persistent>
      <SelecionaAutocomplete
        :mensagem="mensagemAutocomplete"
        :dados="entidades"
        @fechar="fechaEntidadesDialog"
        @selecao="adicionaEntidades"
      />
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import SelecionaAutocomplete from "@/components/pedidos/generic/SelecionaAutocomplete";
import EditarCamposDialog from "@/components/pedidos/generic/EditarCamposDialog";

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
  },

  data() {
    return {
      novoHistorico: {},
      loading: true,
      editaCampo: {
        visivel: false,
        nome: "",
        key: "",
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
      footerProps: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },

      mensagemAutocomplete: {
        titulo: "entidades",
        autocomplete: "entidades",
      },
      dialogEntidades: false,
      entidades: [],
    };
  },

  computed: {
    tipologia() {
      return this.p.objeto.dados;
    },

    tipologiaOriginal() {
      return this.p.objeto.dadosOriginais;
    },

    historico() {
      return this.p.historico;
    },
  },

  async created() {
    try {
      await this.loadEntidades();

      this.loading = false;
    } catch (e) {
      this.erroDialog.visivel = true;
      this.erroDialog.mensagem =
        "Erro ao carregar os dados, por favor tente novamente";
    }
  },

  mounted() {
    this.novoHistorico = JSON.parse(
      JSON.stringify(this.historico[this.historico.length - 1])
    );
  },

  methods: {
    transformaKeys(key) {
      return mapKeys(key);
    },

    abreEntidadesDialog() {
      this.tipologia.entidadesSel.forEach((entSel) => {
        const index = this.entidades.findIndex(
          (ent) => ent.sigla === entSel.sigla
        );

        if (index !== -1) this.entidades.splice(index, 1);
      });

      this.dialogEntidades = true;
    },

    fechaEntidadesDialog() {
      this.dialogEntidades = false;
    },

    removeEntidade(entidade) {
      const index = this.tipologia.entidadesSel.findIndex(
        (entSel) => entSel.sigla === entidade.sigla
      );

      const existe = this.entidades.some((ent) => ent.sigla === entidade.sigla);

      if (index !== -1) {
        if (!existe) {
          this.entidades.push(entidade);
          this.entidades.sort(comparaSigla);
        }
        this.tipologia.entidadesSel.splice(index, 1);
        this.novoHistorico.entidadesSel = {
          ...this.novoHistorico.entidadesSel,
          cor: "amarelo",
          dados: this.tipologia.entidadesSel,
        };
      }
    },

    adicionaEntidades(entidades) {
      this.tipologia.entidadesSel.push(...entidades);
      this.dialogEntidades = false;
      this.novoHistorico.entidadesSel = {
        ...this.novoHistorico.entidadesSel,
        cor: "amarelo",
        dados: this.tipologia.entidadesSel,
      };
    },

    async loadEntidades() {
      try {
        let { data } = await this.$request("get", "/entidades");

        this.entidades = data.map((item) => {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
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

    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

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
            `/tipologias/tip_${pedido.objeto.dados.sigla}`,
            pedido.objeto.dados
          );

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

      // Abrir dialog com despacho
      // Guardar despacho
    },

    edita(campo) {
      this.editaCampo = {
        visivel: true,
        nome: this.transformaKeys(campo),
        key: campo,
      };

      // Abrir dialog com despacho (Opcional)
      // Guardar despacho
    },

    fechaEditaCampoDialog(campo) {
      this.editaCampo.visivel = false;
      this.novoHistorico[campo].cor = null;
    },

    editarCampo(event) {
      console.log("event", event);
      console.log("dados", event.dados);
      console.log("campo", event.campo);

      this.editaCampo.visivel = false;

      this.tipologia[event.campo.key] = event.dados;
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

    close() {
      this.dialogtipologias = false;
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
