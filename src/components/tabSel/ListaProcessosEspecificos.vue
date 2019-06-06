<template>
  <v-data-table
    :items="lista"
    :headers="headers"
    class="elevation-1"
    item-key="classe"
    :rows-per-page-items="[10, 20, 100]"
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
            (listaResEspecificos.findIndex(p => p == props.item.classe) != -1 ||
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
                  ? (calcRel(props.item.classe), selProcEsp(props.item))
                  : props.item.dono && props.item.participante
                  ? selProcEsp(props.item)
                  : !props.item.dono && !props.item.participante
                  ? (uncheck(props.item.classe), desSelProcEsp(props.item))
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
                  ? (calcRel(props.item.classe), selProcEsp(props.item))
                  : props.item.participante && props.item.dono
                  ? selProcEsp(props.item)
                  : !props.item.participante && !props.item.dono
                  ? (uncheck(props.item.classe), desSelProcEsp(props.item))
                  : null;
              }
            "
          ></v-checkbox>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");

export default {
  props: ["lista", "tipo", "listaPreSel"],
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
    // Lista dos processos especificos resultantes das travessias
    listaResEspecificos: [],
    // Lista dos processos restantes resultantes das travessias
    listaResRestantes: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Lista com os processos especificos selecionados
    procEspSel: []
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
      this.$emit("aCalcular", true);

      try {
        var profundidade = 1;
        var stackProc = [];
        stackProc.push({ listaProc: [], nivel: 1 });
        stackProc[0].listaProc.push(processo);
        var proc;
        var listaResultados = [];
        var visitados = [];
        visitados.push(processo); // Processo inicial está no índice 0

        // Coloca na lista de processos resultantes especificos os processos pré selecionados
        // resultantes das travessias dos processos comuns
        if (!this.listaResEspecificos.length) {
          if (this.listaPreSel.length) {
            for (var l = 0; l < this.lista.length; l++) {
              if (this.listaPreSel.includes(this.lista[l].classe))
                this.listaResEspecificos.push(this.lista[l].classe);
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

        // separa o resultado da travessia em duas listas, uma com os processos especificos (que estão presentes na tabela) e os restantes
        for (var i = 0; i < listaResultados.length; i++) {
          var procEspecifico = false;
          for (var j = 0; j < this.lista.length; j++) {
            if (
              this.lista[j].classe === listaResultados[i].codigo &&
              !this.listaResEspecificos.includes(listaResultados[i].codigo)
            ) {
              this.listaResEspecificos.push(listaResultados[i].codigo);
              procEspecifico = true;
              break;
            }
          }
          if (
            !procEspecifico &&
            !this.listaResRestantes.includes(listaResultados[i].codigo) &&
            !this.listaResEspecificos.includes(listaResultados[i].codigo)
          ) {
            this.listaResRestantes.push(listaResultados[i].codigo);
          }
        }
        // retira aqueles processos que já estão selecionados
        var procSel = Object.keys(this.listaProcResultado);
        for (var x = 0; x < procSel.length; x++) {
          if (this.listaResEspecificos.includes(procSel[x])) {
            this.listaResEspecificos.splice(
              this.listaResEspecificos.indexOf(procSel[x]),
              1
            );
          }
        }
        console.log(
          "calcRel: listaResEspecificos \n Lista dos processos resultantes (das travessias) especificos:",
          this.listaResEspecificos
        );
        console.log(
          "calcRel: listaResRestantes \n Lista dos processos resultantes (das travessias) restantes:",
          this.listaResRestantes
        );

        this.$emit("procPreSelResTravEsp", this.listaResRestantes);
        this.$emit("contadorProcPreSelEsp", this.listaResEspecificos);
        this.$emit("aCalcular", false);
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
      var newListaResEspecificos = [];
      var newListaResRestantes = [];
      for (var i = 0; i < procSel.length; i++) {
        for (var j = 0; j < this.listaProcResultado[procSel[i]].length; j++) {
          if (
            (this.listaResEspecificos.includes(
              this.listaProcResultado[procSel[i]][j].codigo
            ) ||
              this.listaProcResultado[procSel[i]][j].codigo === processo) &&
            !newListaResEspecificos.includes(
              this.listaProcResultado[procSel[i]][j].codigo
            )
          ) {
            newListaResEspecificos.push(
              this.listaProcResultado[procSel[i]][j].codigo
            );
          } else if (
            this.listaResRestantes.includes(
              this.listaProcResultado[procSel[i]][j].codigo
            ) &&
            !newListaResRestantes.includes(
              this.listaProcResultado[procSel[i]][j].codigo
            )
          ) {
            newListaResRestantes.push(
              this.listaProcResultado[procSel[i]][j].codigo
            );
          }
        }
      }
      this.listaResEspecificos = newListaResEspecificos;
      this.listaResRestantes = newListaResRestantes;

      console.log(
        "uncheck: listaProcResultado \n Nova lista dos processos resultantes das travessias (sem o processo que se desselecionou)",
        this.listaProcResultado
      );
      console.log(
        "uncheck: newListaResEspecificos \n Nova lista dos processos resultantes especificos:",
        newListaResEspecificos
      );
      console.log(
        "uncheck: newListaResRestantes \n Nova lista dos processos resultantes restantes:",
        newListaResRestantes
      );

      this.$emit("contadorProcPreSelEsp", this.listaResEspecificos);
    },
    // Para colocar e retirar qualquer processo da lista de processos especificos selecionados
    selProcEsp: async function(processo) {
      if (!this.procEspSel.includes(processo)) {
        this.procEspSel.push(processo);
        this.$emit("contadorProcSelEsp", this.procEspSel);
      }
    },
    desSelProcEsp: async function(processo) {
      var index = this.procEspSel.findIndex(e => e.classe === processo.classe);
      this.procEspSel.splice(index, 1);
      this.$emit("contadorProcSelEsp", this.procEspSel);
    }
  }
};
</script>
