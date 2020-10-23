<template>
  <v-card class="ma-8">
    <div v-if="!erroDialog.visivel">
      <v-card-title class="pa-2 indigo darken-4 title white--text">
        Consulta do pedido: {{ p.codigo }} <v-spacer />
        <v-chip color="indigo accent-4" text-color="white" label>
          <v-icon class="mr-1">label</v-icon>
          <b>Pedidos Novos</b>
        </v-chip>
      </v-card-title>
      <v-card-text>
        <v-row class="mt-1">
          <v-col cols="2">
            <div class="info-label">Estado</div>
          </v-col>
          <v-col>
            <div class="info-content">{{ p.estado }}</div>
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col cols="2">
            <div class="info-label">Data</div>
          </v-col>
          <v-col>
            <div class="info-content">{{ p.data.split("T")[0] }}</div>
          </v-col>
        </v-row>
        <v-row class="mt-1" v-if="p.entidade">
          <v-col cols="2">
            <div class="info-label">Entidade</div>
          </v-col>
          <v-col>
            <div class="info-content">{{ p.entidade }}</div>
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col cols="2">
            <div class="info-label">Criado Por</div>
          </v-col>
          <v-col>
            <div class="info-content">{{ p.criadoPor }}</div>
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col cols="2">
            <div class="info-label">Tipo</div>
          </v-col>
          <v-col>
            <div class="info-content">
              {{ p.objeto.acao }} - {{ p.objeto.tipo }}
            </div>
          </v-col>
        </v-row>

        <v-card class="mt-3">
          <v-card-title class="pa-2 indigo darken-4 title white--text">
            Distribuição
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="distHeaders"
              :items="p.distribuicao"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item="props">
                <tr>
                  <td class="subheading">{{ props.item.estado }}</td>
                  <td class="subheading">
                    {{ converteData(props.item.data) }}
                  </td>
                  <td class="subheading">{{ props.item.responsavel }}</td>
                  <td class="subheading">
                    {{ props.item.despacho }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <ShowTSPluri v-if="p.objeto.tipo == 'TS Pluriorganizacional'" :p="p" />
        <ShowTSOrg v-else-if="p.objeto.tipo == 'TS Organizacional'" :p="p" />
        <ShowClasse v-else-if="p.objeto.tipo == 'Classe'" :p="p" />
        <ShowEntidade
          v-else-if="p.objeto.tipo == 'Entidade'"
          :p="p"
          @verHistorico="verHistorico()"
        />
        <ShowRADA v-else-if="p.objeto.tipo == 'RADA'" :p="p" />
        <ShowAE
          v-else-if="
            p.objeto.tipo.includes('AE ') ||
              p.objeto.tipo == 'Auto de Eliminação'
          "
          :p="p"
        />
        <ShowPGD v-else-if="p.objeto.tipo == 'PGD'" :p="p" />
        <ShowTipologia
          v-else-if="p.objeto.tipo === 'Tipologia'"
          :p="p"
          @verHistorico="verHistorico()"
        />
        <ShowLegislacao
          v-else-if="p.objeto.tipo == 'Legislação'"
          :p="p"
          @verHistorico="verHistorico()"
        />
        <ShowTI v-else-if="p.objeto.tipo == 'Termo de Indice'" :p="p" />
        <ShowDefault v-else :p="p" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="indigo" dark @click="voltar">Voltar</v-btn>
        <v-spacer />
        <span v-if="temPermissaoDistribuir()">
          <!-- TODO: Alterar com as permissões corretas -->
          <v-btn
            class="mr-9"
            text
            color="red accent-4"
            dark
            @click="devolver = true"
          >
            Devolver
          </v-btn>

          <v-btn color="indigo accent-4" dark @click="distribuir = true">
            Distribuir
          </v-btn>
        </span>
      </v-card-actions>

      <v-dialog v-model="distribuir" width="80%" persistent>
        <AvancarPedido
          :utilizadores="utilizadores"
          :texto="{
            textoTitulo: 'Distribuição',
            textoAlert: 'análise',
            textoBotao: 'Distribuir',
          }"
          :pedido="p.codigo"
          @fecharDialog="fecharDialog()"
          @avancarPedido="atribuirPedido($event)"
        />
      </v-dialog>
    </div>

    <!-- Campo despacho -->
    <v-dialog v-model="devolver" width="60%">
      <DevolverPedido
        @fecharDialog="fecharDialog()"
        @devolverPedido="despacharPedido($event)"
      />
    </v-dialog>

    <!-- Dialog de erros -->
    <v-dialog v-model="erroDialog.visivel" width="50%" persistent>
      <ErroDialog :erros="erroDialog.mensagem" uri="/pedidos" />
    </v-dialog>

    <!-- Dialog Ver Historico de Alterações-->
    <v-dialog v-model="verHistoricoDialog" width="70%">
      <VerHistorico :pedido="p" @fecharDialog="fecharHistorico()" />
    </v-dialog>
  </v-card>
</template>

<script>
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import ShowTSPluri from "@/components/pedidos/consulta/showTSPluri.vue";
import ShowTSOrg from "@/components/pedidos/consulta/showTSOrg.vue";
import ShowClasse from "@/components/pedidos/consulta/showClasse.vue";
import ShowDefault from "@/components/pedidos/consulta/showDefault.vue";
import ShowRADA from "@/components/pedidos/consulta/showRADA.vue";
import ShowAE from "@/components/pedidos/consulta/showAE.vue";
import ShowEntidade from "@/components/pedidos/consulta/showEntidade";
import ShowTipologia from "@/components/pedidos/consulta/showTipologia";
import ShowLegislacao from "@/components/pedidos/consulta/showLegislacao";
import ShowTI from "@/components/pedidos/consulta/showTI";
import ShowPGD from "@/components/pedidos/consulta/showPGD";

import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import ErroDialog from "@/components/generic/ErroDialog";

import VerHistorico from "@/components/pedidos/generic/VerHistorico";

import {
  NIVEIS_ANALISAR_PEDIDO,
  NIVEL_MINIMO_DISTRIBUIR_PEDIDOS,
} from "@/utils/consts";
import { converteData } from "@/utils/utils";
import { filtraNivel } from "@/utils/permissoes";

export default {
  props: ["p"],

  components: {
    ShowTSPluri,
    ShowTSOrg,
    ShowClasse,
    ShowDefault,
    ShowAE,
    ShowEntidade,
    ShowTipologia,
    ShowLegislacao,
    ShowTI,
    AvancarPedido,
    ShowRADA,
    ShowPGD,
    ErroDialog,
    VerHistorico,
    DevolverPedido,
  },

  data() {
    return {
      devolver: false,
      verHistoricoDialog: false,
      distribuir: false,
      utilizadores: [],
      erroDialog: {
        visivel: false,
        mensagem: null,
      },
      headers: [
        { text: "Estado", align: "left", sortable: false, value: "estado" },
        { text: "Data", value: "data" },
        { text: "Responsável", value: "responsavel" },
        { text: "Despacho", value: "despacho" },
        { text: "Objeto", value: "objeto" },
      ],
      distHeaders: [
        { text: "Estado", value: "estado", class: "subtitle-1" },
        { text: "Data", value: "data", class: "subtitle-1" },
        { text: "Responsável", value: "responsavel", class: "subtitle-1" },
        { text: "Despacho", value: "despacho", class: "subtitle-1" },
      ],
    };
  },

  async created() {
    if (this.p.estado !== "Submetido") {
      this.erroDialog.visivel = true;
      this.erroDialog.mensagem = "Este pedido não se encontra neste estado.";
    }

    if (this.temPermissaoDistribuir()) await this.listaUtilizadores();
  },

  methods: {
    temPermissaoDistribuir() {
      return this.$userLevel() >= NIVEL_MINIMO_DISTRIBUIR_PEDIDOS;
    },

    converteData(data) {
      let dataFormatada = "";
      let dataConvertida = new Date(data);

      dataFormatada += `${data.split("T")[0]} - ${dataConvertida.getHours()}:`;

      if (dataConvertida.getMinutes() < 10)
        dataFormatada += `0${dataConvertida.getMinutes()}`;
      else dataFormatada += dataConvertida.getMinutes();

      return dataFormatada;
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

        await this.$request("put", "/pedidos", {
          pedido: pedido,
          distribuicao: novaDistribuicao,
        });

        this.fecharDialog();

        const submissao = JSON.parse(localStorage.getItem("submissao"));

        if (submissao) {
          localStorage.removeItem("submissao");
          this.$router.push("/pedidos");
        } else {
          this.$router.go(-1);
        }
      } catch (e) {
        this.erroDialog.visivel = true;
        this.erroDialog.mensagem =
          "Erro ao devolver o pedido, por favor tente novamente";
      }
    },

    despacho_para_html(despacho) {
      let despacho_divido_por_n = despacho.split("\n");

      if (despacho_divido_por_n.length == 1) {
        return despacho_divido_por_n[0];
      } else {
        let html = "<div><br/>" + despacho_divido_por_n[0] + "<br/><ul>";

        for (let i = 1; i < despacho_divido_por_n.length - 1; i++) {
          // const regex_encontrar_codigo = /\[(?<codigo>.*)\](?<pedido>.*)/

          let match_regex = despacho_divido_por_n[i].match(
            /\[(?<codigo>.*)\](?<pedido>.*)/
          ).groups;

          html =
            html +
            "<li><a href=" +
            match_regex.codigo +
            ">" +
            match_regex.pedido +
            "</a></li>";
        }

        html = html + "</ul></div>";

        return html;
      }
    },

    async listaUtilizadores() {
      const response = await this.$request("get", "/users");

      const utilizadores = filtraNivel(response.data, NIVEIS_ANALISAR_PEDIDO);

      this.utilizadores = utilizadores;
    },

    async atribuirPedido(dados) {
      try {
        let pedido = JSON.parse(JSON.stringify(this.p));

        const estado = "Distribuído";

        let dadosUtilizador = this.$verifyTokenUser();

        pedido.estado = estado;

        pedido.historico.push(pedido.historico[pedido.historico.length - 1]);

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

        this.fecharDialog();
        this.$router.push("/pedidos");
      } catch (e) {
        //console.log("e :", e);
      }
    },

    verHistorico() {
      this.verHistoricoDialog = true;
    },

    fecharHistorico() {
      this.verHistoricoDialog = false;
    },

    fecharDialog() {
      this.distribuir = false;
      this.devolver = false;
    },

    voltar() {
      const submissao = JSON.parse(localStorage.getItem("submissao"));

      if (submissao) {
        localStorage.removeItem("submissao");
        this.$router.push("/pedidos");
      } else {
        const pesquisa = JSON.parse(localStorage.getItem("pesquisa-pedidos"));
        localStorage.setItem(
          "pesquisa-pedidos",
          JSON.stringify({
            ...pesquisa,
            limpar: false,
          })
        );

        this.$router.go(-1);
      }
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #1a237e; /* indigo darken-4 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  margin-top: 5px;
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
