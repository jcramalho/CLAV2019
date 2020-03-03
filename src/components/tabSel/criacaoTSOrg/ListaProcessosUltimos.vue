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
            (listaResUltimos.findIndex(p => p == props.item.classe) != -1 ||
              preSel.findIndex(p => p == props.item.classe) != -1) &&
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
            class="ma-1"
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
                    selProcUlt(props.item),
                    verificaTipoPar(props.item.participante, props.item))
                  : props.item.participante && props.item.dono
                  ? selProcUlt(props.item)
                  : !props.item.participante && !props.item.dono
                  ? (uncheck(props.item.classe, props.item.participante),
                    desSelProcUlt(props.item))
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
    // Lista dos ultimos processos resultantes das travessias
    listaResUltimos: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Lista com os processos ultimos selecionados
    procUltSel: [],
    // Todas as travessias são carregadas para esta variável
    travessias: [],
    preSel: [],
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

        // resultado da travessia
        // listaResUltimos: Lista dos processos resultantes (das travessias) dos ultimos
        for (var i = 0; i < this.travessias[processo].length; i++) {
          for (var j = 0; j < this.lista.length; j++) {
            if (
              this.lista[j].classe === this.travessias[processo][i] &&
              !this.listaResUltimos.includes(this.travessias[processo][i])
            ) {
              this.listaResUltimos.push(this.travessias[processo][i]);
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
      } catch (err) {
        return err;
      }
    },

    // Reverte a seleção
    uncheck: async function(processo) {
      var resProc = this.listaProcResultado[processo];
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
            !newListaResUltimos.includes(this.listaProcResultado[procSel[i]][j])
          ) {
            newListaResUltimos.push(this.listaProcResultado[procSel[i]][j]);
          }
        }
      }
      if (procSel.length) {
        this.listaResUltimos = newListaResUltimos;
      } else {
        for (var l = 0; l < resProc.length; l++) {
          if (this.procPreSel.includes(resProc[l])) {
            var index = this.listaResUltimos.findIndex(
              p => p.id === resProc[l]
            );
            this.listaResUltimos.splice(index, 1);
          }
        }
      }

      if (!procSel.length && this.preSel.includes(processo)) {
        this.listaResUltimos.push(processo);
      }

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
        this.desSelProcUlt(item.classe);
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

      // Faz os calculos iniciais dos processos selecionados
      for (var i = 0; i < this.lista.length; i++) {
        if (this.lista[i].dono || this.lista[i].participante) {
          if (!this.procUltSel.includes(this.lista[i])) {
            this.procUltSel.push(this.lista[i]);
            this.$emit("contadorProcSelUlt", this.procUltSel);
          }
        }
      }

      // Coloca na lista de processos resultantes ultimos os processos pré selecionados
      // resultantes das travessias anteriores
      if (!this.listaResUltimos.length) {
        if (this.preSel.length) {
          for (var l = 0; l < this.lista.length; l++) {
            if (this.preSel.includes(this.lista[l].classe))
              this.listaResUltimos.push(this.lista[l].classe);
            this.procPreSel.push(this.lista[l].classe);
          }
        }
      }

      this.tipoPar();
    } catch (error) {
      return error;
    }
  }
};
</script>
