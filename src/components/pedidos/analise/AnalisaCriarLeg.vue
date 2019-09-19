<template>
    <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="content"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Não consegui carregar a informação...
            </v-alert>
          </template>

          <template slot="headerCell" slot-scope="props">
            <span style="color: blue;">
              {{ props.header.text }}
            </span>
          </template>

          <template v-slot:item="props">
            <tr v-bind:style="props.item.style">
              <td class="subheading">{{ props.item.campo }}</td>

              <td class="subheading" v-if="props.item.conteudo.constructor === Array">
                <ul>
                  <li v-for="(elem, index) in props.item.conteudo" :key="index">
                    {{ elem }}
                  </li>
                </ul>
              </td>
              <td v-else class="subheading">{{ props.item.conteudo }}</td>
              
              <td>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on:click="props.item.style.backgroundColor='#c8e6c9'" color="indigo darken-2" v-on="on">check</v-icon>
                    </template>
                    <span>Campo em conformidade</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on:click="props.item.style.backgroundColor='#ffcdd2'" color="indigo darken-2" v-on="on">clear</v-icon>
                    </template>
                    <span>Campo em não conformidade</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-dialog v-model="dialog" width="60%">
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" color="indigo darken-2">edit</v-icon>
                          </template>

                          <v-card>
                            <v-card-title>
                              <span class="title font-weight-light">Proposta de revisão</span>
                            </v-card-title>

                            <v-card-text>
                              <v-layout row wrap ma-2>
                                <v-flex xs10>
                                  <v-text-field
                                    v-model="props.item.nota"
                                    label="Notas"
                                  ></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                                <v-btn color="red darken-4" text @click="dialog = false">Fechar</v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <!--v-icon @click="analisaPedido(props.item)" color="indigo darken-2" v-on="on">edit</v-icon-->
                    </template>
                    <span>Escrever proposta de revisão</span>
                </v-tooltip>
              </td>
              <td class="subheading">{{ props.item.nota }}</td>
            </tr>
          </template>
        </v-data-table>
    </v-flex>
</template>

<script>

export default {
  props: ["leg"],

  data: () => ({
    headers: [
        { text: "Campo", value: "campo", sortable: false, class: "title" },
        { text: "Conteúdo", value: "conteudo", sortable: false, class: "title" },
        { text: "Tarefas", sortable: false, class: "title" },
        { text: "Proposta de revisão", sortable: false, class: "title" }
    ],
    dialog: false,
    content: []
  }),

  mounted: function(){
      this.content.push({campo: "Tipo", conteudo: this.leg.dados.tipo, nota: "", style: {backgroundColor: 'white'}})
      this.content.push({campo: "Número", conteudo: this.leg.dados.numero, nota: "", style: {backgroundColor: 'white'}})
      this.content.push({campo: "Data", conteudo: this.leg.dados.data, nota: "", style: {backgroundColor: 'white'}})
      this.content.push({campo: "Sumário", conteudo: this.leg.dados.sumario, nota: "", style: {backgroundColor: 'white'}})
      this.content.push({campo: "Link", conteudo: this.leg.dados.link, nota: "", style: {backgroundColor: 'white'}})
      this.content.push({campo: "Entidades responsáveis", conteudo: this.leg.dados.entidades, nota: "", style: {backgroundColor: 'white'}})
      this.content.push({campo: "Processos regulados", conteudo: this.leg.dados.processos, nota: "", style: {backgroundColor: 'white'}})
  }
};
</script>

<style>
.info-label {
  color:white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #64b5f6;
  font-weight: bold;
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

