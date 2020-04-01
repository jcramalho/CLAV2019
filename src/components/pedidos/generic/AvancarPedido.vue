<template>
  <v-card>
    <v-card-title class="indigo darken-4 title white--text" dark>
      {{ texto.textoTitulo }} do pedido
    </v-card-title>

    <v-card-text class="mt-2">
      <div v-if="!utilizadorSelecionado">
        <v-alert type="info">
          Clique sobre a linha da tabela para selecionar o utilizador a quem
          deve ser atribuída a {{ texto.textoAlert }} do pedido.
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
          Tarefa atribuída a:
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
            <div class="info-label">Mensagem:</div>
          </v-col>

          <v-col>
            <v-text-field
              solo
              clearable
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
      this.$emit("fecharDialog");
    },

    avancar() {
      this.utilizadorSelecionado = null;
      this.mensagemDespacho = null;
      this.$emit("avancarPedido", {
        utilizadorSelecionado: this.utilizadorSelecionado,
        mensagemDespacho: this.mensagemDespacho
      });
    }
  }
};
</script>

<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
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
