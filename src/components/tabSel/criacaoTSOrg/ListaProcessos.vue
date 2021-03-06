<template>
  <v-card flat outlined>
    <div v-if="infoReady" class="pa-5">
      <v-row>
        <v-col>
          <v-radio-group
            class="ml-5"
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

        <v-btn class="mx-5" dark color="green" @click="importFlag = true">
          <unicon
            class="mt-2 mr-1"
            name="importar-icon"
            width="20"
            height="20"
            fill="#ffffff"
          />
          <p>Importar Processos</p>
        </v-btn>
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
                  : 'transparent',
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
                v-if="props.item.procTrans === 'S'"
                class="mt-5"
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
                rounded
                small
                class="clav-linear-background white--text"
                @click="editaBlocoDescritivo(props.item)"
              >
                <v-icon>{{
                  props.item.descriptionEdited
                    ? editadoIcon
                    : editaBlocoDescritivoIcon
                }}</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-slot:[`footer.page-text`]="props">
          Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>

      <v-row wrap class="ml-1">
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
        @cancelado="blocoDescritivoCancelado($event)"
      />
      <v-dialog v-model="importFlag" width="95%">
        <v-card>
          <v-card-title class="headline">
            Importação de processos
          </v-card-title>

          <v-card-text>
            <v-file-input
              label="Ficheiro CSV/Excel"
              placeholder="Selecione o ficheiro CSV/Excel com a Tabela de Seleção"
              show-size
              truncate-length="100"
              accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              color="indigo darken-4"
              @change="selecionaFicheiro($event)"
            ></v-file-input>

            <v-alert type="info">
              Caso o ficheiro seja CSV deve respeitar o seguinte:

              <ul>
                <li>Os delimitadores podem ser ',' ou ';' ou '\t' ou '|'</li>
                <li>O quote e o escape são realizados através de "</li>
                <li>O encoding do ficheiro tem de ser UTF-8</li>
              </ul>

              O ficheiro (seja CSV ou Excel(xslx)) tem de possuir uma sheet em
              que tenha:

              <ul>
                <li>Uma coluna 'Código' com os códigos dos processos</li>
                <li>Uma coluna 'Título' com os títulos dos processos</li>
                <li>
                  Uma coluna 'Dono' com:
                  <ul>
                    <li>x ou X nos processos selecionados</li>
                    <li>Nada para os processos não selecionados</li>
                  </ul>
                </li>
                <li>
                  Uma coluna 'Participante' com o tipo de participação:
                  <ul>
                    <li>Apreciador</li>
                    <li>Assessor</li>
                    <li>Comunicador</li>
                    <li>Decisor</li>
                    <li>Executor</li>
                    <li>Iniciador</li>
                    <li>Nada para os processos não selecionados</li>
                  </ul>
                </li>
              </ul>
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="white--text ma-2"
              color="red darken-4"
              @click="importFlag = false"
              >Cancelar</v-btn
            >
            <v-btn
              class="white--text ma-2"
              color="indigo darken-4"
              :disabled="file == null"
              @click="enviarFicheiro()"
              >Importar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <p>A preparar a informação dos processos...</p>
    </div>
  </v-card>
</template>

<script>
import EditDescritivo from "@/components/tabSel/parteDescritiva/EditDescritivo.vue";
import { mdiLockCheck, mdiPencil } from "@mdi/js";
import { mdiFileDocumentEdit } from "@mdi/js";
import { mdiCheckCircle } from "@mdi/js";
import { mdiCheckBoxOutline } from "@mdi/js";
import { mdiCheckboxBlankOutline } from "@mdi/js";

export default {
  props: ["listaProcs", "listaCodigosEsp", "participante"],
  components: {
    EditDescritivo,
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
    importFlag: false,
    file: null,

    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "codigo",
        width: "10%",
        class: ["body-2", "font-weight-bold"],
        filterable: false,
        sortable: false,
      },
      {
        text: "Título",
        value: "titulo",
        width: "30%",
        class: ["body-2", "font-weight-bold"],
        filterable: false,
      },
      {
        text: "Dono",
        value: "dono",
        width: "5%",
        class: ["body-2", "font-weight-bold"],
        filterable: false,
      },
      {
        text: "Participante",
        value: "participante",
        class: ["body-2", "font-weight-bold"],
        width: "50%",
        filterable: false,
      },
      {
        text: "Operações",
        class: ["body-2", "font-weight-bold"],
        width: "5%",
        sortable: false,
      },
      {
        text: "Tipo",
        value: "tipoProc",
        width: "0%",
        class: ["body-2", "font-weight-bold"],
        align: " d-none",
      },
      {
        text: "Pré-Selecionado",
        value: "preSelectedLabel",
        width: "0%",
        class: ["body-2", "font-weight-bold"],
        align: " d-none",
      },
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos",
    },
  }),

  created: async function () {
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
    selecionaParticipacao: async function (proc, participacao) {
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
    selecionaDono: async function (proc) {
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
    desselecionaDono: async function (proc) {
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
    filtraProcessos: function (value, search, item) {
      return item.tipoProc == "";
    },

    acrescentaFecho: function (processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcs.procs.findIndex(
          (p) => p.codigo == fecho[i]
        );
        if (index != -1) {
          this.listaProcs.procs[index].preSelected++;
          if (this.listaProcs.procs[index].preSelected == 1) {
            this.listaProcs.numProcessosPreSelecionados++;
            this.numProcessosPreSelecionados++;
            this.listaProcs.procs[index].preSelectedLabel = "Pré-Selecionado";
            this.listaProcs.procsAselecionar.push({
              codigo: this.listaProcs.procs[index].codigo,
              titulo: this.listaProcs.procs[index].titulo,
            });
          }
        }
      }
    },
    // Reverte a seleção
    retiraFecho: async function (processo) {
      var fecho = this.fechoTransitivo[processo.codigo];
      !fecho.includes(processo.codigo) ? fecho.push(processo.codigo) : "";
      for (let i = 0; i < fecho.length; i++) {
        var index = this.listaProcs.procs.findIndex(
          (p) => p.codigo == fecho[i]
        );
        if (index != -1) {
          this.listaProcs.procs[index].preSelected--;
          if (this.listaProcs.procs[index].preSelected == 0) {
            this.listaProcs.numProcessosPreSelecionados--;
            this.numProcessosPreSelecionados--;
            this.listaProcs.procs[index].preSelectedLabel = "";
            this.listaProcs.procsAselecionar.splice(
              this.listaProcs.procsAselecionar.findIndex(
                (p) => p.codigo == this.listaProcs.procs[index].codigo
              ),
              1
            );
          }
        }
      }
    },

    // Edição dos Blocos Descritivos dos processos
    editaBlocoDescritivo: function (p) {
      this.procSel = p;
      this.editaBlocoDescritivoFlag = true;
    },
    // Função de retorno do processo de edição do Bloco Descritivo
    blocoDescritivoEditado: function (p) {
      let proc = this.listaProcs.procs[
        this.listaProcs.procs.findIndex((proc) => proc.codigo == p.codigo)
      ];
      proc.notasAp = p.notasAp;
      proc.exemplosNotasAp = p.exemplosNotasAp;
      proc.notasEx = p.notasEx;
      proc.termosInd = p.termosInd;

      this.editaBlocoDescritivoFlag = false;
    },
    // Função de cancelamento do processo de edição do Bloco Descritivo
    blocoDescritivoCancelado: function (p) {
      this.editaBlocoDescritivoFlag = false;
    },

    // Ordena os processos de acordo com a legenda
    ordenaProcs: function (label) {
      if (label === "Todos") this.filtro = "";
      else {
        this.filtro = label;
      }
      this.filtroLabel = label;
    },
    selecionaFicheiro: function (file) {
      this.file = file;
    },
    //Importação de processos
    enviarFicheiro: function () {
      this.$emit("importar", this.file);
      this.importFlag = false;
    },
  },
};
</script>

<style>
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>
