<template>
  <v-dialog v-model="dialogState" max-width="80%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text">Importar Classes</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <ImportarFicheiro label="Ficheiro Classes" @ficheiro="novoFicheiroClasses" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-alert width="100%" :value="existe_erros" outlined type="error" prominent border="left">
          Ficheiro inválido devido aos seguintes erros:
          <div v-for="(erro, index) in erros" :key="index">
            <ul>
              <li v-for="(err, i) in erro" :key="i">{{ err.classe + ": " + err.erro}}</li>
            </ul>
          </div>
        </v-alert>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!importarCircle"
          color="indigo darken-4"
          dark
          @click="dialogState = false"
        >Voltar</v-btn>
        <v-btn v-if="!importarCircle" color="indigo darken-4" dark @click="importar">Importar</v-btn>
        <v-progress-circular
          v-if="importarCircle"
          :size="40"
          :width="3"
          color="amber accent-3"
          indeterminate
        ></v-progress-circular>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ImportarFicheiro from "@/components/rada/importacao/importarFicheiro";

const validarClasses = require("@/plugins/rada/conversor_ts").validarClasses;

export default {
  props: ["dialog", "classes", "RE", "legislacao", "formaContagem"],
  data: () => ({
    ficheiroClasses: null,
    existe_erros: false,
    erros: null,
    importarCircle: false,
  }),
  methods: {
    novoFicheiroClasses(novoFicheiro) {
      this.ficheiroClasses = novoFicheiro;
    },
    importar() {
      if (this.$refs.form.validate()) {
        this.importarCircle = true;
        validarClasses(
          this.ficheiroClasses,
          this.classes,
          this.RE,
          this.legislacao,
          this.formaContagem
        )
          .then((res) => {
            this.$emit("pendurarNovasClasses", res.novas_classes);
            this.dialogState = false;
            this.importarCircle = false;
          })
          .catch((err) => {
            this.erros = err.erros;
            this.existe_erros = true;
            this.importarCircle = false;
          });
      }
    },
  },
  components: {
    ImportarFicheiro,
  },
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      },
    },
  },
};
</script>