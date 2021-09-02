<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text mb-4" dark>
      Nota relativa ao campo: {{ converteCampo(campo) }}
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Nota
          </div>
        </v-col>

        <v-col>
          <v-textarea
            clearable
            filled
            outlined
            auto-grow
            color="indigo"
            v-model="nota"
            label="Nota"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="fechar()">
        Cancelar
      </v-btn>

      <v-btn color="indigo accent-4 white--text" rounded @click="adicionar()">
        Adicionar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapKeys } from "@/utils/utils";
export default {
  props: ["campo", "notaAtual"],

  data() {
    return {
      nota: null
    };
  },

  watch: {
    notaAtual(novaNota, antigaNota) {
      if (novaNota !== undefined) this.nota = novaNota;
      else this.nota = "";
    }
  },

  mounted() {
    if (this.notaAtual !== undefined) this.nota = this.notaAtual;
    else this.nota = "";
  },

  methods: {
    converteCampo(campo) {
      return mapKeys(campo);
    },

    fechar() {
      this.$emit("fechar");
    },

    adicionar() {
      if (this.notaAtual === this.nota) {
        this.fechar();
      } else {
        this.$emit("adicionar", {
          nota: this.nota,
          campo: this.campo
        });

        this.nota = "";
      }
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}
</style>
