<template>
  <v-row>
    <v-col xs="12" sm="3">
      <ArvoreLateralPPD
        :arvore="ppd.arvore"
        :sistemasInfo="ppd.sistemasInfo"
      />
    </v-col>
    <v-col xs="12" sm="9">
      <!-- HEADER -->
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading">Criar Plano de Preservação Digital</v-toolbar-title>
        </v-app-bar>

        <v-card-text>
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Título
                <InfoBox header="Título do PPD" :text="myhelp.Ppd.titulo"/>
              </div>
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
              <div class="info-label">Entidades
                <InfoBox header="Entidades do PPD" :text="myhelp.Ppd.entidade"/>
              </div>
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
              <div class="info-label">Menção de responsabilidade
                <InfoBox header="Identificação de responsabilidades pela elaboração do PPD " :text="myhelp.Ppd.responsabilidade"/>
              </div>
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
          <v-row>
            <v-col cols="12" xs="12" sm="3">
              <div class="info-label">Fonte de legitimação </div>
            </v-col>
            <v-col cols="12" xs="12" sm="9">
              <v-radio-group v-model="loadCheck" row>
                <v-radio
                  v-for="(p, i) in fonteLegitimacao"
                  :key="i"
                  :label="p"
                  :value="p"
                  color="indigo darken-3"
                ></v-radio>
              </v-radio-group>
              <div v-if="loadCheck === 'TS/LC'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="tabelasSelecao"
                  item-text="titulo"
                  return-object
                  v-model="a"
                  solo
                  dense
                />
              </div>
              <div v-else-if="loadCheck === 'PGD/LC'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portariaLC"
                  item-text="titulo"
                  return-object
                  v-model="a"
                  solo
                  dense
                />
              </div>
              <div v-else-if="loadCheck === 'PGD'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portaria"
                  item-text="titulo"
                  return-object
                  v-model="fonteLegitimacaoSelected"
                  solo
                  dense
                />
              </div>
              <div v-else-if="loadCheck === 'RADA'">
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portariaRada"
                  item-text="titulo"
                  return-object
                  v-model="a"
                  solo
                  dense
                />
              </div>
              <div v-else>
                    <v-autocomplete
                      label="Selecione a fonte de legitimação"
                      :items="tsRada"
                      item-text="titulo"
                      return-object
                      v-model="a"
                      solo
                      dense
                    ></v-autocomplete>
                  </div>
            </v-col>
          </v-row>

          <SistemaInfo
            :ppd="ppd"
            :sistema="ppd.sistemasInfo" @newSistema="newSistema($event, ppd.sistemasInfo)"
            :entidades="entidades"
            :semaforos="semaforos"
            :listaLegislacao="listaLegislacao"
            :importarPPD="importarPPD"
            :classesSI="classesSI"
            :classesDaFonteL="classesDaFonteL"
          />
          <SistemaOps
            :sistema="ppd.sistemasInfo"
            @unselectSistema="unselectSistema($event)"
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
      <v-row align="center" justify="space-around">
        <v-btn
        color="indigo darken-2"
        dark
        class="ma-2"
        rounded
        @click="$router.push('/')"
        >
          Guardar
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import InfoBox from "@/components/generic/infoBox.vue";
import SistemaInfo from "@/components/ppd/criacao/sistemaInformacao/SistemaInfo.vue";
import SistemaOps from "@/components/ppd/criacao/sistemaInformacao/SistemaOps.vue";
import ArvoreLateralPPD from './ArvoreLateralPPD.vue';
//import SistemaSelect from "@/components/ppd/criacao/sistemaInformacao/SistemaSelect.vue";


export default {
  props:[
   "importarPPD"
  ],
  components: {
    InfoBox,
    SistemaInfo,
    SistemaOps,
    ArvoreLateralPPD
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
      si:{
        numeroSI: "",
        nomeSI:"",
        identificacao: {
          adminSistema: [],
          adminDados: [],
          propSistemaPublico: [],
          propSistemaPrivado: "",
          propDados: [],
          localDadosPublico: [],
          localDadosPrivado: "",
          userList: [],
          insourcingCheck:"",
          outsourcingCheck: "",
          defCheck: "",
          defResponsavel: "",
          insourcing: "",
          outsourcing: "",
          notas: "",
        },
        avaliacao: {
          descricao: "",
          tabelaDecomposicao: [],
          selecionadosTabelaFL: [],
          sistemasRelacionados: [],
          checkedAti: "",
          checkedGrau: "",
          checkedCriticidade: "",
          objetoPreservacao: "",
        },
        caracterizacao:{
          dependenciaSoft: "",
          categoriaDados: "",
          formatos:"",
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
          utilizacaoOperacional:{
            idMetodoPreservacao: "",
            fundMetodoPreservacao: "",
            lacunas: ""
          },
          utilizacaoMemoria:{
            idMetodoPreservacao: "",
            fundMetodoPreservacao: "",
            lacunas: ""
          }
        },
      },


      listaSistemasInfoAuxiliar: [],
      sistemasInfo: [],

      user: {
        token: ""
      },
      arvore: [],
    },

    //para apagar!!!!!!!
    a: "",
    //---Fonte de legitimacao---
    loadCheck: "",
    fonteLegitimacaoSelected: "",
    fonteLegitimacao: ["TS/LC", "PGD/LC", "PGD", "RADA", "RADA/CLAV"],
    portaria: [],
    portariaLC: [],
    portariaRada: [],
    tabelasSelecao: [],
    tsRada: [],
    tree_ou_tabela: false,
    search: "",
    classesTree: [],
    classesDaFonteL: [],
    classesSI: [],
    paginaTabela: 1,
    expanded: [],


    footer_props: {
        "items-per-page-text": "Classes por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
    },
    headers: [
      {text: "Código", sortable: false, value: "codigo", sortable: true},
      {text: "Referência", sortable: false, value: "referencia", sortable: true},
      {text: "Título", sortable: false, value: "titulo"},
      {text: "PCA", sortable: false, value: "pca"},
      {text: "Destino Final", sortable: false, value: "df"},
    ],

    headersLC: [
      {text: "Código", sortable: false, value: "codigo"},
      {text: "Título", sortable: false, value: "titulo"},
      {text: "PCA", sortable: false, value: "pca"},
      {text: "Destino Final", sortable: false, value: "df"}
    ],

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


 watch:{
    "fonteLegitimacaoSelected": function() {

      //if (this.fonteLegitimacaoSelected != "") {
        this.loadConsultaPGD(this.fonteLegitimacaoSelected.id);
      //}
    },
  },

  methods: {

  //-------Fonte Legitimacao-------
    loadConsultaPGD: async function(id) {
      try {
        var response = await this.$request("get", "/pgd/"+id);
        //this.classesSI = await prepararClasses(response.data);
        this.classesDaFonteL = response.data;
        for (var c of response.data) {
          if(c.codigo){
            this.classesSI.push({info:"Cod: " + c.codigo + " - " + c.titulo , classe:c.classe});
          }
          else{
            this.classesSI.push({info:"Ref: " + c.referencia + " - " + c.titulo , classe:c.classe})
          }
        }
      }catch (err) {
        return err;
      }
    },


    parseEntidades: async function(ent) {
      try {
        var entidades = "";
        for (var i = 0; i < ent.length; i++) {
          entidades = entidades + ent[i] + " ";
        }
        return entidades;
      } catch (e) {
        return {};
      }
    },
    preparaLegislacao: async function(leg) {
      try {
        var myLegislacao = {
          data: {
            campo: "Data do diploma",
            text: leg.data
          },
          sumario: {
            campo: "Sumário",
            text: leg.sumario
          },
          fonte: {
            campo: "Fonte de legitimação",
            text: leg.fonte
          },
          link: {
            campo: "Link",
            text: leg.link
          },
          entidades: {
            campo: "Entidades",
            text: await this.parseEntidades(leg.entidades)
          }
        };
        return myLegislacao;
      } catch (e) {
        return {};
      }
    },
    procuraClasse: function (classe, myClasses, classePai) {
      var index = myClasses.map(cl => cl.classe).indexOf(classePai)
      if(index>=0) myClasses[index].filhos.push(classe)
      else
        for(var c of myClasses) {
          c.filhos = this.procuraClasse(classe,c.filhos,classePai)
        }
      return myClasses
    },

    //--------------------
    //----------------------------------------------
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push({id: l.idPGD , titulo: l.tipo + " " + l.numero + " - " + l.sumario});
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },


  //-------Fonte Legitimacao-------


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

    newSistema: async function(sis, lista) {
        var index = lista.findIndex(e => e.numeroSI === sis.numeroSI);
        if(index != -1){
          //lista[index] = sis;
          //listaAux[index] = sis;
          //teste
          //lista.splice(index, 1);
          //listaAux.splice(index, 1);
        }
        else{
          lista.push(sis);
          //Dar reset as listas usadas....
          this.ppd.listaSistemasInfoAuxiliar = [...lista];
          this.loadConsultaPGD(this.fonteLegitimacaoSelected.id);
          var child = [];
          var index =  this.ppd.arvore.findIndex(l => l.id === sis.numeroSI);
          //ESTE CASO NUNCA ACONTECE PORQUE NAO SE PODE INSERIR OUTRO SI COM O MESMO ID....
          if(index != -1){
            if(this.ppd.arvore[index].avaliacao.tabelaDecomposicao.length>0){
              let aux = this.ppd.arvore[index].avaliacao.tabelaDecomposicao.map(e=> e.numeroSI+"."+e.numeroSub).toString().replaceAll(",","#")
              child = aux.split("#").map(e=> e=({"id": e, "name":e}));
              alert(child[0]);
            }
          }
          else{
              child = [];
              if(sis.avaliacao.tabelaDecomposicao.length>0){
                let aux = sis.avaliacao.tabelaDecomposicao.map(e=> e.numeroSI+"."+e.numeroSub).toString().replaceAll(",","#")
                child = aux.split("#").map(e=> e=({"id": e, "name":e}));
                child.sort();
                child.sort((a,b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : ((parseInt(b.id) > parseInt(a.id)) ? -1 : 0));
              }
              this.ppd.arvore.push({"id": sis.numeroSI, "name": sis.numeroSI, "titulo": sis.nomeSI, children: child })
              this.ppd.arvore.sort((a,b) => (parseInt(a.id) >parseInt(b.id)) ? 1 : ((parseInt(b.id) > parseInt(a.id)) ? -1 : 0));
          }
        }
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
      this.ppd.arvore.splice(index,1);
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
        //var user = this.$verifyTokenUser();
        //var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
        //this.portariaLC = await this.prepararLeg(response.data);
        var response2 = await this.$request("get", "/pgd");
        this.portaria = await this.prepararLeg(response2.data);
        //var response3 = await this.$request("get", "/legislacao?fonte=RADA");
        //this.portariaRada = await this.prepararLeg(response3.data);
        //var response4 = await this.$request("get","/rada");
        //this.tsRada = response4.data
        var response5 = await this.$request("get","/tabelasSelecao")
        this.tabelasSelecao = response5.data.map(ts=>{return {
            titulo: ts.designacao,
            codigo: ts.id.split("clav#")[1]
          }
        });
      }
      catch(e){
        this.portariaLC = [];
        this.portaria = [];
        this.portariaRada = [];
        this.tabelasSelecao = [];
        this.tsRada = [];
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

.separadorMini {
  color: #283593;
  text-align: center;
  padding: 5px;
  font-weight: 400;
  width: 75%;
  background-color: #e8eaf6;
  font-size: 14pt;
  font-weight: bold;
  margin: auto;
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
