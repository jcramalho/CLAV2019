<template>
  <v-card flat class="pa-3">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="7">
        <span class="clav-content-title-2">
          Consulta do pedido: {{ Pedido.codigo }} <v-spacer />
        </span>
      </v-col>
      <v-col cols="12" sm="6" md="5" align="right" justify="center">
        <v-chip color="primary" text-color="white" label>
          <v-icon class="mr-1">label</v-icon>
          <b>{{ label }}</b>
        </v-chip>
      </v-col>
    </v-row>
    <Campo nome="Estado" infoHeader="Estado do Pedido" color="neutralpurple">
      <template v-slot:conteudo>
        <span>{{ Pedido.estado }}</span>
      </template>
    </Campo>
    <Campo nome="Data" infoHeader="Data do Pedido" color="neutralpurple">
      <template v-slot:conteudo>
        <span>{{ Pedido.data.split("T")[0] }}</span>
      </template>
    </Campo>
    <Campo nome="Entidade" infoHeader="Entidade do Pedido" color="neutralpurple">
      <template v-slot:conteudo>
        <span>{{ Pedido.entidade ? Pedido.entidade.split("_")[1] : "a carregar" }}</span>
      </template>
    </Campo>
    <Campo nome="Criado Por" infoHeader="Criador do Pedido" color="neutralpurple">
      <template v-slot:conteudo>
        <span>{{ Pedido.criadoPor }}</span>
      </template>
    </Campo>
    <Campo nome="Tipo" infoHeader="Tipo do Pedido" color="neutralpurple">
      <template v-slot:conteudo>
        <span>{{ Pedido.objeto.acao }} - {{ Pedido.objeto.tipo }}</span>
      </template>
    </Campo>
    <v-card>
      <v-card-title class="clav-linear-background white--text">
        Distribuição
        <v-spacer></v-spacer>
        <unicon
          name="participacao-icon"
          width="25"
          height="25"
          viewBox="0 0 20.71 17.678"
          fill="white"
        />
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="distHeaders"
          :items="Pedido.distribuicao"
          hide-default-footer
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="subheading">{{ item.estado }}</td>
              <td class="subheading">
                {{ item.data.split("T")[0] }}
              </td>
              <td class="subheading">{{ item.responsavel }}</td>
              <td class="subheading">
                {{ item.despacho }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ShowTSPluri v-if="Pedido.objeto.tipo == 'TS Pluriorganizacional'" :p="Pedido" />
    <ShowTSOrg v-else-if="Pedido.objeto.tipo == 'TS Organizacional'" :p="Pedido" />
    <ShowClasse v-else-if="Pedido.objeto.tipo == 'Classe'" :p="Pedido" />
    <ShowClasseL1
      v-else-if="Pedido.objeto.tipo == 'Classe_N1' || Pedido.objeto.tipo == 'Classe_N2'"
      :p="Pedido"
      @verHistorico="verHistorico()"
    />
    <ShowEntidade
      v-else-if="Pedido.objeto.tipo == 'Entidade'"
      :p="Pedido"
      @verHistorico="verHistorico()"
    />
    <ShowRADA v-else-if="Pedido.objeto.tipo == 'RADA'" :p="Pedido" />
    <ShowAE
      v-else-if="
        Pedido.objeto.tipo.includes('AE ') || Pedido.objeto.tipo == 'Auto de Eliminação'
      "
      :p="Pedido"
    />
    <ShowPGD v-else-if="Pedido.objeto.tipo == 'PGD'" :p="Pedido" />
    <ShowTipologia
      v-else-if="Pedido.objeto.tipo === 'Tipologia'"
      :p="Pedido"
      @verHistorico="verHistorico()"
    />
    <ShowLegislacao
      v-else-if="Pedido.objeto.tipo == 'Legislação'"
      :p="Pedido"
      @verHistorico="verHistorico()"
    />
    <ShowTI v-else-if="Pedido.objeto.tipo == 'Termo de Indice'" :p="Pedido" />
    <ShowDefault v-else :p="Pedido" />

    <v-row>
      <v-col cols="3" align="left">
        <Voltar />
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        v-if="
          (Pedido.estado === 'Distribuído' ||
            Pedido.estado === 'Apreciado' ||
            Pedido.estado === 'Redistribuído' ||
            Pedido.estado === 'Reapreciado') &&
          temPermissaoSubstituirResponsavel()
        "
        cols="3"
        align="center"
      >
        <v-btn color="primary" @click="substituirResponsavelDialog = true" rounded
          >Substituir Responsável</v-btn
        >
      </v-col>
      <v-col
        v-if="
          Pedido.estado === 'Apreciado' ||
          Pedido.estado === 'Reapreciado' ||
          Pedido.estado === 'Em Despacho' ||
          Pedido.estado === 'Devolvido para validação'
        "
        cols="3"
        align="center"
      >
        <v-btn color="primary" @click="reapreciarDialog = true" rounded
          >Reapreciar pedido</v-btn
        >
      </v-col>
    </v-row>

    <!-- Dialog Ver Historico de Alterações-->
    <v-dialog v-model="verHistoricoDialog" width="70%">
      <VerHistorico :pedido="Pedido" @fecharDialog="fecharHistorico()" />
    </v-dialog>

    <!-- Substituir responsável dialog -->
    <v-dialog v-model="substituirResponsavelDialog" width="80%" persistent>
      <SubstituirResponsavel :pedido="Pedido" @fecharDialog="fecharDialog()" />
    </v-dialog>

    <!-- Dialog para reapreciar pedidos -->
    <v-dialog v-model="reapreciarDialog" width="80%" persistent>
      <AvancarPedido
        :utilizadores="utilizadores"
        :texto="{
          textoTitulo: 'Distribuição',
          textoAlert: 'reapreciação',
          textoBotao: 'Reapreciar',
        }"
        :pedido="Pedido.codigo"
        @fecharDialog="reapreciarDialog = false"
        @avancarPedido="reapreciarPedido($event)"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/Campo";
import Voltar from "@/components/generic/Voltar";

import ShowTSPluri from "@/components/pedidos/consulta/showTSPluri.vue";
import ShowTSOrg from "@/components/pedidos/consulta/showTSOrg.vue";
import ShowClasse from "@/components/pedidos/consulta/showClasse.vue";
import ShowClasseL1 from "@/components/pedidos/consulta/showClasseL1.vue";
import ShowDefault from "@/components/pedidos/consulta/showDefault.vue";
import ShowRADA from "@/components/pedidos/consulta/showRADA.vue";
import ShowAE from "@/components/pedidos/consulta/showAE.vue";
import ShowEntidade from "@/components/pedidos/consulta/showEntidade";
import ShowTipologia from "@/components/pedidos/consulta/showTipologia";
import ShowLegislacao from "@/components/pedidos/consulta/showLegislacao";
import ShowTI from "@/components/pedidos/consulta/showTI";
import ShowPGD from "@/components/pedidos/consulta/showPGD";

import SubstituirResponsavel from "@/components/pedidos/generic/SubstituirResponsavel";
import VerHistorico from "@/components/pedidos/generic/VerHistorico";
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";

import { filtraNivel } from "@/utils/permissoes";
import { NIVEIS_SUBSTITUIR_RESPONSAVEL, NIVEIS_ANALISAR_PEDIDO } from "@/utils/consts";

export default {
  props: ["idp"],

  data: () => ({
    utilizadores: [],
    verHistoricoDialog: false,
    substituirResponsavelDialog: false,
    reapreciarDialog: false,
    Pedido: {
      estado: "a carregar",
      data: "a carregar",
      responsavel: "a carregar",
      despacho: "a carregar",
      objeto: {
        acao: "a carregar",
        tipo: "a carregar",
      },
    },
    distHeaders: [
      { text: "Estado", value: "estado", class: "subtitle-1" },
      { text: "Data", value: "data", class: "subtitle-1" },
      { text: "Responsável", value: "responsavel", class: "subtitle-1" },
      { text: "Despacho", value: "despacho", class: "subtitle-1" },
    ],
  }),
  components: {
    Campo,
    Voltar,

    ShowTSPluri,
    ShowTSOrg,
    ShowClasse,
    ShowClasseL1,
    ShowDefault,
    ShowAE,
    ShowEntidade,
    ShowTipologia,
    ShowLegislacao,
    ShowTI,
    ShowRADA,

    VerHistorico,
    AvancarPedido,
    SubstituirResponsavel,
  },

  computed: {
    label() {
      var value = "Sem categoria";
      switch (this.Pedido.estado) {
        case "Submetido":
          value = "Pedidos Novos";
          break;
        case "Redistribuído":
        case "Distribuído":
          value = "Pedidos em Apreciação Técnica";
          break;
        case "Reapreciado":
        case "Apreciado":
          value = "Pedidos em Validação";
          break;
        case "Em Despacho":
          value = "Pedidos em Despacho";
          break;
        case "Devolvido":
          value = "Pedidos Devolvidos";
          break;
        case "Validado":
          value = "Pedidos Aprovados";
          break;
        default:
          value = "Sem categoria";
      }
      return value;
    },
  },
  async created() {
    await this.listaUtilizadores();
    this.$request("get", "/pedidos/" + this.idp)
      .then((response) => {
        this.Pedido = response.data;
      })
      .catch((error) => {
        return error;
      });
  },
  methods: {
    async listaUtilizadores() {
      const response = await this.$request("get", "/users");

      const utilizadores = filtraNivel(response.data, NIVEIS_ANALISAR_PEDIDO);

      this.utilizadores = utilizadores;
    },

    verHistorico() {
      this.verHistoricoDialog = true;
    },

    fecharHistorico() {
      this.verHistoricoDialog = false;
    },

    temPermissaoSubstituirResponsavel() {
      return NIVEIS_SUBSTITUIR_RESPONSAVEL.includes(this.$userLevel());
    },

    async reapreciarPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.Pedido));

        const estado =
          this.Pedido.estado == "Em Despacho"
            ? "Devolvido para validação"
            : "Redistribuído";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;

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

        this.eapreciarDialog = false;
        this.$router.push("/pedidos");
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
