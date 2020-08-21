<template>
  <div>
    <Loading v-if="loading" :message="'pedido'" />
    <span v-else>
      <v-card shaped class="ma-8">
        <v-card-title class="indigo darken-4 white--text" dark>
          Informação sobre o pedido: {{ numeroPedido }}
        </v-card-title>

        <v-card-text>
          <div class="ma-2">
            <v-progress-linear
              :color="calculaCor(pedido.estado)"
              height="20"
              :value="calculaValor(pedido.estado)"
              striped
              rounded
            >
              <template>
                <strong class="white--text">{{ pedido.estado }}</strong>
              </template>
            </v-progress-linear>
          </div>

          <v-card outlined class="ma-2">
            <v-card-title>
              {{ tipoPedido }}
              <v-spacer />
              <v-chip
                v-if="pedido.estado === 'Validado'"
                outlined
                color="green"
              >
                {{ pedido.estado }}
                <v-icon right>assignment_turned_in</v-icon>
              </v-chip>

              <v-chip
                v-else-if="pedido.estado === 'Devolvido'"
                outlined
                color="red"
              >
                {{ pedido.estado }}
                <v-icon right>assignment_late</v-icon>
              </v-chip>

              <v-chip
                v-else-if="pedido.estado === 'Submetido'"
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
            </v-card-title>

            <v-card-subtitle>{{ dataPedido }}</v-card-subtitle>

            <v-card-text>
              <span v-if="pedido.objeto.acao !== 'Criação'">
                <v-alert
                  type="info"
                  width="90%"
                  class="m-auto mb-2 mt-2"
                  outlined
                >
                  <span v-if="pedido.objeto.tipo === 'Legislação'">
                    <b> {{ pedido.objeto.tipo }}: </b>
                    {{ dadosOriginais.diplomaFonte }}
                    - {{ dadosOriginais.numero }} -
                    {{ dadosOriginais.sumario }}
                  </span>

                  <span v-else-if="pedido.objeto.tipo === 'Entidade'">
                    <b> {{ pedido.objeto.tipo }}: </b>
                    {{ dadosOriginais.sigla }}
                    - {{ dadosOriginais.designacao }}
                  </span>

                  <span v-else-if="pedido.objeto.tipo === 'Tipologia'">
                    <b> {{ pedido.objeto.tipo }}: </b>
                    {{ dadosOriginais.sigla }}
                    - {{ dadosOriginais.designacao }}
                  </span>
                </v-alert>

                <v-divider class="m-auto mb-2" />
              </span>

              <div v-for="(info, campo) in dados" :key="campo">
                <v-row
                  v-if="
                    campo !== 'id' &&
                      info !== '' &&
                      info !== null &&
                      info !== undefined
                  "
                >
                  <v-col>
                    <v-text-field
                      v-if="!(info instanceof Array)"
                      shaped
                      rounded
                      filled
                      readonly
                      dense
                      hide-details
                      :label="transformaKeys(campo)"
                      :value="info"
                    />

                    <!-- Entidades -->
                    <v-card
                      v-else-if="campo === 'entidadesSel'"
                      shaped
                      class="rounded-t"
                    >
                      <v-card-title class="cardTitle">
                        {{ transformaKeys(campo) }}
                      </v-card-title>

                      <v-card-text class="mt-2">
                        <v-data-table
                          :headers="entidadesHeaders"
                          :items="info"
                          class="elevation-1"
                          :footer-props="entidadesFooterProps"
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
                        </v-data-table>
                      </v-card-text>
                    </v-card>

                    <!-- Processos -->
                    <v-card
                      v-else-if="campo === 'processosSel'"
                      shaped
                      class="rounded-t"
                    >
                      <v-card-title class="cardTitle">
                        {{ transformaKeys(campo) }}
                      </v-card-title>

                      <v-card-text class="mt-2">
                        <v-data-table
                          :headers="processosHeaders"
                          :items="info"
                          class="elevation-1"
                          :footer-props="processosFooterProps"
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
                        </v-data-table>
                      </v-card-text>
                    </v-card>

                    <!-- Tipologias -->
                    <v-card
                      v-else-if="campo === 'tipologiasSel'"
                      shaped
                      class="rounded-t"
                    >
                      <v-card-title class="cardTitle">
                        {{ transformaKeys(campo) }}
                      </v-card-title>

                      <v-card-text class="mt-2">
                        <v-data-table
                          :headers="tipologiasHeaders"
                          :items="info"
                          class="elevation-1"
                          :footer-props="tipologiasFooterProps"
                        >
                          <template v-slot:no-data>
                            <v-alert
                              type="error"
                              width="100%"
                              class="m-auto mb-2 mt-2"
                              outlined
                            >
                              Nenhuma tipologias de entidade selecionada...
                            </v-alert>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-actions class="ml-4">
          <v-btn color="indigo" dark class="mb-2" @click="voltar">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </span>

    <!-- Dialog de erros da API -->
    <v-dialog v-model="erroPedido" width="50%" persistent>
      <ErroAPIDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import ErroAPIDialog from "@/components/generic/ErroAPIDialog";
import Loading from "@/components/generic/Loading";

import { mapKeys } from "@/utils/utils";

export default {
  props: ["numeroPedido"],

  components: {
    ErroAPIDialog,
    Loading,
  },

  data() {
    return {
      erros: [],
      erroPedido: false,
      loading: true,
      pedido: {},
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
    };
  },

  computed: {
    dados() {
      return this.pedido.objeto.dados;
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

  async created() {
    try {
      const { data } = await this.$request(
        "get",
        `/pedidos/${this.numeroPedido}`
      );

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

  methods: {
    calculaCor(estado) {
      let cor = "blue";

      switch (estado) {
        case "Submetido":
          cor = "blue";
          break;

        case "Distribuído":
        case "Redistribuído":
          cor = "orange";
          break;

        case "Apreciado":
        case "Reapreciado":
          cor = "orange";
          break;

        case "Devolvido":
          cor = "red";
          break;

        case "Validado":
          cor = "green";
          break;

        default:
          cor = "blue";
          break;
      }

      return cor;
    },

    calculaValor(estado) {
      let valor = 0;

      switch (estado) {
        case "Submetido":
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
        this.$router.push("/users/pedidos");
      } else {
        this.$router.go(-1);
      }
    },

    fecharErro() {
      this.erroPedido = false;
      this.$router.go(-1);
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
