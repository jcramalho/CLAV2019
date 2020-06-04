<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      Histórico de alterações
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
                  <v-row v-if="info !== '' && info !== null">
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
                          hide-default-footer
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
                <v-row v-for="(info, campo) in h" :key="campo">
                  <v-col cols="2">
                    <div
                      :class="['info-descricao', `info-descricao-${info.cor}`]"
                    >
                      {{ transformaKeys(campo) }}
                    </div>
                  </v-col>
                  <v-col>
                    <div
                      v-if="!(info.alteracao instanceof Array)"
                      class="info-conteudo"
                    >
                      {{ info.alteracao }}
                    </div>

                    <div v-else>
                      <v-data-table
                        v-if="campo === 'entidadesSel'"
                        :headers="entidadesHeaders"
                        :items="info.alteracao"
                        class="elevation-1"
                        hide-default-footer
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
                    </div>
                  </v-col>
                </v-row>
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
                <v-icon>fiber_manual_record</v-icon>
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
        Cancelar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["pedido"],

  data() {
    return {
      onboarding: 0,
      dados: [],
      entidadesHeaders: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
      ],
    };
  },

  created() {
    if (this.pedido.objeto.acao !== "Criação") {
      this.dados.push(this.pedidoOriginal);
      this.dados.push(...this.historico);
      console.log("this.dados", this.dados);
    }
  },

  computed: {
    historico() {
      return this.pedido.historico;
    },

    pedidoOriginal() {
      return this.pedido.objeto.dadosOriginais || this.pedido.objeto.dados;
    },
  },

  methods: {
    next() {
      this.onboarding =
        this.onboarding + 1 === this.length ? 0 : this.onboarding + 1;
    },
    prev() {
      this.onboarding =
        this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1;
    },

    transformaKeys(key) {
      let descricao = "";
      switch (key) {
        case "designacao":
          descricao = "Nome";
          break;

        case "entidadesSel":
          descricao = "Entidades";
          break;

        default:
          descricao = key.charAt(0).toUpperCase() + key.slice(1);
          break;
      }

      return descricao;
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
