<template>
  <v-data-table
    :items="lista"
    :headers="headers"
    class="elevation-1"
    item-key="classe"
    :rows-per-page-items="[10, 20, 100]"
    rows-per-page-text="Mostrar"
  >
    <template v-slot:headers="props">
      <tr>
        <th
          v-for="h in props.headers"
          :key="h.value"
          class="body-2 font-weight-bold"
        >
          {{ h.text }}
        </th>
      </tr>
    </template>
    <template v-slot:items="props">
      <tr
        :style="{
          backgroundColor:
            listaResComuns.findIndex(p => p == props.item.classe) != -1 &&
            (!props.item.dono && !props.item.participante)
              ? 'orange'
              : 'transparent'
        }"
      >
        <td>
          {{ props.item.classe }}
        </td>
        <td>
          {{ props.item.designacao }}
        </td>
        <td>
          <v-checkbox
            v-model="props.item.dono"
            primary
            hide-details
            v-on:change="
              {
                props.item.dono && !props.item.participante
                  ? (calcRel(props.item.classe), selProcComum(props.item))
                  : props.item.dono && props.item.participante
                  ? selProcComum(props.item)
                  : !props.item.dono && !props.item.participante
                  ? (uncheck(props.item.classe), desSelProcComum(props.item))
                  : null;
              }
            "
          ></v-checkbox>
        </td>
        <td>
          <v-checkbox
            v-model="props.item.participante"
            v-if="!(props.item.participante != true && props.item.participante != false)"
            primary
            hide-details
            v-on:change="
              {
                props.item.participante && !props.item.dono
                  ? (calcRel(props.item.classe), selProcComum(props.item))
                  : props.item.participante && props.item.dono
                  ? selProcComum(props.item)
                  : !props.item.participante && !props.item.dono
                  ? (uncheck(props.item.classe), desSelProcComum(props.item))
                  : null;
              }
            "
          ></v-checkbox>
        </td>
      </tr>
    </template>
    <template v-slot:pageText="props">
      Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
      {{ props.itemsLength }}
    </template>
  </v-data-table>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");

export default {
  props: ["lista", "tipo"],
  data: () => ({
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Classe",
        value: "classe",
        width: "20%"
      },
      {
        text: "Designação",
        value: "designacao",
        width: "60%"
      },
      {
        text: "Dono",
        value: "dono"
      },
      {
        text: "Participante",
        value: "participante"
      }
    ],
    // Lista dos processos comuns resultantes das travessias
    listaResComuns: [],
    // Lista dos processos restantes resultantes das travessias
    listaResRestantes: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Lista com os processos comuns selecionados
    procComunsSel: [],
    // Todas as travessias são carregadas para esta variável
    travessias: [],
  }),
  methods: {
    // Calculo da travessia do processo passado como parametro (vai buscar a informação à estrutura carregada na variável "travessias")
    calcRel: async function(processo) {
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
    } catch (erro) {
      console.log(erro);
    }
  },

  // Reverte a seleção
  uncheck: async function(processo) {
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
          !newListaResComuns.includes(
            this.listaProcResultado[procSel[i]][j]
          )
        ) {
          newListaResComuns.push(
            this.listaProcResultado[procSel[i]][j]
          );
        } else if (
          this.listaResRestantes.includes(
            this.listaProcResultado[procSel[i]][j]
          ) &&
          !newListaResRestantes.includes(
            this.listaProcResultado[procSel[i]][j]
          )
        ) {
          newListaResRestantes.push(
            this.listaProcResultado[procSel[i]][j]
          );
        }
      }
    }
    this.listaResComuns = newListaResComuns;
    this.listaResRestantes = newListaResRestantes;

    this.$emit("contadorProcPreSelCom", this.listaResComuns);
  },
  // Para colocar e retirar qualquer processo da lista de processos comuns selecionados
  selProcComum: async function(processo) {
    if (!this.procComunsSel.includes(processo)) {
      this.procComunsSel.push(processo);
      this.$emit("contadorProcSelCom", this.procComunsSel);
    }
  },
  desSelProcComum: async function(processo) {
    var index = this.procComunsSel.findIndex(
      e => e.classe === processo.classe
    );
    this.procComunsSel.splice(index, 1);
    this.$emit("contadorProcSelCom", this.procComunsSel);
  }
},
mounted: async function() {
  try{
    // Vai a API de dados buscar todos os cálculos das travessias
    var res = await axios.get(
        lhost + "/api/travessia"
      );
    var trav = res.data;
    for( var j = 0; j < trav.length; j++){
      this.travessias[trav[j].processo] = trav[j].travessia
    }
    
    // Faz os calculos iniciais dos processos selecionados por default como donos (não transversais)
    for( var i = 0; i < this.lista.length; i++ ){
      if(this.lista[i].dono){
        this.calcRel(this.lista[i].classe);
        if (!this.procComunsSel.includes(this.lista[i])) {
          this.procComunsSel.push(this.lista[i]);
          this.$emit("contadorProcSelCom", this.procComunsSel);
        }
      }
    }
  }
  catch(e){
    console.log(e)
  }
},
};
</script>
