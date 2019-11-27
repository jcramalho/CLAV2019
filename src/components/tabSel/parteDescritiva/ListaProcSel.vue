<template :key="componentKey">
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
      <tr>
        <td>
          {{ props.item.classe }}
        </td>
        <td>
          {{ props.item.designacao }}
        </td>
        <td>
          <v-dialog
            v-model="props.item.parteDescritiva"
            scrollable
            persistent
            width="1000px"
          >
            <template v-slot:activator="{ on }">
              <v-btn small color="primary" v-on="on" @click="compKey+=1">
                <v-icon>
                  edit
                </v-icon>
              </v-btn>
            </template>
            <v-card v-if="novaListaReady">
              <v-card-title>
                <span class="headline">
                  Parte descritiva do processo {{ props.item.classe }} -
                  {{ props.item.designacao }}
                </span>
              </v-card-title>
              <v-divider></v-divider>

              <v-card-text style="height: 500px;">
                <NotasAp
                  :lista="novaLista[props.item.classe]"
                  :compKeyNA="compKey"
                />
                <hr />
                <ExemplosNotasAp
                  :lista="novaLista[props.item.classe]"
                  :compKeyENA="compKey"
                />
                <hr />
                <NotasEx
                  :lista="novaLista[props.item.classe]"
                  :compKeyNE="compKey"
                />
                <hr />
                <TermosIndice
                  :lista="novaLista[props.item.classe]"
                  :compKeyTI="compKey"
                />
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    guardar(props.item.classe);
                    props.item.parteDescritiva = false;
                  "
                >
                  Guardar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="eliminarParteDescritiva = true"
                >
                  Cancelar
                </v-btn>
                <v-dialog
                  v-model="eliminarParteDescritiva"
                  persistent
                  width="660"
                >
                  <v-card>
                    <v-card-title class="title"
                      >Eliminar alterações da parte descritiva do processo
                      {{ props.item.classe }}?</v-card-title
                    >
                    <v-card-text>
                      <p>
                        Esta ação reverte a parte descritiva deste processo para
                        as suas descrições iniciais
                      </p>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red"
                        text
                        @click="eliminarParteDescritiva = false"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          cancelar(props.item.classe);
                          props.item.parteDescritiva = false;
                          eliminarParteDescritiva = false;
                        "
                      >
                        Confirmar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
            <v-card v-else>
              <v-card-title>
                <span class="headline">
                  A carregar a parte descritiva dos processos...
                </span>
                <div class="flex-grow-1"></div>
                <v-progress-circular
                  :size="50"
                  :width="6"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-card-title>
            </v-card>
          </v-dialog>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import NotasAp from "@/components/tabSel/parteDescritiva/NotasAp.vue";
import ExemplosNotasAp from "@/components/tabSel/parteDescritiva/ExemplosNotasAp.vue";
import NotasEx from "@/components/tabSel/parteDescritiva/NotasEx.vue";
import TermosIndice from "@/components/tabSel/parteDescritiva/TermosIndice.vue";

export default {
  props: ["lista"],
  components: {
    NotasAp,
    ExemplosNotasAp,
    NotasEx,
    TermosIndice
  },
  data: () => ({
    headers: [
      {
        text: "Classe",
        value: "classe",
        width: "10%"
      },
      {
        text: "Designação",
        value: "designacao",
        width: "65%"
      },
      {
        text: "Parte Descritiva",
        value: "parteDescritiva",
        width: "25%"
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    },
    novaLista: [],
    novaListaReady: false,
    notasAp: [],
    exemplosNotasAp: [],
    notasEx: [],
    termosInd: [],
    componentKey: 0,
    eliminarParteDescritiva: false,
    info: {},
    compKey: 0
  }),
  methods: {
    guardar: async function(classe) {
      // Slice para copiar o array
      this.notasAp[classe] = this.novaLista[classe].notasAp.slice(0);
      this.exemplosNotasAp[classe] = this.novaLista[
        classe
      ].exemplosNotasAp.slice(0);
      this.notasEx[classe] = this.novaLista[classe].notasEx.slice(0);
      this.termosInd[classe] = this.novaLista[classe].termosInd.slice(0);
      this.$emit("listaTotalSelUpdate", this.novaLista);
      this.componentKey += 1;
    },
    cancelar: async function(classe) {
      var res = await this.$request(
        "get",
        "/api/classes?nivel=3&info=completa"
      );

      for (var j = 0; j < res.data.length; j++) {
        if (res.data[j].codigo == classe) {
          this.novaLista[classe].notasAp = res.data[j].notasAp.slice(0);
          for (var ap = 0; ap < this.novaLista[classe].notasAp.length; ap++) {
            this.novaLista[classe].notasAp[ap].backgroundColor = "transparent";
          }
          this.novaLista[classe].exemplosNotasAp = res.data[
            j
          ].exemplosNotasAp.slice(0);
          for (
            var exAp = 0;
            exAp < this.novaLista[classe].exemplosNotasAp.length;
            exAp++
          ) {
            this.novaLista[classe].exemplosNotasAp[exAp].backgroundColor =
              "transparent";
          }
          this.novaLista[classe].notasEx = res.data[j].notasEx.slice(0);
          for (var ex = 0; ex < this.novaLista[classe].notasEx.length; ex++) {
            this.novaLista[classe].notasEx[ex].backgroundColor = "transparent";
          }
          this.novaLista[classe].termosInd = res.data[j].termosInd.slice(0);
          for (
            var ter = 0;
            ter < this.novaLista[classe].termosInd.length;
            ter++
          ) {
            this.novaLista[classe].termosInd[ter].backgroundColor =
              "transparent";
          }
          this.compKey += 1;
          console.log(this.compKey)
          break;
        }
      }
    }
  },
  mounted: async function() {
    try {
      var res = await this.$request(
        "get",
        "/api/classes?nivel=3&info=completa"
      );
      this.info = res.data;

      for (var i = 0; i < this.lista.length; i++) {
        this.novaLista[this.lista[i].classe] = this.lista[i];

        for (var j = 0; j < this.info.length; j++) {
          if (this.info[j].codigo == this.lista[i].classe) {
            var na = this.info[j].notasAp;
            var ena = this.info[j].exemplosNotasAp;
            var ne = this.info[j].notasEx;
            var ti = this.info[j].termosInd;
            break;
          }
        }

        // Caso já exista notas de Aplicação associadas (acontece quando já se guardou trabalho previamente)
        if (this.lista[i].notasAp) {
          this.novaLista[this.lista[i].classe].notasAp = this.lista[i].notasAp;
        } else {
          this.novaLista[this.lista[i].classe].notasAp = na;
          for (
            var ap = 0;
            ap < this.novaLista[this.lista[i].classe].notasAp.length;
            ap++
          ) {
            this.novaLista[this.lista[i].classe].notasAp[ap].backgroundColor =
              "transparent";
          }
        }
        this.notasAp[this.lista[i].classe] = this.novaLista[
          this.lista[i].classe
        ].notasAp.slice(0);

        if (this.lista[i].exemplosNotasAp) {
          this.novaLista[this.lista[i].classe].exemplosNotasAp = this.lista[
            i
          ].exemplosNotasAp;
        } else {
          this.novaLista[this.lista[i].classe].exemplosNotasAp = ena;
          for (
            var exAp = 0;
            exAp < this.novaLista[this.lista[i].classe].exemplosNotasAp.length;
            exAp++
          ) {
            this.novaLista[this.lista[i].classe].exemplosNotasAp[
              exAp
            ].backgroundColor = "transparent";
          }
        }
        this.exemplosNotasAp[this.lista[i].classe] = this.novaLista[
          this.lista[i].classe
        ].exemplosNotasAp.slice(0);

        if (this.lista[i].notasEx) {
          this.novaLista[this.lista[i].classe].notasEx = this.lista[i].notasEx;
        } else {
          this.novaLista[this.lista[i].classe].notasEx = ne;
          for (
            var ex = 0;
            ex < this.novaLista[this.lista[i].classe].notasEx.length;
            ex++
          ) {
            this.novaLista[this.lista[i].classe].notasEx[ex].backgroundColor =
              "transparent";
          }
        }
        this.notasEx[this.lista[i].classe] = this.novaLista[
          this.lista[i].classe
        ].notasEx.slice(0);

        if (this.lista[i].termosInd) {
          this.novaLista[this.lista[i].classe].termosInd = this.lista[
            i
          ].termosInd;
        } else {
          this.novaLista[this.lista[i].classe].termosInd = ti;
          for (
            var ter = 0;
            ter < this.novaLista[this.lista[i].classe].termosInd.length;
            ter++
          ) {
            this.novaLista[this.lista[i].classe].termosInd[
              ter
            ].backgroundColor = "transparent";
          }
        }
        this.termosInd[this.lista[i].classe] = this.novaLista[
          this.lista[i].classe
        ].termosInd.slice(0);
      }
      this.$emit("listaTotalSelUpdate", this.novaLista);
      this.novaListaReady = true;
    } catch (err) {
      return err;
    }
  }
};
</script>

<style>
.info-label {
  color: #1a237e;
  padding: 4px;
  font-weight: 400;
  width: 90%;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
