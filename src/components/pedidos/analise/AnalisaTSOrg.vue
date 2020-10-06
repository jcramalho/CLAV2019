<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Entidade</div>
      </v-col>
      <v-col>
        <div class="info-content">
          <span>
            <v-chip class="ma-2" color="indigo darken-4" outlined label>
              <v-icon left>account_balance</v-icon>
              {{ p.objeto.dados.ts.designacaoEntidade }}
              {{ p.objeto.dados.ts.designacaoTipologia }}
            </v-chip>
          </span>
        </div>
      </v-col>
    </v-row>

    <v-data-table
      :headers="tsHeaders"
      :items="p.objeto.dados.ts.listaProcessos.procs"
      class="elevation-1"
      :footer-props="tsFooterProps"
    >
      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="warning">Não existem processos para mostrar...</v-alert>
      </template>

      <template v-slot:footer.page-text="props">
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
              {{p.objeto.dados.ts.idTipologia}}
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
            >{{ props.item.participante }}</v-chip>
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
        operacao="Analisar"
        @avancarPedido="encaminharPedido($event)"
        @devolverPedido="despacharPedido($event)"
      />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";

export default {
  props: ["p"],
  components: {
    PO
  },

  data() {
    return {
      novoHistorico: null,
      json: null,
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
          despacho: dados.mensagemDespacho
        };

        let pedido = JSON.parse(JSON.stringify(this.p));

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    },
    async encaminharPedido(dados) {
      try {
        let dadosUtilizador = this.$verifyTokenUser();

        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado =
          pedido.estado === "Distribuído" ? "Apreciado" : "Reapreciado";

        pedido.estado = estado;

        pedido.historico.push(this.novoHistorico);

        const novaDistribuicao = {
          estado: estado,
          responsavel: dadosUtilizador.email,
          proximoResponsavel: {
            nome: dados.utilizadorSelecionado.name,
            entidade: dados.utilizadorSelecionado.entidade,
            email: dados.utilizadorSelecionado.email
          },
          data: new Date(),
          despacho: dados.mensagemDespacho
        };

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao
        });

        this.$router.go(-1);
      } catch (e) {
        //console.log("e :", e);
      }
    }
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  }
};
</script>
