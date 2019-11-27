<template>
  <v-container fluid>
    <v-layout row wrap ma-2>
      <v-flex xs12>
        <v-card v-if="pedidoLoaded">
          <v-toolbar color="blue" dark>
            <v-toolbar-title
              >Análise do pedido: {{ this.pedido.codigo }}</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-container fluid>
                <v-layout row wrap>
                  <v-flex xs4 sm4>
                    <v-text-field
                      :value="pedido.objeto.acao + ' de ' + pedido.objeto.tipo"
                      label="Tipo de Pedido"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4>
                    <v-text-field
                      :value="pedido.data.split('T')[0]"
                      label="Data"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4>
                    <v-text-field
                      :value="pedido.criadoPor"
                      label="Autor"
                      readonly
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <h4>Distribuição</h4>
                    <v-data-table
                      :headers="headers"
                      :items="etapas"
                      class="elevation-1"
                      hide-default-footer
                    >
                      <template v-slot:item="props">
                        <td>{{ props.item.estado }}</td>
                        <td>{{ props.item.data.split("T")[0] }}</td>
                        <td>{{ props.item.responsavel }}</td>
                        <td>{{ props.item.despacho }}</td>
                      </template>

                      <template v-slot:no-data>
                        <v-alert :value="true" color="error" icon="warning">
                          Sem informação disponível.
                        </v-alert>
                      </template>
                    </v-data-table>
                  </v-flex>
                </v-layout>

                <v-layout
                  row
                  wrap
                  justify-center
                  v-if="
                    pedido.objeto.tipo == 'Legislação' &&
                      pedido.objeto.acao == 'Criação'
                  "
                >
                  <AnalisaCriarLeg :leg="pedido.objeto" />
                </v-layout>

                <v-layout
                  v-else-if="pedido.objeto.tipo == 'Auto de Eliminação'"
                >
                  <AnalisaCriarAE :ae="pedido.objeto" />
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>

        <p v-else>A carregar...</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AnalisaCriarLeg from "@/components/pedidos/analise/AnalisaCriarLeg.vue"; // @ is an alias to /src
import AnalisaCriarAE from "@/components/pedidos/analise/AnalisaCriarAE.vue";

export default {
  props: ["idp"],

  components: {
    AnalisaCriarLeg,
    AnalisaCriarAE
  },

  data: () => ({
    pedido: {},
    pedidoLoaded: false,
    headers: [
      { text: "Estado", align: "left", sortable: false, value: "estado" },
      { text: "Data", value: "data" },
      { text: "Responsável", value: "responsavel" },
      { text: "Despacho", value: "despacho" }
    ],
    etapas: []
  }),
  watch: {
    pedidoLoaded: function() {
      this.etapas = this.pedido.distribuicao;
    }
  },
  mounted: function() {
    this.$request("get", "/api/pedidos/" + this.idp)
      .then(response => {
        this.pedido = response.data;
        this.pedidoLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<style></style>
