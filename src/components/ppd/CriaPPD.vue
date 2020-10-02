<template>
  <v-row class="ma-1">
    <v-col>
      <!-- HEADER -->
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading">Criar Plano de Preservação Digital</v-toolbar-title>
        </v-app-bar>

        <v-card-text>
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Título</div>
            </v-col>
            <v-col cols="12" xs="12" sm="9">
              <v-text-field
                :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                v-model="ppd.titulo"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Entidades</div>
            </v-col>
            <v-col cols="12" xs="12" sm="9" v-if="entidadesReady">
              <v-autocomplete
                v-model="entSel"
                :items="entidades"
                item-text="label"
                placeholder="Selecione as entidades abrangidas pelo PPD"
                multiple
                chips
                deletable-chips
                return-object
              >
              </v-autocomplete>
            </v-col>
            <v-col v-else>
              <v-alert dense type="info">
                Ainda não foi possível carregar as entidades...
              </v-alert>
            </v-col>
          </v-row>
          <v-expansion-panels>
            <!-- BLOCO IDENTIFICAÇÃO -->
            <BlocoIdentificacao
              :c="ppd"
            />
            <!-- BLOCO AVALIAÇÃO -->
            <BlocoAvaliacao
              :c="ppd"
            />
            <!-- BLOCO CARACTERIZAÇÃO -->
            <BlocoCaracterizacao
              :c="ppd"
            />
          </v-expansion-panels>
        </v-card-text>

        <v-snackbar
          v-model="loginErrorSnackbar"
          :timeout="8000"
          color="error"
          :top="true"
        >
          {{ loginErrorMessage }}
          <v-btn text @click="loginErrorSnackbar = false">Fechar</v-btn>
        </v-snackbar>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import BlocoIdentificacao from "@/components/ppd/BlocoIdentificacao.vue";
import BlocoAvaliacao from "@/components/ppd/BlocoAvaliacao.vue";
import BlocoCaracterizacao from "@/components/ppd/BlocoCaracterizacao.vue";

export default {
  components: {
    BlocoIdentificacao,
    BlocoAvaliacao,
    BlocoCaracterizacao,
  },

  data: () => ({
    // Objeto que guarda um ppd
    ppd: {
      nRef: "",
      identificacao: {
        nomeSI: "",
        local: "",
        adminSistema: "",
        adminDados: "",
        propSistema: "",
        propDados: "",
        userList: [],
        defFormal: "",
        defResponsavel: "",
        insourcingCheck: "",
        insourcing: "",
        outsourcingCheck: "",
        outsourcing: "",
        notas: "",
        mencaoResp: ""
      },
      avaliacao: {
        codigo: "",
        descricao: "",
        checkedAti: "",
        nRef: ""
      },
      caracterizacao:{
        nRef: "",
        nomeSI: "",
        dependenciaSoft: "",
        modeloCres: "",
        dimensao:"",
        crescimento: "",
        localSistema: "",
        salaTec: "",
        acessoSalaTec: "",
        energiaRed: "",
        energiaSoc: "",
        alarme: "",
        climatizacao: "",
        seguranca: "",
        comunicacaoEx: "",
        planoContingencia: "",
        planoMudEvolucao: "",
        privAcesso: "",
        catSegDados: "",
        rotinaAuditoria: "",
        logsRotinas: "",
        integridadeInfo: "",
        armazenamento: "",
        replicacaoDados: "",
        backupsRegular: "",
        modeloBackup: "",
        qualidadeBackup: "",
        inventarioSoft: "",
        inventarioHard: "",
        documentacaoSis: "",
        documentacaoProc: "",
        controlVersaoDProc: "",
        contratoAtivos: "",
        planoRecuperacao: ""
      },
      codigo: "",
      titulo: "",
      descricao: "",
      notasAp: [],
      exemplosNotasAp: [],
      notasEx: [],
      termosInd: [],


      user: {
        token: ""
      }
    },
    // Lista de todas as entidades existentes
    entidades: [],
    // Lista com as entidades selecionadas
    entSel: [],
    // True quando a lista de entidades estiver carregada
    entidadesReady: false,
    // Passa a true quando o utilizador tiver selecionado todas as entidades no primeiro passo
    entSelReady: false,

    myhelp: help,
    classesPai: [],
    entidadesD: [],
    entidadesP: [],
    listaProcessos: [],
    listaLegislacao: [],

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar um PLano de preservação digital!",
    mensValCodigo: ""

  }),



  methods: {

    // Faz load de todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            identificacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        this.entidadesReady = true;
      }
        catch (err) {
          return err;
      }
    },

    // Quando se termina a seleção das entidades
    entidadesSelecionadas: async function(){
      try{
        this.entSel.sort((a, b) => a.identificacao > b.identificacao ? 1 : -1 );
        this.ppd.entidades = this.entSel;

        for(let i=0; i < this.listaProcessos.procs.length; i++){
            for(let j=0; j < this.ppd.entidades.length; j++){
                this.listaProcessos.procs[i].entidades.push({
                    sigla: this.ppd.entidades[j].sigla,
                    identificacao: this.ppd.entidades[j].identificacao,
                    id: this.ppd.entidades[j].id,
                    label: this.ppd.entidades[j].label,
                    dono: false,
                    participante: "NP"
                });
            }
        }
        await this.loadProcessosEspecificos(this.ppd.entidades);
        this.entSelReady = true;
      }
      catch(e){
        console.log("Erro ao fundir as entidades nos processos: " + e);
      }
    },


  },

  /* em principio nao vai ser necessario porque vou buscar a info toda logo no inicio
  watch:{
    "classe.nivel": function() {

      if (this.classe.nivel > 1) {
        this.loadEntidades();
      }
      if (this.classe.nivel >= 3 && !this.semaforos.legislacaoReady) {
        this.loadLegislacao();
      }
    },
  },
  */
  created: async function() {
      try{
            await this.loadEntidades();
      }
      catch(e){
          console.log('Erro ao carregar a informação inicial: ' + e);
      }
  }

};
</script>

<style>
.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E;
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
