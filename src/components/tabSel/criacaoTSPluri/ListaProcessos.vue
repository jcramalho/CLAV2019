<template>
  <div>
    <v-row justify="space-around">
      <v-btn color="primary" dark @click="filtro=''">Todos</v-btn>
      <v-btn color="primary" dark @click="filtro='Processo Comum'">Processos Comuns</v-btn>
      <v-btn color="primary" dark @click="filtro='Processo Específico'">Processos Específicos</v-btn>
      <v-btn color="primary" dark @click="filtro='PR'">Processos Restantes</v-btn>
      <v-btn outlined>{{filtro}}</v-btn>
    </v-row>

    <v-data-table
      :items="listaProcs.procs"
      :headers="headers"
      class="ma-1"
      item-key="chave"
      :footer-props="procsFooterProps"
      :search="filtro"
    >

    <template v-slot:item="props">
      <tr
        :style="{
          backgroundColor: props.item.edited
              ? '#BBDEFB'
              : (props.item.preSelected > 0 ? '#FFECB3' : 'transparent')
        }"
      >
        <td>
          {{ props.item.codigo }}
        </td>
        <td>
          {{ props.item.titulo }}
        </td>
        <td>
          <span v-if="props.item.tipoProc == 'Processo Comum'">PC</span>
          <span v-else-if="props.item.tipoProc == 'PR'">PR</span>
          <span v-else>PE</span>
        </td>
        <td>
            <v-icon v-if="props.item.dono">check</v-icon>
        </td>
        <td>
          <v-icon v-if="props.item.participante">check</v-icon>
        </td>
        <td>
            <v-btn small color="indigo darken-4" dark
                @click="selecionaParticipacoes(props.item)">Selecionar</v-btn>
        </td>
      </tr>
    </template>
    <template v-slot:footer.page-text="props">
      Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
      {{ props.itemsLength }}
    </template>
  </v-data-table>

  <v-row wrap>
    <v-col>
        <v-text-field
            readonly
            label="Nº de processos selecionados"
            v-model="listaProcs.numProcessosSelecionados"
        ></v-text-field>
    </v-col>
    <v-col>
        <v-text-field
            readonly
            label="Nº de processos pré-selecionados"
            v-model="listaProcs.numProcessosPreSelecionados"
        ></v-text-field>
    </v-col>
  </v-row>

  <Selresponsabilidade v-if="selecionaResponsabilidades" 
        :p = "procSel"
        @selecionadas = "selectProc($event)"/>

  </div>
</template>

<script>

import Selresponsabilidade from "@/components/tabSel/criacaoTSPluri/SelResponsabilidade.vue";

export default {
  props: ["listaProcs", "listaCodigosEsp"],
  components: {
      Selresponsabilidade
  },

  data: () => ({
    // Processo corrente
    procSel: {},
    // Fecho Transitivo dos processos
    fechoTransitivo: {},
    // Ativador do subcomponente que tem a interface de seleção
    selecionaResponsabilidades: false,
    // Filtro da tabela
    filtro: "",
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "codigo",
        width: "10%",
        class: ["body-2", "font-weight-bold"]
      },
      {
        text: "Título",
        value: "titulo",
        width: "40%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Tipo",
        value: "tipoProc",
        width: "10%",
        class: ["body-2", "font-weight-bold"]
      },
      {
        text: "Dono",
        value: "dono",
        width: "10%",
        class: ["body-2", "font-weight-bold"]
      },
      {
        text: "Participante",
        value: "participante",
        width: "10%",
        class: ["body-2", "font-weight-bold"]
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    }
  }),

  created: async function(){
    try{
      var response = await this.$request("get", "/travessiaV2");
      this.fechoTransitivo = response.data;
    }
    catch(e){
      console.log("Erro ao carregar o fecho transitivo: " + e);
    }
  },

  methods: {
    // Filtra os processos na tabela
    filtraProcessos: function (value, search, item) {
        return (item.tipoProc == "");
      },

    // Seleção das participações
    selecionaParticipacoes: function(proc){
        this.procSel = proc;
        this.selecionaResponsabilidades = true;
    },

    // Função de retorno do processo de seleção  
    selectProc: async function(p){
        try{
          this.selecionaResponsabilidades = false;
          this.listaProcs.numProcessosSelecionados += p.inc;
          if(p.inc > 0){ // foi selecionado
              await this.acrescentaFecho(p);
          }
          else if(p.inc < 0){
              await this.retiraFecho(p);
          }
        }
        catch (err) {
        return err;
      }
    },
    
    acrescentaFecho: function(processo) {
        var fecho = this.fechoTransitivo[processo.codigo];
        for(let i=0; i < fecho.length; i++){
          var index = this.listaProcs.procs.findIndex(p => p.codigo == fecho[i]);
          if(index != -1){
            this.listaProcs.procs[index].preSelected ++;
            if(this.listaProcs.procs[index].preSelected == 1) this.listaProcs.numProcessosPreSelecionados++;
          } 
        }
    },
    // Reverte a seleção
    retiraFecho: async function(processo) {
        var fecho = this.fechoTransitivo[processo.codigo];
        for(let i=0; i < fecho.length; i++){
          var index = this.listaProcs.procs.findIndex(p => p.codigo == fecho[i]);
          if(index != -1){
            this.listaProcs.procs[index].preSelected --;
            if(this.listaProcs.procs[index].preSelected == 0) this.listaProcs.numProcessosPreSelecionados--;
          } 
        }
    }
  }
};
</script>

<style>
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>