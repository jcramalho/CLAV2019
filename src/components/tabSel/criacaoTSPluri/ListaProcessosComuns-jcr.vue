<template>
  <div>
      <v-data-table
        :items="lista"
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
                @click="procSel = props.item; selecionaResponsabilidades=true">Selecionar</v-btn>
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
        @selecionadas = "selecionaResponsabilidades=false"/>
  </div>
</template>

<script>

import Selresponsabilidade from "@/components/tabSel/criacaoTSPluri/SelResponsabilidade.vue";

export default {
  props: ["lista", "entidades"],
  components: {
      Selresponsabilidade
  },

  data: () => ({
    // Ativador do dialog para fazer debug de alguma estrutura
    debug: false,
    // Processo corrente
    procSel: {},
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
    guardaEntDonos: async function(proc, des) {
      for (var i = 0; i < Object.keys(this.entProcDono[proc]).length; i++) {
        var haDono = false;
        if (this.entProcDono[proc][Object.keys(this.entProcDono[proc])[i]]) {
          haDono = true;
          this.procSelDonos.push(proc);
          if (!this.procComunsSel.find(x => x.classe === proc)) {
            this.procComunsSel.push({
              classe: proc,
              designacao: des
            });
            this.$emit("contadorProcSelCom", this.procComunsSel);
            this.calcRel(proc);
          }
          break;
        }
      }
      if (!haDono) {
        var indexDono;
        if (Object.keys(this.entProcPar[proc]).length == 0) {
          var index = this.procComunsSel.indexOf(x => x.classe === proc);
          indexDono = this.procSelDonos.indexOf(proc);
          if (index != -1) {
            this.procComunsSel.splice(index, 1);
            this.procSelDonos.splice(indexDono, 1);
            this.uncheck(proc);
            this.$emit("contadorProcSelCom", this.procComunsSel);
          }
        } else {
          indexDono = this.procSelDonos.indexOf(proc);
          if (index != -1) {
            this.procSelDonos.splice(indexDono, 1);
          }
        }
      }

      var guardar = {};
      guardar["dono"] = this.entProcDono;
      this.$emit("guardarTSProcComuns", guardar);
    },
    selecTodasEnt: async function(entidades, proc, des) {
      for (var i = 0; i < entidades.length; i++) {
        this.entProcDono[proc][entidades[i].id] = true;
      }
      this.procSelDonos.push(proc);
      if (!this.procComunsSel.find(x => x.classe === proc)) {
        this.procComunsSel.push({
          classe: proc,
          designacao: des
        });
        this.$emit("contadorProcSelCom", this.procComunsSel);
        this.calcRel(proc);
      }
      var guardar = {};
      guardar["dono"] = this.entProcDono;
      this.$emit("guardarTSProcComuns", guardar);
    },
    guardaEntPar: async function(proc, des) {
      var guardar = {};
      guardar["part"] = this.entProcPar;
      this.$emit("guardarTSProcComuns", guardar);
      if (
        !this.procComunsSel.find(x => x.classe === proc) &&
        Object.keys(this.entProcPar[proc]).length
      ) {
        this.procComunsSel.push({
          classe: proc,
          designacao: des
        });
        this.$emit("contadorProcSelCom", this.procComunsSel);
        this.calcRel(proc);
      } else if (Object.keys(this.entProcPar[proc]).length == 0) {
        var haDono = false;
        for (var i = 0; i < Object.keys(this.entProcDono[proc]).length; i++) {
          if (this.entProcDono[proc][Object.keys(this.entProcDono[proc])[i]]) {
            haDono = true;
            break;
          }
        }
        if (!haDono) {
          var index = this.procComunsSel.indexOf(x => x.classe === proc);
          if (index != -1) {
            this.procComunsSel.splice(index, 1);
            this.uncheck(proc);
            this.$emit("contadorProcSelCom", this.procComunsSel);
          }
        }
      }
    },
    desselecionarPart: async function(classe, id) {
      delete this.entProcPar[classe][id];
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
    },
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

      this.tipoPar();
      for (var i = 0; i < this.lista.length; i++) {
        this.entProcDono[this.lista[i].classe] = {};
        for (j = 0; j < this.entidades.length; j++) {
          this.entProcDono[this.lista[i].classe][this.entidades[j].id] = false;
        }
      }
      this.entProcDonoReady = true;
      for (i = 0; i < this.lista.length; i++) {
        this.entProcPar[this.lista[i].classe] = {};
        var tempDialog = [];
        for (j = 0; j < this.entidades.length; j++) {
          tempDialog[this.entidades[j].id] = false;
        }
        this.dialog[this.lista[i].classe] = tempDialog;
        tempDialog = [];
      }
      this.entProcParReady = true;
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