<template>
  <v-container>
    <v-row>
      <v-dialog v-model="dialog" width="95%" persistent>
        <v-card class="info-card">
          <v-card-title class="headline mb-4 white--text">
            Descrição: {{ p.codigo }} - {{ p.titulo }}
          </v-card-title>
          <v-card-text class="font-weight-medium">
            <v-row class="text-center">
              <!-- DESCRIÇÂO -->
              <v-col cols="2">
                <div class="info-label">
                  Descrição
                  <InfoBox
                    header="Descrição"
                    :text="myhelp.Classe.Campos.Descricao"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="p.descricao"
                  label="Descrição"
                  dense
                  solo
                  clearable
                  auto-grow
                  rows="2"
                ></v-textarea>
              </v-col>
            </v-row>

            <hr style="border-top: 1px dashed #dee2f8;" />

            <BlocoDescritivoNotasAp :c="p" />

            <hr style="border-top: 1px dashed #dee2f8;" />

            <BlocoDescritivoExemplosNotasAp :c="p" />

            <hr style="border-top: 1px dashed #dee2f8;" />

            <BlocoDescritivoNotasEx :c="p" />

            <hr style="border-top: 1px dashed #dee2f8;" />

            <TermosIndiceOps :c="p" v-if="!p.temSubclasses4Nivel" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="selecionar"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
const help = require('@/config/help').help;

import BlocoDescritivoNotasAp from '@/components/classes/criacao/BlocoDescritivoNotasAp.vue';
import BlocoDescritivoExemplosNotasAp from '@/components/classes/criacao/BlocoDescritivoExemplosNotasAp.vue';
import BlocoDescritivoNotasEx from '@/components/classes/criacao/BlocoDescritivoNotasEx.vue';
import TermosIndiceOps from '@/components/classes/criacao/TermosIndiceOps.vue';
import InfoBox from '@/components/generic/infoBox.vue';

export default {
  props: ['p'],

  components: {
    BlocoDescritivoNotasAp,
    BlocoDescritivoExemplosNotasAp,
    BlocoDescritivoNotasEx,
    TermosIndiceOps,
    InfoBox,
  },

  data: function() {
    return {
      myhelp: help,
      dialog: false,
    };
  },

  mounted: function() {
    this.dialog = true;
  },

  methods: {
    // Devolve a seleção para cima
    selecionar: function() {
      this.p.descriptionEdited = true;
      this.$emit('editado', this.p);
    },
  },
};
</script>
<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
</style>
