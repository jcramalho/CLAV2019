<template>
  <div>
    <v-row v-for="t in legislacaoInfo" :key="t.campo">
      <v-col cols="2" v-if="t.conteudo != ''">
        <div class="info-label">{{ t.campo }}</div>
      </v-col>

      <v-col v-if="t.conteudo != ''">
        <v-data-table
          v-if="t.campo == 'Entidades'"
          :headers="headersEntidades"
          :items="t.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.operacoes="{ item }">
            <v-icon color="green" @click="test(item)">check</v-icon>
            <v-icon color="red" @click="test(item)">delete</v-icon>
          </template>

          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Entidades</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialogEnditades" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn rounded class="indigo accent-4 white--text" v-on="on">
                    Adicionar em Falta
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Selecione uma Entidade</span>
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
            </v-toolbar>
          </template>
        </v-data-table>

        <v-data-table
          v-else-if="t.campo == 'Processos'"
          :headers="headersProcessos"
          :items="t.conteudo"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item.operacoes="{ item }">
            <v-icon color="green" @click="test('check')">check</v-icon>
            <v-icon color="red" @click="test('remove')">delete</v-icon>
          </template>

          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Processos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialogProcessos" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn rounded class="indigo accent-4 white--text" v-on="on">
                    Adicionar em Falta
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Selecione um Processo</span>
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
            </v-toolbar>
          </template>
        </v-data-table>

        <v-text-field v-else solo readonly :value="t.conteudo">
          <template slot="append">
            <v-icon color="green" @click="test(t)">check</v-icon>
            <v-icon color="red" @click="test(t)">clear</v-icon>
            <v-icon @click="test(t)">create</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["p"],

  data() {
    return {
      dialogEnditades: false,
      dialogProcessos: false,
      legislacaoInfo: [
        { campo: "Tipo de Diploma", conteudo: this.p.objeto.dados.tipo },
        {
          campo: "Fonte do Diploma",
          conteudo: this.p.objeto.dados.diplomaFonte
        },
        { campo: "Número do Diploma", conteudo: this.p.objeto.dados.numero },
        { campo: "Data", conteudo: this.p.objeto.dados.data },
        { campo: "Sumário", conteudo: this.p.objeto.dados.sumario },
        { campo: "Link", conteudo: this.p.objeto.dados.link },
        { campo: "Código", conteudo: this.p.objeto.dados.codigo },
        { campo: "Entidades", conteudo: this.p.objeto.dados.entidadesSel },
        { campo: "Processos", conteudo: this.p.objeto.dados.processosSel }
      ],
      headersEntidades: [
        { text: "Sigla", value: "sigla", class: "subtitle-1" },
        { text: "Designação", value: "designacao", class: "subtitle-1" },
        {
          text: "Operações",
          value: "operacoes",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center"
        }
      ],
      headersProcessos: [
        { text: "Código", value: "codigo", class: "subtitle-1" },
        { text: "Título", value: "titulo", class: "subtitle-1" },
        {
          text: "Operações",
          value: "operacoes",
          class: "subtitle-1",
          sortable: false,
          width: "10%",
          align: "center"
        }
      ]
    };
  },

  methods: {
    close() {
      this.dialogEnditades = false;
      this.dialogProcessos = false;
    },

    test(m) {
      console.log("Dados: ", m);
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
