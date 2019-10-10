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
            
            <!--Adicionar Agregações-->
            <AdicionarAgregacao 
              v-bind:auto="auto"
              v-bind:index="index"
            />
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
    limparZC: function() {
      this.classe = null;
      this.ni = "Vazio";
      this.dono = null;
      this.dataInicio = null;
      this.dataFim = null;
      this.uiPapel = null;
      this.uiDigital = null;
      this.uiOutros = null;
    },
    adicionarZC: async function() {
      const re = /\d{4}/;
      const reUI = /^-?\d*(\.\d\d?)?$/;
      if (!this.classe || !this.dataInicio || !this.dataFim) {
        this.erro =
          " Verifique se os campos <strong>Código da Classe," +
          " Data de Início e Data de Fim</strong> se encontram devidamente preenchidos.";
        this.erroDialog = true;
      } else if (!re.test(this.dataInicio) || !re.test(this.dataFim)) {
        this.erro =
          " Verifique se os campos <strong>" +
          " Data de Início e Data de Fim</strong> se encontram devidamente preenchidos.";
        this.erroDialog = true;
      } else {
        var codigo = this.classe.split(" - ")[0];
        var classe = await this.$request("get", "/api/classes/c" + codigo);
        var titulo = classe.data.titulo;
        var prazoConservacao = classe.data.pca.valores;
        var destino = classe.data.df.valor;
        var dataInicio = this.dataInicio;
        var dataFim = this.dataFim;
        if (this.ni == "Vazio") var ni = "";
        else var ni = this.ni;
        if (!this.dono) var dono = "";
        else var dono = this.dono.split(" - ")[1];
        if (!this.uiPapel || this.uiPapel == "0") var uiPapel = "";
        else if (!reUI.test(this.uiPapel)) {
          this.erro =
            " Verifique se o campo <strong>" +
            "Medição de UI em Papel</strong> se encontra devidamente preenchidos.";
          this.erroDialog = true;
        } else var uiPapel = this.uiPapel;
        if (!this.uiDigital || this.uiDigital == "0") var uiDigital = "";
        else if (!reUI.test(this.uiDigital)) {
          this.erro =
            " Verifique se o campo <strong>" +
            "Medição de UI Digital</strong> se encontra devidamente preenchidos.";
          this.erroDialog = true;
        } else var uiDigital = this.uiDigital;
        if (!this.uiOutros || this.uiOutros == "0") var uiOutros = "";
        else if (!reUI.test(this.uiOutros)) {
          this.erro =
            " Verifique se o campo <strong>" +
            "Medição de UI noutro Suporte</strong> se encontra devidamente preenchidos.";
          this.erroDialog = true;
        } else var uiOutros = this.uiOutros;

        this.auto.zonaControlo.push({
          codigo: codigo,
          titulo: titulo,
          prazoConservacao: prazoConservacao,
          destino: destino,
          ni: ni,
          dono: dono,
          dataInicio: dataInicio,
          dataFim: dataFim,
          uiPapel: uiPapel,
          uiDigital: uiDigital,
          uiOutros: uiOutros,
          agregacoes: []
        });

        this.limparZC();
      }
    }
  }
};
</script>
<style>
.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #696969;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>