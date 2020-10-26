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
                v-model="ppd.geral.nomePPD"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Entidades</div>
            </v-col>
            <v-col cols="12" xs="12" sm="9" v-if="semaforos.entidadesReady">
              <v-autocomplete
                v-model="ppd.geral.entSel"
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
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Menção de responsabilidade</div>
            </v-col>
            <v-col cols="12" xs="12" sm="9">
              <v-textarea
                  v-model="ppd.geral.mencaoResp"
                  label=""
                  solo
                  clearable
              ></v-textarea>
            </v-col>
          </v-row>
          <!-- sisISLAÇÂO -->
          <SistemaOps
            :sistema="ppd.sistemasInfo"
            @unselectSistema="unselectSistema($event)"
          />
          <SistemaInfo
            :ppd="ppd"
            :sistema="ppd.sistemasInfo" @newSistema="newSistema($event, ppd.sistemasInfo, ppd.listaSistemasInfoAuxiliar)"
            :entidades="entidades"
            :semaforos="semaforos"
            :listaLegislacao="listaLegislacao"
          />
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

import SistemaInfo from "@/components/ppd/criacao/sistemaInformacao/SistemaInfo.vue";
import SistemaOps from "@/components/ppd/criacao/sistemaInformacao/SistemaOps.vue";
//import SistemaSelect from "@/components/ppd/criacao/sistemaInformacao/SistemaSelect.vue";


export default {
  components: {
    SistemaInfo,
    SistemaOps,
    //SistemaSelect
  },

  data: () => ({
    // Objeto que guarda um ppd
    ppd: {
      lixo : "",
      geral:{
        numeroPPD: "", //é necessário?
        nomePPD: "",
        mencaoResp: "",
        entSel: [],
      },
      Sistemas: [],
      identificacao: {
        numeroSI: "",
        nomeSI: "",
        adminSistema: [],
        adminDados: [],
        propSistemaPublico: [],
        propSistemaPrivado: "",
        propDados: [],
        localDadosPublico: [],
        localDadosPrivado: "",
        userList: [],
        defResponsavel: "",
        defCheck: "",
        insourcing: "",
        insourcingCheck:"",
        outsourcing: "",
        outsourcingCheck: "",
        notas: "",
      },
      avaliacao: {
        codigo: "",
        descricao: "",
        checkedAti: "",
        sistemasRelacionados: [],
        legislacoes: [],
      },
      caracterizacao:{
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
        planoRecuperacao: "",
        notas: "",
      },
      estrategia:{

      },
      codigo: "", //é necessário?
      descricao: "", //é necessário?
      notasAp: [], //é necessário?
      exemplosNotasAp: [], //é necessário?
      notasEx: [], //é necessário?
      termosInd: [], //é necessário?

      listaSistemasInfoAuxiliar: [],
      sistemasInfo: [],

      user: {
        token: ""
      },
    },

    dialog: false,

    // Lista de todas as entidades existentes
    entidades: [],
    // Lista com as entidades selecionadas
    entSel: [],
    // Passa a true quando o utilizador tiver selecionado todas as entidades no primeiro passo
    entSelReady: false,

    myhelp: help,

    listaLegislacao: [],

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar um PLano de preservação digital!",
    mensValCodigo: "",


    semaforos: {
      entidadesReady: false,
      legislacaoReady: false,

      sistemaReady: false,
      pcaFormasContagemReady: false,
      pcaSubFormasContagemReady: false,
      critLegalAdicionadoPCA: false,
      critLegalAdicionadoDF: false,
      critGestionarioAdicionado: false
    },

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
        this.semaforos.entidadesReady = true;
      }
        catch (err) {
          return err;
      }
    },

    // Quando se termina a seleção das entidades
    entidadesSelecionadas: async function(){
      try{
        this.geral.entSel.sort((a, b) => a.identificacao > b.identificacao ? 1 : -1 );
        this.ppd.entidades = this.geral.entSel;

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


    loadLegislacao: async function() {
      try {
        var response = await this.$request("get", "/legislacao?estado=Ativo");
        this.listaLegislacao = response.data
          .map(function(item) {
            return {
              tipo: item.tipo,
              numero: item.numero,
              sumario: item.sumario,
              data: item.data,
              selected: false,
              id: item.id
            };
          })
          .sort(function(a, b) {
            return -1 * a.data.localeCompare(b.data);
          });
        this.semaforos.legislacaoReady = true;
      } catch (error) {
        return error;
      }
    },

    newSistema: function(sis, lista, listaAux) {
        lista.push(sis);
        listaAux.push(sis);
    },

    selectSistema: function(sis) {
      this.ppd.sistemasInfo.push(sis);
      this.ppd.listaSistemasInfoAuxiliar.push(sis);
      // Remove dos selecionáveis
      var index = this.listaLegislacao.findIndex(l => l.numeroSI === sis.numeroSI);
      this.listaLegislacao.splice(index, 1);
    },
    unselectSistema: function(sistema) {
      // Recoloca o sistema nos selecionáveis
      //this.listaLegislacao.push(sistema);
      var index = this.ppd.sistemasInfo.findIndex(e => e.numeroSI === sistema.numeroSI);
      this.ppd.sistemasInfo.splice(index, 1);
      this.ppd.listaSistemasInfoAuxiliar.splice(index, 1);
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
            await this.loadLegislacao();
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
