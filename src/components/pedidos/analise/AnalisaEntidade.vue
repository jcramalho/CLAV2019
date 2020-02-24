<template>
  <div>
    <v-row v-for="(t, i) in legislacaoInfo" :key="i">
      <!-- Label -->
      <v-col cols="2" v-if="t.conteudo !== '' && t.conteudo !== undefined">
        <div class="info-label">{{ t.campo }}</div>
      </v-col>

      <!-- Conteudo -->
      <v-col v-if="t.conteudo !== '' && t.conteudo !== undefined">
        <!-- Se o conteudo for uma lista de tipologias-->
        <v-data-table
          v-if="t.campo == 'Tipologias'"
          :headers="headersTipologias"
          :items="t.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.operacao="{ item }">
            <v-icon color="red" @click="">delete</v-icon>
          </template>

          <template v-slot:top>
            <v-toolbar flat :color="t.cor">
              <v-dialog v-model="dialogTipologias" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn rounded class="indigo accent-4 white--text" v-on="on">
                    Adicionar em Falta
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Selecione uma Tipologia</span>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="indigo darken-1" text @click="close"
                      >Fechar</v-btn
                    >
                    <!-- <v-btn color="blue darken-1" text @click="save">Save</v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer />
              <v-icon color="green" @click="verifica(t)">check</v-icon>
            </v-toolbar>
          </template>
        </v-data-table>

        <!-- Se o conteudo for texto -->
        <v-text-field
          v-else
          solo
          readonly
          hide-details
          :background-color="t.cor"
          :value="t.conteudo"
        >
          <template slot="append">
            <v-icon color="green" @click="verifica(t)">check</v-icon>
            <v-icon color="red" @click="anula(t)">clear</v-icon>
            <v-icon @click="">create</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-spacer />
      <PO />
    </v-row>
  </div>
</template>

<script>
import PO from "@/components/pedidos/analise/PainelOperacoes";
export default {
  props: ["p"],

  components: {
    PO
  },

  data() {
    return {
      dialogTipologias: false,
      legislacaoInfo: [
        {
          campo: "Sigla",
          conteudo: this.p.objeto.dados.sigla,
          cor: null
        },
        {
          campo: "Designação",
          conteudo: this.p.objeto.dados.designacao,
          cor: null
        },
        {
          campo: "Internacional",
          conteudo: this.p.objeto.dados.internacional,
          cor: null
        },
        { campo: "SIOE", conteudo: this.p.objeto.dados.sioe, cor: null },
        {
          campo: "Tipologias",
          conteudo: this.p.objeto.dados.tipologiasSel,
          cor: null
        },
        {
          campo: "Data Extinção",
          conteudo: this.p.objeto.dados.dataExtincao,
          cor: null
        }
      ],
      headersTipologias: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        {
          text: "Operação",
          value: "operacao",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center"
        }
      ]
    };
  },

  methods: {
    verifica(obj) {
      const i = this.legislacaoInfo.findIndex(o => o.campo == obj.campo);
      this.legislacaoInfo[i].cor = "green lighten-3";
    },

    anula(obj) {
      const i = this.legislacaoInfo.findIndex(o => o.campo == obj.campo);
      this.legislacaoInfo[i].cor = "red lighten-3";
    },

    close() {
      this.dialogtipologias = false;
      this.dialogProcessos = false;
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
