<template>
  <v-data-table
    v-if="entProcDonoReady"
    :items="lista"
    :headers="headers"
    class="ma-1"
    item-key="classe"
    :footer-props="procsFooterProps"
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
    <template v-slot:item="props">
      <tr
        :style="{
          backgroundColor:
            listaResComuns.findIndex(p => p == props.item.classe) != -1 &&
            !entProcDono[props.item.classe][
              Object.keys(entProcDono[props.item.classe])
            ] &&
            !Object.keys(entProcPar[props.item.classe]).length
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
          <v-dialog
            v-model="props.item.dono"
            scrollable
            persistent
            width="700px"
          >
            <template
              v-slot:activator="{ on }"
              v-if="!procSelDonos.includes(props.item.classe)"
            >
              <v-btn class="ma-1" fab small color="primary" v-on="on">
                <v-icon>list</v-icon>
              </v-btn>
            </template>
            <template v-slot:activator="{ on }" v-else>
              <v-btn class="ma-1" fab small color="primary" v-on="on">
                <v-icon>check</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>
                  Selecione as entidades donas do processo:
                  {{ props.item.classe }}
                </span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 400px;">
                <v-row align="center" v-for="e in entidades" :key="e.id">
                  <v-checkbox
                    hide-details
                    v-model="entProcDono[props.item.classe][e.id]"
                    class="shrink mr-2 mt-0"
                  ></v-checkbox>
                  <b>{{ e.designacao + "  (" + e.sigla + ") " }}</b>
                  <hr style="border-top: 0px" />
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    props.item.dono = false;
                    selecTodasEnt(
                      entidades,
                      props.item.classe,
                      props.item.designacao
                    );
                  "
                >
                  Selecionar todos
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    props.item.dono = false;
                    guardaEntDonos(props.item.classe, props.item.designacao);
                  "
                >
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <td>
          <v-dialog
            v-model="props.item.participante"
            scrollable
            persistent
            width="700px"
            v-if="entProcParReady"
          >
            <template
              v-slot:activator="{ on }"
              v-if="!Object.keys(entProcPar[props.item.classe]).length"
            >
              <v-btn class="ma-1" fab small color="primary" v-on="on">
                <v-icon>list</v-icon>
              </v-btn>
            </template>
            <template v-slot:activator="{ on }" v-else>
              <v-btn class="ma-1" fab small color="primary" v-on="on">
                <v-icon>check</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>
                  Selecione as entidades participantes no processo:
                  {{ props.item.classe }}
                </span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 400px;">
                <div v-for="e in entidades" :key="e.id">
                  <template v-if="!entProcPar[props.item.classe][e.id]">
                    <v-btn
                      color="primary"
                      fab
                      small
                      dark
                      @click="
                        dialog[props.item.classe][e.id] = !dialog[
                          props.item.classe
                        ][e.id];
                        props.item.participante = false;
                      "
                    >
                      <v-icon dark>add</v-icon>
                    </v-btn>
                    <b class="ma-4">{{
                      e.designacao + "  (" + e.sigla + ") "
                    }}</b>
                    <hr style="border-top: 0px" />
                  </template>
                  <template v-else>
                    <v-btn
                      color="primary"
                      fab
                      small
                      dark
                      @click="
                        dialog[props.item.classe][e.id] = !dialog[
                          props.item.classe
                        ][e.id];
                        props.item.participante = false;
                      "
                    >
                      <v-icon dark>edit</v-icon>
                    </v-btn>
                    <v-btn
                      color="primary"
                      fab
                      small
                      dark
                      @click="eliminarPart = true"
                      class="ma-1"
                    >
                      <v-icon dark>remove</v-icon>
                      <v-dialog
                        v-model="eliminarPart"
                        persistent
                        max-width="290"
                      >
                        <v-card>
                          <v-card-title class="headline">
                            Confirmar ação
                          </v-card-title>
                          <v-card-text>
                            Pretende eliminar esta participação?
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="red"
                              text
                              @click="eliminarPart = false"
                            >
                              Cancelar
                            </v-btn>
                            <v-btn
                              color="primary"
                              text
                              @click="
                                desselecionarPart(props.item.classe, e.id);
                                eliminarPart = false;
                              "
                            >
                              Confirmar
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-btn>
                    <b class="ma-4">{{
                      e.designacao +
                        "  (" +
                        e.sigla +
                        ") " +
                        ": " +
                        entProcPar[props.item.classe][e.id]
                    }}</b>
                    <hr style="border-top: 0px" />
                  </template>
                  <div style="flex: 1 1 auto;">
                    <v-dialog
                      v-model="dialog[props.item.classe][e.id]"
                      persistent
                      max-width="500px"
                    >
                      <v-card>
                        <v-card-title>
                          {{
                            "Selecione o tipo de intervenção da entidade: " +
                              e.sigla
                          }}
                          <br />
                          {{ "No processo: " + props.item.classe }}
                        </v-card-title>
                        <v-card-text>
                          <v-container fluid>
                            <v-radio-group
                              v-model="entProcPar[props.item.classe][e.id]"
                            >
                              <v-radio
                                v-for="t in tipoParticipacao"
                                :key="t"
                                v-bind:value="t"
                              >
                                <template v-slot:label>
                                  <div class="shrink mr-6 mt-2">{{ t }}</div>
                                </template>
                              </v-radio>
                            </v-radio-group>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            text
                            @click="
                              dialog[props.item.classe][e.id] = false;
                              props.item.participante = true;
                            "
                          >
                            Continuar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </div>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    props.item.participante = false;
                    guardaEntPar(props.item.classe, props.item.designacao);
                  "
                >
                  Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
export default {
  props: ["lista", "entidades", "procSelGuardados"],
  data: () => ({
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Classe",
        value: "classe",
        width: "20%"
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
        width: "15%"
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    },
    // Onde vão ficar armazenados as entidades donas de cada processo. Por ex: {proc1: [ent1,ent2]; proc2: [ent1,ent3]}
    entProcDono: [],
    // True quando a lista das entidades donas de cada processo estiver pronta
    entProcDonoReady: false,
    // Para abrir e fechar a caixa de dialogo
    dialog: {},
    // Onde vão ficar armazenados as entidades participantes de cada processo. Por ex: {proc1: [ent1 : "apreciar", ent2 : __]; proc2: [ent1: __,ent3: "iniciar"]}
    entProcPar: [],
    // True quando a lista das entidades donas de cada processo estiver pronta
    entProcParReady: false,
    // Tipos de participação
    tipoParticipacao: [],
    // Processos comuns selecionados (como dono ou participante ou ambos)
    procComunsSel: [],
    // exemplo: {processo1 : [listaResultados1], processo2: [listaResultados2]}
    listaProcResultado: {},
    // Todas as travessias são carregadas para esta variável
    travessias: [],
    // Lista dos processos comuns resultantes das travessias
    listaResComuns: [],
    // Lista dos processos restantes resultantes das travessias
    listaResRestantes: [],
    // Lista dos processos selecionados como donos
    procSelDonos: [],
    // Dialog de confirmação de eliminação de participação
    eliminarPart: false
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
    tipoPar: async function() {
      var resPar = await this.$request(
        "get",
        "/api/vocabularios/vc_processoTipoParticipacao"
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
  mounted: async function() {
    try {
      // Vai a API de dados buscar todos os cálculos das travessias
      var res = await this.$request("get", "/api/travessia");
      var trav = res.data;
      for (var j = 0; j < trav.length; j++) {
        this.travessias[trav[j].processo] = trav[j].travessia;
      }

      this.tipoPar();
      for (var i = 0; i < this.lista.length; i++) {
        this.entProcDono[this.lista[i].classe] = {};
        for (j = 0; j < this.entidades.length; j++) {
          this.entProcDono[this.lista[i].classe][
            this.entidades[j].id
          ] = this.procSelGuardados[this.lista[i].classe].dono[
            this.entidades[j].id
          ];
          if (
            this.procSelGuardados[this.lista[i].classe].dono[
              this.entidades[j].id
            ]
          ) {
            if (
              !this.procComunsSel.find(x => x.classe === this.lista[i].classe)
            ) {
              this.procComunsSel.push({
                classe: this.lista[i].classe,
                designacao: this.lista[i].designacao
              });
              this.$emit("contadorProcSelCom", this.procComunsSel);
              this.procSelDonos.push(this.lista[i].classe);
              this.calcRel(this.lista[i].classe);
            }
          }
        }
      }
      this.entProcDonoReady = true;
      var tempDialog;
      if (
        JSON.stringify(this.procSelGuardados[this.lista[0].classe].part) == "[]"
      ) {
        for (i = 0; i < this.lista.length; i++) {
          this.entProcPar[this.lista[i].classe] = {};
          tempDialog = [];
          for (j = 0; j < this.entidades.length; j++) {
            tempDialog[this.entidades[j].id] = false;
          }
          this.dialog[this.lista[i].classe] = tempDialog;
          tempDialog = [];
        }
      } else {
        for (i = 0; i < this.lista.length; i++) {
          this.entProcPar[this.lista[i].classe] = this.procSelGuardados[
            this.lista[i].classe
          ].part;
          if (
            JSON.stringify(this.procSelGuardados[this.lista[i].classe].part) !=
            "{}"
          ) {
            if (
              !this.procComunsSel.find(x => x.classe === this.lista[i].classe)
            ) {
              this.procComunsSel.push({
                classe: this.lista[i].classe,
                designacao: this.lista[i].designacao
              });
              this.$emit("contadorProcSelCom", this.procComunsSel);
              this.calcRel(this.lista[i].classe);
            }
          }
          tempDialog = [];
          for (j = 0; j < this.entidades.length; j++) {
            tempDialog[this.entidades[j].id] = false;
          }
          this.dialog[this.lista[i].classe] = tempDialog;
          tempDialog = [];
        }
      }
      this.entProcParReady = true;
    } catch (err) {
      return err;
    }
  }
};
</script>
