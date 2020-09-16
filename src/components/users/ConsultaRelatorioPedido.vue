<template>
  <div>
    <v-card shaped class="ma-8">
      <v-card-title class="indigo darken-4 white--text" dark>
        Relatório do pedido: {{ relatorio.numeroPedido }}
      </v-card-title>

      <v-card-text>
        <v-card outlined class="ma-2">
          <v-card-title>
            {{ relatorio.tipoPedido }}

            <v-spacer />

            <v-chip v-if="pedido.estado === 'Validado'" outlined color="green">
              {{ relatorio.estadoPedido }}
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
          </v-card-title>

          <v-card-subtitle>
            <b>Data de criação:</b> <u>{{ relatorio.dataInicial }}</u>
            <br />
            <b>Data de finalização:</b> <u>{{ relatorio.dataFinal }}</u>
          </v-card-subtitle>

          <v-card-text>
            <span v-if="pedido.objeto.acao !== 'Criação'">
              <v-alert
                type="info"
                width="90%"
                class="m-auto mb-2 mt-2"
                outlined
              >
                <span>
                  {{ relatorio.alteracaoInfo }}
                </span>
              </v-alert>

              <v-divider class="m-auto mb-2" />
            </span>

            <v-card class="ma-1">
              <v-data-table
                :headers="tableHeader"
                :items="relatorio.comparacao"
                hide-default-footer
                calculate-widths
                class="elevation-1"
                :footer-props="footerProps"
              >
                <template v-slot:[`item.campo`]="{ item }">
                  <span class="font-weight-bold"> {{ item.campo }}</span>
                </template>

                <template v-slot:[`item.nota`]="{ item }">
                  <v-icon v-if="!item.finalizado.nota" disabled>
                    speaker_notes_off
                  </v-icon>

                  <v-badge v-else color="blue" dot>
                    <v-icon @click="abrirNotaDialog(item.finalizado.nota)">
                      speaker_notes
                    </v-icon>
                  </v-badge>
                </template>

                <template v-slot:[`item.submetido`]="{ item }">
                  <v-alert
                    v-if="
                      item.submetido === undefined ||
                        item.submetido.dados === '' ||
                        item.submetido.dados === null
                    "
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    color="grey"
                    icon="not_interested"
                  >
                    Campo não preenchido
                  </v-alert>

                  <v-alert
                    v-else-if="item.submetido.dados instanceof Array"
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.submetido.cor)"
                    :icon="icons(item.submetido.cor)"
                  >
                    <v-chip
                      v-if="item.submetido.dados.length === 0"
                      color="grey"
                      label
                      outlined
                    >
                      A lista está vazia.
                    </v-chip>

                    <ul v-else class="ma-0">
                      <span
                        v-for="dado in item.submetido.dados"
                        :key="dado.sigla"
                      >
                        <li v-if="dado.sigla">
                          {{ dado.sigla }}
                        </li>

                        <li v-else>
                          {{ dado.codigo }}
                        </li>
                      </span>
                    </ul>
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.submetido.cor)"
                    :icon="icons(item.submetido.cor)"
                  >
                    {{ item.submetido.dados }}
                  </v-alert>
                </template>

                <template v-slot:[`item.finalizado`]="{ item }">
                  <v-alert
                    v-if="
                      item.finalizado === undefined ||
                        item.finalizado.dados === '' ||
                        item.finalizado.dados === null
                    "
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    color="grey"
                    icon="not_interested"
                  >
                    Campo não preenchido
                  </v-alert>

                  <v-alert
                    v-else-if="item.finalizado.dados instanceof Array"
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.finalizado.cor)"
                    :icon="icons(item.finalizado.cor)"
                  >
                    <v-chip
                      v-if="item.finalizado.dados.length === 0"
                      color="grey"
                      label
                      outlined
                    >
                      A lista está vazia.
                    </v-chip>

                    <ul v-else class="ma-0">
                      <span
                        v-for="dado in item.finalizado.dados"
                        :key="dado.sigla"
                      >
                        <li v-if="dado.sigla">
                          <v-badge
                            v-if="
                              novoItemAdicionado(
                                dado.sigla,
                                item.submetido,
                                'sigla'
                              )
                            "
                            right
                            dot
                            inline
                            >{{ dado.sigla }}</v-badge
                          >

                          <span v-else>
                            {{ dado.sigla }}
                          </span>
                        </li>

                        <li v-else>
                          <v-badge
                            v-if="
                              novoItemAdicionado(
                                dado.codigo,
                                item.submetido,
                                'codigo'
                              )
                            "
                            right
                            dot
                            inline
                            >{{ dado.codigo }}</v-badge
                          >

                          <span v-else>
                            {{ dado.codigo }}
                          </span>
                        </li>
                      </span>
                    </ul>
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.finalizado.cor)"
                    :icon="icons(item.finalizado.cor)"
                  >
                    {{ item.finalizado.dados }}
                  </v-alert>
                </template>
              </v-data-table>
            </v-card>

            <div v-if="relatorio.despacho.trim() !== ''" class="mt-2">
              <v-divider class="m-auto mb-4" />
              <v-textarea
                :value="relatorio.despacho"
                label="Despacho"
                shaped
                rounded
                filled
                readonly
                hide-details
                no-resize
              />
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions class="ml-4">
        <v-btn color="indigo" dark class="mb-2" @click="voltar">Voltar</v-btn>
        <v-spacer />
        <v-btn color="indigo accent-4" dark class="mb-2 mr-4" @click="geraPDF">
          Descarregar
          <v-icon right dark>picture_as_pdf</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog da nota -->
    <v-dialog v-model="notaDialog.visivel" width="70%" persistent>
      <ConsultarNota :nota="notaDialog.nota" @fecharDialog="fecharNotaDialog" />
    </v-dialog>
  </div>
</template>

<script>
import ConsultarNota from "@/components/generic/ConsultarNotaCampoDialog";

import { gerarDadosRelatorio, identificaItemEmTabela } from "@/utils/utils";
import { gerarPDF } from "@/utils/pdf";

export default {
  props: ["pedido"],

  components: {
    ConsultarNota,
  },

  data() {
    return {
      notaDialog: {
        visivel: false,
        nota: null,
      },
      relatorio: {},
      tableHeader: [
        {
          text: "Campo",
          value: "campo",
          class: "title",
          sortable: false,
        },
        {
          text: "Submetido",
          value: "submetido",
          class: "title",
          sortable: false,
        },
        {
          text: "Finalizado",
          value: "finalizado",
          class: "title",
          sortable: false,
        },
        {
          text: "Nota",
          value: "nota",
          class: "title",
          sortable: false,
          align: "center",
        },
      ],
      footerProps: {
        "items-per-page-options": [-1],
      },
    };
  },

  created() {
    this.prepararRelatorio();
  },

  methods: {
    geraPDF() {
      gerarPDF(this.relatorio);
    },

    fecharNotaDialog() {
      this.notaDialog = {
        visivel: false,
        nota: null,
      };
    },

    abrirNotaDialog(nota) {
      this.notaDialog = {
        visivel: true,
        nota: nota,
      };
    },

    novoItemAdicionado(item, lista, siglaOuCodigo) {
      return identificaItemEmTabela(item, lista, siglaOuCodigo);
    },

    cores(cor) {
      let retornaCor;

      switch (cor) {
        case "verde":
          retornaCor = "green";
          break;

        case "amarelo":
          retornaCor = "orange";
          break;

        case "vermelho":
          retornaCor = "red";
          break;

        default:
          break;
      }

      return retornaCor;
    },

    icons(cor) {
      let retornaIcon;

      switch (cor) {
        case "verde":
          retornaIcon = "done";
          break;

        case "amarelo":
          retornaIcon = "create";
          break;

        case "vermelho":
          retornaIcon = "clear";
          break;

        default:
          break;
      }

      return retornaIcon;
    },

    prepararRelatorio() {
      const relatorio = gerarDadosRelatorio(this.pedido);

      this.relatorio = relatorio;
    },

    voltar() {
      this.$router.go(-1);
    },
  },
};
</script>
