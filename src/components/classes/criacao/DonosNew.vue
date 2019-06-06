<template>
  <v-layout row wrap color="teal lighten-5" ma-2>
    <v-flex xs2>
      <div class="info-label">Entidade nova</div>
      <v-btn small dark round color="teal darken-4" @click="newEntidade">
          Adicionar
          <v-icon small dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-flex>
    <v-flex xs10>
      <v-form v-model="valid">
        <v-container>
          <v-layout>
            <v-flex xs12 md3>
              <v-text-field
                v-model="sigla"
                :rules="siglaRules"
                label="Sigla"
                required
              ></v-text-field>
            </v-flex>

            <v-flex xs12 md3>
              <v-text-field v-model="sioe" label="SIOE"></v-text-field>
            </v-flex>

            <v-flex xs12 md3>
              <v-text-field
                v-model="designacao"
                :rules="designacaoRules"
                label="Designação"
                required
              ></v-text-field>
            </v-flex>

            <v-flex xs12 md3>
              <v-select
                prefix="Internacional: "
                item-text="label"
                item-value="value"
                v-model="internacional"
                :items="simNao"
                label="Internacional"
                solo
                dense
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: function() {
    return {
      valid: false,
      sigla: "",
      sioe: "",
      siglaRules: [v => !!v || "A Sigla é um campo obrigatório."],
      designacao: "",
      designacaoRules: [v => !!v || "A Designação é obrigatória."],
      internacional: "Nao",
      simNao: [
          {
              label: "Sim", value: "Sim"
          },
          {
              label: "Não", value: "Nao"
          }
      ]
    };
  },

  methods: {
      newEntidade: function(){
          var entidade = {
              estado: "Nova",
              id: "ent_" + this.sigla,
              sigla: this.sigla,
              sioe: this.sioe,
              designacao: this.designacao,
              internacional: this.internacional
          }
          this.sigla = ""
          this.sioe = ""
          this.designacao = ""
          this.internacional = "Nao"
          this.$emit('newEntidade', entidade)
      }
  }
};
</script>
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
