<template>
  <div>
    <v-row>
      <v-col>
        <v-radio-group
          v-model="filtroLabel"
          v-on:change="ordenaProcs(filtroLabel)"
          row
        >
          <v-radio
            color="indigo darken-4"
            label="Todos"
            value="Todos"
          ></v-radio>
          <v-radio
            color="indigo darken-4"
            label="Comuns"
            value="Processo Comum"
          ></v-radio>
          <v-radio
            color="indigo darken-4"
            label="Específicos"
            value="Processo Específico"
          ></v-radio>
          <v-radio
            color="indigo darken-4"
            label="Restantes"
            value="Processo Restante"
          ></v-radio>
          <v-radio
            color="indigo darken-4"
            label="A Selecionar"
            value="Pré-Selecionado"
          ></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-data-table
      :items="listaProcs.procs"
      :headers="headers"
      class="ma-1"
      item-key="chave"
      :footer-props="procsFooterProps"
      :search="filtro"
    >
      <template v-slot:item="props">
        <tr
          :style="{
            backgroundColor: props.item.edited
              ? '#BBDEFB'
              : props.item.preSelected > 0
              ? '#FFECB3'
              : 'transparent'
          }"
        >
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.titulo }}</td>
          <td>
            <v-icon v-if="props.item.dono">check</v-icon>
          </td>
          <td>
            <v-icon v-if="props.item.participante">check</v-icon>
          </td>
          <td>
            <v-btn
              small
              class="ma-2"
              @click="selecionaParticipacoes(props.item)"
            >
              <v-icon dark>{{ selecionaResponsabilidadesIcon }}</v-icon>
            </v-btn>
            <v-btn
              v-if="props.item.descriptionEdited"
              small
              class="ma-2"
              @click="editaBlocoDescritivo(props.item)"
            >
              <v-icon dark>{{ editadoIcon }}</v-icon>
            </v-btn>
            <v-btn
              v-else
              small
              class="ma-2"
              @click="editaBlocoDescritivo(props.item)"
            >
              <v-icon dark>{{ editaBlocoDescritivoIcon }}</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:[`footer.page-text`]="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>

    <v-row wrap>
      <v-col>
        <v-text-field
          readonly
          label="Nº de processos selecionados"
          v-model="listaProcs.numProcessosSelecionados"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          readonly
          label="Nº de processos a selecionar"
          v-model="this.processosPreSelecionados"
        ></v-text-field>
      </v-col>
    </v-row>

    <Selresponsabilidade
      v-if="selecionaResponsabilidades"
      :p="procSel"
      @selecionadas="selectProc($event)"
      @cancelada="selecaoCancelada"
    />

    <EditDescritivo
      v-if="editaBlocoDescritivoFlag"
      :p="procSel"
      @editado="blocoDescritivoEditado($event)"
    />
  </div>
</template>

<script>
import Selresponsabilidade from "@/components/tabSel/criacaoTSPluri/SelResponsabilidade.vue";
import EditDescritivo from "@/components/tabSel/criacaoTSPluri/EditDescritivo.vue";
import { mdiPencil } from "@mdi/js";
import { mdiFileDocumentEdit } from "@mdi/js";
import { mdiCheckCircle } from "@mdi/js";

export default {
  props: ["listaProcs", "listaCodigosEsp"],
  components: {
    Selresponsabilidade,
    EditDescritivo
  },

  data: () => ({
    // Processo corrente
    procSel: {},
    // Fecho Transitivo dos processos
    fechoTransitivo: {},
    // Icons
    selecionaResponsabilidadesIcon: mdiPencil,
    editaBlocoDescritivoIcon: mdiFileDocumentEdit,
    editadoIcon: mdiCheckCircle,
    // Ativador do subcomponente que tem a interface de seleção
    selecionaResponsabilidades: false,
    // Ativador do subcomponente que tem a interface de edição do Bloco Descritivo
    editaBlocoDescritivoFlag: false,
    // Filtro da tabela
    filtro: "",
    filtroLabel: "Todos",
    //Conta o número de processos a selecionar selecionados
    processosPreSelecionados: 0,
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "codigo",
        width: "15%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Título",
        value: "titulo",
        width: "45%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Tipo",
        value: "tipoProc",
        width: "0%",
        class: ["body-2", "font-weight-bold"],
        align: " d-none"
      },
      {
        text: "Pré-Selecionado",
        value: "preSelectedLabel",
        width: "0%",
        class: ["body-2", "font-weight-bold"],
        align: " d-none"
      },
      {
        text: "Dono",
        value: "dono",
        width: "10%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Partic.",
        value: "participante",
        width: "10%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Operações",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    }
  }),

  created: async function() {
    try {
      var response = await this.$request("get", "/travessiaV2");
      this.fechoTransitivo = response.data;
    } catch (e) {
      console.log("Erro ao carregar o fecho transitivo: " + e);
    }
    this.processosPreSelecionados =
      this.listaProcs.numProcessosPreSelecionados -
      this.listaProcs.processosPreSelecionados;
  },

  methods: {
    // Ordena os processos de acordo com a legenda
    ordenaProcs: function(label) {
      if (label === "Todos") this.filtro = "";
      else {
        this.filtro = label;
      }
      this.filtroLabel = label;
    },

    // Filtra os processos na tabela
    filtraProcessos: function(value, search, item) {
      return item.tipoProc == "";
    },

    // Seleção das participações
    selecionaParticipacoes: function(proc) {
      this.procSel = proc;
      this.selecionaResponsabilidades = true;
    },

    // Função de retorno do processo de seleção
    selecaoCancelada: function() {
      this.selecionaResponsabilidades = false;
    },

    // Função de retorno do processo de seleção
    selectProc: async function(p) {
      try {
        this.selecionaResponsabilidades = false;
        this.listaProcs.numProcessosSelecionados += p.inc;
        if (p.inc > 0) {
          // foi selecionado
          await this.acrescentaFecho(p);
          if (p.preSelected >= 1) {
            this.listaProcs.processosPreSelecionados++;
          }
          this.processosPreSelecionados =
            this.listaProcs.numProcessosPreSelecionados -
            this.listaProcs.processosPreSelecionados;
        } else if (p.inc < 0) {
          if (p.preSelected >= 1) {
            this.listaProcs.processosPreSelecionados--;
          }
          await this.retiraFecho(p);
          this.processosPreSelecionados =
            this.listaProcs.numProcessosPreSelecionados -
            this.listaProcs.processosPreSelecionados;
        }
      } catch (err) {
        return err;
      }
    },

    acrescentaFecho: function(processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcs.procs.findIndex(p => p.codigo == fecho[i]);
        if (index != -1) {
          this.listaProcs.procs[index].preSelected++;
          if (this.listaProcs.procs[index].preSelected == 1) {
            this.listaProcs.numProcessosPreSelecionados++;
            this.listaProcs.procs[index].preSelectedLabel = "Pré-Selecionado";
            this.listaProcs.procsAselecionar.push({
              codigo: this.listaProcs.procs[index].codigo,
              titulo: this.listaProcs.procs[index].titulo
            });
          }
        }
      }
    },
    // Reverte a seleção
    retiraFecho: async function(processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcs.procs.findIndex(p => p.codigo == fecho[i]);
        if (index != -1) {
          this.listaProcs.procs[index].preSelected--;
          if (this.listaProcs.procs[index].preSelected == 0) {
            this.listaProcs.numProcessosPreSelecionados--;
            this.listaProcs.procs[index].preSelectedLabel = "";
            this.listaProcs.procsAselecionar.splice(
              this.listaProcs.procsAselecionar.findIndex(
                p => p.codigo == this.listaProcs.procs[index].codigo
              ),
              1
            );
          }
        }
      }
    },

    // Edição dos Blocos Descritivos dos processos
    editaBlocoDescritivo: function(p) {
      this.procSel = p;
      this.editaBlocoDescritivoFlag = true;
    },
    // Função de retorno do processo de edição do Bloco Descritivo
    blocoDescritivoEditado: function(p) {
      this.editaBlocoDescritivoFlag = false;
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