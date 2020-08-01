<template>
  <v-dialog v-model="dialogState" max-width="80%">
    <v-card>
      <v-form ref="form">
        <v-card-title class="indigo darken-4 white--text">Importar Relatório Expositivo</v-card-title>
        <v-card-text>
          <ImportarFicheiro label="Ficheiro Relatório Expositivo" @ficheiro="novoFicheiroRE" />
        </v-card-text>
        <v-card-actions>
          <v-alert
            width="100%"
            :value="erros_ficheiro"
            outlined
            type="error"
            prominent
            border="left"
          >{{ erros.produtoras }}</v-alert>
          <v-spacer></v-spacer>
          <v-btn color="indigo darken-4" dark @click="dialogState = false">Voltar</v-btn>
          <v-btn color="indigo darken-4" dark @click="importar">Importar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import ImportarFicheiro from "@/components/rada/importacao/importarFicheiro";

const conversor = require("@/plugins/rada/conversor_re").importarRE;

export default {
  props: ["dialog", "entidades", "tipologias", "RE"],
  data: () => ({
    ficheiroRE: null,
    erros_ficheiro: false,
    erros: {}
  }),
  methods: {
    novoFicheiroRE(novoFicheiro) {
      this.ficheiroRE = novoFicheiro;
    },
    importar() {
      if (this.$refs.form.validate()) {
        conversor(
          this.ficheiroRE,
          this.entidades,
          this.tipologias,
          JSON.parse(JSON.stringify(this.RE))
        )
          .then(res => {
            this.copiarRE(res.RE);
            this.dialogState = false;
          })
          .catch(err => {
            this.erros = err.erros;
            this.erros_ficheiro = true;

            setTimeout(() => {
              this.erros_ficheiro = false;
              this.erros = {};
            }, 3000);
          });
      }
    },
    copiarRE(novo_RE) {
      this.RE.entidadesProd = novo_RE.entidadesProd;
      this.RE.tipologiasProd = novo_RE.tipologiasProd;
      this.RE.dataInicial = novo_RE.dataInicial;
      this.RE.dataFinal = novo_RE.dataFinal;
      this.RE.hist_admin = novo_RE.hist_admin;
      this.RE.hist_cust = novo_RE.hist_cust;
      this.RE.sist_org = novo_RE.sist_org;
      this.RE.localizacao = novo_RE.localizacao;
      this.RE.est_conser = novo_RE.est_conser;
    }
  },

  components: {
    ImportarFicheiro
  },
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  }
};
</script>

<style>
</style>