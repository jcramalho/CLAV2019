<template>
  <div>
    <v-row justify="end" class="mx-2">
      <v-btn @click="addZC=true" style="color: #1a237e; background-color: #dee2f8;">Adicionar Zona de Controlo</v-btn>
    </v-row>
    <v-dialog v-model="addZC">
      <DialogZonaControlo 
        v-bind:auto="auto"
        v-bind:classes="classes"
        v-bind:entidades="entidades"
        v-bind:closeZC="closeZC"
      />
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro: Não foi possível adicionar a Zona de Controlo</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      Zona de Controlo adicionada com sucesso
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import DialogZonaControlo from "@/components/autosEliminacao/criacao/DialogZonaControlo.vue"

export default {
  props: ["classes", "entidades", "auto"],
  components: {
    DialogZonaControlo
  },
  data: () => ({
    snackbar: false,
    erro: null,
    erroDialog: false,
    addZC: false,
  }),
  methods: {
    closeZC: function () {
      this.addZC = false
      this.snackbar = true
    }
  }
};
</script>