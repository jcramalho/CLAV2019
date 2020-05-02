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
              : 'transparent'
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

  <Selresponsabilidade v-if="selecionaResponsabilidades" 
        :p = "procSel"
        @selecionadas = "selectProc($event)"/>
  </div>
</template>

<script>

import Selresponsabilidade from "@/components/tabSel/criacaoTSPluri/SelResponsabilidade.vue";

export default {
  props: ["listaProcs", "entidades"],
  components: {
      Selresponsabilidade
  },

  data: () => ({
    // Processo corrente
    procSel: {},
    // Travessias
    travessias: [],
    // Ativador do subcomponente que tem a interface de seleção
    selecionaResponsabilidades: false,
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "classe",
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
    selectProc: function(inc){
        this.selecionaResponsabilidades = false;
        this.listaProcs.numProcSelCom += inc;
        alert(JSON.stringify(this.listaProcs))
        /*if(inc > 0){ // foi selecionado
            this.acrescentaFecho(this.procSel);
        }
        else{
            this.retiraFecho(this.procSel);
        }*/
    },
    
    // Calculo da travessia do processo passado como parametro (vai buscar a informação à estrutura carregada na variável "travessias")
    acrescentaFecho: async function(processo) {
      try {
        // Lista com todos os processos resultantes da travessia com ponto de partida no processo x (processo):
        this.listaProcResultado[processo] = this.travessias[processo];

        // separa o resultado da travessia em duas listas, uma com os processos comuns (que estão presentes na tabela) e os restantes
        // listaResComuns: Lista dos processos resultantes (das travessias) comuns
        // listaResRestantes: Lista dos processos resultantes (das travessias) restantes
        for (var i = 0; i < this.travessias[processo].length; i++) {
          var procComum = false;
          for (var j = 0; j < this.lista.length; j++) {
            if (
              this.lista[j].classe === this.travessias[processo][i] &&
              !this.listaResComuns.includes(this.travessias[processo][i])
            ) {
              this.listaResComuns.push(this.travessias[processo][i]);
              procComum = true;
              break;
            }
          }
          if (
            !procComum &&
            !this.listaResRestantes.includes(this.travessias[processo][i]) &&
            !this.listaResComuns.includes(this.travessias[processo][i])
          ) {
            this.listaResRestantes.push(this.travessias[processo][i]);
          }
        }
        // retira aqueles processos que já estão selecionados
        var procSel = Object.keys(this.listaProcResultado);
        for (var x = 0; x < procSel.length; x++) {
          if (this.listaResComuns.includes(procSel[x])) {
            this.listaResComuns.splice(
              this.listaResComuns.indexOf(procSel[x]),
              1
            );
          }
        }

        this.$emit("procPreSelResTravCom", this.listaResRestantes);
        this.$emit("contadorProcPreSelCom", this.listaResComuns);
      } catch (err) {
        return err;
      }
    },
    // Reverte a seleção
    retiraFecho: async function(processo) {
      // apaga o resultado da travessia desse processo
      // Assim listaProcResultado: Nova lista dos processos resultantes das travessias (sem o processo que se desselecionou)
      delete this.listaProcResultado[processo];

      // Vai rever se a lista de resultados de processos comuns contem processos iguais aos outros resultados de travessias.
      var procSel = Object.keys(this.listaProcResultado);
      // newListaResComuns: Nova lista dos processos resultantes comuns
      var newListaResComuns = [];
      // newListaResRestantes: Nova lista dos processos resultantes restantes
      var newListaResRestantes = [];
      for (var i = 0; i < procSel.length; i++) {
        for (var j = 0; j < this.listaProcResultado[procSel[i]].length; j++) {
          if (
            (this.listaResComuns.includes(
              this.listaProcResultado[procSel[i]][j]
            ) ||
              this.listaProcResultado[procSel[i]][j] === processo) &&
            !newListaResComuns.includes(this.listaProcResultado[procSel[i]][j])
          ) {
            newListaResComuns.push(this.listaProcResultado[procSel[i]][j]);
          } else if (
            this.listaResRestantes.includes(
              this.listaProcResultado[procSel[i]][j]
            ) &&
            !newListaResRestantes.includes(
              this.listaProcResultado[procSel[i]][j]
            )
          ) {
            newListaResRestantes.push(this.listaProcResultado[procSel[i]][j]);
          }
        }
      }
      this.listaResComuns = newListaResComuns;
      this.listaResRestantes = newListaResRestantes;

      this.$emit("procPreSelResTravCom", this.listaResRestantes);
      this.$emit("contadorProcPreSelCom", this.listaResComuns);
    },

    // Lista com todos os tipos de intervenção possíveis
    tipoPar: async function() {
        try{
            var resPar = await this.$request(
                            "get",
                            "/vocabularios/vc_processoTipoParticipacao"
            );
            for (var i = 0; i < resPar.data.length; i++) {
                this.tipoParticipacao.push(resPar.data[i].termo);
            }
        }
        catch(e){
            console.log("Erro na recuperação dos tipos de participação: " + e );
        }
    }
  },

  created: async function() {
    try {
      // Vai a API de dados buscar todos os cálculos das travessias
      var res = await this.$request("get", "/travessia");
      var trav = res.data;
      for (var j = 0; j < trav.length; j++) {
        this.travessias[trav[j].processo] = trav[j].travessia;
      }
      alert(JSON.stringify(this.travessias));

      await this.tipoPar();
      
    } catch (err) {
      return err;
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