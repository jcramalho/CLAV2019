<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <div v-else>
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
            <template v-slot:no-data>
              Não existem entidades selecionadas.
            </template>

            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.sigla }}</td>
                <td>{{ props.item.designacao }}</td>
                <td>
                  <v-icon color="red" @click="removeEntidade(props.item)"
                    >delete</v-icon
                  >
                </td>
              </tr>
            </template>

            <template v-slot:top>
              <v-toolbar flat :color="info.cor">
                <v-btn
                  rounded
                  class="indigo accent-4 white--text"
                  @click="abreEntidadesDialog()"
                >
                  Adicionar Entidades
                </v-btn>

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
            <template v-slot:no-data>
              Não existem processos selecionados.
            </template>

            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.codigo }}</td>
                <td>{{ props.item.titulo }}</td>
                <td>
                  <v-icon color="red" @click="removeProcesso(props.item)">
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
                  @click="abreProcessosDialog()"
                >
                  Adicionar Processos
                </v-btn>

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
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.codigo }}</td>
                <td>{{ props.item.titulo }}</td>
                <td><v-icon color="red">delete</v-icon></td>
              </tr>
            </template>

            <template v-slot:top>
              <v-toolbar flat :color="info.cor">
                <v-dialog v-model="dialogProcessos" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      rounded
                      class="indigo accent-4 white--text"
                      v-on="on"
                    >
                      Adicionar Processos
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline"
                        >Selecione os processos em falta
                      </span>
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
              <!--<v-icon @click="">create</v-icon>-->
              <v-icon>create</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-spacer />
        <PO
          operacao="Analisar"
          @avancarPedido="encaminharPedido($event)"
          @devolverPedido="despacharPedido($event)"
        />
      </v-row>
    </div>

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
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import SelecionaAutocomplete from "@/components/pedidos/generic/SelecionaAutocomplete";

import Loading from "@/components/generic/Loading";
import ErroDialog from "@/components/generic/ErroDialog";

import { comparaSigla, comparaCodigo } from "@/utils/utils";

export default {
  props: ["p"],

  components: {
    PO,
    Loading,
    ErroDialog,
    SelecionaAutocomplete,
  },

  data() {
    return {
      loading: true,
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      headersEntidades: [
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
      headersProcessos: [
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
      infoPedido: [],
      pedido: null,
    };
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
    this.infoPedido = [
      {
        campo: "Tipo de Diploma",
        conteudo: this.pedido.objeto.dados.tipo,
        cor: null,
      },
      {
        campo: "Fonte do Diploma",
        conteudo: this.pedido.objeto.dados.diplomaFonte,
        cor: null,
      },
      {
        campo: "Número do Diploma",
        conteudo: this.pedido.objeto.dados.numero,
        cor: null,
      },
      { campo: "Data", conteudo: this.pedido.objeto.dados.data, cor: null },
      {
        campo: "Sumário",
        conteudo: this.pedido.objeto.dados.sumario,
        cor: null,
      },
      { campo: "Link", conteudo: this.pedido.objeto.dados.link, cor: null },
      { campo: "Código", conteudo: this.pedido.objeto.dados.codigo, cor: null },
      {
        campo: "Entidades",
        conteudo: this.pedido.objeto.dados.entidadesSel,
        cor: null,
      },
      {
        campo: "Processos",
        conteudo: this.pedido.objeto.dados.processosSel,
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
    abreEntidadesDialog() {
      this.pedido.objeto.dados.entidadesSel.forEach((entSel) => {
        const index = this.entidades.findIndex(
          (ent) => ent.sigla === entSel.sigla
        );

        if (index !== -1) this.entidades.splice(index, 1);
      });

      this.dialogEntidades = true;
    },

    abreProcessosDialog() {
      this.pedido.objeto.dados.processosSel.forEach((procSel) => {
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
      const index = this.pedido.objeto.dados.entidadesSel.findIndex(
        (entSel) => entSel.sigla === entidade.sigla
      );

      const existe = this.entidades.some((ent) => ent.sigla === entidade.sigla);

      if (index !== -1) {
        if (!existe) {
          this.entidades.push(entidade);
          this.entidades.sort(comparaSigla);
        }

        this.pedido.objeto.dados.entidadesSel.splice(index, 1);
      }
    },

    removeProcesso(processo) {
      const index = this.pedido.objeto.dados.processosSel.findIndex(
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

        this.pedido.objeto.dados.processosSel.splice(index, 1);
      }
    },

    adicionaEntidades(entidades) {
      this.pedido.objeto.dados.entidadesSel.push(...entidades);
      this.dialogEntidades = false;
    },

    adicionaProcessos(processos) {
      this.pedido.objeto.dados.processosSel.push(...processos);
      this.dialogProcessos = false;
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

    async encaminharPedido(dados) {
      try {
        const estado = "Apreciado";

        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.pedido));

        pedido.estado = estado;
        pedido.token = this.$store.state.token;

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

    verifica(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.infoPedido.findIndex((o) => o.campo == obj.campo);
      this.infoPedido[i].cor = "red lighten-3";
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
