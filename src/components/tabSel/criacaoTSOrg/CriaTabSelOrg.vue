<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Tabela de Seleção</v-toolbar-title
          >
        </v-app-bar>
        <v-card-text class="panel-body">
            <v-stepper v-model="stepNo" vertical>
              <v-stepper-step :complete="stepNo > 1" step="1">
                Identificação da entidade ou tipologia da tabela de seleção:
                <span v-if="stepNo > 1 && tipoTS!='tipologia'">
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ tabelaSelecao.idEntidade.split("_")[1] + ": " + tabelaSelecao.designacaoEntidade }}
                  </v-chip>
                </span>
                <span v-else-if="stepNo > 1 && tipoTS=='tipologia'">
                  <v-chip
                    class="ma-2"
                    color="indigo darken-4"
                    text-color="white"
                    label
                  >
                    <v-icon left>account_balance</v-icon>
                    {{ tabelaSelecao.idTipologia.split("_")[1] + ": " + tabelaSelecao.designacaoTipologia }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content step="1">
                <div v-if="entidadeDGLAB">
                  <v-col>
                        <span class="subtitle-2">Pretende:</span>
                        <v-radio-group v-model="tipoTS" column>
                          <v-radio label="Criar uma Tabela de Seleção para uma entidade" value="entidade"></v-radio>
                          <v-radio label="Criar uma Tabela de Seleção para uma tipologia" value="tipologia"></v-radio>
                        </v-radio-group>

                        <div v-if="tipoTS=='entidade' && entidadesReady">
                          <v-col >
                            <v-autocomplete
                              :items="entidades"
                              label="Selecione a entidade"
                              item-text="label"
                              return-object
                              v-model="ent"
                              prepend-icon="account_balance"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-btn
                            v-if="ent != ''"
                            color="primary"
                            @click="guardaEntidade"
                          >Continuar</v-btn>
                        </div>

                        <div v-if="tipoTS=='tipologia' && tipologiasReady">
                          <v-col>
                            <v-autocomplete
                              :items="tipologias"
                              item-text="label"
                              return-object
                              label="Selecione a tipologia"
                              v-model="tipSel"
                              prepend-icon="account_balance"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-btn
                            color="primary"
                            @click="guardaTipologia"
                          >Continuar</v-btn>
                        </div>
                    </v-col>
                </div>

                <div v-else>
                    <v-col>
                        <span class="subtitle-2">Pretende:</span>
                        <v-radio-group v-model="tipoTS" column>
                          <v-radio label="Criar uma Tabela de Seleção para a minha organização" value="utilizador"></v-radio>
                          <v-radio label="Criar uma Tabela de Seleção para uma tipologia" value="tipologia"></v-radio>
                        </v-radio-group>

                    <div v-if="tipoTS=='utilizador'">
                      <v-btn
                        color="primary"
                        @click="guardaEntidadeUtilizador"
                      >Continuar</v-btn>
                    </div>

                    <div v-if="tipoTS=='tipologia' && tipologiasReady">
                          <v-col>
                            <v-autocomplete
                              :items="tipologias"
                              item-text="label"
                              return-object
                              label="Selecione a tipologia"
                              v-model="tipSel"
                              prepend-icon="account_balance"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-btn
                            color="primary"
                            @click="guardaTipologia"
                          >Continuar</v-btn>
                    </div>

                  </v-col>
                </div>

              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 2" step="2">
                Designação da Tabela de Seleção
                <span v-if="stepNo > 1">
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
                    :placeholder="tabelaSelecao.designacao"
                    v-model="tabelaSelecao.designacao"
                  ></v-text-field>
                </v-flex>
                <v-btn
                  color="primary"
                  @click="
                    stepNo = stepNo + 1;
                    loadProcEspecificos();
                  "
                  >Continuar</v-btn
                >
              </v-stepper-content>

              <v-stepper-step :complete="stepNo > 3" step="3">
                Seleção dos Processos
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-col v-if="listaProcessosReady">
                  <v-card>
                    <v-card-text>
                      <ListaProcessos
                            :listaProcs="listaProcessos"
                            :listaCodigosEsp="listaCodigosEsp"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col v-else>Ainda não foi possível carregar a informação dos Processos...</v-col>
              </v-stepper-content>
            </v-stepper>
        </v-card-text>
        <v-card-actions>
          <!-- Voltar ao passo anterior ............................................-->
          <v-btn v-if="stepNo>2" color="primary" @click="stepNo--;">Voltar</v-btn>

          <!-- Validar a TS ........................................................-->
          <v-btn 
            v-if="stepNo>2" 
            color="primary" 
            @click="validarTS">
              Validar TS
                  
            <DialogValidacaoOK 
              v-if="validacaoTerminada && numeroErros == 0"
              @continuar="fechoValidacao" />

            <DialogValidacaoErros 
                v-if="validacaoTerminada && numeroErros > 0"
                :erros="mensagensErro"
                @continuar="fechoValidacao" />
          </v-btn>

          <!-- Guardar o trabalho para continuar depois ..........................-->
          <v-btn
            v-if="stepNo>2"
            color="primary"
            @click="guardarTrabalho"
            >Guardar trabalho

            <DialogPendenteGuardado 
              v-if="pendenteGuardado" 
              :pendente="pendente"
              @continuar="pendenteGuardado = false"/>
            
          </v-btn>

          <!-- Submeter e criar o pedido ............................................-->
          <v-btn v-if="stepNo>2" color="primary" @click="submeterTS">Submeter</v-btn>

          <!-- Sair da criação da TS sem abortar o processo .........................-->
          <v-btn 
            v-if="stepNo>2" 
            color="primary"
            @click="sairOperacao = true"
            >Sair 
                    
            <DialogSair
              v-if="sairOperacao" 
              @continuar="sairOperacao=false"
              @sair="sair"
            />

          </v-btn>

          <!-- Abortar a criação da TS ..........................................-->
          <v-btn
            dark
            color="red darken-4"
            @click="eliminarTabela = true"
            >Cancelar
                  
              <DialogCancelar 
                v-if="eliminarTabela" 
                @continuar="eliminarTabela=false"
                @sair="abortar"/>
              </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSOrg/ListaProcessos.vue";
import DialogPendenteGuardado from "@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue";
import DialogCancelar from "@/components/tabSel/criacaoTSPluri/DialogCancelar.vue";
import DialogValidacaoOK from "@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue";
import DialogValidacaoErros from "@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue";
import DialogSair from "@/components/tabSel/criacaoTSPluri/DialogSair.vue";

export default {
  components: {
    ListaProcessos, DialogPendenteGuardado, DialogCancelar,
    DialogValidacaoOK, DialogValidacaoErros, DialogSair
  },
  data() {
    return {
      // Objeto da TS
      tabelaSelecao: {
        idEntidade: "",
        designacaoEntidade: "",
        idTipologia: "",
        designacaoTipologia: "",
        designacaoTS: "",
        tipologias: [],
        listaProcessos: {}
      },
      // Numero do passo da criação de TS
      stepNo: null,
      
      entidadeDGLAB: false,
      entidades: [],
      entidadesReady: false,
      ent: "",
      // Estrutura onde se guarda a entidade do utilizador
      entidadeUtilizador: {},
      // Flag de controlo: indica que a TS é para a entidade do utilizador
      tipoTS: "",
      // Flag de controlo: indica se a TS é para uma tipologia
      tipologiaTS: false,
      // Lista de todas as tipologias existentes
      tipologias: [],
      // True quando a lista de tipologias estiver carregada
      tipologiasReady: false,
      // Tipologia ou tipologias selecionadas
      tipSel: [],
      // Lista com todos os processos
      listaProcessos: {},
      // True quando a lista de todos os processos comuns existentes estiver completa
      listaProcessosReady: false,
      // Lista com os códigos dos processos específicos da entidade selecionada
      listaCodigosEsp: [],

      // Tratamento de erros da validação
      mensagensErro: [],
      numeroErros: 0,
      validacaoTerminada: false,
      notasApSet: [],
      exemplosNotasApSet: [],
      termosIndSet: [],

      // Se houver gravações intermédias, há um pendente
      pendente: {},

      // Para o snackbar de pedido criado e trabalho guardado
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false,
      // Dialog de confirmação de abandonar a operação
      sairOperacao: false
    };
  },
  methods: {
    debug: function(obj){
      alert(JSON.stringify(obj));
    },
    // Função que procura o nome da entidade e o id da Entidade associada ao utilizador
    infoUserEnt: async function() {
      var resUser = this.$verifyTokenUser();

      if (resUser.entidade === "ent_DGLAB") {
        this.stepNo = 1;
        await this.loadEntidades();
        this.entidadeDGLAB = true;
      } else {
        var resEnt = await this.$request("get", "/entidades/" + resUser.entidade);
        this.entidadeUtilizador = resEnt.data;
        this.stepNo = 1;
      }
    },
    // Vai à API buscar todas as entidades
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
        this.entidadesReady = true;
      }
        catch (err) {
          console.log("Erro ao recuperar a lista de entidades: " + err);
      }
    },

    guardaEntidade: async function() {
      this.tabelaSelecao.designacao = "Tabela de Seleção de " + this.ent.designacao;
      this.tabelaSelecao.designacaoEntidade = this.ent.designacao;
      this.tabelaSelecao.idEntidade = "ent_" + this.ent.sigla;
      try {
        await this.loadTipologias();
      } catch (e) {
        console.log("Erro ao carregar as tipologias: " + e);
      }
      this.stepNo = this.stepNo + 1;
    },

    guardaTipologia: function() {
      // id e designação
      this.tabelaSelecao.designacao = "Tabela de seleção de " + this.tipSel.designacao;
      this.tabelaSelecao.designacaoTipologia = this.tipSel.designacao;
      this.tabelaSelecao.idTipologia = this.tipSel.id;
      this.stepNo = this.stepNo + 1;
    },

    guardaEntidadeUtilizador: function() {
      // id e designação
      this.tabelaSelecao.designacao = "Tabela de seleção de " + this.entidadeUtilizador.designacao;
      this.tabelaSelecao.designacaoEntidade = this.entidadeUtilizador.designacao;
      this.tabelaSelecao.idEntidade = this.entidadeUtilizador.id;
      this.stepNo = this.stepNo + 1;
    },

    // Vai à API buscar todas as tipologias a que pertence a entidade do utilizador
    loadTipologiasUtilizador: async function() {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
      }
      catch(e){
        console.log("Erro ao carregar as tipologias da entidade do utilizador: " + e);
      }
    },

    // Vai à API buscar todas as tipologias
    loadTipologias: async function() {
      try {
        var response = await this.$request("get", "/tipologias/");
        this.tipologias = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        this.tipologiasReady = true;
      } catch (e) {
        console.log("Erro ao carregar as tipologias: " + e);
      }
    },

    // Carrega apenas as tipologias da entidade selecionada
    loadTipologiasDaEntidade: async function() {
      try {
        // Tipologias onde a entidade se encontra
        var tipologias = await this.$request(
          "get",
          "/entidades/" + this.tabelaSelecao.idEntidade + "/tipologias"
        );
        this.tipSel = tipologias.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + " - " + item.designacao
          };
        });
        // Retira da lista de todas as tipologias as que já pertencem à entidade selecionada
        for (var i = 0; i < this.tipSel.length; i++) {
          var index = this.tipologias.findIndex(
            e => e.id === this.tipSel[i].id
          );
          this.tipologias.splice(index, 1);
        }
      } catch (error) {
        return error;
      }
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

            this.listaProcessos.procs.push(response.data[i]);
            this.listaProcessos.procs[i].chave = i;
            this.listaProcessos.procs[i].edited = false;
            this.listaProcessos.procs[i].descriptionEdited = false;
            this.listaProcessos.procs[i].preSelected = 0;
            // Para poder ser filtrado na tabela
            this.listaProcessos.procs[i].preSelectedLabel = "";
            this.listaProcessos.procs[i].dono = false;
            this.listaProcessos.procs[i].participante = "NP";
          } 
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },

    loadProcessosEspecificos: async function(entidade){
      try{
        var url = "/classes?tipo=especifico&ents=" + entidade.id;
        var response = await this.$request("get", url);
        
        for (let j = 0; j < response.data.length; j++) {
          this.listaCodigosEsp.push(response.data[j].codigo);
        }
        // Marcamos os processos que não são específicos desta entidade como restantes
        var index;
        for(let j = 0; j < this.listaProcessos.procs.length; j++){
          if(this.listaProcessos.procs[j].tipoProc != "Processo Comum"){
            index = this.listaCodigosEsp.indexOf(this.listaProcessos.procs[j].codigo);
            if(index == -1) this.listaProcessos.procs[j].tipoProc = "Processo Restante";
          }
        }
      }
      catch(e){
        console.log("Erro ao calcular os processos específicos das entidades: " + e);
      }
    },

    // Carrega os processos específicos da entidade e das tipologias em causa
    loadProcEspecificos: async function() {
      try {
        if (!this.listaProcEspReady) {
          var url =
            "/classes?tipo=especifico&ents=" + this.tabelaSelecao.idEntidade;
          if (this.tipSel.length || this.tipSel.length) {
            url += "&tips=";
          }
          if (this.tipSel.length) {
            for (var i = 0; i < this.tipSel.length - 1; i++) {
              url += this.tipSel[i].id + ",";
            }
            url += this.tipSel[i].id;
          }
          var response = await this.$request("get", url);
          for (var x = 0; x < response.data.length; x++) {
            if (response.data[x].transversal === "S") {
              this.listaProcEsp.push({
                classe: response.data[x].codigo,
                designacao: response.data[x].titulo,
                dono: false,
                participante: false
              });
            } else {
              this.listaProcEsp.push({
                classe: response.data[x].codigo,
                designacao: response.data[x].titulo,
                dono: true
              });
            }
          }
          this.listaProcEsp.sort((a, b) => (a.classe > b.classe ? 1 : -1));
          return this.listaProcEsp;
        }
      } catch (error) {
        return error;
      }
    },
    
    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(JSON.stringify(this.listaProcessos));
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(p => p.edited);

        var tsObj = {
          entidade: this.tabelaSelecao.idEntidade,
          designacao: this.tabelaSelecao.designacao,
          tipologias: this.tipSel,
          processos: this.tabelaSelecao.listaProcessos.procs
        };

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Organizacional",
          novoObjeto: { ts: tsObj },
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token,
          historico: []
        };

        var codigoPedido = await this.$request("post", "/pedidos", pedidoParams);
        this.$router.push(`/pedidos/novos/${codigoPedido.data}`);
      } catch (error) {
        console.log("Erro ao criar o pedido: " + error);
      }
    },
    // Guarda o trabalho de criação de uma TS
    guardarTrabalho: async function() {
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(JSON.stringify(this.listaProcessos));
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(p => p.edited);

        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Organizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token
        };

        // É preciso testar se há um Pendente criado para não criar um novo
        if(this.pendente._id){
          pendenteParams._id = this.pendente._id;
          pendenteParams.numInterv = this.pendente.numInterv++;
          var response = await this.$request("put", "/pendentes", pendenteParams);
        }
        else{
          pendenteParams.numInterv = 1;
          var response = await this.$request("post", "/pendentes", pendenteParams);
        }

        this.pendente = response.data;
        this.pendenteGuardado = true;
      } catch (e) {
        console.log("Erro ao guardar trabalho: " + e);
      }
    },
    // Elimina todo o trabalho feito até esse momento
    eliminarTS: async function() {
      this.$router.push("/");
    },

    // Valida a TS construída até ao momento
    validarTS: function(){
      return true;
    },

    // Quando a validação termina chama-se esta rotina para fazer reset ao estado da Validação
    fechoValidacao: async function(){
      this.numeroErros = 0;
      this.mensagensErro = [];
      //this.notasApSet = [];
      //this.exemplosNotasApSet = [];
      //this.termosIndSet = [];
      this.validacaoTerminada = false;
    },

    // Abandonar a operação deixando o estado como estiver: se houver pendente não é apagado...
    sair: async function(){
        this.$router.push("/"); 
    },

    // Abortar a operação apagando o pendente se existir
    abortar: async function(){
      if(this.pendente && this.pendente._id){
        try{
          var response = await this.$request("delete", "/pendentes/" + this.pendente._id);
        }
        catch(e){
          console.log("Erro ao eliminar o pendente: " + e);
        }
      }
      this.$router.push("/");
    },

  },
  created: async function() {
    try{
      await this.infoUserEnt();
    }
    catch(e){
      console.log("Erro na recuperação da informação do utilizador: " + e);
    }
    
    try{
      await this.loadTipologias();
    }
    catch(e){
      console.log("Erro no carregamento das tipologias: " + e);
    }

    try{
      await this.loadProcessos();
    }
    catch(e){
      console.log("Erro no carregamento dos processos: " + e);
    }

  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #bac1eb 0, #8c9eff 100%);
}

.info-label {
  color: #1a237e !important;
  padding: 5px;
  font-weight: 400;
  width: auto;
  height: auto;
  background-color: #e8eaf6;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}
</style>
