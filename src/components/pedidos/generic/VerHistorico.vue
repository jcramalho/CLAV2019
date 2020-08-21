<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Histórico de alterações

      <v-spacer />

      <v-chip color="indigo accent-4" text-color="white" label>
        <v-icon class="mr-1">label</v-icon>
        <b>{{ etapaReferente }}</b>
      </v-chip>

      <v-tooltip v-if="dados.length > 1" bottom>
        <template v-slot:activator="{ on }">
          <v-icon
            @click="dialogVerHistoricoEmTabela = true"
            color="white"
            v-on="on"
            class="ml-4"
          >
            table_chart
          </v-icon>
        </template>
        <span>Comparar duas etapas do histórico em formato tabela...</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text class="mt-2">
      <v-card flat tile>
        <v-window v-model="onboarding" class="mt-2">
          <v-window-item v-for="(h, i) in dados" :key="i">
            <v-card shaped class="rounded-card pa-4" :color="cor(i)">
              <v-card-text>
                <div v-for="(info, campo) in h" :key="campo">
                  <v-row
                    v-if="
                      info.dados !== '' &&
                        info.dados !== null &&
                        campo !== 'estado' &&
                        campo !== 'id'
                    "
                  >
                    <v-col cols="2">
                      <div
                        class="info-descricao"
                        :class="`info-descricao-${info.cor}`"
                      >
                        {{ transformaKeys(campo) }}
                      </div>
                    </v-col>

                    <v-col>
                      <div
                        v-if="!(info.dados instanceof Array)"
                        class="info-conteudo"
                      >
                        {{ info.dados }}
                      </div>

                      <div v-else>
                        <v-data-table
                          v-if="campo === 'entidadesSel'"
                          :headers="entidadesHeaders"
                          :items="info.dados"
                          class="elevation-1"
                          :footer-props="footerPropsEntidades"
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

                        <v-data-table
                          v-else-if="campo === 'tipologiasSel'"
                          :headers="tipologiasHeaders"
                          :items="info.dados"
                          class="elevation-1"
                          :footer-props="footerPropsTipologias"
                        >
                          <template v-slot:no-data>
                            <v-alert
                              type="error"
                              width="100%"
                              class="m-auto mb-2 mt-2"
                              outlined
                            >
                              Nenhuma tipologia selecionada...
                            </v-alert>
                          </template>
                        </v-data-table>

                        <v-data-table
                          v-else-if="campo === 'processosSel'"
                          :headers="processosHeaders"
                          :items="info.dados"
                          class="elevation-1"
                          :footer-props="footerPropsProcessos"
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

                        <div
                          class="info-conteudo"
                          v-else-if="campo === 'zonaControlo'"
                        >
                          <ZonaControlo :info="info" />
                        </div>

                        <div class="info-conteudo" v-else>
                          <span v-for="i in info" :key="i">{{ i }}</span>
                        </div>
                      </div>
                    </v-col>

                    <!-- Operação -->
                    <v-col cols="1">
                      <v-tooltip v-if="info.nota" bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" @click="verNota(info.nota)">
                            message
                          </v-icon>
                        </template>
                        <span>Ver nota relativa ao campo...</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>

        <v-card-actions class="justify-space-between">
          <v-btn @click="prev">
            <v-icon medium>chevron_left</v-icon>
          </v-btn>
          <v-item-group v-model="onboarding" class="text-center" mandatory>
            <v-item
              v-for="(n, i) in dados"
              :key="`btn-${i}`"
              v-slot:default="{ active, toggle }"
            >
              <v-btn :input-value="active" icon @click="toggle">
                <b>{{ i + 1 }}</b>
              </v-btn>
            </v-item>
          </v-item-group>
          <v-btn @click="next">
            <v-icon medium>chevron_right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="cancelar()">
        Fechar
      </v-btn>
    </v-card-actions>

    <!-- Ver historico em tabela dialog -->
    <v-dialog v-model="dialogVerHistoricoEmTabela" width="80%" persistent>
      <VerHistoricoEmTabela
        :historico="dados"
        :distribuicao="distribuicaoFormatada"
        @fecharDialog="dialogVerHistoricoEmTabela = false"
      />
    </v-dialog>

    <!-- Ver nota dialog -->
    <v-dialog v-model="dialogVerNota.visivel" width="50%">
      <v-card>
        <v-card-title class="indigo darken-4 title white--text">
          Nota
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-textarea
                :value="dialogVerNota.nota"
                auto-grow
                outlined
                readonly
                color="indigo"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="red darken-4" dark @click="fecharDialogVerNota()">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapKeys, converterDadosOriginais } from "@/utils/utils";
import ZonaControlo from "@/components/pedidos/generic/VerHistoricoZonaControlo";

import VerHistoricoEmTabela from "@/components/pedidos/generic/VerHistoricoEmTabela";

export default {
  props: ["pedido"],
  components: {
    ZonaControlo,
    VerHistoricoEmTabela
  },
  data() {
    return {
      distribuicaoFormatada: [],
      dialogVerHistoricoEmTabela: false,
      dialogVerNota: {
        visivel: false,
        nota: ""
      },
      etapaReferente: "",
      onboarding: 0,
      dados: [],
      entidadesHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ],
      footerPropsEntidades: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas"
      },

      tipologiasHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" }
      ],
      footerPropsTipologias: {
        "items-per-page-text": "Tipologias por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas"
      },

      processosHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" }
      ],
      footerPropsProcessos: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  created() {
    this.preparaDistribuicao();

    if (this.pedido.objeto.acao === "Criação") {
      this.dados.push(...this.historico);
      this.etapaReferente = "Pedido Submetido";
    } else {
      this.dados.push(converterDadosOriginais(this.pedidoOriginal));
      this.dados.push(...this.historico);
      this.etapaReferente = "Objeto Atual no Sistema";
    }
  },

  computed: {
    historico() {
      return this.pedido.historico;
    },

    pedidoOriginal() {
      return this.pedido.objeto.dadosOriginais;
    },

    distribuicao() {
      return this.pedido.distribuicao;
    }
  },

  watch: {
    onboarding(novoValor, antigoValor) {
      this.etapaReferente = this.distribuicaoFormatada[novoValor];
    }
  },

  methods: {
    /**
     * Distribuição simples apenas com estados
     */
    preparaDistribuicao() {
      const distribuicaoAlterada = JSON.parse(
        JSON.stringify(this.distribuicao)
      );

      // Remove os estados duplicados (Quando há alteração de responsável e quando há nova apreciação)
      // Substitui o nome das labels a apresentar
      const distribuicaoSemRepetidos = distribuicaoAlterada.reduce(
        (semRepetidos, valorAtual) => {
          if (
            !semRepetidos.some(obj => obj.estado === valorAtual.estado) &&
            valorAtual.estado !== "Distribuído"
          ) {
            if (valorAtual.estado === "Submetido")
              semRepetidos.push(
                this.pedido.objeto.acao === "Criação"
                  ? "Pedido Submetido"
                  : "Alteração Submetida"
              );
            else semRepetidos.push(valorAtual.estado);
          }

          return semRepetidos;
        },
        []
      );

      // Adiciona na distribuição o estado para o pedido original
      if (this.pedido.objeto.acao !== "Criação")
        distribuicaoSemRepetidos.splice(0, 0, "Objeto Atual no Sistema");

      this.distribuicaoFormatada = distribuicaoSemRepetidos;
    },

    cor(index) {
      if (index === 0) return "indigo lighten-5";
      else if (index === 1 && this.pedido.objeto.acao !== "Criação")
        return "indigo lighten-5";
      else return "orange lighten-5";
    },

    verNota(nota) {
      this.dialogVerNota.nota = nota;
      this.dialogVerNota.visivel = true;
    },

    fecharDialogVerNota() {
      this.dialogVerNota.nota = "";
      this.dialogVerNota.visivel = false;
    },

    next() {
      if (this.onboarding + 1 < this.dados.length) this.onboarding++;
    },

    prev() {
      if (this.onboarding - 1 < 0) this.onboarding = 0;
      else this.onboarding--;
    },

    transformaKeys(key) {
      return mapKeys(key);
    },

    cancelar() {
      this.onboarding = 0;
      this.$emit("fecharDialog");
    }
  }
};
</script>

<style scoped>
.rounded-card {
  border-radius: 10px;
}

.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #c5cae9;
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-verde {
  background-color: #c8e6c9; /* lighten-4 */
}

.info-descricao-vermelho {
  background-color: #ffcdd2; /* lighten-4 */
}

.info-descricao-amarelo {
  background-color: #ffe0b2; /* lighten-4 */
}
</style>
