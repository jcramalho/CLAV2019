<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      {{ texto.textoTitulo }} do pedido {{ pedido }}
    </v-card-title>

    <v-card-text class="mt-2">
      <div v-if="!utilizadorSelecionado">
        <v-alert type="info">
          Clique sobre a linha da tabela para selecionar o utilizador a quem
          deve ser atribuída a {{ texto.textoAlert }} do pedido {{ pedido }}.
        </v-alert>

        <v-text-field
          filled
          v-model="procuraUtilizador"
          append-icon="search"
          label="Procurar utilizador"
          single-line
          hide-details
        />

        <v-data-table
          :headers="usersHeaders"
          :items="utilizadores"
          :items-per-page="5"
          :search="procuraUtilizador"
          class="elevation-1"
        >
          <template v-slot:item="props">
            <tr @click="utilizadorSelecionado = props.item">
              <td class="subheading">{{ props.item.name }}</td>
              <td class="subheading">
                {{ props.item.entidade.split("_")[1] }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>

      <div v-else>
        <v-alert type="success">
          Tarefa atribuída a
          <b>
            {{
              `${this.utilizadorSelecionado.name} (${
                this.utilizadorSelecionado.entidade.split("_")[1]
              })`
            }}
          </b>
        </v-alert>

        <v-row>
          <v-col cols="2">
            <div class="info-label">Mensagem</div>
          </v-col>

          <v-col>
            <v-textarea
              solo
              hide-details
              color="indigo"
              :label="`Mensagem de ${texto.textoTitulo.toLowerCase()}`"
              v-model="mensagemDespacho"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="red darken-4" text rounded dark @click="cancelar()">
        Cancelar
      </v-btn>

      <v-btn
        :disabled="utilizadorSelecionado === null"
        color="indigo accent-4 white--text"
        rounded
        @click="avancar()"
      >
        {{ texto.textoBotao }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["texto", "utilizadores", "pedido"],
  data() {
    return {
      procuraUtilizador: null,
      utilizadorSelecionado: null,
      mensagemDespacho: null,
      usersHeaders: [
        { text: "Nome", value: "name", class: "title" },
        { text: "Entidade", value: "entidade", class: "title" }
      ]
    };
  },

  methods: {
    cancelar() {
      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.procuraUtilizador = null;
      this.$emit("fecharDialog");
    },

    avancar() {
      const despacho = {
        utilizadorSelecionado: this.utilizadorSelecionado
      };

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;

      this.$emit("avancarPedido", despacho);

      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.procuraUtilizador = null;
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
