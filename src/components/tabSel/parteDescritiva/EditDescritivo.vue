<template>
  <v-container>
    <v-row>
      <v-dialog v-model="dialog" persistent width="95%">
        <v-card>
          <v-card-title class="headline">
            Descrição: {{ p.codigo }} - {{ p.titulo }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <!-- DESCRIÇÂO -->
              <v-col cols="2">
                <div class="info-label">Descrição</div>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="proc.descricao"
                  label="Descrição"
                  dense
                  solo
                  auto-grow
                  rows="2"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>

            <hr style="border-top: 1px dashed #dee2f8" />

            <BlocoDescritivoNotasAp :c="proc" />

            <hr style="border-top: 1px dashed #dee2f8" />

            <ListaDeNotasCLAV
              nome="Exemplo(s) de Nota(s) de Aplicação"
              infoHeader="Exemplo(s) de Nota(s) de Aplicação"
              :infoBody="myhelp.Classe.Campos.ExemplosNotasAp"
              :objeto="proc"
              tipo="exna"
            ></ListaDeNotasCLAV>

            <ListaDeNotasCLAV
              nome="Notas de Exclusão"
              infoHeader="Notas de Exclusão"
              :infoBody="myhelp.Classe.Campos.NotasEx"
              :objeto="proc"
              tipo="ne"
            ></ListaDeNotasCLAV>

            <ListaDeNotasCLAV
              v-if="!p.temSubclasses4Nivel"
              nome="Termos de Índice"
              infoHeader="Termos de Índice"
              :infoBody="myhelp.Classe.Campos.TermosIndice"
              :objeto="proc"
              tipo="ti"
            ></ListaDeNotasCLAV>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-4" text dark rounded @click="cancelar"
              >Cancelar</v-btn
            >
            <v-btn color="indigo darken-4" text dark rounded @click="selecionar"
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="errorDialog" persistent width="60%">
        <v-card class="info-card">
          <v-card-title class="headline mb-2 white--text"
            >Erro na alteração dos campos</v-card-title
          >
          <div class="info-content-card px-3 mx-6 mb-2">
            <v-card-text>
              <h5>Os campos assinalados a vermelho têm valores repetidos:</h5>
              <ul>
                <li v-for="(item, index) in errors" :key="index">
                  <span
                    :class="
                      item.value === true || item.value.length > 0 ? 'red--text' : ''
                    "
                    >{{ item.text }}
                    <ul v-if="item.value.length > 0">
                      <li v-for="(item2, index2) in item.value" :key="index2">
                        {{ item2 }}
                      </li>
                    </ul>
                  </span>
                </li>
              </ul>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-4" text dark rounded @click="errorDialog = false"
              >Voltar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
const help = require("@/config/help").help;
import BlocoDescritivoNotasAp from "@/components/tabSel/parteDescritiva/NotasAp.vue";

export default {
  props: ["p"],

  components: {
    BlocoDescritivoNotasAp,
  },

  data: function () {
    return {
      myhelp: help,
      errors: [],
      errorDialog: false,
      dialog: false,
      proc: JSON.parse(JSON.stringify(this.p)),
    };
  },

  mounted: function () {
    this.dialog = true;
  },

  methods: {
    notaDuplicada: function (notas) {
      if (notas.length > 1) {
        for (let lastNota of notas) {
          var duplicados = notas.filter((n) => n.nota == lastNota.nota);
          if (duplicados.length > 1) {
            return true;
          }
        }
      } else {
        return false;
      }
      return false;
    },

    exemploDuplicado: function (exemplos) {
      if (exemplos.length > 1) {
        for (let lastExemplo of exemplos) {
          var duplicados = exemplos.filter((e) => e.exemplo == lastExemplo.exemplo);
          if (duplicados.length > 1) {
            return true;
          }
        }
      } else {
        return false;
      }
      return false;
    },

    tiDuplicado: function (termos) {
      if (termos.length > 1) {
        for (let lastTermo of termos) {
          var duplicados = termos.filter((t) => t.termo == lastTermo.termo);
          if (duplicados.length > 1) {
            return true;
          }
        }
      } else {
        return false;
      }
      return false;
    },

    // Devolve a seleção para cima
    selecionar: async function () {
      this.errors = [];
      this.proc.notasAp && this.proc.notasAp.length > 0
        ? this.errors.push({
            text: "Notas de Aplicação",
            value: this.notaDuplicada(this.proc.notasAp),
          })
        : "";

      this.proc.exemplosNotasAp && this.proc.exemplosNotasAp.length > 0
        ? this.errors.push({
            text: "Exemplos de Notas de Aplicação",
            value: this.exemploDuplicado(this.proc.exemplosNotasAp),
          })
        : "";

      this.proc.notasEx && this.proc.notasEx.length > 0
        ? this.errors.push({
            text: "Notas de Exclusão",
            value: this.notaDuplicada(this.proc.notasEx),
          })
        : "";

      this.proc.termosInd && this.proc.termosInd.length > 0
        ? this.errors.push({
            text: "Termos de indice",
            value: this.tiDuplicado(this.proc.termosInd),
          })
        : "";

      if (this.errors.some((err) => err.value)) {
        this.errorDialog = true;
      } else {
        //Erros do mesmo PN Verificados
        //Reset da var de Erros
        this.errors = [];
        var aux = [];
        for (let nota of this.proc.notasAp) {
          var existeNotaAp = await this.$request(
            "get",
            `/notasAp/notaAp?classe=c${this.proc.codigo}&valor=${encodeURIComponent(
              nota.nota
            )}`
          );
          existeNotaAp.data ? aux.push(nota.nota) : "";
        }

        this.errors.push({
          text: `Notas de Aplicação`,
          value: aux,
        });

        aux = [];

        for (let nota of this.proc.exemplosNotasAp) {
          var existeExemplosNotaAp = await this.$request(
            "get",
            `/exemplosNotasAp/exemploNotaAp?classe=c${
              this.proc.codigo
            }&valor=${encodeURIComponent(nota.exemplo)}`
          );
          existeExemplosNotaAp.data ? aux.push(nota.exemplo) : "";
        }

        this.errors.push({
          text: `Exemplos de Notas de Aplicação`,
          value: aux,
        });

        aux = [];

        for (let nota of this.proc.termosInd) {
          var existeTermoInd = await this.$request(
            "get",
            `/termosIndice/termoIndice?classe=c${
              this.proc.codigo
            }&valor=${encodeURIComponent(nota.termo)}`
          );
          existeTermoInd.data ? aux.push(nota.termo) : "";
        }
        this.errors.push({
          text: `Termos de indice`,
          value: aux,
        });

        if (this.errors.some((err) => err.value.length > 0)) {
          this.errorDialog = true;
        } else {
          this.p.descriptionEdited = true;
          this.$emit("editado", this.proc);
        }
      }
    },
    // Cancela a alteração dos campos
    cancelar: function () {
      this.$emit("cancelado", this.p);
    },
  },
};
</script>
<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 2px;
  border-radius: 3px;
}

.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.info-content-card {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
