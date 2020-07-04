<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Histórico de alterações
      <v-spacer />
      <v-chip color="indigo accent-4" text-color="white" label>
        <v-icon class="mr-1">label</v-icon>
        <b>{{ etapaReferente }}</b>
      </v-chip>
    </v-card-title>

    <v-card-text class="mt-2">
      <v-card flat tile>
        <v-window v-model="onboarding" class="mt-2">
          <v-window-item v-for="(h, i) in dados" :key="i">
            <v-card
              v-if="i === 0"
              shaped
              class="rounded-card pa-4"
              color="indigo lighten-5"
            >
              <v-card-text>
                <div v-for="(info, campo) in h" :key="campo">
                  <v-row
                    v-if="
                      info !== '' &&
                        info !== null &&
                        campo !== 'estado' &&
                        campo !== 'id'
                    "
                  >
                    <v-col cols="2">
                      <div class="info-descricao">
                        {{ transformaKeys(campo) }}
                      </div>
                    </v-col>
                    <v-col>
                      <div
                        v-if="!(info instanceof Array)"
                        class="info-conteudo"
                      >
                        {{ info }}
                      </div>

                      <div v-else>
                        <v-data-table
                          v-if="campo === 'entidadesSel'"
                          :headers="entidadesHeaders"
                          :items="info"
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
                          :items="info"
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
                          :items="info"
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
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>

            <v-card
              v-else
              shaped
              class="rounded-card pa-4"
              color="orange lighten-5"
            >
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
                        :class="[
                          'info-descricao',
                          `info-descricao-${info.cor}`,
                        ]"
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
import { mapKeys } from "@/utils/utils";

export default {
  props: ["pedido"],

  data() {
    return {
      dialogVerNota: {
        visivel: false,
        nota: "",
      },
      etapaReferente: "",
      onboarding: 0,
      dados: [],
      entidadesHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      footerPropsEntidades: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },

      tipologiasHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
      footerPropsTipologias: {
        "items-per-page-text": "Tipologias por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todas",
      },

      processosHeaders: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
      ],
      footerPropsProcessos: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
    };
  },

  created() {
    if (
      this.pedido.estado === "Validado" ||
      this.pedido.estado === "Devolvido"
    ) {
      this.dados.push(this.pedidoOriginal);
      if (this.pedido.objeto.acao === "Alteração")
        this.dados.push(this.historico[0]);
      if (this.pedido.distribuicao.length > 2)
        this.dados.push(this.historico[this.historico.length - 1]);
    } else {
      this.dados.push(this.pedidoOriginal);
      this.dados.push(...this.historico);
    }

    if (this.pedido.objeto.acao === "Criação")
      this.etapaReferente = "Pedido Submetido";
    else this.etapaReferente = "Objeto Atual no Sistema";
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
    },
  },

  watch: {
    onboarding(novoValor, antigoValor) {
      if (
        novoValor !== undefined &&
        this.distribuicao[novoValor] !== undefined
      ) {
        if (
          novoValor === 0 &&
          (this.pedido.objeto.acao === "Alteração" ||
            this.pedido.objeto.acao === "Extinção")
        )
          this.etapaReferente = "Objeto Atual no Sistema";
        else if (novoValor === 0 && this.pedido.objeto.acao === "Criação")
          this.etapaReferente = "Pedido Submetido";
        else if (
          (this.pedido.objeto.acao === "Alteração" ||
            this.pedido.objeto.acao === "Extinção") &&
          novoValor === 1
        )
          this.etapaReferente = "Alteração Submetida";
        else if (
          this.pedido.estado === "Validado" ||
          this.pedido.estado === "Devolvido"
        )
          this.etapaReferente = this.distribuicao[
            this.distribuicao.length - 1
          ].estado;
        else if (this.pedido.objeto.acao === "Criação")
          this.etapaReferente = this.distribuicao[novoValor + 1].estado;
        else this.etapaReferente = this.distribuicao[novoValor].estado;
      } else if (
        (this.pedido.objeto.acao === "Alteração" ||
          this.pedido.objeto.acao === "Extinção") &&
        novoValor === 1
      )
        this.etapaReferente = "Alteração Submetida";
    },
  },

  methods: {
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
      this.$emit("fecharDialog");
    },
  },
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
