<template>
  <v-dialog v-model="ativo">
    <v-card dark class="info-card">
      <v-card-title>Selecione a {{ tipo }} a alterar</v-card-title>
      <div class="info-content">
        <v-tooltip top color="info" open-delay="500">
          <template v-slot:activator="{ on }">
            <v-autocomplete
              v-model="dadosEditar"
              :items="items"
              :label="tipo"
              light
              clearable
              v-on="on"
            />
          </template>
          <span v-if="dadosEditar">{{ dadosEditar }}</span>
          <span v-else>Selecionar {{ tipo }}</span>
        </v-tooltip>
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success darken-1"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="editar(tipo)"
        >
          Alterar
        </v-btn>
        <v-btn
          color="error darken-4"
          rounded
          dark
          elevation="0"
          class="px-4"
          @click="
            dadosEditar = null;
            fechar();
          "
          >Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CaixaDeDialogo",
  props: ["ativo", "items", "tipo"],
  data() {
    return {
      dadosEditar: null,
      ativar: false,
    };
  },
  methods: {
    editar(caso) {
      switch (caso) {
        case "Tipologia":
          this.$router.push(`/tipologias/editar/tip_${this.dadosEditar.split(" ")[0]}`);
          break;
        case "Entidade":
          this.$router.push(`/entidades/editar/ent_${this.dadosEditar.split(" ")[0]}`);
          break;
        case "Legislação":
          this.$emit("editar", this.dadosEditar);
          break;
        default:
          break;
      }
      this.$emit("fechar");
    },
    fechar() {
      this.$emit("fechar");
    },
  },
};
</script>

<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.info-content {
  padding: 8px;
  margin: 15px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
