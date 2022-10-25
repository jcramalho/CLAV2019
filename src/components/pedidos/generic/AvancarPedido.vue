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
      <v-tabs
        v-if="pedidoAuxiliar.estado == 'Apreciado' || pedidoAuxiliar.estado == 'Reapreciado'"
        v-model="tab"
      >
        <v-tab v-for="t1 in tabsVal1" :key="t1">
          {{ t1 }}
        </v-tab>
      </v-tabs>

      <v-tabs
        v-else-if="pedidoAuxiliar.estado == 'Apreciado2v' || pedidoAuxiliar.estado == 'Reapreciado2v'"
        v-model="tab"
      >
        <v-tab v-for="t2 in tabsVal2" :key="t2">
          {{ t2 }}
        </v-tab>
      </v-tabs>

      <v-tabs
        v-else-if="
          pedidoAuxiliar.estado !== 'Submetido' &&
          pedidoAuxiliar.estado !== 'Ressubmetido' &&
          pedidoAuxiliar.estado !== 'Apreciado' &&
          pedidoAuxiliar.estado !== 'Reapreciado'
        "
        v-model="tab"
      >

        <v-tab v-for="t in tabs" :key="t">
          {{ t }}
        </v-tab>
      </v-tabs>

      <v-row class="my-2">
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
import Campo from "@/components/generic/CampoCLAV";
export default {
  props: ["texto", "utilizadores", "pedido"],
  components: {
    Campo,
  },
  async beforeMount() {
    this.pedidoAuxiliar = (await this.$request("get", "/pedidos/" + this.pedido)).data;
  },
  data() {
    return {
      procuraUtilizador: null,
      utilizadorSelecionado: null,
      mensagemDespacho: null,
      pedidoAuxiliar: "",
      tabs: ["Validação 1", "Validação 2"],
      tabsVal1 : ["Reapreciação", "Validação 2"],
      tabsVal2 : ["Reapreciação", "Validação 1"],
      tab: "Validação 1",
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

      if (
        this.pedidoAuxiliar.estado !== "Submetido" &&
        this.pedidoAuxiliar.estado !== "Ressubmetido"
      ){
        if (this.pedidoAuxiliar.estado == 'Apreciado2v' || this.pedidoAuxiliar.estado == 'Reapreciado2v')
          despacho.etapa = this.tabsVal2[this.tab];
        else if (this.pedidoAuxiliar.estado == 'Apreciado' || this.pedidoAuxiliar.estado == 'Reapreciado')
          despacho.etapa = this.tabsVal1[this.tab];
        else  
          despacho.etapa = this.tabs[this.tab];
      }
        

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
