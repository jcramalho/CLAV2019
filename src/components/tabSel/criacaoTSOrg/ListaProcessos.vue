<template>
  <div>
    <div v-if="infoReady">
      <v-row>
        <v-col>
          <v-radio-group
            v-on:change="ordenaProcs(filtroLabel)"
            v-model="filtroLabel"
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
        :items="listaProcessos.procs"
        :headers="headers"
        class="ma-1"
        item-key="chave"
        :footer-props="procsFooterProps"
        :search="filtro"
      >
        <template v-slot:item="props">
          <tr
            :style="{
              backgroundColor:
                props.item.dono || props.item.participante != 'NP'
                  ? '#BBDEFB'
                  : props.item.preSelected > 0
                  ? '#FFECB3'
                  : 'transparent'
            }"
          >
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
              <v-btn
                v-if="props.item.dono"
                small
                text
                class="ma-2"
                @click="desselecionaDono(props.item)"
              >
                <v-icon dark>{{ donoSelecionado }}</v-icon>
              </v-btn>
              <v-btn
                v-else
                small
                text
                class="ma-2"
                @click="selecionaDono(props.item)"
              >
                <v-icon dark>{{ donoDesselecionado }}</v-icon>
              </v-btn>
              <!--v-checkbox color="indigo darken-4" v-model="props.item.dono"></v-checkbox-->
            </td>
            <td>
              <v-radio-group
                v-model="participante[props.item.chave]"
                v-on:change="
                  selecionaParticipacao(
                    props.item,
                    participante[props.item.chave]
                  )
                "
                row
              >
                <v-radio
                  color="indigo darken-4"
                  label="Não part."
                  value="NP"
                ></v-radio>
                <v-radio
                  color="indigo darken-4"
                  v-for="p in participacao"
                  :key="p.idtermo"
                  :label="p.termo.substring(0, 3)"
                  :value="p.termo"
                  class="caption"
                ></v-radio>
              </v-radio-group>
            </td>
            <td>
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
          Nº de processos selecionados:
          {{ numProcessosSelecionados }}
        </v-col>
        <v-col>
          Nº de processos a selecionar:
          {{ numProcessosPreSelecionados - processosPreSelecionados }}
        </v-col>
      </v-row>

      <EditDescritivo
        v-if="editaBlocoDescritivoFlag"
        :p="procSel"
        @editado="blocoDescritivoEditado($event)"
      />
    </div>
    <div v-else>
      <p>A preparar a informação dos processos...</p>
    </div>
  </div>
</template>

<script>
import EditDescritivo from "@/components/tabSel/criacaoTSPluri/EditDescritivo.vue";
import { mdiPencil } from "@mdi/js";
import { mdiFileDocumentEdit } from "@mdi/js";
import { mdiCheckCircle } from "@mdi/js";
import { mdiCheckBoxOutline } from "@mdi/js";
import { mdiCheckboxBlankOutline } from "@mdi/js";

export default {
  props: ["listaProcs", "listaCodigosEsp", "participante"],
  components: {
    EditDescritivo
  },

  data: () => ({
    // Processo corrente
    procSel: {},
    // Lista de processos local, para forçar um watcher
    listaProcessos: {},
    // Fecho Transitivo dos processos
    fechoTransitivo: {},
    // Tipos de participação carregados da BD
    participacao: [],
    // Flag de controlo da preparação da informação
    infoReady: false,
    // Número de processos selecionados
    numProcessosSelecionados: 0,
    // Número de processos a selecionar
    numProcessosPreSelecionados: 0,
    // Número de Processos a selecionar selecionados
    processosPreSelecionados: 0,
    // Icons
    selecionaResponsabilidadesIcon: mdiPencil,
    editaBlocoDescritivoIcon: mdiFileDocumentEdit,
    editadoIcon: mdiCheckCircle,
    donoSelecionado: mdiCheckBoxOutline,
    donoDesselecionado: mdiCheckboxBlankOutline,
    // Ativador do subcomponente que tem a interface de seleção
    selecionaResponsabilidades: false,
    // Ativador do subcomponente que tem a interface de edição do Bloco Descritivo
    editaBlocoDescritivoFlag: false,
    // Filtro da tabela
    filtro: "",
    filtroLabel: "Todos",
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "codigo",
        width: "10%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Título",
        value: "titulo",
        width: "30%",
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
        width: "5%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Participante",
        value: "participante",
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

    try {
      var resPar = await this.$request(
        "get",
        "/vocabularios/vc_processoTipoParticipacao"
      );
      this.participacao = resPar.data;
    } catch (e) {
      console.log("Erro no carregamento dos tipos de participação: " + e);
    }
    this.listaProcessos = this.listaProcs;
    this.numProcessosSelecionados = this.listaProcs.numProcessosSelecionados;
    this.numProcessosPreSelecionados = this.listaProcs.numProcessosPreSelecionados;
    this.processosPreSelecionados = this.listaProcs.processosPreSelecionados;
    this.infoReady = true;
  },

  methods: {
    selecionaParticipacao: async function(proc, participacao) {
      if (!proc.dono && proc.participante == "NP" && participacao != "NP") {
        this.listaProcs.numProcessosSelecionados++;
        this.numProcessosSelecionados++;
        await this.acrescentaFecho(proc);
        if (proc.preSelected >= 1) {
          this.processosPreSelecionados++;
          this.listaProcs.processosPreSelecionados++;
        }
      } else if (
        !proc.dono &&
        proc.participante != "NP" &&
        participacao == "NP"
      ) {
        if (proc.preSelected >= 1) {
          this.processosPreSelecionados--;
          this.listaProcs.processosPreSelecionados--;
        }
        this.listaProcs.numProcessosSelecionados--;
        this.numProcessosSelecionados--;
        await this.retiraFecho(proc);
      }
      proc.participante = participacao;
    },

    // Seleciona um processo como dono
    selecionaDono: async function(proc) {
      proc.dono = true;
      // Se ainda não tinha sido selecionado
      if (proc.participante == "NP") {
        this.listaProcs.numProcessosSelecionados++;
        this.numProcessosSelecionados++;
        await this.acrescentaFecho(proc);
        if (proc.preSelected >= 1) {
          this.processosPreSelecionados++;
          this.listaProcs.processosPreSelecionados++;
        }
      }
    },

    // Desseleciona um processo como dono
    desselecionaDono: async function(proc) {
      proc.dono = false;
      // Se vai ficar desselecionado...
      if (proc.participante == "NP") {
        this.listaProcs.numProcessosSelecionados--;
        this.numProcessosSelecionados--;
        if (proc.preSelected >= 1) {
          this.processosPreSelecionados--;
          this.listaProcs.processosPreSelecionados--;
        }
        await this.retiraFecho(proc);
      }
    },

    // Filtra os processos na tabela
    filtraProcessos: function(value, search, item) {
      return item.tipoProc == "";
    },

    acrescentaFecho: function(processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcs.procs.findIndex(p => p.codigo == fecho[i]);
        if (index != -1) {
          this.listaProcs.procs[index].preSelected++;
          if (this.listaProcs.procs[index].preSelected == 1) {
            this.listaProcs.numProcessosPreSelecionados++;
            this.numProcessosPreSelecionados++;
            this.listaProcs.procs[index].preSelectedLabel = "Pré-Selecionado";
          }
        }
      }
    },
    // Reverte a seleção
    retiraFecho: async function(processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcs.procs.findIndex(p => p.codigo == fecho[i]);
        if (index != -1) {
          this.listaProcs.procs[index].preSelected--;
          if (this.listaProcs.procs[index].preSelected == 0) {
            this.listaProcs.numProcessosPreSelecionados--;
            this.numProcessosPreSelecionados--;
            this.listaProcs.procs[index].preSelectedLabel = "";
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
    },

    // Ordena os processos de acordo com a legenda
    ordenaProcs: function(label) {
      if (label === "Todos") this.filtro = "";
      else {
        this.filtro = label;
      }
      this.filtroLabel = label;
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
