<template>
  <div>
    <Loading v-if="loading" message="pedido" />
    <v-card v-else flat class="pa-2">
      <v-card-title class="clav-content-title-1">
        Informação sobre o pedido: {{ numeroPedido }}
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          :color="cor[pedido.estado ? pedido.estado : 'Default']"
          height="20"
          :value="calculaValor(pedido.estado)"
          buffer-value="100"
          rounded
          class="mb-3"
        >
          <template>
            <strong class="white--text">{{ pedido.estado }}</strong>
          </template>
        </v-progress-linear>

        <v-row>
          <v-col cols="9">
            <div class="clav-content-title-2">{{ tipoPedido }}</div>
            <div class="content-text ml-1">{{ dataPedido }}</div>
          </v-col>
          <v-spacer />
          <v-col cols="3" align="right">
            <v-chip v-if="pedido.estado === 'Validado'" outlined color="green">
              {{ pedido.estado }}
              <v-icon right>assignment_turned_in</v-icon>
            </v-chip>
            <v-chip v-else-if="pedido.estado === 'Devolvido'" outlined color="red">
              {{ pedido.estado }}
              <v-icon right>assignment_late</v-icon>
            </v-chip>
            <v-chip
              v-else-if="
                pedido.estado === 'Submetido' || pedido.estado === 'Ressubmetido'
              "
              outlined
              color="blue"
            >
              {{ pedido.estado }}
              <v-icon right>send</v-icon>
            </v-chip>
            <v-chip v-else outlined color="orange">
              {{ pedido.estado }}
              <v-icon right>assignment</v-icon>
            </v-chip>
          </v-col>
        </v-row>
        <span
          v-if="pedido.objeto.acao !== 'Criação' && pedido.objeto.acao !== 'Alteração'"
        >
          <v-alert type="warning" class="m-auto mb-2 mt-2">
            <span v-if="pedido.objeto.tipo === 'Legislação'">
              <b>{{ pedido.objeto.tipo }}:</b>
              {{ dadosOriginais.diplomaFonte }}
              - {{ dadosOriginais.numero }} -
              {{ dadosOriginais.sumario }}
            </span>

            <span v-else-if="pedido.objeto.tipo === 'Entidade'">
              <b>{{ pedido.objeto.tipo }}:</b>
              {{ dadosOriginais.sigla }}
              - {{ dadosOriginais.designacao }}
            </span>

            <span v-else-if="pedido.objeto.tipo === 'Tipologia'">
              <b>{{ pedido.objeto.tipo }}:</b>
              {{ dadosOriginais.sigla }}
              - {{ dadosOriginais.designacao }}
            </span>
          </v-alert>

          <v-divider class="m-auto mb-2" />
        </span>
        <ShowTSPluri v-if="pedido.objeto.tipo == 'TS Pluriorganizacional'" :p="pedido" />
        <ShowTSOrg v-else-if="pedido.objeto.tipo == 'TS Organizacional'" :p="pedido" />
        <ShowAE v-else-if="pedido.objeto.tipo === 'Auto de Eliminação'" :p="pedido" />
        <ShowRADA v-else-if="pedido.objeto.tipo == 'RADA'" :p="pedido" />
        <div v-else v-for="(info, campo) in dados" :key="campo">
          <v-row
            v-if="
              campo !== 'id' &&
              campo !== 'user' &&
              !camposEscondidos.find((item) => item === campo) &&
              info !== '' &&
              info !== null &&
              info !== undefined
            "
          >
            <v-col>
              <Campo
                v-if="!(info instanceof Array) && campo !== 'pai'"
                :nome="transformaKeys(campo)"
                color="neutralpurple"
                class="mb-n5"
              >
                <template v-slot:conteudo>
                  {{ info }}
                </template>
              </Campo>

              <Campo
                v-else-if="campo === 'pai' && !!info.codigo"
                :nome="campo.charAt(0).toUpperCase() + campo.slice(1)"
                color="neutralpurple"
                class="mb-n5"
              >
                <template v-slot:conteudo>
                  {{ info.codigo }} {{ !!info.titulo ? "- " + info.titulo : "" }}
                </template>
              </Campo>

              <!-- Entidades -->
              <Campo
                v-else-if="campo === 'entidadesSel'"
                :nome="transformaKeys(campo)"
                color="neutralpurple"
              >
                <template v-slot:conteudo>
                  <v-data-table
                    :headers="entidadesHeaders"
                    :items="info"
                    :footer-props="entidadesFooterProps"
                  >
                    <template v-slot:no-data>
                      <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined
                        >Nenhuma entidade selecionada...</v-alert
                      >
                    </template>
                  </v-data-table>
                </template>
              </Campo>

              <!-- Processos -->
              <Campo
                v-else-if="campo === 'processosSel'"
                :nome="transformaKeys(campo)"
                color="neutralpurple"
              >
                <template v-slot:conteudo>
                  <v-data-table
                    :headers="processosHeaders"
                    :items="info"
                    :footer-props="processosFooterProps"
                  >
                    <template v-slot:no-data>
                      <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined
                        >Nenhum processo selecionado...</v-alert
                      >
                    </template>
                  </v-data-table>
                </template>
              </Campo>

              <!-- Tipologias -->
              <Campo
                v-else-if="campo === 'tipologiasSel'"
                :nome="transformaKeys(campo)"
                color="neutralpurple"
              >
                <template v-slot:conteudo>
                  <v-data-table
                    :headers="tipologiasHeaders"
                    :items="info"
                    :footer-props="tipologiasFooterProps"
                  >
                    <template v-slot:no-data>
                      <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined
                        >Nenhuma tipologias de entidade selecionada...</v-alert
                      >
                    </template>
                  </v-data-table>
                </template>
              </Campo>

              <!-- Notas de Aplicaçao/Exclusao -->

              <Campo
                v-else-if="campo === 'notasAp' || campo === 'notasEx'"
                :nome="transformaKeys(campo)"
                color="neutralpurple"
              >
                <template v-slot:conteudo>
                  <v-data-table
                    :headers="notasAppHeaders"
                    :items="info"
                    :footer-props="notasAppFooterProps"
                  >
                    <template v-slot:no-data>
                      <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined
                        >Nenhuma Nota adicionada...</v-alert
                      >
                    </template>
                  </v-data-table>
                </template>
              </Campo>
            </v-col>
          </v-row>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="primary" rounded @click="voltar"
          >Painel de controlo
          <unicon
            class="ml-1"
            name="perfil-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 23.677"
            fill="#fff"
        /></v-btn>
        <v-btn
          v-if="['Validado', 'Devolvido'].includes(pedido.estado)"
          color="primary"
          rounded
          class="ml-1"
          @click="verRelatorio()"
          >Ver Relatório</v-btn
        >
        <v-btn
          v-if="['Devolvido'].includes(pedido.estado)"
          color="success"
          rounded
          class="ml-1"
          @click="corrigirPedido(pedido)"
          >Corrigir</v-btn
        >
      </v-card-actions>
    </v-card>
    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";
import Loading from "@/components/generic/Loading";
import ShowTSPluri from "@/components/pedidos/consulta/showTSPluri.vue";
import ShowTSOrg from "@/components/pedidos/consulta/showTSOrg.vue";
import ShowAE from "@/components/pedidos/consulta/showSubmissaoAE.vue";
import ShowRADA from "@/components/pedidos/consulta/showRADA.vue";
import { mapKeys } from "@/utils/utils";
import PedidosDevolvidosVue from "../pedidos/PedidosDevolvidos.vue";
import Campo from "@/components/generic/Campo";
import { bus } from "../../main";

export default {
  props: ["numeroPedido"],

  components: {
    ErroAPIDialog,
    Loading,
    ShowTSPluri,
    ShowTSOrg,
    ShowAE,
    ShowRADA,
    Campo,
  },

  data() {
    return {
      cor: {
        Submetido: "blue",
        Ressubmetido: "grey",
        Distribuído: "orange",
        Redistribuído: "orange",
        Apreciado: "orange",
        Reapreciado: "orange",
        Devolvido: "red",
        Validado: "green",
        Default: "blue",
      },
      erros: [],
      erroPedido: false,
      loading: true,
      pedido: {},
      camposEscondidos: [
        "temSubclasses4Nivel",
        "temSubclasses4NivelPCA",
        "temSubclasses4NivelDF",
        "subdivisao4Nivel01Sintetiza02",
        "tipoProc",
        "procTrans",
        "donos",
        "participantes",
        "processosRelacionados",
        "legislacao",
        "pca",
        "df",
        "subclasses",
      ],
      entidadesHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      entidadesFooterProps: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
      processosHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
      ],
      processosFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
      tipologiasHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      tipologiasFooterProps: {
        "items-per-page-text": "Tipologias por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
      notasAppHeaders: [
        { text: "Notas de Aplicação", value: "nota", class: "subtitle-1" },
      ],
      notasAppFooterProps: {
        "items-per-page-text": "Notas por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },
    };
  },

  async created() {
    try {
      const { data } = await this.$request("get", `/pedidos/${this.numeroPedido}`);
      this.pedido = data;
      this.loading = false;
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
  computed: {
    dados() {
      if (this.pedido.estado === "Devolvido" || this.pedido.estado === "Validado")
        return this.pedido.objeto.dados;
      else return this.dadosSubmetidos;
    },

    dadosSubmetidos() {
      const criaEstruturaPedido = {};
      Object.keys(this.pedido.historico[0]).forEach((key) => {
        criaEstruturaPedido[key] = this.pedido.historico[0][key].dados;
      });
      return criaEstruturaPedido;
    },

    dadosOriginais() {
      return this.pedido.objeto.dadosOriginais;
    },

    tipoPedido() {
      return `${this.pedido.objeto.acao} - ${this.pedido.objeto.tipo}`;
    },

    dataPedido() {
      return this.pedido.data.split("T")[0];
    },
  },

  methods: {
    verRelatorio() {
      this.$router.push(`/users/pedidos/${this.pedido.codigo}/relatorio`);
    },
    corrigirPedido(pedido) {
      this.$router.push("/ressubmissao/" + pedido.codigo);
    },
    calculaValor(estado) {
      let valor = 0;

      switch (estado) {
        case "Submetido":
        case "Ressubmetido":
          valor = (100 / 4) * 1;
          break;

        case "Distribuído":
        case "Redistribuído":
          valor = (100 / 4) * 2;
          break;

        case "Apreciado":
        case "Reapreciado":
          valor = (100 / 4) * 3;
          break;

        case "Devolvido":
        case "Validado":
          valor = (100 / 4) * 4;
          break;

        default:
          valor = 0;
          break;
      }

      return valor;
    },

    voltar() {
      const submissao = JSON.parse(localStorage.getItem("submissao"));

      if (submissao) {
        localStorage.removeItem("submissao");
        this.$router.push("/users/painel");
      } else {
        this.$router.go(-1);
      }
    },

    fecharErro() {
      this.erroPedido = false;
      this.$router.push("/users/pedidos");
    },

    transformaKeys(key) {
      return mapKeys(key);
    },
  },
};
</script>

<style scoped>
.cardTitle {
  background-color: #f0f0f0;
}

.cardTitle:hover {
  background-color: #e0e0e0;
}
</style>
