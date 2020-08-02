<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular 
        indeterminate 
        :size="128"
        :width="20"
        color="indigo darken-4"
      >
      A processar pedido...
      </v-progress-circular>
    </v-overlay>
    <v-row class="mt-1">
        <v-col cols="2">
          <div class="info-label">Entidades</div>
        </v-col>
        <v-col>
          <div class="info-content">
              <span>
                  <v-chip
                    v-for="e in p.objeto.dados.entidades" :key="e.sigla"
                    class="ma-2"
                    color="indigo darken-4"
                    outlined
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ e.label }}
                  </v-chip>
                </span>
          </div>
        </v-col>
      </v-row>

      <v-data-table
        :headers="tsHeaders"
        :items="p.objeto.dados.listaProcessos.procs"
        class="elevation-1"
        :footer-props="tsFooterProps"
      >
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Não existem processos para mostrar...
          </v-alert>
        </template>

        <template v-slot:footer.page-text="props">
          {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>

        <template v-slot:item="props">
          <tr v-if="props.item.edited">
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
                <span v-if="props.item.entidades.length > 0">
                    <span v-for="(e,i) in props.item.entidades" :key="i">
                        <v-chip
                            v-if="e.dono"
                            class="ml-1"
                            color="indigo darken-4"
                            outlined
                            label
                            x-small
                        >
                            {{ e.sigla }}
                        </v-chip>
                    </span>
                </span>
            </td>
            <td>
                <span v-if="props.item.entidades.length > 0">
                    <span v-for="(e,i) in props.item.entidades" :key="i">
                        <v-chip
                            v-if="e.participante != 'NP'"
                            class="ml-1"
                            color="indigo darken-4"
                            outlined
                            label
                            x-small
                        >
                            {{ e.sigla }}-{{ e.participante }}
                        </v-chip>
                    </span>
                </span>
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
        <v-card-title
          class="success darken-4 title white--text"
          dark
        >Tabela de Seleção adicionada com sucesso!</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap">
            O Pedido de criação da Tabela de Seleção foi efetuado com sucesso...
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="$router.go(-1)">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroPedido" width="80%" hide-overlay>
      <ErroDialog :erros="erros" @fecharErro="erroPedido=false" />
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
        { text: "Participante", value: "participante", class: "subtitle-1" }
      ],
      tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },
  methods: {
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

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    async finalizarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        for (const key in pedido.objeto.dados) {
          if (
            pedido.objeto.dados[key] === undefined ||
            pedido.objeto.dados[key] === null ||
            pedido.objeto.dados[key] === ""
          ) {
            delete pedido.objeto.dados[key];
          }
        }

        this.overlay = true;
        await this.$request("post", "/tabelasSelecao", {
          tabela: pedido,
        });
        
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
        this.overlay = false;
        this.sucessDialog = true;
          
      } catch (e) {
        this.overlay = false;
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
        //console.log("e :", e);
        }
      }
    }
  },
  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
};
</script>
