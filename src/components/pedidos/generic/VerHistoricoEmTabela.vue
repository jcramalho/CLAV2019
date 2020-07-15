<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Comparação de duas etapas
    </v-card-title>

    <v-card-text class="ma-0">
      <v-stepper v-model="etapa" alt-labels>
        <v-stepper-header>
          <!-- Step 1 -->
          <v-stepper-step :complete="etapa > 1" step="1">
            Etapas a comparar
          </v-stepper-step>

          <v-divider />

          <!-- Step 2 -->
          <v-stepper-step :complete="etapa > 2" step="2">
            Comparação
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-select
              v-model="etapasSelecionadas"
              :items="etapasHistorico"
              label="Escolha duas etapas a comparar"
              filled
              clearable
              multiple
              chips
              hide-selected
              deletable-chips
              class="m-2 mt-4"
            >
              <template slot="no-data">
                <v-alert type="info" width="99%" class="m-auto " outlined>
                  Sem mais dados a mostrar.
                </v-alert>
              </template>
            </v-select>

            <v-btn
              class="mt-9"
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="gerarTabela()"
            >
              Continuar
            </v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card class="ma-1">
              <v-data-table
                v-if="defaultHeaders.length !== 0"
                :headers="defaultHeaders"
                :items="dadosTabela"
                hide-default-footer
                calculate-widths
                class="elevation-1"
                :footer-props="footerProps"
              >
                <template v-slot:item.campo="{ item }">
                  <span class="font-weight-bold"> {{ item.campo }}</span>
                </template>

                <template v-slot:item.colunaA="{ item }">
                  <v-alert
                    v-if="
                      item.colunaA.dados === '' || item.colunaA.dados === null
                    "
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    color="grey"
                  >
                    Campo não preenchido
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaA.cor)"
                  >
                    {{ item.colunaA.dados }}
                  </v-alert>
                </template>

                <template v-slot:item.colunaB="{ item }">
                  <v-alert
                    v-if="
                      item.colunaB.dados === '' || item.colunaB.dados === null
                    "
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    color="grey"
                  >
                    Campo não preenchido
                  </v-alert>

                  <v-alert
                    v-else
                    border="right"
                    class="pa-2 ma-2 ml-0 mr-0"
                    text
                    :color="cores(item.colunaB.cor)"
                  >
                    {{ item.colunaB.dados }}
                  </v-alert>
                </template>
              </v-data-table>
            </v-card>

            <v-btn
              class="mt-5"
              :disabled="etapasSelecionadas.length !== 2"
              color="primary"
              @click="voltar()"
            >
              Voltar
            </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" rounded dark @click="fechar()">
        Fechar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapKeys } from "@/utils/utils";

export default {
  props: ["historico", "distribuicao", "tipoPedido"],

  data() {
    return {
      dadosTabela: [],
      etapa: 1,
      etapasHistorico: [],
      etapasSelecionadas: [],
      defaultHeaders: [],
      footerProps: {
        "items-per-page-options": [-1],
      },
    };
  },

  created() {
    this.removeEstados();

    switch (this.tipoPedido) {
      case "Criação":
        this.preparaHistoricoCriacao();
        break;
      case "Alteração":
      case "Extinção":
        this.preparaHistoricoAlteracao();
        break;

      default:
        break;
    }
  },

  methods: {
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

    removeEstados() {
      const distI = this.distribuicao.findIndex(
        (dist) => dist.estado === "Distribuído"
      );

      if (distI !== -1) this.distribuicao.splice(distI, 1);

      const devoI = this.distribuicao.findIndex(
        (dist) => dist.estado === "Devolvido"
      );

      if (devoI !== -1) this.distribuicao.splice(devoI, 1);

      const procI = this.distribuicao.findIndex(
        (dist) => dist.estado === "Processado"
      );

      if (procI !== -1) this.distribuicao.splice(procI, 1);
    },

    voltar() {
      this.defaultHeaders = [];
      this.dadosTabela = [];
      this.etapasSelecionadas = [];

      this.etapa = 1;
    },

    gerarTabela() {
      this.removeEstados();

      this.defaultHeaders.push({
        text: "Campo",
        value: "campo",
        class: "title",
        width: "20%",
        sortable: false,
      });
      let indexA;
      let indexB;

      if (
        this.etapasSelecionadas[0] === "Pedido Submetido" ||
        this.etapasSelecionadas[0] === "Alteração Submetida"
      )
        indexA = 0;
      else
        indexA = this.distribuicao.findIndex(
          (dist) => dist.estado === this.etapasSelecionadas[0]
        );

      if (
        this.etapasSelecionadas[1] === "Pedido Submetido" ||
        this.etapasSelecionadas[1] === "Alteração Submetida"
      )
        indexB = 0;
      else
        indexB = this.distribuicao.findIndex(
          (dist) => dist.estado === this.etapasSelecionadas[1]
        );

      if (indexA > indexB) {
        let temporario = indexA;
        indexA = indexB;
        indexB = temporario;

        this.defaultHeaders.push(
          {
            text: this.etapasSelecionadas[1],
            value: "colunaA",
            class: "title",
            width: "40%",
            sortable: false,
          },
          {
            text: this.etapasSelecionadas[0],
            value: "colunaB",
            class: "title",
            width: "40%",
            sortable: false,
          }
        );
      } else {
        this.defaultHeaders.push(
          {
            text: this.etapasSelecionadas[0],
            value: "colunaA",
            class: "title",
            width: "40%",
            sortable: false,
          },
          {
            text: this.etapasSelecionadas[1],
            value: "colunaB",
            class: "title",
            width: "40%",
            sortable: false,
          }
        );
      }

      let campos = [];

      Object.keys(this.historico[0]).forEach((item) => campos.push(item));

      campos.forEach((campo) => {
        this.dadosTabela.push({
          campo: mapKeys(campo),
          colunaA: this.historico[indexA][campo],
          colunaB: this.historico[indexB][campo],
        });
      });

      this.etapa = 2;
    },

    preparaHistoricoCriacao() {
      this.distribuicao.forEach((dist) => {
        if (dist.estado === "Submetido")
          this.etapasHistorico.push("Pedido Submetido");
        else this.etapasHistorico.push(dist.estado);
      });
    },

    preparaHistoricoAlteracao() {
      this.distribuicao.forEach((dist) => {
        if (dist.estado === "Submetido")
          this.etapasHistorico.push("Alteração Submetida");
        else this.etapasHistorico.push(dist.estado);
      });
    },

    fechar() {
      this.voltar();

      this.$emit("fecharDialog");
    },
  },
};
</script>
