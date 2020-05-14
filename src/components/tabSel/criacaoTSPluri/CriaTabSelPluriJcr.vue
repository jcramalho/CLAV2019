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
                <v-col v-if="listaProcessosReady && entSelReady">
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

                <v-btn v-if="stepNo>2" color="primary" @click="submeterTS()">Submeter</v-btn>

                <v-btn
                  v-if="stepNo>2"
                  color="primary"
                  @click="guardarTrabalho()"
                  >Guardar trabalho
                  <DialogPendenteGuardado v-if="pendenteGuardado" :pendente="pendente"/>
                </v-btn>
                <v-btn
                  dark
                  color="red darken-4"
                  @click="eliminarTabela = true"
                  >Sair / Cancelar
                  <DialogCancelar v-if="eliminarTabela" @continuar="eliminarTabela=false"/>
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

export default {
  components: {
    ListaProcessos, DialogPendenteGuardado, DialogCancelar
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {
        designacao: "",
        entidades: [],
        listaProcessos: {}
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
      
      // Pendente criado na BD
      pendente: {},
      // Dialog de confirmação da gravação do Pendente
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
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log("Erro ao carregar os processos: " + err);
      }
    },

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
        this.listaProcessos.procs = this.listaProcessos.procs.filter(p => p.edited);
        this.tabelaSelecao.listaProcessos = this.listaProcessos;
        var pendenteParams = {
          numInterv: 1,
          acao: "Criação",
          tipo: "TS Pluriorganizacional",
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token
        };

        var response = await this.$request(
          "post",
          "/pendentes",
          pendenteParams
        );
        this.pendente = response.data;
        this.pendenteGuardado = true;
      } catch (err) {
        return err;
      }
    },

    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      
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
