<template>
  <div>
    <v-card>
      <v-card-title class="indigo darken-4 white--text">
        Selecione {{ mensagem.titulo }} em falta
      </v-card-title>

      <v-card-text>
        <v-autocomplete
          v-model="selecao"
          :items="
            tipologias.map(
              (tipologia) => `${tipologia.sigla} - ${tipologia.designacao}`
            )
          "
          :search-input.sync="pesquisa"
          filled
          multiple
          chips
          counter
          hide-selected
          deletable-chips
          class="m-2 mt-4"
          :label="`Selecione ${mensagem.autocomplete}`"
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Sem resultados para "<strong>{{ pesquisa }}</strong
                  >".
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="red darken-4" dark @click="fechar">
          Fechar
        </v-btn>
        <v-btn color="indigo darken-1" dark @click="adicionar">
          Adicionar
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["mensagem", "tipologias", "tipologiasSelecionadas"],

  data() {
    return {
      pesquisa: null,
      selecao: null,
    };
  },

  methods: {
    fechar() {
      this.$emit("fechar");
    },

    adicionar() {
      const selecaoFormatada = [];

      this.selecao.forEach((elemento) => {
        this.tipologias.some((tipologia) => {
          if (elemento.split(" ")[0].localeCompare(tipologia.sigla) === 0) {
            selecaoFormatada.push(tipologia);
          }
        });
      });

      this.selecao = null;
      this.$emit("selecao", selecaoFormatada);
    },
  },
};
</script>
