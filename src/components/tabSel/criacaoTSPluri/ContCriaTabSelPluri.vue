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
          
            <v-stepper v-model="stepNo" vertical>
              <v-stepper-step :complete="stepNo > 1" step="1">
                Entidades abrangidas pela TS
                <span v-if="stepNo > 1">
                  <v-chip
                    v-for="(e,i) in tabelaSelecao.entidades" :key="i"
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
                <v-col xs12 sm6 md10>
                  <v-text-field
                    placeholder="Designação da Nova Tabela de Seleção"
                    v-model="tabelaSelecao.designacao"
                  ></v-text-field>
                </v-col>
                <v-btn color="primary" @click="stepNo = 3;"
                  >Continuar</v-btn>
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

              <hr style="border-top: 0px" />

              <v-row align="center" justify="space-around">
              
                <v-btn v-if="stepNo>2" color="primary" @click=" stepNo = 2;">Voltar</v-btn>

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

                <v-btn
                  v-if="stepNo>2"
                  color="primary"
                  @click="guardarTrabalho()"
                  >Guardar trabalho
                  <DialogPendenteGuardado 
                    v-if="pendenteGuardado" 
                    :pendente="pendente"
                    @continuar="pendenteGuardado = false"/>
                </v-btn>

                <v-btn v-if="stepNo>2" color="primary" @click="submeterTS">Submeter</v-btn>

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
              </v-row>
            </v-stepper>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ListaProcessos from "@/components/tabSel/criacaoTSPluri/ListaProcessos.vue";
import DialogPendenteGuardado from "@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue";
import DialogCancelar from "@/components/tabSel/criacaoTSPluri/DialogCancelar.vue";
import DialogValidacaoOK from "@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue";
import DialogValidacaoErros from "@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue";
import DialogSair from "@/components/tabSel/criacaoTSPluri/DialogSair.vue";

export default {
  props: ["obj"],

  components: {
    ListaProcessos, DialogPendenteGuardado, DialogCancelar,
    DialogValidacaoOK, DialogValidacaoErros, DialogSair
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {
        designacao: "",
        entidades: [],
        listaProcessos: {}
      },

      // Fecho Transitivo dos processos
      fechoTransitivo: {},

      // Numero do passo da criação de TS
      stepNo: 2,
      
      // Lista de todas as entidades existentes
      entidades: [],
      // True quando a lista de entidades estiver carregada
      entidadesReady: false,

      // Flag de controlo do carregamento dos processos
      listaProcessosReady: false,
      // Lista com todos os processos e com a informação necessária à criação da TS
      listaProcessos: {},
      // Lista com os códigos dos processos específicos das entidades selecionadas
      listaCodigosEsp: [],

      // Tratamento de erros da validação
      mensagensErro: [],
      numeroErros: 0,
      validacaoTerminada: false,
      
      // Pendente criado na BD
      pendente: {},
      // Dialog de confirmação da gravação do Pendente
      pendenteGuardado: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação de abandonar a operação
      sairOperacao: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false
    };
  },

  created: async function() {
      this.pendente = this.obj;
      this.tabelaSelecao = this.obj.objeto;
      try{
            await this.loadFechoTransitivo();
            await this.loadProcessos();
            await this.entidadesSelecionadas();
            await this.loadProcessosEspecificos(this.tabelaSelecao.entidades);
            // Merge com os processos que já estavam selecionados
            var index;
            for(let i=0; i < this.tabelaSelecao.listaProcessos.procs.length; i++){
                index = this.listaProcessos.procs.findIndex(p => p.codigo == this.tabelaSelecao.listaProcessos.procs[i].codigo);
                if(index != -1){
                    this.listaProcessos.procs[index] = this.tabelaSelecao.listaProcessos.procs[i];
                    this.acrescentaFecho(this.listaProcessos.procs[index]);
                }
            }
            this.listaProcessos.numProcessosSelecionados = this.tabelaSelecao.listaProcessos.numProcessosSelecionados;
            this.listaProcessosReady = true;
        }
      catch(e){
          console.log('Erro ao carregar a informação inicial: ' + e);
      }
      
  },

  methods: {
    debug: function(data){
       alert(JSON.stringify(data));
    },

    // Faz a pré-seleção do fecho transitivo dos processos já selecionados
    acrescentaFecho: function(processo) {
        var fecho = this.fechoTransitivo[processo.codigo];
        for(let i=0; i < fecho.length; i++){
          var index = this.listaProcessos.procs.findIndex(p => p.codigo == fecho[i]);
          if(index != -1){
            this.listaProcessos.procs[index].preSelected ++;
            if(this.listaProcessos.procs[index].preSelected == 1) {
              this.listaProcessos.numProcessosPreSelecionados++;
              this.listaProcessos.procs[index].preSelectedLabel = "Pré-Selecionado";
            }
          } 
        }
    },

    loadFechoTransitivo: async function(){
        try{
            var response = await this.$request("get", "/travessiaV2");
            this.fechoTransitivo = response.data;
        }
        catch(e){
            console.log("Erro ao carregar o fecho transitivo: " + e);
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
            this.listaProcessos.procs[i].entidades = [];
          } 
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },
    
    // Quando se termina a seleção das entidades
    entidadesSelecionadas: async function(){
      try{
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
            if(index == -1) this.listaProcessos.procs[j].tipoProc = "Processo Restante";
          }
        }
      }
      catch(e){
        console.log("Erro ao calcular os processos específicos das entidades: " + e);
      }
    },

    // Guarda a estrutura criada até ao momento nos Pendentes
    guardarTrabalho: async function(){
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(JSON.stringify(this.listaProcessos));
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(p => p.edited);

        var pendenteParams = {
          acao: "Criação",
          tipo: "TS Pluriorganizacional",
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
      } catch (err) {
        console.log("Erro ao guardar trabalho: " + err);
      }
    },

    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      // É preciso testar se há um Pendente criado para o apagar
      if(this.pendente._id){
          try{
            var response = await this.$request("delete", "/pendentes/" + this.pendente._id);
          }
          catch(e){
            console.log("Erro ao remover o pendente na submissão da TS: " + e);
          }
      }
      
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        this.tabelaSelecao.listaProcessos = this.listaProcessos;
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(p => p.edited);

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "TS Pluriorganizacional",
          novoObjeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          entidade: userBD.entidade,
          token: this.$store.state.token
        };

        var response = await this.$request("post", "/pedidos", pedidoParams);
        alert(JSON.stringify(response.data));
        this.$router.push("/pedidos/submissao");
      } catch (error) {
        console.log("Erro no POST da TS: " + error);
      }
    },

    sair: async function(){
        this.$router.push("/"); 
    },

    abortar: async function(){
      try{
        if(this.pendente._id){
          var response = await this.$request("delete", "/pendentes/" + this.pendente._id);
        }
        this.$router.push("/");
      }
      catch(e){
        console.log("Erro ao eliminar o pendente: " + e);
      }
    },

    // Funções de validação --------------------------------------
    // Validação da TS
    validarTS: async function(){
      var processosSelecionados = this.listaProcessos.procs.filter(p => p.edited);
      // Criação das estruturas auxiliares para a validação
      for(let i = 0; i < processosSelecionados.length; i++){
        this.notasApSet = this.notasApSet.concat(processosSelecionados[i].notasAp);
        this.exemplosNotasApSet = this.exemplosNotasApSet.concat(processosSelecionados[i].exemplosNotasAp);
        this.termosIndSet = this.termosIndSet.concat(processosSelecionados[i].termosInd);
      }
      // Valida-se agora o bloco descritivo
      for(let i = 0; i < processosSelecionados.length; i++){
        await this.validaBlocoDescritivo(processosSelecionados[i]);
      }
      this.validacaoTerminada = true;
    },

    fechoValidacao: function(){
      this.validacaoTerminada = false;
      this.numeroErros = 0;
      this.mensagensErro = [];
    },

    validaBlocoDescritivo: async function(p){
      this.validaDescricao(p);
      this.validaNotasAp(p);
      this.validaExemplosNotasAp(p);
      this.validaNotasEx(p);
      this.validaTIs(p);
    },

    validaDescricao: function(p){
      // Descrição
      if (p.descricao == "") {
        this.mensagensErro.push({
          sobre: "Descrição",
          mensagem: "A descrição não pode ser vazia."
        });
        this.numeroErros++;
      }
    },

    validaNotasAp: async function(p){
      var filtradas;
      for (let i = 0; i < p.notasAp.length; i++) {
        filtradas = this.notasApSet.filter(n => n.nota == p.notasAp[i].nota);
          
          if (filtradas.length > 1) {
            this.mensagensErro.push({
              sobre: "Nota de Aplicação(" + (i + 1) + ")",
              mensagem: "[" + p.notasAp[i].nota + "] já existente na BD."
            });
            this.numeroErros++;
          }
      }
      if (this.notaDuplicada(p.notasAp)) {
        this.mensagensErro.push({
          sobre: "Nota de Aplicação(" + (i + 1) + ")",
          mensagem: "A última nota encontra-se duplicada."
        });
        this.numeroErros++;
      }
    },

    notaDuplicada: function(notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1].nota;
        var duplicados = notas.filter(n => n.nota == lastNota);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    exemploDuplicado: function(exemplos) {
      if (exemplos.length > 1) {
        var lastExemplo = exemplos[exemplos.length - 1].exemplo;
        var duplicados = exemplos.filter(e => e.exemplo == lastExemplo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    tiDuplicado: function(termos) {
      if (termos.length > 1) {
        var lastTermo = termos[termos.length - 1].termo;
        var duplicados = termos.filter(t => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    validaExemplosNotasAp: async function(p){
      var filtrados;
      for (let i = 0; i < p.exemplosNotasAp.length; i++) {
        filtrados = this.exemplosNotasApSet.filter(e => e.exemplo == p.exemplosNotasAp[i].exemplo);
        if (filtrados.length > 1) {
            this.mensagensErro.push({
              sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
              mensagem: "[" + p.exemplosNotasAp[i].exemplo + "] já existente na BD."
            });
            this.numeroErros++;
          }
      }
      if (this.exemploDuplicado(p.exemplosNotasAp)) {
        this.mensagensErro.push({
          sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
          mensagem: "O último exemplo encontra-se duplicado."
        });
        this.numeroErros++;
      }
    },

    validaNotasEx: async function(p){
      // Notas de Exclusão
      if (this.notaDuplicada(p.notasEx)) {
        this.mensagensErro.push({
          sobre: "Nota de Exclusão(" + p.notasEx.length + ")",
          mensagem: "A última nota encontra-se duplicada."
        });
        this.numeroErros++;
      }
    },

    validaTIs: async function(p){
      // Termos de Índice
      var filtrados;
      for (let i = 0; i < p.termosInd.length; i++) {
        filtrados = this.termosIndSet.filter(t => t.termo == p.termosInd[i].termo);
        if (filtrados.length > 1) {
          this.mensagensErro.push({
              sobre: "Termo de Índice(" + (i + 1) + ")",
              mensagem:
                "[" + p.termosInd[i].termo + "] já existente na BD."
          });
          this.numeroErros++;
        }
      }
      if (this.tiDuplicado(p.termosInd)) {
        this.numeroErros++;
        this.mensagensErro.push({
          sobre: "Termo de Índice(" + (i + 1) + ")",
          mensagem: "O último ti encontra-se duplicado."
        });
      }
    }
    // ----------Fim da validação ----------------------------
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
