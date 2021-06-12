<template>
  <div>
    <v-card flat class="ma-1">
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="numeroPPD"
        campoText="Número do PPD"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="nomePPD"
        campoText="Nome do PPD"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="mencaoResp"
        campoText="Menção de responsabilidade"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="tipoFonteL"
        campoText="Tipo da fonte de legitimação"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="fonteLegitimacao"
        campoText="Fonte de legitimação"
        tipo="object"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados.geral"
        :novoHistorico="novoHistorico"
        campoValue="entSel"
        campoText="Entidades"
        tipo="array"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="p.objeto.dados"
        :novoHistorico="novoHistorico"
        campoValue="sistemasInfo"
        campoText="Sistemas de Informação"
        tipo="si"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
    </v-card>
  </div>
</template>
<script>
import PO from "@/components/pedidos/generic/PainelOperacoes";
import ValidaCampo from "@/components/pedidos/analise/ppd/ValidaCampo";
import InfoBox from "@/components/generic/infoBox.vue";
import ConfirmacaoOperacao from "@/components/pedidos/generic/ConfirmacaoOperacao";

export default {
  props: {
    p: {},
    fase: { type: String, required: true },
  },
  components: {
    PO,
    ValidaCampo,
    InfoBox,
    ConfirmacaoOperacao,
  },

  data() {
    return {
      search: "",
      paginaTabela: 1,
      expanded: [],
      novoHistorico: null,
      json: null,
      expandedProc: {},
      listaProcs: false,
      dialogConfirmacao: {
        visivel: false,
        mensagem: "",
        dados: null,
      },
      tsHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        { text: "Dono", value: "dono", align: "center", class: "subtitle-1" },
        {
          text: "Participante",
          value: "participante",
          align: "center",
          class: "subtitle-1",
        },
        {
          text: "",
          value: "data-table-expand",
          width: "5%",
        },
      ],
      tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
      myhelp: require("@/config/help").help,
    };
  },
  methods: {
    async clicked({ item }) {
      if (
        !this.expandedProc.codigo ||
        this.expandedProc.codigo != item.codigo
      ) {
        let response = await this.$request("get", "/classes/c" + item.codigo);
        this.expandedProc = response.data;
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

        pedido.historico.push(this.novoHistorico);

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
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
        //console.log("e :", e);
      }
    },
    alterarOriginal() {
      let n_vermelhos = 0;
      Object.keys(this.novoHistorico).map((k) => {
        if (k != "ts") {
          this.novoHistorico[k].nota = null;
          n_vermelhos =
            this.novoHistorico[k].cor === "vermelho"
              ? n_vermelhos + 1
              : n_vermelhos;
        }
      });
      Object.keys(this.novoHistorico.ts).map((k) => {
        this.novoHistorico.ts[k].nota = null;
        n_vermelhos =
          this.novoHistorico.ts[k].cor === "vermelho"
            ? n_vermelhos + 1
            : n_vermelhos;
      });

      this.novoHistorico.ts.classes.dados.forEach((classe) => {
        classe.nota = null;
        Object.keys(classe.dados).map((k) => {
          classe.dados[k].nota = null;
          n_vermelhos =
            classe.dados[k].cor === "vermelho" ? n_vermelhos + 1 : n_vermelhos;
        });
      });

      //Falta a edição de campos
      this.p.objeto.dados.geral.nomePPD = this.novoHistorico.geral.nomePPD.dados;
      return n_vermelhos;
    },
    async verificaVermelhos(dados) {
      let existem_vermelhos = await this.alterarOriginal();

      // Se existirem abre dialog de confirmação
      if (existem_vermelhos > 0)
        this.dialogConfirmacao = {
          visivel: true,
          mensagem:
            "Existem " +
            existem_vermelhos +
            " campos assinalados a vermelho, deseja mesmo continuar com a submissão do pedido?",
          dados: dados,
        };
      // Caso contrário segue para a finalização do pedido
      else await this.finalizarPedido(dados);
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
          despacho: dados.mensagemDespacho,
        };

        pedido.estado = estado;

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });
        this.overlay = false;
        this.sucessDialog = true;
        this.$router.go(-1);
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
        }
      }
    },
  },

  mounted() {
    this.json = JSON.stringify(this.p, null, 2);
  },
  created() {
    //alert(JSON.stringify(this.p.objeto.dados.geral.fonteLegitimacao))
    alert(JSON.stringify(this.p.objeto.dados.sistemasInfo))
    //alert(JSON.stringify(this.p.historico))

    this.novoHistorico = JSON.parse(
      JSON.stringify(this.p.historico[this.p.historico.length - 1])
    );
    alert(JSON.stringify(this.novoHistorico))
    //Object.keys(this.novoHistorico.entSel).map((k) => {
    //  if (k != "entSel") this.novoHistorico.entSel[k].nota = null;
    //});

    //alert(JSON.stringify(this.novoHistorico))
    //Object.keys(this.novoHistorico.geral).map((k) => {
    //  if (k != "sistemasInfo") this.novoHistorico.sistemasInfo[k].nota = null;
    //});

    this.novoHistorico.entSel.dados.forEach((e) => {
      e.nota = null;
    });

    //this.novoHistorico.geral.classes.dados.forEach((classe) => {
    //  classe.nota = null;
    //  Object.keys(classe.dados).map((k) => {
    //    classe.dados[k].nota = null;
    //    if (k === "pca" || k === "df") {
    //      Object.keys(classe.dados[k].dados).map((d) => {
    //        classe.dados[k].dados[d].nota = null;
    //      });
    //    }
    //  });
    //});

  },
};
</script>
