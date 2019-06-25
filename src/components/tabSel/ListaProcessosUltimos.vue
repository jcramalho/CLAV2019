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
    // Retorna a lista dos processos complementares ao processo passado como parâmetro
    loadComplementares: async function(p, profundidade) {
      try {
        var response = await axios.get(
          lhost + "/api/classes/c" + p + "/procRel/eComplementarDe"
        );
        return response.data.map(function(item) {
          return {
            codigo: item.codigo,
            titulo: item.titulo,
            relacao: "eComplementarDe",
            nivel: profundidade
          };
        });
      } catch (erro) {
        console.log(erro);
      }
    },
    // Retorna a lista dos processos sintetizados ao processo passado como parâmetro
    loadSintetizados: async function(p, profundidade) {
      try {
        var response = await axios.get(
          lhost + "/api/classes/c" + p + "/procRel/eSintetizadoPor"
        );
        return response.data.map(function(item) {
          return {
            codigo: item.codigo,
            titulo: item.titulo,
            relacao: "eSintetizadoPor",
            nivel: profundidade
          };
        });
      } catch (erro) {
        console.log(erro);
      }
    },
    // Retorna a lista dos processos suplementares ao processo passado como parâmetro
    loadSuplementares: async function(p, profundidade) {
      try {
        var response = await axios.get(
          lhost + "/api/classes/c" + p + "/procRel/eSuplementoPara"
        );
        return response.data.map(function(item) {
          return {
            codigo: item.codigo,
            titulo: item.titulo,
            relacao: "eSuplementoPara",
            nivel: profundidade
          };
        });
      } catch (erro) {
        console.log(erro);
      }
    },
    // Calculo da travessia do processo passado como parametro
    calcRel: async function(processo) {
      var emit = 'true ' + processo;
      this.$emit("aCalcular", emit);

      try {
        var profundidade = 1;
        var stackProc = [];
        stackProc.push({ listaProc: [], nivel: 1 });
        stackProc[0].listaProc.push(processo);
        var proc;
        var listaResultados = [];
        var visitados = [];
        visitados.push(processo); // Processo inicial está no índice 0

        // Coloca na lista de processos resultantes ultimos os processos pré selecionados
        // resultantes das travessias das anteriores seleções de processos
        if (!this.listaResUltimos.length) {
          if (this.listaPreSel.length) {
            for (var l = 0; l < this.lista.length; l++) {
              if (this.listaPreSel.includes(this.lista[l].classe))
                this.listaResUltimos.push(this.lista[l].classe);
            }
          }
        }

        while (
          profundidade <= 1000 &&
          stackProc[profundidade - 1].listaProc.length > 0
        ) {
          stackProc.push({ listaProc: [], nivel: profundidade + 1 });
          for (
            var s = 0;
            s < stackProc[profundidade - 1].listaProc.length;
            s++
          ) {
            proc = stackProc[profundidade - 1].listaProc[s];

            // Procura os processos que estabelecem com este processo a relação de "complementares"
            var comp = await this.loadComplementares(proc, profundidade);
            if (comp.length > 0) {
              listaResultados = await this.juntaNovos(listaResultados, comp);
              stackProc[profundidade].listaProc = stackProc[
                profundidade
              ].listaProc.concat(
                await this.juntaNovosVisitas(
                  visitados,
                  this.filtra(comp),
                  "comp"
                )
              );
            }
            // Procura os processos que estabelecem com este processo a relação de "sintetizados"
            var sint = await this.loadSintetizados(proc, profundidade);
            if (sint.length > 0) {
              listaResultados = await this.juntaNovos(listaResultados, sint);
              stackProc[profundidade].listaProc = stackProc[
                profundidade
              ].listaProc.concat(
                await this.juntaNovosVisitas(
                  visitados,
                  this.filtra(sint),
                  "sint"
                )
              );
            }
            // Procura os processos que estabelecem com este processo a relação de "suplementares"
            var sup = await this.loadSuplementares(proc, profundidade);
            if (sup.length > 0) {
              listaResultados = await this.juntaNovos(listaResultados, sup);
              stackProc[profundidade].listaProc = stackProc[
                profundidade
              ].listaProc.concat(
                await this.juntaNovosVisitas(visitados, this.filtra(sup), "sup")
              );
            }
          }
          profundidade++;
        }
        console.log(
          "calcRel: listaResultados \n Lista com todos os processos resultantes da travessia:",
          listaResultados
        );

        listaResultados.sort(function(a, b) {
          return a.codigo.localeCompare(b.codigo);
        });

        this.listaProcResultado[processo] = listaResultados;
        console.log(
          "calcRel: listaProcResultados \n Listas com todos os processos resultantes da travessia com ponto de partida no processo x:",
          this.listaProcResultado
        );

        // resultado da travessia
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
        console.log(
          "calcRel: listaResUltimos \n Lista dos processos resultantes (das travessias) dos ultimos:",
          this.listaResUltimos
        );

        this.$emit("contadorProcPreSelUlt", this.listaResUltimos);
        emit = 'false';
        this.$emit("aCalcular", emit);
      } catch (erro) {
        console.log(erro);
      }
    },
    juntaNovos: async function(existentes, candidatos) {
      for (var i = 0; i < candidatos.length; i++) {
        if (existentes.length > 0) {
          var index = existentes.findIndex(
            p => p.codigo == candidatos[i].codigo
          );
          if (index == -1) {
            existentes.push(candidatos[i]);
          }
        } else existentes.push(candidatos[i]);
      }
      return existentes;
    },
    juntaNovosVisitas: async function(visitados, candidatos, relacao) {
      var res = [];
      for (var i = 0; i < candidatos.length; i++) {
        var index = visitados.indexOf(candidatos[i]);
        if (index == -1) {
          visitados.push(candidatos[i]);
          res.push(candidatos[i]);
        }
      }
      return res;
    },
    filtra: function(lproc) {
      return lproc.map(function(p) {
        return p.codigo;
      });
    },

    // função para reverter a seleção
    uncheck: async function(processo) {
      // apaga o resultado da travessia desse processo
      delete this.listaProcResultado[processo];

      // Vai rever se a lista de resultados de processos comuns contem processos iguais aos outros resultados de travessias.
      var procSel = Object.keys(this.listaProcResultado);
      var newListaResUltimos = [];
      for (var i = 0; i < procSel.length; i++) {
        for (var j = 0; j < this.listaProcResultado[procSel[i]].length; j++) {
          if (
            (this.listaResUltimos.includes(
              this.listaProcResultado[procSel[i]][j].codigo
            ) ||
              this.listaProcResultado[procSel[i]][j].codigo === processo) &&
            !newListaResUltimos.includes(
              this.listaProcResultado[procSel[i]][j].codigo
            )
          ) {
            newListaResUltimos.push(
              this.listaProcResultado[procSel[i]][j].codigo
            );
          } 
        }
      }
      this.listaResUltimos = newListaResUltimos;

      console.log(
        "uncheck: listaProcResultado \n Nova lista dos processos resultantes das travessias (sem o processo que se desselecionou)",
        this.listaProcResultado
      );
      console.log(
        "uncheck: newListaResEspecificos \n Nova lista dos processos resultantes especificos:",
        newListaResUltimos
      );

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