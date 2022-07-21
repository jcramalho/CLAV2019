<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <ArvoreLateralPPD
        @ver="showSI"
        :arvore="ppd.arvore"
        :sistemasInfo="ppd.sistemasInfo"
      />
    </v-col>
    <v-col cols="12" xs="12" sm="9">
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading">Criar Plano de Preservação Digital</v-toolbar-title>
        </v-app-bar>
        <v-card-text>
          <v-stepper v-model="e1" vertical class="elevation-0" style="background-color:#fafafa">
            <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1">
              <font size="4">
                <b>Informação Geral</b>
              </font>
            </v-stepper-step>
            <v-stepper-content step="1">
              <InformacaoGeral
                @seguinte="changeE1"
                @consultaFT="consultaFT($event)"
                :ppd="ppd"
                :entidades="entidades"
                :semaforos="semaforos"
                :myhelp="myhelp"
                />
            </v-stepper-content>
            <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2">
              <font size="4">
                <b>Sistemas de Informação</b>
              </font>
            </v-stepper-step>
            <v-stepper-content step="2">
              <SistemaOps
                @ver="showSI"
                :sistema="ppd.sistemasInfo"
                @unselectSistema="unselectSistema($event)"
              />
              <v-btn v-if="addSI == false" color="indigo lighten-2" dark class="ma-1" @click="importarSI = true">
                Importar SI
                <v-icon dark right>file_upload</v-icon>
              </v-btn>
              <v-btn v-if="addSI == false" color="indigo darken-2" dark class="ma-1" rounded @click="addSI = true">
                Adicionar SI
              </v-btn>
              <v-row>
                <v-col>
                  <hr style="border: 3px solid indigo; border-radius: 2px;" />
                </v-col>
              </v-row>
              <div v-if="addSI == true">
                <v-form ref="form" :lazy-validation="false">
                  <v-row >
                    <v-col cols="12" xs="12" sm="3">
                      <div class="info-label">Número de referência SI
                        <InfoBox header="Número de referência do Sistema de informação" :text="myhelp.Ppd.numeroSI"/>
                      </div>
                    </v-col>
                    <v-col cols="12" xs="12" sm="8">
                      <v-text-field
                        :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                        v-model="ppd.si.numeroSI"
                        label="Identificador do sistema de informação"
                        solo
                        clearable
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" xs="12" sm="3">
                      <div class="info-label">Nome do SI
                        <InfoBox header="Nome do Sistema de informação" :text="myhelp.Ppd.nomeSI"/>
                      </div>
                    </v-col>
                    <v-col cols="12" xs="12" sm="8">
                      <v-text-field
                        :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
                        v-model="ppd.si.nomeSI"
                        label="Designação oficial do sistema"
                        solo
                        clearable
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-expansion-panels v-model="panels">
                    <!-- BLOCO IDENTIFICAÇÃO -->
                    <BlocoIdentificacao
                      :ppd="ppd"
                      :semaforos="semaforos"
                      :entidades="entidades"
                    />
                    <!-- BLOCO AVALIAÇÃO -->
                    <BlocoAvaliacao
                      :ppd="ppd"
                      :semaforos="semaforos"
                      :listaLegislacao="listaLegislacao"
                      :classesSI="classesSI"
                      :classesDaFonteL="classesDaFonteL"
                      @newSistemasRelacionados="newSistemasRelacionados($event, ppd.si.avaliacao.sistemasRelacionados)"
                      @unselectSistemasRelacionados="unselectSistemasRelacionados($event)"
                    />
                    <!-- BLOCO CARACTERIZAÇÃO -->
                    <BlocoCaracterizacao
                      :ppd="ppd"
                    />
                    <!-- BLOCO ESTRATÉGIA -->
                    <BlocoEstrategia
                      :ppd="ppd"
                    />
                  </v-expansion-panels>
                </v-form>
                <br/>
                <v-btn
                color="indigo darken-2"
                dark
                class="ma-2"
                rounded
                @click="guardarSistema()"
                >
                  Adicionar
                </v-btn>
                <v-btn
                color="red darken-2"
                dark
                class="ma-2"
                rounded
                @click="addSI = false"
                >
                  Cancelar
                </v-btn>
                <v-row>
                  <v-col>
                    <hr style="border: 3px solid indigo; border-radius: 2px;" />
                  </v-col>
                </v-row>
              </div>

              <v-btn color="indigo darken-4" dark class="ma-2" rounded @click="changeE1(1)">
                Voltar
              </v-btn>
              <v-btn color="indigo darken-4" dark class="ma-2" @click="guardarPPD">
                Guardar
                <v-icon right>save</v-icon>
              </v-btn>
              <v-btn color="green darken-4" class="ma-2" @click="submeterPPD">
                Submeter
              </v-btn>
              <v-btn v-if="addSI == false" color="indigo darken-2" dark class="ma-2">
                Finalizar
              </v-btn>
              
            </v-stepper-content>
          </v-stepper>
          <v-row justify-center>
            <v-dialog v-model="ppdGuardado" persistent width="50%">
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Trabalho pendente guardado</v-card-title>
                <v-card-text>
                  <br />
                  <p>
                    Os seus dados foram guardados para que possa retomar o trabalho
                    mais tarde. Aceda aos pendentes para continuar.
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <ImportarSI
      :ppd = "ppd"
      :dialog="importarSI"
      @fecharDialog="importarSI = false"
    />
    <template>
      <div>
        <v-dialog
          :retain-focus="false"
          v-model="verSI"
        >
          <v-card>
            <v-card-title class="expansion-panel-heading">Sitema de informação</v-card-title>
            <div class="v-card__text mt-4">
              <verBlocoIdentificacao
                :siSpec="siSpec"
              />
              <verBlocoAvaliacao
                :siSpec="siSpec"
              />
              <verBlocoCaracterizacao
                :siSpec="siSpec"
              />
              <verBlocoEstrategia
                :siSpec="siSpec"
              />
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-row align="center" justify="space-around">
                <v-btn
                color="indigo darken-2"
                dark
                class="ma-2"
                rounded
                @click="verSI = false"
                >
                  Fechar
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-row justify-center>
      <v-dialog v-model="ppdPendente" persistent width="50%">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Trabalho pendente guardado</v-card-title>
          <v-card-text>
            <br />
            <p>
              Os seus dados foram guardados para que possa retomar o trabalho
              mais tarde. Aceda aos pendentes para continuar.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify-center>
      <v-dialog v-model="classeCriada" persistent width="50%">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Trabalho submetido</v-card-title>
          <v-card-text>
            <br />
            <p>
              Os seus dados foram submetidos. Pode verificar na secção "Gestão de Pedidos".
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="erroValidacao" :color="'warning'" :timeout="6000">
      {{mensagemErroSI}}
      <v-btn dark text @click="erroValidacao = false">Fechar</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import { nanoid } from 'nanoid'
const help = require("@/config/help").help;
const criteriosLabels = require("@/config/labels").criterios;

import InfoBox from "@/components/generic/infoBox.vue";
import InformacaoGeral from "@/components/ppd/criacao/InformacaoGeral.vue";
import SistemaInfo from "@/components/ppd/criacao/sistemaInformacao/SistemaInfo.vue";
import SistemaOps from "@/components/ppd/criacao/sistemaInformacao/SistemaOps.vue";
import ArvoreLateralPPD from "@/components/ppd/criacao/ArvoreLateralPPD.vue";
import mixinCriacaoPPD from "@/mixins/ppd/mixinCriacaoPPD.js";
import ImportarSI from "@/components/ppd/criacao/sistemaInformacao/importacao/ImportarSI.vue";
import BlocoIdentificacao from "@/components/ppd/criacao/sistemaInformacao/BlocoIdentificacao.vue";
import BlocoAvaliacao from "@/components/ppd/criacao/sistemaInformacao/BlocoAvaliacao.vue";
import BlocoCaracterizacao from "@/components/ppd/criacao/sistemaInformacao/BlocoCaracterizacao.vue";
import BlocoEstrategia from "@/components/ppd/criacao/sistemaInformacao/BlocoEstrategia.vue";
import verBlocoIdentificacao from "@/components/ppd/criacao/verSI/verBlocoIdentificacao.vue"
import verBlocoAvaliacao from "@/components/ppd/criacao/verSI/verBlocoAvaliacao.vue"
import verBlocoCaracterizacao from "@/components/ppd/criacao/verSI/verBlocoCaracterizacao.vue"
import verBlocoEstrategia from "@/components/ppd/criacao/verSI/verBlocoEstrategia.vue"
//import SistemaSelect from "@/components/ppd/criacao/sistemaInformacao/SistemaSelect.vue";


export default {
  props:['obj'],
  components: {
    InfoBox,
    InformacaoGeral,
    SistemaInfo,
    SistemaOps,
    ArvoreLateralPPD,
    mixinCriacaoPPD,
    ImportarSI,
    BlocoIdentificacao,
    BlocoAvaliacao,
    BlocoCaracterizacao,
    BlocoEstrategia,
    verBlocoIdentificacao,
    verBlocoAvaliacao,
    verBlocoCaracterizacao,
    verBlocoEstrategia
    //SistemaSelect
  },
  mixins: [mixinCriacaoPPD],


  data: () => ({
    siSpec: {
        numeroSI: [],
        nomeSI: [],
        identificacao:{},
        avaliacao:{},
        caracterizacao:{},
        estrategia:{}
    },
    verSI: false,
    importarSI: false,
    addSI: false,
    idPendente: null,
    ppdGuardado: false,
    // Objeto que guarda um ppd
    ppd: {
      listaSistemasInfoAuxiliar: [],
      sistemasInfo: [],
      arvore: [],
      geral:{
        numeroPPD: "", //é necessário?
        nomePPD: "",
        mencaoResp: "",
        entSel: [],
        fonteLegitimacao: "",
        tipoFonteL: ""
      },
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
          pcaSI: 0,
          destinoSI: "",
          decomposicao: [],
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
      user: {
        token: ""
      },

    },
    panels: [],
    //para apagar!!!!!!!
    a: "",


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

    // Lista de todas as entidades existentes
    entidades: [],
    // Lista com as entidades selecionadas
    entSel: [],
    // Passa a true quando o utilizador tiver selecionado todas as entidades no primeiro passo
    entSelReady: false,

    myhelp: help,

    listaLegislacao: [],

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar um Plano de preservação digital!",
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

    codigoPedido: "",
    classeCriada: false,
    errosValidacao: false,
    pendenteGuardado: false,
    pendenteGuardadoInfo: "",
    ppdPendente: false


  }),


 watch:{
    e1(v) {
      if (v > 1 && !this.guardar) {
        this.guardar = true;
      }
    },
  },

  methods: {

    guardarPPD() {
      delete this.ppd.listaSistemasInfoAuxiliar;
      delete this.ppd.si;
      let updatePendente = {
        _id: this.obj._id,
        objeto: this.ppd
      };
      var response = this.$request("put", "/pendentes", updatePendente);
      response.then((resp) => {
          this.ppdPendente = true;
          setTimeout(() => {
            this.ppdPendente = false;
            this.$router.push('/')
          }, 5000);
        });
    },

    apagar: function() {
      this.$refs.form.reset();
      this.panels = [];
      this.consultaFT();
    },
    newSistemasRelacionados: function(sistema, lista) {
        lista.push(sistema);
    },
    unselectSistemasRelacionados: function(sistema) {
      // Recoloca o sistema nos selecionáveis
      this.ppd.listaSistemasInfoAuxiliar.push(sistema);
      var index = this.ppd.si.avaliacao.sistemasRelacionados.findIndex(e => e.numeroSI === sistema.numeroSI);
      this.ppd.si.avaliacao.sistemasRelacionados.splice(index, 1);
    },
    guardarSistema: async function() {
      if(/*this.validaAll("O campo número do SI",this.ppd.si.numeroSI) &&
        this.validaAll("O campo  nome do SI",this.ppd.si.nomeSI) &&
        this.validaAll("O campo administrador do sistema",this.ppd.si.identificacao.adminSistema) &&
        this.validaAll("O campo administrador de dados",this.ppd.si.identificacao.adminDados) &&
        this.validaAll("O campo proprietário do SI - entidade pública",this.ppd.si.identificacao.propSistemaPublico) &&
        this.validaAll("O campo proprietário do SI - entidade privada",this.ppd.si.identificacao.propSistemaPrivado) &&
        this.validaAll("O campo proprietário dos dados",this.ppd.si.identificacao.propDados) &&
        this.validaAll("O campo localização dos dados - entidade pública",this.ppd.si.identificacao.localDadosPublico) &&
        this.validaAll("O campo localização dos dados - entidade privada",this.ppd.si.identificacao.localDadosPrivado) &&
        this.validaDef(this.ppd.si.identificacao.defResponsavel, this.ppd.si.identificacao.defCheck) &&
        this.validaInsourcing(this.ppd.si.identificacao.insourcing, this.ppd.si.identificacao.insourcingCheck) &&
        this.validaOutsourcing(this.ppd.si.identificacao.outsourcing, this.ppd.si.identificacao.outsourcingCheck) &&
        this.validaAll("O campo notas", this.ppd.si.identificacao.notas) &&
        this.validaAll("O campo de utilizadores",this.ppd.si.identificacao.userList)*/
        //this.$refs.form.validate() para verificar se os campos obrigatorios tao preenchidos
        true
      ){
         var sistema = {
          visto: true,
          numeroSI: this.ppd.si.numeroSI,
          nomeSI: this.ppd.si.nomeSI,
          identificacao: {},
          avaliacao: {},
          caracterizacao: {},
          estrategia: {},
        };
        Object.assign(sistema.identificacao,this.ppd.si.identificacao)
        Object.assign(sistema.avaliacao,this.ppd.si.avaliacao)
        Object.assign(sistema.caracterizacao,this.ppd.si.caracterizacao)
        Object.assign(sistema.estrategia,this.ppd.si.estrategia)
        /*this.ppd.si.numeroSI = "",
        this.ppd.si.nomeSI = "",
        this.ppd.si.identificacao.adminSistema = [],
        this.ppd.si.identificacao.adminDados = [],
        this.ppd.si.identificacao.propSistemaPublico = [],
        this.ppd.si.identificacao.propSistemaPrivado = "",
        this.ppd.si.identificacao.propDados = [],
        this.ppd.si.identificacao.localDadosPublico = [],
        this.ppd.si.identificacao.localDadosPrivado = "",
        this.ppd.si.identificacao.userList = [],
        this.ppd.si.identificacao.outsourcingCheck = "",
        this.ppd.si.identificacao.defCheck = "",
        this.ppd.si.identificacao.insourcingCheck = "",
        this.ppd.si.identificacao.defResponsavel = "",
        this.ppd.si.identificacao.expressaoResponsavel = "",
        this.ppd.si.identificacao.insourcing = "",
        this.ppd.si.identificacao.outsourcing = "",
        this.ppd.si.identificacao.notas = "",
        this.ppd.si.avaliacao.descricao = "",
        this.ppd.si.avaliacao.decomposicao = [],
        this.ppd.si.avaliacao.selecionadosTabelaFL = [],
        this.ppd.si.avaliacao.sistemasRelacionados = [],
        this.ppd.si.avaliacao.checkedAti = "",
        this.ppd.si.avaliacao.checkedGrau = "",
        this.ppd.si.avaliacao.checkedCriticidade = "",
        this.ppd.si.avaliacao.objetoPreservacao = "",
        this.ppd.si.avaliacao.legislacoes = "",
        this.ppd.si.caracterizacao.dependenciaSoft = "",
        this.ppd.si.caracterizacao.categoriaDados = "",
        this.ppd.si.caracterizacao.formato = "",
        this.ppd.si.caracterizacao.modeloCres = "",
        this.ppd.si.caracterizacao.dimensao = "",
        this.ppd.si.caracterizacao.crescimento = "",
        this.ppd.si.caracterizacao.localSistema = "",
        this.ppd.si.caracterizacao.salaTec = "",
        this.ppd.si.caracterizacao.acessoSalaTec = "",
        this.ppd.si.caracterizacao.energiaRed = "",
        this.ppd.si.caracterizacao.energiaSoc = "",
        this.ppd.si.caracterizacao.alarme = "",
        this.ppd.si.caracterizacao.climatizacao = "",
        this.ppd.si.caracterizacao.seguranca = "",
        this.ppd.si.caracterizacao.comunicacaoEx = "",
        this.ppd.si.caracterizacao.planoContingencia = "",
        this.ppd.si.caracterizacao.planoMudEvolucao = "",
        this.ppd.si.caracterizacao.privAcesso = "",
        this.ppd.si.caracterizacao.catSegDados = "",
        this.ppd.si.caracterizacao.rotinaAuditoria = "",
        this.ppd.si.caracterizacao.logsRotinas = "",
        this.ppd.si.caracterizacao.integridadeInfo = "",
        this.ppd.si.caracterizacao.armazenamento = "",
        this.ppd.si.caracterizacao.replicacaoDados = "",
        this.ppd.si.caracterizacao.backupsRegular = "",
        this.ppd.si.caracterizacao.modeloBackup = "",
        this.ppd.si.caracterizacao.qualidadeBackup = "",
        this.ppd.si.caracterizacao.inventarioSoft = "",
        this.ppd.si.caracterizacao.inventarioHard = "",
        this.ppd.si.caracterizacao.documentacaoSis = "",
        this.ppd.si.caracterizacao.documentacaoProc = "",
        this.ppd.si.caracterizacao.controlVersaoDProc = "",
        this.ppd.si.caracterizacao.contratoAtivos = "",
        this.ppd.si.caracterizacao.planoRecuperacao = "",
        this.ppd.si.caracterizacao.notas = "",
        this.ppd.si.estrategia.utilizacaoOperacional.idMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoOperacional.fundMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoOperacional.lacunas= ""
        this.ppd.si.estrategia.utilizacaoMemoria.idMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoMemoria.fundMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoMemoria.lacunas= ""*/
        this.dialog= false;
        this.newSistema(sistema,this.ppd.sistemasInfo);
        this.ppd.si.avaliacao.decomposicao = []
        this.ppd.si.avaliacao.sistemasRelacionados = []
        this.$refs.form.reset();//   ver como fazer para conseguir usar isto sem apagar tudo..de modo a deixar os items e assim...
        this.panels = [];
        this.addSI = false;
        this.ppd.si.avaliacao.pcaSI = 0;
        this.ppd.si.avaliacao.destinoSI = "";
        this.ppd.si.avaliacao.selecionadosTabelaFL = [];
        await this.consultaFT();
      } else {
        this.dialog= true;
        this.erroValidacao = true;
      }
    },

  //-------Fonte Legitimacao-------
    consultaFT: async function() {
      try {
        var tipo = this.ppd.fonteLegitimacao.id.split("_");
        if(tipo[0] == 'pgd'){
          var response = await this.$request("get", "/pgd/"+this.ppd.fonteLegitimacao.id);
          //this.classesSI = await prepararClasses(response.data);
          this.classesDaFonteL = response.data[0];
          for (var c of response.data[0]) {
            if(c.pca){
              if(c.codigo){
                this.classesSI.push({info:"Cod: " + c.codigo + " - " + c.titulo , classe:c.classe});
              }
              else{
                this.classesSI.push({info:"Ref: " + c.referencia + " - " + c.titulo , classe:c.classe})
              }
            }
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
          this.consultaFT(this.fonteLegitimacao);
          var child = [];
          var index =  this.ppd.arvore.findIndex(l => l.id === sis.numeroSI);
          //ESTE CASO NUNCA ACONTECE PORQUE NAO SE PODE INSERIR OUTRO SI COM O MESMO ID....
          if(index != -1){
            if(this.ppd.arvore[index].avaliacao.decomposicao.length>0){
              let aux = this.ppd.arvore[index].avaliacao.decomposicao.map(e=> e.numeroSI+"."+e.numeroSub).toString().replaceAll(",","#")
              child = aux.split("#").map(e=> e=({"id": e, "name":e}));
              //alert(child[0]);
            }
          }
          else{
              child = [];
              if(sis.avaliacao.decomposicao.length>0){
                let aux = sis.avaliacao.decomposicao.map(e=> e.numeroSI+"."+e.numeroSub + "-" + e.nomeSub).toString().replaceAll(",","#")
                child = aux.split("#").map(e=> e=({"id": e.split("-")[0], "name":e.split("-").slice(1).toString()}));
                //child.sort();
                child.sort((a,b) => (parseFloat(a.id) > parseFloat(b.id)) ? 1 : ((parseFloat(b.id) > parseFloat(a.id)) ? -1 : 0));
              }
              this.ppd.arvore.push({"id": sis.numeroSI, "name": sis.nomeSI, "titulo": sis.nomeSI, children: child })
              this.ppd.arvore.sort((a,b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : ((parseInt(b.id) > parseInt(a.id)) ? -1 : 0));
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
      var indexArv = this.ppd.arvore.findIndex(e => e.id === sistema.numeroSI);
      //alert("Si id - ",index);
      //alert(index);
      this.ppd.sistemasInfo.splice(index, 1);
      //this.ppd.listaSistemasInfoAuxiliar.splice(index, 1);
      this.ppd.arvore.splice(indexArv,1);
    },

    validarPPD: function(){
      //funçao para confirmar se o ppd esta bem construido
      return 0;
    },

    submeterPPD: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var erros = await this.validarPPD();
          if (erros == 0) {
            var auxPPD = {
              geral: {},
              sistemasInfo: []
            };
            auxPPD.geral = this.ppd.geral;
            auxPPD.sistemasInfo = this.ppd.sistemasInfo;
            var userBD = this.$verifyTokenUser();
            var pedidoParams = {
              tipoPedido: "Criação",
              tipoObjeto: "PPD",
              novoObjeto: auxPPD,
              user: { email: userBD.email },
              entidade: userBD.entidade,
              token: this.$store.state.token,
              historico: await this.criaHistorico()
            };

            var response = await this.$request(
              "post",
              "/pedidos",
              pedidoParams
            );
            if(response.status == '200'){
              this.classeCriada = true;
            }
          } else {
            this.errosValidacao = true;
          }
        }
      } catch (error) {
        console.log("Erro na criação do pedido: " + error);
      }
    },


  },

  created: async function() {
      try{
        this.ppd = this.obj.objeto;
        //this.ppd.listaSistemasInfoAuxiliar = this.ppd.sistemasInfo;
        await this.loadEntidades();
        await this.consultaFT();
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
