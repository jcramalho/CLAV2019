<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        :size="128"
        :width="20"
        color="indigo darken-4"
        >A processar pedido...</v-progress-circular
      >
    </v-overlay>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Entidade</div>
      </v-col>
      <v-col class="mt-3">
        <div class="mb-1">
          <v-icon left>account_balance</v-icon>
          {{ p.objeto.dados.ts.designacaoEntidade }}
          {{ p.objeto.dados.ts.designacaoTipologia }}
        </div>
      </v-col>
      <v-col cols="1">
        <v-icon color="green" @click="novoHistorico.entidades.cor = 'verde'"
          >check</v-icon
        >
        <v-icon color="red" @click="novoHistorico.entidades.cor = 'vermelho'"
          >clear</v-icon
        >
        <v-icon @click="abrirNotaDialog('entidades', -1)">add_comment</v-icon>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Tabela de Seleção</div>
      </v-col>
    </v-row>
    <v-data-table
      :headers="tsHeaders"
      :items="p.objeto.dados.ts.listaProcessos.procs"
      class="elevation-1"
      :footer-props="tsFooterProps"
    >
      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="warning"
          >Não existem processos para mostrar...</v-alert
        >
      </template>

      <template v-slot:[`footer.page-text`]="props">
        {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>

      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.titulo }}</td>
          <td>
            <v-chip
              v-if="props.item.dono"
              class="ml-1"
              color="indigo darken-4"
              outlined
              label
              x-small
            >
              {{ p.objeto.dados.ts.idEntidade }}
              {{ p.objeto.dados.ts.idTipologia }}
            </v-chip>
          </td>
          <td>
            <v-chip
              v-if="props.item.participante != 'NP'"
              class="ml-1"
              color="indigo darken-4"
              outlined
              label
              x-small
              >{{ props.item.participante }}</v-chip
            >
          </td>
          <td>
            <v-icon
              color="green"
              @click="novoHistorico.legislacao.cor = 'verde'"
              >check</v-icon
            >
            <v-icon
              color="red"
              @click="novoHistorico.legislacao.cor = 'vermelho'"
              >clear</v-icon
            >
          </td>
        </tr>
      </template>

      <template v-slot:pageText="props">
        Processos {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
    <v-row>
      <v-spacer />
      <PO
        operacao="Validar"
        @finalizarPedido="finalizarPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>

    <v-dialog v-model="sucessDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="success darken-4 title white--text" dark
          >Tabela de Seleção adicionada com sucesso!</v-card-title
        >

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap"
            >O Pedido de criação da Tabela de Seleção foi efetuado com
            sucesso...</span
          >
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="$router.go(-1)"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="erroPedido = false" />
    </v-dialog>
    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog.visivel" width="70%" persistent>
      <v-card>
        <v-card-title class="indigo darken-4 title white--text mb-4" dark
          >Nota relativa ao campo:
          {{ converteCampo(notaDialog.campo) }}</v-card-title
        >

        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Nota</div>
            </v-col>

            <v-col>
              <v-textarea
                clearable
                filled
                auto-grow
                color="indigo"
                v-model="notaDialog.nota"
                label="Nota"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-4"
            text
            rounded
            dark
            @click="notaDialog.visivel = false"
            >Cancelar</v-btn
          >

          <v-btn
            color="indigo accent-4 white--text"
            rounded
            @click="adicionarNota()"
            >Adicionar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ErroDialog from "@/components/pedidos/generic/ErroDialog";
import { mapKeys } from "@/utils/utils";

export default {
  props: ["p"],
  components: {
    PO,
    ErroDialog
  },

  data() {
    return {
      json: null,
      result: "",
      sucessDialog: false,
      erros: [],
      erroPedido: false,
      overlay: false,
      tsHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        { text: "Dono", value: "dono", class: "subtitle-1" },
        { text: "Participante", value: "participante", class: "subtitle-1" },
        { text: "Validar", class: "subtitle-1", width: "8%" }
      ],
      tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      },
      notaDialog: {
        visivel: false,
        campo: "",
        index: -1,
        nota: ""
      },
      novoHistorico: null
    };
  },
  methods: {
    converteCampo(campo) {
      return mapKeys(campo);
    },
    abrirNotaDialog(campo, index) {
      this.notaDialog.visivel = true;
      this.notaDialog.campo = campo;
      this.notaDialog.index = index;
      if (index == -1) {
        if (this.novoHistorico[campo].nota !== undefined)
          this.notaDialog.nota = this.novoHistorico[campo].nota;
      } else {
        if (this.novoHistorico[campo][index].nota !== undefined)
          this.notaDialog.nota = this.novoHistorico[campo][index].nota;
      }
    },
    adicionarNota() {
      if (this.notaDialog.index == -1) {
        this.novoHistorico[this.notaDialog.campo].nota = this.notaDialog.nota;
      } else
        this.novoHistorico[this.notaDialog.campo][
          this.notaDialog.index
        ].nota = this.notaDialog.nota;

      this.notaDialog = {
        visivel: false,
        campo: "",
        index: -1,
        nota: ""
      };
    },
    async despacharPedido(dados) {
      try {
        const estado = "Devolvido";

        let dadosUtilizador = this.$verifyTokenUser();

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        let dadosUtilizador = this.$verifyTokenUser();

        const estado = "Em Despacho";

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });
        this.overlay = false;
        this.sucessDialog = true;
      } catch (e) {
        this.overlay = false;
        this.erroPedido = true;

        let parsedError = Object.assign({}, e);
        parsedError = parsedError.response;

        if (parsedError !== undefined) {
          if (parsedError.status === 422) {
            parsedError.data.forEach(erro => {
              this.erros.push({ parametro: erro.param, mensagem: erro.msg });
            });
          }
        }
      }
    }
  },
  async created() {
    const copiaHistorico = JSON.parse(
      JSON.stringify(this.historico[this.historico.length - 1])
    );
    Object.keys(copiaHistorico).forEach(h => (copiaHistorico[h].nota = null));

    this.novoHistorico = copiaHistorico;

    this.loading = false;
  }
};
</script>
<style scoped>
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
