<template>
  <div>
      <v-data-table
        :items="listaProcs.procs"
        :headers="headers"
        class="ma-1"
        item-key="chave"
        :footer-props="procsFooterProps"
      >

    <template v-slot:item="props">
      <tr
        :style="{
          backgroundColor: props.item.edited
              ? '#BBDEFB'
              : (props.item.preSelected ? '#FFECB3' : 'transparent')
        }"
      >
        <td>
          {{ props.item.proc }}
        </td>
        <td>
          {{ props.item.designacao }}
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
            v-model="listaProcs.numProcSel"
        ></v-text-field>
    </v-col>
    <v-col>
        <v-text-field
            readonly
            label="Nº de processos pré-selecionados"
            v-model="listaProcs.numProcPreSel"
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
  props: ["listaProcs"],
  components: {
      Selresponsabilidade
  },

  created: function(){
      alert("Lista: " + JSON.stringify(this.listaProcs));
  },

  data: () => ({
    // Processo corrente
    procSel: {},
    // Travessia
    travessia: [],
    // Ativador do subcomponente que tem a interface de seleção
    selecionaResponsabilidades: false,
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "proc",
        width: "10%",
        class: ["body-2", "font-weight-bold"]
      },
      {
        text: "Designação",
        value: "designacao",
        width: "50%",
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
  methods: {
    // Seleção das participações
    selecionaParticipacoes: function(proc){
        this.procSel = proc;
        this.selecionaResponsabilidades = true;
    },

    // Função de retorno do processo de seleção  
    selectProc: async function(p){
        try{
          this.selecionaResponsabilidades = false;
          this.listaProcs.numProcSel += p.inc;
          if(p.inc > 0){ // foi selecionado
              await this.acrescentaFecho(p);
          }
          else if(p.inc < 0){
              this.retiraFecho(this.procSel);
          }
        }
        catch (err) {
        return err;
      }
    },
    
    // Calculo da travessia do processo passado como parametro (vai buscar a informação à estrutura carregada na variável "travessias")
    acrescentaFecho: async function(processo) {
      try {
        var res = await this.$request("get", "/travessia/" + processo.proc);
        this.travessia = res.data;

        for(let t=0; t < this.travessia.length; t++){
          var index = this.listaProcs.procs.findIndex(p => p.proc == this.travessia[t]);
          if(index != -1){
            this.listaProcs.procs[index].preSelected = true;
            this.listaProcs.numProcPreSel++;
          } 
        }
      } catch (err) {
        return err;
      }
    },
    // Reverte a seleção
    retiraFecho: async function(processo) {
      try {
        var res = await this.$request("get", "/travessia/" + processo.proc);
        this.travessia = res.data;

        for(let t=0; t < this.travessia.length; t++){
          var index = this.listaProcs.procs.findIndex(p => p.proc == this.travessia[t]);
          if(index != -1){
            this.listaProcs.procs[index].preSelected = false;
            this.listaProcs.numProcPreSel--;
          } 
        }
      } catch (err) {
        return err;
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