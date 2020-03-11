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
            listaResComuns.findIndex(p => p == props.item.classe) != -1 &&
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
            class="ma-1"
            primary
            hide-details
            v-on:change="
              {
                props.item.dono && !props.item.participante
                  ? (calcRel(props.item.classe), selProcComum(props.item))
                  : props.item.dono && props.item.participante
                  ? selProcComum(props.item)
                  : !props.item.dono && !props.item.participante
                  ? (uncheck(props.item.classe, props.item.participante),
                    desSelProcComum(props.item))
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
                    selProcComum(props.item),
                    verificaTipoPar(props.item.participante, props.item))
                  : props.item.participante && props.item.dono
                  ? selProcComum(props.item)
                  : !props.item.participante && !props.item.dono
                  ? (uncheck(props.item.classe, props.item.participante),
                    desSelProcComum(props.item))
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
  props: ["lista", "it"],
  data: () => ({
    // Cabeçalho da tabela para selecionar os PNs comuns
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
    listaSistemaDecrementada: [],
    // Tipos de participação
    tipoParticipacao: []
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
      } catch (err) {
        return err;
      }
    },

    // Reverte a seleção
    uncheck: async function(processo, trans) {
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

      if (trans == null && !this.listaSistemaDecrementada.includes(processo)) {
        this.listaSistemaDecrementada.push(processo);

        this.$emit(
          "contadorComDecrementarSistema",
          this.listaSistemaDecrementada
        );
      }

      this.$emit("procPreSelResTravCom", this.listaResRestantes);
      this.$emit("contadorProcPreSelCom", this.listaResComuns);
    },
    // Para colocar e retirar qualquer processo da lista de processos comuns selecionados
    selProcComum: async function(processo) {
      if (!this.procComunsSel.includes(processo)) {
        this.procComunsSel.push(processo);
        this.$emit("contadorProcSelCom", this.procComunsSel);
        this.$emit("contadorProcSelComUtilizador", this.procComunsSel);
      }
    },
    desSelProcComum: async function(processo) {
      var index = this.procComunsSel.findIndex(
        e => e.classe === processo.classe
      );
      this.procComunsSel.splice(index, 1);
      this.$emit("contadorProcSelCom", this.procComunsSel);
      this.$emit("contadorProcSelComUtilizador", this.procComunsSel);
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
        this.desSelProcComum(item.classe);
      }
    }
  },
  mounted: async function() {
    try {
      // Vai a API de dados buscar todos os cálculos das travessias
      var res = await this.$request("get", "/travessia");
      var trav = res.data;
      for (var j = 0; j < trav.length; j++) {
        this.travessias[trav[j].processo] = trav[j].travessia;
      }

      // Faz os calculos iniciais dos processos já selecionados
      for (var i = 0; i < this.lista.length; i++) {
        if (this.lista[i].dono || this.lista[i].participante) {
          this.calcRel(this.lista[i].classe);
          if (!this.procComunsSel.includes(this.lista[i])) {
            this.procComunsSel.push(this.lista[i]);
            this.$emit("contadorProcSelCom", this.procComunsSel);
            if (this.it == "1") {
              this.$emit("contadorProcSelComSistema", this.procComunsSel);
            }
          }
        } else if (this.lista[i].participante == null) {
          this.listaSistemaDecrementada.push(this.lista[i].classe);
        }
      }
      this.tipoPar();
    } catch (e) {
      return e;
    }
  }
};
</script>
