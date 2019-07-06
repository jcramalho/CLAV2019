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
            (listaResUltimos.findIndex(p => p == props.item.classe) != -1 ||
            listaPreSel.findIndex(p => p == props.item.classe) != -1) &&
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
                  ? (calcRel(props.item.classe), selProcUlt(props.item))
                  : props.item.dono && props.item.participante
                  ? selProcUlt(props.item)
                  : !props.item.dono && !props.item.participante
                  ? (uncheck(props.item.classe), desSelProcUlt(props.item))
                  : null;
              }
            "
          ></v-checkbox>
        </td>
        <td>
          <v-checkbox
            v-model="props.item.participante"
            primary
            hide-details
            v-on:change="
              {
                props.item.participante && !props.item.dono
                  ? (calcRel(props.item.classe), selProcUlt(props.item))
                  : props.item.participante && props.item.dono
                  ? selProcUlt(props.item)
                  : !props.item.participante && !props.item.dono
                  ? (uncheck(props.item.classe), desSelProcUlt(props.item))
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
  props: ["lista", "tipo", "listaPreSel" ],
  data: () => ({
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
    // Lista dos ultimos processos resultantes das travessias
    listaResUltimos: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Lista com os processos ultimos selecionados
    procUltSel: [],
  }),
  methods: {
    // Calculo da travessia do processo passado como parametro
    calcRel: async function(processo) {
      try {
        // Lista com todos os processos resultantes da travessia com ponto de partida no processo x (processo):
        this.listaProcResultado[processo] = listaResultados;

        // resultado da travessia
        // listaResUltimos: Lista dos processos resultantes (das travessias) dos ultimos
        for (var i = 0; i < listaResultados.length; i++) {
          for (var j = 0; j < this.lista.length; j++) {
            if (
              this.lista[j].classe === listaResultados[i].codigo &&
              !this.listaResUltimos.includes(listaResultados[i].codigo)
            ) {
              this.listaResUltimos.push(listaResultados[i].codigo);
            }
          }
        }
        // retira aqueles processos que já estão selecionados
        var procSel = Object.keys(this.listaProcResultado);
        for (var x = 0; x < procSel.length; x++) {
          if (this.listaResUltimos.includes(procSel[x])) {
            this.listaResUltimos.splice(
              this.listaResUltimos.indexOf(procSel[x]),
              1
            );
          }
        }

        this.$emit("contadorProcPreSelUlt", this.listaResUltimos);
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
      // newListaResEspecificos: Nova lista dos processos resultantes especificos
      var newListaResUltimos = [];
      for (var i = 0; i < procSel.length; i++) {
        for (var j = 0; j < this.listaProcResultado[procSel[i]].length; j++) {
          if (
            (this.listaResUltimos.includes(
              this.listaProcResultado[procSel[i]][j]
            ) ||
              this.listaProcResultado[procSel[i]][j] === processo) &&
            !newListaResUltimos.includes(
              this.listaProcResultado[procSel[i]][j]
            )
          ) {
            newListaResUltimos.push(
              this.listaProcResultado[procSel[i]][j]
            );
          } 
        }
      }
      this.listaResUltimos = newListaResUltimos;

      this.$emit("contadorProcPreSelUlt", this.listaResUltimos);
    },
    // Para colocar e retirar qualquer processo da lista de processos ultimos selecionados
    selProcUlt: async function(processo) {
      if (!this.procUltSel.includes(processo)) {
        this.procUltSel.push(processo);
        this.$emit("contadorProcSelUlt", this.procUltSel);
      }
    },
    desSelProcUlt: async function(processo) {
      var index = this.procUltSel.findIndex(e => e.classe === processo.classe);
      this.procUltSel.splice(index, 1);
      this.$emit("contadorProcSelUlt", this.procUltSel);
    }
  }
};
</script>