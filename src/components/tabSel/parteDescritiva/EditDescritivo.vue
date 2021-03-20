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
                <div class="info-label">
                  Descrição
                </div>
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

            <hr style="border-top: 1px dashed #dee2f8;" />

            <BlocoDescritivoNotasAp :c="proc" />

            <hr style="border-top: 1px dashed #dee2f8;" />

            <BlocoDescritivoExemplosNotasAp :c="proc" />

            <hr style="border-top: 1px dashed #dee2f8;" />

            <BlocoDescritivoNotasEx :c="proc" />

            <hr style="border-top: 1px dashed #dee2f8;" />

            <TermosIndiceOps :c="proc" v-if="!p.temSubclasses4Nivel" />
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
    </v-row>
  </v-container>
</template>

<script>
import BlocoDescritivoNotasAp from "@/components/classes/criacao/BlocoDescritivoNotasAp.vue";
import BlocoDescritivoExemplosNotasAp from "@/components/classes/criacao/BlocoDescritivoExemplosNotasAp.vue";
import BlocoDescritivoNotasEx from "@/components/classes/criacao/BlocoDescritivoNotasEx.vue";
import TermosIndiceOps from "@/components/classes/criacao/TermosIndiceOps.vue";

export default {
  props: ["p"],

  components: {
    BlocoDescritivoNotasAp,
    BlocoDescritivoExemplosNotasAp,
    BlocoDescritivoNotasEx,
    TermosIndiceOps
  },

  data: function() {
    return {
      dialog: false,
      proc: JSON.parse(JSON.stringify(this.p))
    };
  },

  mounted: function() {
    this.dialog = true;
  },

  methods: {
    // Devolve a seleção para cima
    selecionar: function() {
      this.p.descriptionEdited = true;
      this.$emit("editado", this.proc);
    },
    // Cancela a alteração dos campos
    cancelar: function() {
      this.$emit("cancelado", this.p);
    }
  }
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
</style>
