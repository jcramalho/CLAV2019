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
                <v-row v-for="(info, campo) in h" :key="campo">
                  <v-col cols="2">
                    <div class="info-descricao">
                      {{ transformaKeys(campo) }}
                    </div>
                  </v-col>
                  <v-col>
                    <div class="info-conteudo">
                      {{ info }}
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card
              v-else
              shaped
              class="rounded-card pa-4"
              color="deep-orange lighten-5"
            >
              <v-card-text>
                <v-row v-for="(info, campo) in h" :key="campo">
                  <v-col cols="2">
                    <div class="info-descricao">
                      {{ transformaKeys(campo) }}
                    </div>
                  </v-col>
                  <v-col>
                    <div class="info-conteudo">
                      {{ info }}
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
              v-for="n in dados"
              :key="`btn-${n}`"
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

.info-descricao {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #c5cae9;
  font-weight: bold;
  border-radius: 3px;
}

.info-conteudo {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
