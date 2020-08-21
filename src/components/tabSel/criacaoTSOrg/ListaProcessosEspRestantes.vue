<template>
  <v-data-table
    :items="lista"
    :headers="headers"
    class="ma-1"
    item-key="classe"
    :footer-props="procsFooterProps"
  >
    <template v-slot:header="props">
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
    <template v-slot:item="props">
      <tr
        :style="{
          backgroundColor:
            (listaResEspRestantes.findIndex(p => p == props.item.classe) !=
              -1 ||
              preSel.findIndex(p => p == props.item.classe) != -1) &&
            !props.item.dono &&
            !props.item.participante
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
            class="ma-1"
            hide-details
            v-on:change="
              {
                props.item.dono && !props.item.participante
                  ? (calcRel(props.item.classe), selProcRes(props.item))
                  : props.item.dono && props.item.participante
                  ? selProcRes(props.item)
                  : !props.item.dono && !props.item.participante
                  ? (uncheck(props.item.classe, props.item.participante),
                    desSelProcRes(props.item))
                  : null;
              }
            "
          ></v-checkbox>
        </td>
        <td>
          <v-select
            v-model="props.item.participante"
            :items="tipoParticipacao"
            class="ma-1"
            primary
            hide-details
            placeholder="Por Sel."
            v-if="
              !(
                props.item.participante != 'Apreciar' &&
                props.item.participante != 'Assessorar' &&
                props.item.participante != 'Comunicar' &&
                props.item.participante != 'Decidir' &&
                props.item.participante != 'Executar' &&
                props.item.participante != 'Iniciar' &&
                props.item.participante != 'Não Sel' &&
                props.item.participante != false
              )
            "
            v-on:change="
              {
                props.item.participante && !props.item.dono
                  ? (calcRel(props.item.classe),
                    selProcRes(props.item),
                    verificaTipoPar(props.item.participante, props.item))
                  : props.item.participante && props.item.dono
                  ? selProcRes(props.item)
                  : !props.item.participante && !props.item.dono
                  ? (uncheck(props.item.classe, props.item.participante),
                    desSelProcRes(props.item))
                  : null;
              }
            "
          />
        </td>
      </tr>
    </template>
    <template v-slot:footer.page-text="props">
      Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
      {{ props.itemsLength }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["lista", "listaPreSel", "it"],
  data: () => ({
    headers: [
      {
        text: "Classe",
        value: "classe",
        width: "15%"
      },
      {
        text: "Designação",
        value: "designacao",
        width: "55%"
      },
      {
        text: "Dono",
        value: "dono",
        width: "10%"
      },
      {
        text: "Participante",
        value: "participante",
        width: "20%"
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    },
    // Lista dos processos especificos restantes resultantes das travessias
    listaResEspRestantes: [],
    // Lista dos processos restantes resultantes das travessias
    listaResRestantes: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Lista com os processos especificos selecionados
    procEspSel: [],
    // Todas as travessias são carregadas para esta variável
    travessias: [],
    preSel: [],
    listaSistemaDecrementada: [],
    // Tipos de participação
    tipoParticipacao: [],
    // Processos pré selecionados das tabelas anteriores
    procPreSel: []
  }),
  methods: {
    // Calculo da travessia do processo passado como parametro
    calcRel: async function(processo) {
      try {
        // Lista com todos os processos resultantes da travessia com ponto de partida no processo x (processo):
        this.listaProcResultado[processo] = this.travessias[processo];

        // separa o resultado da travessia em duas listas, uma com os processos especificos (que estão presentes na tabela) e os restantes
        // listaResEspRestantes: Lista dos processos resultantes (das travessias) especificos
        // listaResRestantes: Lista dos processos resultantes (das travessias) restantes
        for (var i = 0; i < this.travessias[processo].length; i++) {
          var procEspecifico = false;
          for (var j = 0; j < this.lista.length; j++) {
            if (
              this.lista[j].classe === this.travessias[processo][i] &&
              !this.listaResEspRestantes.includes(this.travessias[processo][i])
            ) {
              this.listaResEspRestantes.push(this.travessias[processo][i]);
              procEspecifico = true;
              break;
            }
          }
          if (
            !procEspecifico &&
            !this.listaResRestantes.includes(this.travessias[processo][i]) &&
            !this.listaResEspRestantes.includes(this.travessias[processo][i])
          ) {
            this.listaResRestantes.push(this.travessias[processo][i]);
          }
        }
        // retira aqueles processos que já estão selecionados
        var procSel = Object.keys(this.listaProcResultado);
        for (var x = 0; x < procSel.length; x++) {
          if (this.listaResEspRestantes.includes(procSel[x])) {
            this.listaResEspRestantes.splice(
              this.listaResEspRestantes.indexOf(procSel[x]),
              1
            );
          }
        }

        this.$emit("procPreSelResTravRes", this.listaResRestantes);
        this.$emit("contadorProcPreSelRes", this.listaResEspRestantes);
      } catch (err) {
        return err;
      }
    },

    // função para reverter a seleção
    uncheck: async function(processo, trans) {
      var resProc = this.listaProcResultado[processo];
      // apaga o resultado da travessia desse processo
      // Assim listaProcResultado: Nova lista dos processos resultantes das travessias (sem o processo que se desselecionou)
      delete this.listaProcResultado[processo];

      // Vai rever se a lista de resultados de processos especificos contem processos iguais aos outros resultados de travessias.
      var procSel = Object.keys(this.listaProcResultado);
      // newListaResEspRestantes: Nova lista dos processos resultantes especificos
      var newListaResEspRestantes = [];
      // newListaResRestantes: Nova lista dos processos resultantes restantes
      var newListaResRestantes = [];
      for (var i = 0; i < procSel.length; i++) {
        if (this.listaProcResultado[procSel[i]]) {
          for (var j = 0; j < this.listaProcResultado[procSel[i]].length; j++) {
            if (
              (this.listaResEspRestantes.includes(
                this.listaProcResultado[procSel[i]][j]
              ) ||
                this.listaProcResultado[procSel[i]][j] === processo) &&
              !newListaResEspRestantes.includes(
                this.listaProcResultado[procSel[i]][j]
              )
            ) {
              newListaResEspRestantes.push(
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
              newListaResRestantes.push(this.listaProcResultado[procSel[i]][j]);
            }
          }
        }
      }
      if (procSel.length) {
        this.listaResEspRestantes = newListaResEspRestantes;
        this.listaResRestantes = newListaResRestantes;
      } else {
        for (var l = 0; l < resProc.length; l++) {
          if (this.procPreSel.includes(resProc[l])) {
            var index = this.listaResRestantes.findIndex(
              p => p.id === resProc[l]
            );
            this.listaResRestantes.splice(index, 1);
          }
        }
      }

      if (!procSel.length && this.preSel.includes(processo)) {
        this.listaResRestantes.push(processo);
      }

      if (trans == null && !this.listaSistemaDecrementada.includes(processo)) {
        this.listaSistemaDecrementada.push(processo);

        this.$emit(
          "contadorEspResDecrementarSistema",
          this.listaSistemaDecrementada
        );
      }

      this.$emit("procPreSelResTravRes", this.listaResRestantes);
      this.$emit("contadorProcPreSelRes", this.listaResEspRestantes);
    },
    // Para colocar e retirar qualquer processo da lista de processos especificos restantes selecionados
    selProcRes: async function(processo) {
      if (!this.procEspSel.includes(processo)) {
        this.procEspSel.push(processo);
        this.$emit("contadorProcSelRes", this.procEspSel);
        this.$emit("contadorProcSelEspResUtilizador", this.procEspSel);
      }
    },
    desSelProcRes: async function(processo) {
      var index = this.procEspSel.findIndex(e => e.classe === processo.classe);
      this.procEspSel.splice(index, 1);
      this.$emit("contadorProcSelRes", this.procEspSel);
      this.$emit("contadorProcSelEspResUtilizador", this.procEspSel);
    },
    // Lista com todos os tipos de intervenção possíveis
    tipoPar: async function() {
      var resPar = await this.$request(
        "get",
        "/vocabularios/vc_processoTipoParticipacao"
      );
      for (var i = 0; i < resPar.data.length; i++) {
        this.tipoParticipacao.push(resPar.data[i].termo);
      }
      this.tipoParticipacao.push("Não Sel");
    },
    verificaTipoPar: async function(part, item) {
      if (item.participante == "Não Sel") {
        item.participante = false;
        this.uncheck(item.classe, item.participante);
        this.desSelProcRes(item.classe);
      }
    }
  },
  mounted: async function() {
    try {
      this.preSel = this.listaPreSel;

      // Vai a API de dados buscar todos os cálculos das travessias
      var res = await this.$request("get", "/travessia");
      var trav = res.data;
      for (var j = 0; j < trav.length; j++) {
        this.travessias[trav[j].processo] = trav[j].travessia;
      }
      // Carrega os calculos iniciais dos processos já selecionados
      for (var i = 0; i < this.lista.length; i++) {
        if (this.lista[i].dono || this.lista[i].participante) {
          await this.calcRel(this.lista[i].classe);
          if (!this.procEspSel.includes(this.lista[i])) {
            this.procEspSel.push(this.lista[i]);
            this.$emit("contadorProcSelRes", this.procEspSel);
            if (this.it == "1") {
              this.$emit("contadorProcSelEspResSistema", this.procEspSel);
            }
          }
        } else if (this.lista[i].participante == null) {
          this.listaSistemaDecrementada.push(this.lista[i].classe);
        }
      }

      // Coloca na lista de processos resultantes especificos os processos pré selecionados
      // resultantes das travessias dos processos comuns e especificos
      if (!this.listaResEspRestantes.length) {
        if (this.preSel.length) {
          for (var l = 0; l < this.lista.length; l++) {
            if (this.preSel.includes(this.lista[l].classe))
              this.listaResEspRestantes.push(this.lista[l].classe);
            this.procPreSel.push(this.lista[l].classe);
          }
        }
      }

      this.tipoPar();
    } catch (e) {
      return e;
    }
  }
};
</script>
