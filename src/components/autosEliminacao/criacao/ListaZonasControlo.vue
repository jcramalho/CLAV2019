<template>
  <div>
    <v-list>
      <v-list-group
        v-for="(item,index) in auto.zonaControlo"
        :key="index"
        color="grey darken-1"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              <v-row>
                <v-col :md="2">
                  <div class="info-label">Código da Classe:</div>
                </v-col>
                <v-col>
                  <div class="mt-2">{{item.codigo}}</div>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item-content>
          <v-list-item-title class="mx-2">
            <table class="consulta">
              <tr v-if="item.titulo">
                <td style="width:20%;">
                  <div class="info-label">Título:</div>
                </td>
                <td>{{ item.titulo }}</td>
              </tr>
              <tr v-if="item.prazoConservacao">
                <td style="width:20%;">
                  <div class="info-label">Prazo de Conservação Administrativa:</div>
                </td>
                <td>{{ item.prazoConservacao }} Anos</td>
              </tr>
              <tr v-if="item.destino">
                <td style="width:20%;">
                  <div class="info-label">Destino Final:</div>
                </td>
                <td v-if="item.destino === 'E'">Eliminação</td>
                <td v-else-if="item.destino === 'C'">Conservação</td>
                <td v-else>{{ item.destino }}</td>
              </tr>
              <tr v-if="item.ni">
                <td style="width:20%;">
                  <div class="info-label">Natureza de intervenção:</div>
                </td>
                <td>{{ item.ni }}</td>
              </tr>
              <tr v-if="item.dono">
                <td style="width:20%;">
                  <div class="info-label">Dono do PN:</div>
                </td>
                <td>{{ item.dono }}</td>
              </tr>
              <tr>
                <td style="width:20%;">
                  <div class="info-label">Data de Início:</div>
                </td>
                <td>{{ item.dataInicio }}</td>
              </tr>
              <tr>
                <td style="width:20%;">
                  <div class="info-label">Data de Fim:</div>
                </td>
                <td>{{ item.dataFim }}</td>
              </tr>
              <tr>
                <td style="width:20%;">
                  <div class="info-label">N.º de agregações:</div>
                </td>
                <td>{{ item.agregacoes.length }}</td>
              </tr>
              <tr v-if="item.uiPapel">
                <td style="width:20%;">
                  <div class="info-label">Medição das UI em papel (m.l.):</div>
                </td>
                <td>{{ item.uiPapel }}</td>
              </tr>
              <tr v-if="item.uiDigital">
                <td style="width:20%;">
                  <div class="info-label">Medição das UI em digital (Gb):</div>
                </td>
                <td>{{ item.uiDigital }}</td>
              </tr>
              <tr v-if="item.uiOutros">
                <td style="width:20%;">
                  <div class="info-label">Medição das UI noutros suportes:</div>
                </td>
                <td>{{ item.uiOutros }}</td>
              </tr>
            </table>
            <!--Adicionar Agregações-->
            <AdicionarAgregacao 
              v-bind:auto="auto"
              v-bind:index="index"
            />
            <!-- Lista de Agregacoes -->
            <div v-if="item.agregacoes.length>0" class="ma-1">
              <div class="info-label">Lista de Agregações:</div>
              <v-data-table
                :headers="cabecalho"
                :items="item.agregacoes"
                :items-per-page="5"
                class="elevation-1 ma-4"
                :footer-props="footer_props"
              >
              </v-data-table>
            </div>
            
          </v-list-item-title>
        </v-list-item-content>
      </v-list-group>
    </v-list>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro: Não foi possível adicionar a Zona de Controlo</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AdicionarAgregacao from "@/components/autosEliminacao/criacao/AdicionarAgregacao.vue"

export default {
  props: ["classes", "entidades", "auto"],
  components: {
    AdicionarAgregacao
  },
  data: () => ({
    classe: null,
    ni: "Vazio",
    dono: null,
    dataInicio: null,
    dataFim: null,
    uiPapel: null,
    uiDigital: null,
    uiOutros: null,

    natureza: ["Vazio", "Dono", "Paticipante"],
    cabecalho: [
      {text: 'Código', align: 'left', sortable: false, value: 'codigo'},
      {text: 'Título', align: 'left', sortable: true, value: 'titulo'},
      {text: 'Data de Contagem', align: 'center', sortable: true, value: 'dataContagem'},
      {text: 'Natureza de Intervenção', align: 'center', sortable: true, value: 'ni'},
    ],
    footer_props: {
      "items-per-page-text": "Mostrar"
    },
    erro: null,
    erroDialog: false
  }),
  methods: {
  }
};
</script>