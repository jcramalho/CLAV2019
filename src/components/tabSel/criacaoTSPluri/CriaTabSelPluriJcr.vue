<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Tabela de Seleção Pluriorganizacional</v-toolbar-title
          >
        </v-app-bar>
        <v-card-text class="panel-body">
          <v-container grid-list-md fluid>
            <v-stepper v-model="stepNo" vertical>
              <v-stepper-step :complete="stepNo > 1" step="1">
                Entidades abrangidas pela TS
                <span v-if="stepNo > 1">
                  <v-chip
                    v-for="(e,i) in entSel" :key="i"
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ e.label }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="1">
                <v-col v-if="entidadesReady">
                  <v-autocomplete
                    v-model="entSel"
                    :items="entidades"
                    item-text="label"
                    placeholder="Selecione as entidades abrangidas pela TS"
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
                <hr style="border-top: 0px" />
                <v-btn
                  color="primary"
                  @click="stepNo = 2; entidadesSelecionadas();"
                  >Continuar</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 2" step="2">
                Designação da Tabela de Seleção
                <span v-if="stepNo > 2">
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    {{ tabelaSelecao.designacao }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="2">
                <v-flex xs12 sm6 md10>
                  <v-text-field
                    placeholder="Designação da Nova Tabela de Seleção"
                    v-model="tabelaSelecao.designacao"
                  ></v-text-field>
                </v-flex>
                <v-btn color="primary" @click="stepNo = 3;"
                  >Continuar</v-btn>
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 3" step="3">
                Seleção dos Processos
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-row wrap v-if="listaProcessosReady && entSelReady">
                  <v-card class="mx-auto">
                    <v-card-title>Selecione os processos</v-card-title>
                    <v-card-text>
                      <ListaProcessos
                            :listaProcs="listaProcessos"
                            :listaCodigosEsp="listaCodigosEsp"
                      />
                    </v-card-text>
                  </v-card>
                </v-row>

                <v-row v-else>
                  <v-col>Ainda não foi possível carregar a informação dos Processos Comuns...</v-col>
                </v-row>
                
                <v-btn color="primary" @click="stepNo = 4;"
                  >Continuar</v-btn>
                <v-btn text @click=" stepNo = 2;"
                  >Voltar</v-btn>
              </v-stepper-content>

              <!--v-stepper-step :complete="stepNo > 7" step="7"
                >Alterações na parte descritiva
                <small>
                  Adicionar, remover ou editar Notas de Aplicação (NA), Exclusão
                  (NE), Exemplos de Notas de Aplicação (ENA) e Termos de Ìndice
                  (TI) nos processos selecionados
                </small>
              </v-stepper-step>
              <v-stepper-content step="7">
                <v-layout wrap>
                  <v-flex>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                          class="expansion-panel-heading"
                        >
                          Lista de processos selecionados
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <ListaParteDescritiva
                            v-if="listaTotalProcSelReady"
                            v-bind:lista="listaTotalProcSel"
                            it="1"
                            @listaTotalSelUpdate="listaTotalSelUpdate($event)"
                          />
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-flex>
                </v-layout>
                <hr style="border-top: 0px" />
                <v-btn color="primary" @click="finalizaUltPasso = true"
                  >Finalizar
                  <v-dialog
                    v-model="finalizaUltPasso"
                    persistent
                    max-width="380"
                  >
                    <v-card>
                      <v-card-title class="title"
                        >Finalizar último passo?</v-card-title
                      >
                      <v-card-text>
                        <p>
                          Chegou ao fim do preenchimento do formulário de
                          criação da TS!
                        </p>
                        <p>
                          Caso pretenda finalizar o mesmo e submeter a TS,
                          selecione "Confirmar". Caso ainda pretenda realizar
                          alguma alteração à TS, clique em "Voltar" e guarde o
                          trabalho.
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red"
                          text
                          @click="finalizaUltPasso = false"
                        >
                          Voltar
                        </v-btn>
                        <v-btn
                          color="primary"
                          text
                          @click="
                            stepNo = 8;
                            finalizaUltPasso = false;
                          "
                        >
                          Confirmar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn>
                <v-btn text @click="stepNo = 4;"
                  >Voltar</v-btn>
              </v-stepper-content-->

              <hr style="border-top: 0px" />

              <v-row align="center" justify="center">
                <v-btn color="primary" v-if="stepNo > 7" @click="submeterTS()"
                  >Submeter</v-btn
                >
                <v-btn
                  color="primary"
                  v-else-if="stepNo >= 1"
                  @click="guardarTrabalho()"
                  >Guardar trabalho
                  <v-dialog v-model="pendenteGuardado" width="60%">
                    <v-card>
                      <v-card-title>Trabalho pendente guardado</v-card-title>
                      <v-card-text>
                        <p>
                          Os seus dados foram guardados para que possa retomar o
                          trabalho mais tarde.
                        </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" dark @click="$router.push('/')"
                          >Fechar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn>
                <v-btn
                  dark
                  text
                  color="red darken-4"
                  @click="eliminarTabela = true"
                  >Cancelar criação
                  <v-dialog v-model="eliminarTabela" persistent max-width="320">
                    <v-card>
                      <v-card-title class="headline"
                        >Eliminar Tabela</v-card-title
                      >
                      <v-card-text>
                        Pretende eliminar todo o trabalho realizado?
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click="eliminarTabela = false">
                          Cancelar
                        </v-btn>
                        <v-btn
                          color="primary"
                          text
                          @click="
                            eliminarTS();
                            eliminarTabela = false;
                          "
                        >
                          Confirmar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn>
              </v-row>
            </v-stepper>
          </v-container>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSPluri/ListaProcessos.vue";

export default {
  components: {
    ListaProcessos
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {
        designacao: "",
        idEntidade: "",
        entidades: [],
        
        parteDescritivaUpdate: {}
      },
      // Numero do passo da criação de TS
      stepNo: 1,
      
      // Lista de todas as entidades existentes
      entidades: [],
      // Lista com as entidades selecionadas
      entSel: [],
      // True quando a lista de entidades estiver carregada
      entidadesReady: false,
      // Passa a true quando o utilizador tiver selecionado todas as entidades no primeiro passo
      entSelReady: false,

      // Flag de controlo do carregamento dos processos
      listaProcessosReady: false,
      // Lista com todos os processos e com a informação necessária à criação da TS
      listaProcessos: {},
      // Lista com os códigos dos processos específicos das entidades selecionadas
      listaCodigosEsp: [],
      
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false
    };
  },

  methods: {
    debug: function(data){
       alert(JSON.stringify(data));
    },

    // Carregamento dos processos
    loadProcessos: async function(){
      try {
        if (!this.listaProcessosReady) {
          this.listaProcessos.numProcessosSelecionados = 0;
          this.listaProcessos.numProcessosPreSelecionados = 0;
          this.listaProcessos.procs = [];
          var response = await this.$request("get", "/classes?nivel=3&info=completa");
          for (let i = 0; i < response.data.length; i++) {
            this.listaProcessos.procs.push({
              chave: i,
              edited: false,
              preSelected: 0,
              tipoProc: response.data[i].tipoProc,
              procTrans: response.data[i].procTrans,
              codigo: response.data[i].codigo,
              titulo: response.data[i].titulo,
              descricao: response.data[i].descricao,
              notasAp: response.data[i].notasAp,
              exemplosNotasAp: response.data[i].exemplosNotasAp,
              notasEx: response.data[i].notasEx,
              termosInd: response.data[i].termosInd
            });
            this.listaProcessos.procs[i].entidades = [];
          } 
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },

    // Função que retira o nome da entidade e o id da Entidade associada ao utilizador do token
    /*infoUserEnt: async function() {
      var resUser = this.$verifyTokenUser();
      this.tabelaSelecao.idEntidade = resUser.entidade;
    },*/
    // Faz load de todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });

        // Carrega a entidade do utilizador nas entidades selecionadas
        /*var resUser = this.$verifyTokenUser();
        debug(resUser);
        var index = this.entidades.findIndex(
          e => e.id === resUser.entidade
        );

        if(index != -1)
          this.entSel.push({
              sigla: resUser.entidade.sigla,
              designacao: resUser.entidade.designacao,
              id: resUser.entidade.id,
              label: resUser.entidade.sigla + " - " + resUser.entidade.designacao
            });
*/
        this.entidadesReady = true;
      }
        catch (err) {
          return err;
      }
    },
    
    // Quando se termina a seleção das entidades
    entidadesSelecionadas: async function(){
      try{
        this.entSel.sort((a, b) => a.designacao > b.designacao ? 1 : -1 );
        this.tabelaSelecao.entidades = this.entSel;
        
        for(let i=0; i < this.listaProcessos.procs.length; i++){
            for(let j=0; j < this.tabelaSelecao.entidades.length; j++){
                this.listaProcessos.procs[i].entidades.push({
                    sigla: this.tabelaSelecao.entidades[j].sigla,
                    designacao: this.tabelaSelecao.entidades[j].designacao,
                    id: this.tabelaSelecao.entidades[j].id,
                    label: this.tabelaSelecao.entidades[j].label,
                    dono: false,
                    participante: "NP"
                });
            }
        }
        await this.loadProcessosEspecificos(this.tabelaSelecao.entidades);
        this.entSelReady = true;
      }
      catch(e){
        console.log("Erro ao fundir as entidades nos processos: " + e);
      }  
    },

    loadProcessosEspecificos: async function(entidades){
      try{
        var url = "/classes?tipo=especifico&ents=";
        for (var i = 0; i < entidades.length-1; i++) {
          url += this.tabelaSelecao.entidades[i].id + ",";
        }
        url += this.tabelaSelecao.entidades[i].id;
        
        var response = await this.$request("get", url);
        
        for (let j = 0; j < response.data.length; j++) {
          this.listaCodigosEsp.push(response.data[j].codigo);
        }
        // Marcamos os processos que não são específicos destas entidades como restantes
        var index;
        for(let j = 0; j < this.listaProcessos.procs.length; j++){
          if(this.listaProcessos.procs[j].tipoProc != "Processo Comum"){
            index = this.listaCodigosEsp.indexOf(this.listaProcessos.procs[j].codigo);
            if(index == -1) this.listaProcessos.procs[j].tipoProc = "PR";
          }
        }
      }
      catch(e){
        console.log("Erro ao calcular os processos específicos das entidades: " + e);
      }
    },

    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      
    },
    
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function() {
      this.$router.push("/");
    }
  },

  created: async function() {
      try{
            //await this.infoUserEnt();
            await this.loadEntidades();
            await this.loadProcessos();
      }
      catch(e){
          console.log('Erro ao carregar a informação inicial: ' + e);
      }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  color: white !important;
  background-color: #1565C0;
}

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
