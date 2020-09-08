<template
  ><v-card shaped class="ma-8">
    <v-card-title class="indigo darken-4 white--text" dark>
      Relatório do pedido: {{ relatorio.numeroPedido }}
    </v-card-title>

    <v-card-text>
      <v-card outlined class="ma-2">
        <v-card-title>
          {{ relatorio.tipoPedido }}
        </v-card-title>

        <v-card-subtitle>
          <b>Data de criação:</b> <u>{{ relatorio.dataInicial }}</u>
          <br />
          <b>Data de finalização:</b> <u>{{ relatorio.dataFinal }}</u>
        </v-card-subtitle>

        <v-card-text>
          <span v-if="pedido.objeto.acao !== 'Criação'">
            <v-alert type="info" width="90%" class="m-auto mb-2 mt-2" outlined>
              <span>
                {{ relatorio.alteracaoInfo }}
              </span>
            </v-alert>

            <v-divider class="m-auto mb-2" />
          </span>

          <div v-for="(info, campo) in relatorio.comparacao" :key="campo">
            info : {{ info }}
            <br />
            campo : {{ campo }}
            <br />
            <!-- <v-row
              v-if="
                campo !== 'id' &&
                  info !== '' &&
                  info !== null &&
                  info !== undefined
              "
            >
            </v-row> -->
          </div>

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
      <v-btn color="indigo" dark class="mb-2">Descarregar (icon)</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { gerarDadosRelatorio } from "@/utils/utils";

export default {
  props: ["pedido"],

  data() {
    return {
      relatorio: {},
    };
  },

  created() {
    this.prepararRelatorio();
  },

  methods: {
    prepararRelatorio() {
      const relatorio = gerarDadosRelatorio(this.pedido);

      this.relatorio = relatorio;

      console.log("relatorio", relatorio);
    },

    voltar() {
      this.$router.go(-1);
    },
  },
};
</script>
