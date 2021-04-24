<template>
  <v-card>
    <v-card-title class="clav-linear-background white--text">
      <span>{{ texto.textoTitulo }} do pedido {{ pedido }}</span>
      <v-spacer></v-spacer>
      <unicon name="participacao-icon" width="25" height="25" fill="white" />
    </v-card-title>

    <v-card-text v-if="!utilizadorSelecionado">
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
        :footer-props="footerProps"
      >
        <template v-slot:no-data>
          <v-alert type="error" width="50%" class="m-auto mb-2 mt-2" outlined>
            Não existem utilizadores para selecionar...
          </v-alert>
        </template>

        <template v-slot:no-results>
          <v-alert type="info" width="50%" class="m-auto mb-2 mt-2" outlined>
            Sem resultados para "<strong>{{ procuraUtilizador }}</strong
            >".
          </v-alert>
        </template>

        <template v-slot:item="props">
          <tr @click="utilizadorSelecionado = props.item">
            <td class="subheading">{{ props.item.name }}</td>
            <td class="subheading">
              {{ props.item.entidade.split("_")[1] }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert type="info">
        Clique sobre a linha da tabela para selecionar o utilizador a quem deve ser
        atribuída a {{ texto.textoAlert }} do pedido {{ pedido }}.
      </v-alert>
    </v-card-text>

    <v-card-text v-else>
      <v-row>
        <v-col>
          <!-- Menssagem -->
          <Campo nome="Mensagem" infoHeader="Mensagem" color="neutralpurple">
            <template v-slot:conteudo>
              <v-text-field
                hide-details
                dense
                v-model="mensagemDespacho"
                :label="`Mensagem de ${texto.textoTitulo.toLowerCase()}`"
              />
            </template>
          </Campo>
        </v-col>
      </v-row>
      <v-alert type="success">
        Tarefa atribuída a
        <strong>
          {{
            `${this.utilizadorSelecionado.name} (${
              this.utilizadorSelecionado.entidade.split("_")[1]
            })`
          }}
        </strong>
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="error" text rounded dark @click="cancelar()"> Cancelar </v-btn>

      <v-btn
        :disabled="!utilizadorSelecionado"
        color="primary"
        rounded
        @click="avancar()"
      >
        {{ texto.textoBotao }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/Campo";
export default {
  props: ["texto", "utilizadores", "pedido"],
  components: {
    Campo,
  },
  data() {
    return {
      procuraUtilizador: null,
      utilizadorSelecionado: null,
      mensagemDespacho: null,
      usersHeaders: [
        { text: "Nome", value: "name", class: "title" },
        { text: "Entidade", value: "entidade", class: "title" },
      ],
      footerProps: {
        "items-per-page-text": "Utilizadores por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos",
      },
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
        utilizadorSelecionado: this.utilizadorSelecionado,
      };

      if (this.mensagemDespacho !== null)
        despacho.mensagemDespacho = this.mensagemDespacho;

      this.$emit("avancarPedido", despacho);

      this.utilizadorSelecionado = false;
      this.mensagemDespacho = null;
      this.procuraUtilizador = null;
    },
  },
};
</script>

<style></style>
