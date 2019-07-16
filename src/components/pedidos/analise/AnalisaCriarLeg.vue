<template>
    <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="content"
          class="elevation-1"
          hide-actions
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

          <template v-slot:items="props">
            <tr>
              <td class="subheading">{{ props.item.campo }}</td>
              <td class="subheading">{{ props.item.conteudo }}</td>
              
              <td>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on:click="conforme($event)" color="indigo darken-2" v-on="on">check</v-icon>
                    </template>
                    <span>Campo em conformidade</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="distribuiPedido(props.item)" color="indigo darken-2" v-on="on">clear</v-icon>
                    </template>
                    <span>Campo em não conformidade</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="analisaPedido(props.item)" color="indigo darken-2" v-on="on">edit</v-icon>
                    </template>
                    <span>Escrever nota</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
    </v-flex>
</template>

<script>
import axios from "axios"
const lhost = require("@/config/global").host

import AnalisaCriarLeg from "@/components/pedidos/analise/AnalisaCriarLeg.vue"; // @ is an alias to /src

export default {
  props: ["leg"],

  components: {
    AnalisaCriarLeg
  },

  data: () => ({
    headers: [
        { text: "Campo", value: "campo", sortable: false, class: "title" },
        { text: "Conteúdo", value: "conteudo", sortable: false, class: "title" },
        { text: "Tarefas", sortable: false, class: "title" }
    ],
    content: []
  }),

  mounted: function(){
      this.content.push({campo: "Tipo", conteudo: this.leg.dados.tipo})
      this.content.push({campo: "Número", conteudo: this.leg.dados.numero})
      this.content.push({campo: "Data", conteudo: this.leg.dados.data})
      this.content.push({campo: "Sumário", conteudo: this.leg.dados.sumario})
      this.content.push({campo: "Link", conteudo: this.leg.dados.link})
      this.content.push({campo: "Entidades responsáveis", conteudo: this.leg.dados.entidades})
      this.content.push({campo: "Processos regulados", conteudo: this.leg.dados.processos})
  },

  methods: {
      conforme: function (e){
          alert(JSON.stringify(e))
      },

      getClosest: function (elem, selector) {
	    // Element.matches() polyfill
	    if (!Element.prototype.matches) {
	        Element.prototype.matches =
	            Element.prototype.matchesSelector ||
	            Element.prototype.mozMatchesSelector ||
	            Element.prototype.msMatchesSelector ||
	            Element.prototype.oMatchesSelector ||
	            Element.prototype.webkitMatchesSelector ||
	            function(s) {
	                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	                    i = matches.length;
	                while (--i >= 0 && matches.item(i) !== this) {}
	                return i > -1;
	            };
	    }
	    // Get the closest matching element
	    for ( ; elem && elem !== document; elem = elem.parentNode ) {
		    if ( elem.matches( selector ) ) return elem;
	    }
	    return null;
      }
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

