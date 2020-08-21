<template>
  <v-dialog v-model="dialogState" max-width="80%">
    <v-card>
      <v-card-title class="indigo darken-4 white--text"
        >Importar Classes</v-card-title
      >
      <v-card-text>
        <v-form ref="form">
          <ImportarFicheiro
            label="Ficheiro Classes"
            @ficheiro="novoFicheiroClasses"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo darken-4" dark @click="dialogState = false"
          >Voltar</v-btn
        >
        <v-btn color="indigo darken-4" dark @click="importar">Importar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ImportarFicheiro from "@/components/rada/importacao/importarFicheiro";

const validarClasses = require("@/plugins/conversorRADA").validarClasses;

export default {
  props: ["dialog", "classes", "RE", "legislacao"],
  data: () => ({
    ficheiroClasses: null,
    ficheiroUIs: null
  }),
  methods: {
    novoFicheiroClasses(novoFicheiro) {
      this.ficheiroClasses = novoFicheiro;
    },
    importar() {
      if (this.$refs.form.validate()) {
        validarClasses(
          this.ficheiroClasses,
          this.classes,
          this.RE,
          this.legislacao
        )
          .then(res => {
            this.$emit("pendurarNovasClasses", res.novas_classes);
            console.log("then", res);
            this.dialogState = false;
          })
          .catch(err => console.log("catch", err));
      }
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
