<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
      <!-- HEADER -->
      <v-col class="py-0 my-0">
        <v-btn
          @click="goBack"
          rounded
          class="white--text mb-6"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
          id="default-button"
        >
          <unicon
            name="arrow-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 37.261"
            fill="#ffffff"
          />
          <p class="ml-2">Voltar</p>
        </v-btn>
        <v-card flat style="border-radius: 10px !important;">
          <p
            class="content-title-1 pt-5"
            style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;"
          >
            Nova Tabela de Seleção Pluriorganizacional
          </p>
          <!-- CONTENT -->
          <v-card-text class="mt-0">
            <v-stepper
              v-model="stepNo"
              id="stepper-card"
              :class="{
                'mx-8': $vuetify.breakpoint.lgAndUp,
                'mx-0': $vuetify.breakpoint.mdAndDown,
              }"
              class=" mt-n3 pa-4"
            >
              <v-stepper-step
                :complete="stepNo > 1"
                step="1"
                :class="{
                  'mt-n12': stepNo > 1,
                }"
              >
                <font
                  size="3"
                  :class="{
                    'mt-12': stepNo > 1,
                  }"
                  class="font-weight-medium"
                  ><b> Entidades abrangidas pela TS</b></font
                >
                <span v-if="stepNo > 1" class="mt-1">
                  <v-chip
                    v-for="(e, i) in entSel"
                    :key="i"
                    class="my-2 mx-4"
                    id="default-chip"
                    text-color="white"
                  >
                    <unicon
                      name="entidade-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.711 21.105"
                      fill="#ffffff"
                      class="mr-3"
                    />
                    {{ e.label }}
                  </v-chip>
                </span>
              </v-stepper-step>
              <v-stepper-content
                step="1"
                class="pt-0"
                :class="{
                  'mx-8': $vuetify.breakpoint.lgAndUp,
                  'mx-0': $vuetify.breakpoint.mdAndDown,
                }"
              >
                <v-col
                  v-if="entidadesReady"
                  :class="{
                    'ma-0 pa-0': $vuetify.breakpoint.mdAndDown,
                  }"
                >
                  <v-form ref="ents" :lazy-validation="false" class="px-4">
                    <v-tooltip top color="info" open-delay="1000">
                      <template v-slot:activator="{ on }">
                        <div
                          class="info-content py-2 pl-6 pr-3 mt-2"
                          style="min-height: 50px;"
                          v-on="on"
                        >
                          <v-autocomplete
                            class="pt-0"
                            v-model="entSel"
                            :items="entidades"
                            :rules="[
                              (v) =>
                                (v && v.length > 1) ||
                                'Tem de escolher pelo menos 2 entidades',
                            ]"
                            item-text="label"
                            placeholder="Selecione as entidades abrangidas pela TS"
                            multiple
                            chips
                            deletable-chips
                            color="blue darken-3"
                            return-object
                          >
                            <template v-slot:selection="data">
                              <v-chip
                                id="default-chip"
                                text-color="white"
                                dark
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="remove(data.item)"
                              >
                                {{ data.item.label }}
                              </v-chip>
                            </template>
                          </v-autocomplete>
                        </div>
                      </template>
                      <span> Entidades abrangidas pela Tabela de Seleção</span>
                    </v-tooltip>
                  </v-form>

                  <v-btn
                    @click="entidadesSelecionadas()"
                    rounded
                    class="white--text mt-10 ml-4"
                    :class="{
                      'px-6': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown,
                    }"
                    color="success darken-1"
                    id="botao-shadow"
                  >
                    <unicon
                      name="continuar-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 37.261"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Continuar</p>
                  </v-btn>
                </v-col>
                <v-col v-else>
                  <v-alert dense type="info">
                    Ainda não foi possível carregar as entidades...
                  </v-alert>
                </v-col>
              </v-stepper-content>
              <v-divider></v-divider>
              <v-stepper-step
                :complete="stepNo > 2"
                step="2"
                :class="{
                  'mt-n12': stepNo > 1,
                }"
              >
                <font
                  size="3"
                  :class="{
                    'mt-12': stepNo > 1,
                  }"
                  class="font-weight-medium"
                  ><b> Designação da Tabela de Seleção</b></font
                >
                <span v-if="stepNo > 2" class="mt-1">
                  <v-chip
                    class="my-2 mx-4"
                    id="default-chip"
                    text-color="white"
                  >
                    <unicon
                      name="ts-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 23.668"
                      fill="#ffffff"
                      class="mr-3"
                    />
                    {{ tabelaSelecao.designacao }}</v-chip
                  >
                </span>
              </v-stepper-step>
              <v-stepper-content
                step="2"
                class="pt-0"
                :class="{
                  'mx-8': $vuetify.breakpoint.lgAndUp,
                  'mx-0': $vuetify.breakpoint.mdAndDown,
                }"
              >
                <v-col
                  :class="{
                    'ma-0 pa-0': $vuetify.breakpoint.mdAndDown,
                  }"
                >
                  <v-form ref="nomeTS" :lazy-validation="false" class="px-4">
                    <span class="subtitle-2 pb-3"
                      >Insira a designação para a tabela:</span
                    >
                    <div
                      class="info-content py-2 pl-6 pr-3 mt-2"
                      style="min-height: 50px;"
                    >
                      <v-tooltip top color="info" open-delay="1000">
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-on="on"
                            class="mt-n3"
                            :rules="[
                              (v) => !!v || 'A designação não pode ser vazia',
                            ]"
                            placeholder="Designação da Nova Tabela de Seleção"
                            v-model="tabelaSelecao.designacao"
                            color="blue darken-3"
                            clearable
                          ></v-text-field>
                        </template>
                        <span> Designação para a tabela de seleção</span>
                      </v-tooltip>
                    </div>
                  </v-form>
                </v-col>
                <v-btn
                  @click="stepNo = 1"
                  rounded
                  class="white--text mt-5 ml-8"
                  :class="{
                    'px-6': $vuetify.breakpoint.lgAndUp,
                    'px-2': $vuetify.breakpoint.mdAndDown,
                  }"
                  style="background-color: rgb(153, 17, 17);"
                  id="botao-shadow"
                >
                  <unicon
                    name="arrow-back-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20.71 37.261"
                    fill="#ffffff"
                  />
                  <p class="ml-2">Retroceder</p>
                </v-btn>
                <v-btn
                  @click="validaTSnome"
                  rounded
                  class="white--text mt-5 ml-4"
                  :class="{
                    'px-6': $vuetify.breakpoint.lgAndUp,
                    'px-2': $vuetify.breakpoint.mdAndDown,
                  }"
                  color="success darken-1"
                  id="botao-shadow"
                >
                  <unicon
                    name="continuar-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20.71 37.261"
                    fill="#ffffff"
                  />
                  <p class="ml-2">Continuar</p>
                </v-btn>
              </v-stepper-content>
              <v-divider></v-divider>

              <v-stepper-step :complete="stepNo > 3" step="3">
                <font size="3"><b> Seleção dos Processos</b></font>
              </v-stepper-step>
              <v-stepper-content step="3">
                <v-col
                  cols="12"
                  v-if="listaProcessosReady && entSelReady"
                  :class="{
                    'px-4': $vuetify.breakpoint.lgAndUp,
                    'ma-0 pa-0': $vuetify.breakpoint.mdAndDown,
                  }"
                >
                  <div
                    class="info-content"
                    style="padding-left: 0 !important; padding-right: 0 !important; min-height: 50px;"
                  >
                    <ListaProcessos
                      :listaProcs="listaProcessos"
                      :listaCodigosEsp="listaCodigosEsp"
                    />
                  </div>
                </v-col>
                <v-col v-else
                  >Ainda não foi possível carregar a informação dos
                  Processos...</v-col
                >
                <v-row class="align-center" style="text-align:center;">
                  <!-- Voltar ao passo anterior ............................................-->
                  <v-col cols="12" md="4" lg="2">
                    <v-btn
                      v-if="stepNo > 2"
                      @click="stepNo--"
                      rounded
                      class="white--text"
                      style="width: 100%; background-color: rgb(153, 17, 17);"
                      id="botao-shadow"
                    >
                      <unicon
                        name="arrow-back-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 37.261"
                        fill="#ffffff"
                      />
                      <p class="ml-2">Retroceder</p>
                    </v-btn>
                  </v-col>
                  <!-- Guardar o trabalho para continuar depois ..........................-->
                  <v-col cols="12" md="4" lg="2">
                    <v-btn
                      v-if="stepNo > 2"
                      @click="guardarTrabalho"
                      rounded
                      class="white--text"
                      :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }"
                      style="width: 100%;"
                      id="default-button"
                    >
                      <unicon
                        name="guardar-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 20.71"
                        fill="#ffffff"
                      />
                      <DialogPendenteGuardado
                        v-if="pendenteGuardado"
                        :pendente="pendente"
                        @continuar="pendenteGuardado = false"
                      />
                      <p class="ml-2">Guardar Trabalho</p>
                    </v-btn>
                  </v-col>
                  <!-- Sair da criação da TS sem abortar o processo .........................-->
                  <v-col cols="12" md="4" lg="2">
                    <v-btn
                      v-if="stepNo > 2"
                      @click="sairOperacao = true"
                      rounded
                      class="white--text"
                      :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }"
                      style="width: 100%;"
                      id="default-button"
                    >
                      <unicon
                        name="relogio-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 20.71"
                        fill="#ffffff"
                      />
                      <DialogSair
                        v-if="sairOperacao"
                        @continuar="sairOperacao = false"
                        @sair="sair"
                      />
                      <p class="ml-2">Continuar Depois</p>
                    </v-btn>
                  </v-col>
                  <!-- Validar a TS ........................................................-->
                  <v-col cols="12" md="4" lg="2">
                    <v-btn
                      v-if="stepNo > 2"
                      @click="validarTS"
                      rounded
                      class="white--text"
                      :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }"
                      style="width: 100%;"
                      id="default-button"
                    >
                      <unicon
                        name="validar-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.709 20.696"
                        fill="#ffffff"
                      />
                      <DialogValidacaoOK
                        v-if="validacaoTerminada && numeroErros == 0"
                        @continuar="fechoValidacao"
                      />

                      <DialogValidacaoErros
                        v-if="validacaoTerminada && numeroErros > 0"
                        :erros="mensagensErro"
                        @continuar="fechoValidacao"
                      />
                      <p class="ml-2">Validar</p>
                    </v-btn>
                  </v-col>
                  <!-- Submeter e criar o pedido ............................................-->
                  <v-col cols="12" md="4" lg="2">
                    <v-btn
                      v-if="stepNo > 2"
                      @click="submeterTS"
                      color="success darken-1"
                      rounded
                      class="white--text"
                      :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }"
                      style="width: 100%;"
                      id="botao-shadow"
                    >
                      <unicon
                        name="adicionar-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 20.71"
                        fill="#ffffff"
                      />
                      <p class="ml-2">Submeter</p>
                    </v-btn>
                  </v-col>

                  <!-- Abortar a criação da TS ..........................................-->
                  <v-col cols="12" md="4" lg="2">
                    <v-btn
                      @click="eliminarTabela = true"
                      color="red darken-4"
                      rounded
                      class="white--text"
                      :class="{
                        'px-8': $vuetify.breakpoint.lgAndUp,
                        'px-2': $vuetify.breakpoint.mdAndDown,
                      }"
                      style="width: 100%;"
                      id="botao-shadow"
                    >
                      <unicon
                        name="eliminar-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 20.71"
                        fill="#ffffff"
                      />
                      <DialogCancelar
                        v-if="eliminarTabela"
                        @continuar="eliminarTabela = false"
                        @sair="abortar"
                      />
                      <p class="ml-2">Eliminar</p>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-stepper-content>
            </v-stepper>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ListaProcessos from '@/components/tabSel/criacaoTSPluri/ListaProcessos.vue';
import DialogPendenteGuardado from '@/components/tabSel/criacaoTSPluri/DialogPendenteGuardado.vue';
import DialogCancelar from '@/components/tabSel/criacaoTSPluri/DialogCancelar.vue';
import DialogValidacaoOK from '@/components/tabSel/criacaoTSPluri/DialogValidacaoOK.vue';
import DialogValidacaoErros from '@/components/tabSel/criacaoTSPluri/DialogValidacaoErros.vue';
import DialogSair from '@/components/tabSel/criacaoTSPluri/DialogSair.vue';

export default {
  components: {
    ListaProcessos,
    DialogPendenteGuardado,
    DialogCancelar,
    DialogValidacaoOK,
    DialogValidacaoErros,
    DialogSair,
  },
  data() {
    return {
      // Objeto Tabela de Seleção
      tabelaSelecao: {
        designacao: '',
        entidades: [],
        listaProcessos: {},
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

      // Tratamento de erros da validação
      mensagensErro: [],
      numeroErros: 0,
      validacaoTerminada: false,
      notasApSet: [],
      exemplosNotasApSet: [],
      termosIndSet: [],

      // Pendente criado na BD
      pendente: {},
      // Dialog de confirmação da gravação do Pendente
      pendenteGuardado: false,
      // Dialog de confirmação de abandonar a operação
      sairOperacao: false,
      // Dialog de confirmação de eliminação de TS
      eliminarTabela: false,
      // Dialog de confirmação finalização de TS
      finalizaUltPasso: false,
    };
  },

  methods: {
    goBack() {
      this.$router.push('/ts/criar');
    },
    remove(item) {
      const index = this.entSel.indexOf(item);
      if (index >= 0) this.entSel.splice(index, 1);
    },
    validaTSnome: function() {
      if (this.$refs.nomeTS.validate()) {
        this.stepNo = 3;
      }
    },
    debug: function(data) {
      alert(JSON.stringify(data));
    },

    // Carregamento dos processos
    loadProcessos: async function() {
      try {
        if (!this.listaProcessosReady) {
          this.listaProcessos.numProcessosSelecionados = 0;
          this.listaProcessos.numProcessosPreSelecionados = 0;
          this.listaProcessos.processosPreSelecionados = 0;
          this.listaProcessos.procs = [];
          var response = await this.$request(
            'get',
            '/classes?nivel=3&info=completa'
          );
          for (let i = 0; i < response.data.length; i++) {
            this.listaProcessos.procs.push(response.data[i]);
            this.listaProcessos.procs[i].chave = i;
            this.listaProcessos.procs[i].edited = false;
            this.listaProcessos.procs[i].descriptionEdited = false;
            this.listaProcessos.procs[i].preSelected = 0;
            // Para poder ser filtrado na tabela
            this.listaProcessos.procs[i].preSelectedLabel = '';
            this.listaProcessos.procs[i].entidades = [];
          }
          // this.listaProcessos.procs.sort((a, b) => (a.proc > b.proc ? 1 : -1));
          this.listaProcessosReady = true;
        }
      } catch (err) {
        console.log('Erro ao carregar os processos: ' + err);
      }
    },

    // Faz load de todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request('get', '/entidades');
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
            label: item.sigla + ' - ' + item.designacao,
          };
        });
        this.entidadesReady = true;
      } catch (err) {
        return err;
      }
    },

    // Quando se termina a seleção das entidades
    entidadesSelecionadas: async function() {
      try {
        if (this.$refs.ents.validate()) {
          this.entSel.sort((a, b) => (a.designacao > b.designacao ? 1 : -1));
          this.tabelaSelecao.entidades = this.entSel;

          for (let i = 0; i < this.listaProcessos.procs.length; i++) {
            for (let j = 0; j < this.tabelaSelecao.entidades.length; j++) {
              this.listaProcessos.procs[i].entidades.push({
                sigla: this.tabelaSelecao.entidades[j].sigla,
                designacao: this.tabelaSelecao.entidades[j].designacao,
                id: this.tabelaSelecao.entidades[j].id,
                label: this.tabelaSelecao.entidades[j].label,
                dono: false,
                participante: 'NP',
              });
            }
          }
          await this.loadProcessosEspecificos(this.tabelaSelecao.entidades);
          this.entSelReady = true;
          this.stepNo = 2;
        }
      } catch (e) {
        console.log('Erro ao fundir as entidades nos processos: ' + e);
      }
    },

    loadProcessosEspecificos: async function(entidades) {
      try {
        var url = '/classes?nivel=3&tipo=especifico&ents=';
        for (var i = 0; i < entidades.length - 1; i++) {
          url += this.tabelaSelecao.entidades[i].id + ',';
        }
        url += this.tabelaSelecao.entidades[i].id;

        var response = await this.$request('get', url);

        for (let j = 0; j < response.data.length; j++) {
          this.listaCodigosEsp.push(response.data[j].codigo);
        }
        // Marcamos os processos que não são específicos destas entidades como restantes
        var index;
        for (let j = 0; j < this.listaProcessos.procs.length; j++) {
          if (this.listaProcessos.procs[j].tipoProc != 'Processo Comum') {
            index = this.listaCodigosEsp.indexOf(
              this.listaProcessos.procs[j].codigo
            );
            if (index == -1)
              this.listaProcessos.procs[j].tipoProc = 'Processo Restante';
          }
        }
      } catch (e) {
        console.log(
          'Erro ao calcular os processos específicos das entidades: ' + e
        );
      }
    },

    // Guarda a estrutura criada até ao momento nos Pendentes
    guardarTrabalho: async function() {
      try {
        var userBD = this.$verifyTokenUser();
        // Guardam-se apenas os processos que foram alterados
        // Ao carregar será preciso fazer Merge com a LC
        // É preciso forçar uma cópia para não perder a lista corrente
        this.tabelaSelecao.listaProcessos = JSON.parse(
          JSON.stringify(this.listaProcessos)
        );
        this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
          (p) => p.edited
        );

        var pendenteParams = {
          acao: 'Criação',
          tipo: 'TS Pluriorganizacional',
          objeto: this.tabelaSelecao,
          criadoPor: userBD.email,
          user: { email: userBD.email },
          token: this.$store.state.token,
        };

        // É preciso testar se há um Pendente criado para não criar um novo
        if (this.pendente._id) {
          pendenteParams._id = this.pendente._id;
          pendenteParams.numInterv = this.pendente.numInterv++;
          var response = await this.$request(
            'put',
            '/pendentes',
            pendenteParams
          );
        } else {
          pendenteParams.numInterv = 1;
          var response = await this.$request(
            'post',
            '/pendentes',
            pendenteParams
          );
        }

        this.pendente = response.data;
        this.pendenteGuardado = true;
      } catch (err) {
        console.log('Erro ao guardar trabalho: ' + err);
      }
    },

    // Lança o pedido de submissão de uma TS
    submeterTS: async function() {
      // É preciso testar se há um Pendente criado para o apagar
      if (this.pendente._id) {
        try {
          var response = await this.$request(
            'delete',
            '/pendentes/' + this.pendente._id
          );
        } catch (e) {
          console.log('Erro ao remover o pendente na submissão da TS: ' + e);
        }
      }

      try {
        //Valida se os processos a selecionar estão todos selecionados
        if (
          this.listaProcessos.numProcessosPreSelecionados -
            this.listaProcessos.processosPreSelecionados !=
          0
        ) {
          this.mensagensErro.push({
            sobre: 'Escolha de processos',

            mensagem: `Ainda tem ${this.listaProcessos
              .numProcessosPreSelecionados -
              this.listaProcessos
                .processosPreSelecionados} processos por selecionar`,
          });
          this.numeroErros++;
          this.validacaoTerminada = true;
        } else {
          var userBD = this.$verifyTokenUser();
          // Guardam-se apenas os processos que foram alterados
          this.tabelaSelecao.listaProcessos = this.listaProcessos;
          this.tabelaSelecao.listaProcessos.procs = this.tabelaSelecao.listaProcessos.procs.filter(
            (p) => p.edited
          );

          var pedidoParams = {
            tipoPedido: 'Criação',
            tipoObjeto: 'TS Pluriorganizacional',
            novoObjeto: this.tabelaSelecao,
            criadoPor: userBD.email,
            user: { email: userBD.email },
            entidade: userBD.entidade,
            token: this.$store.state.token,
            historico: [],
          };

          var response = await this.$request('post', '/pedidos', pedidoParams);
          this.$router.push('/pedidos/submissao/' + response.data);
        }
      } catch (error) {
        console.log('Erro no POST da TS: ' + error);
      }
    },

    sair: async function() {
      this.$router.push('/');
    },

    abortar: async function() {
      if (this.pendente._id) {
        try {
          var response = await this.$request(
            'delete',
            '/pendentes/' + this.pendente._id
          );
        } catch (e) {
          console.log('Erro ao eliminar o pendente: ' + e);
        }
      }
      this.$router.push('/');
    },

    // Funções de validação --------------------------------------
    // Validação da TS
    validarTS: async function() {
      //Valida se os processos a selecionar estão todos selecionados
      if (
        this.listaProcessos.numProcessosPreSelecionados -
          this.listaProcessos.processosPreSelecionados !=
        0
      ) {
        this.mensagensErro.push({
          sobre: 'Escolha de processos',
          mensagem: `Ainda tem ${this.listaProcessos
            .numProcessosPreSelecionados -
            this.listaProcessos
              .processosPreSelecionados} processos por selecionar`,
        });
        this.numeroErros++;
      }
      var processosSelecionados = this.listaProcessos.procs.filter(
        (p) => p.edited
      );
      // Criação das estruturas auxiliares para a validação
      for (let i = 0; i < processosSelecionados.length; i++) {
        this.notasApSet = this.notasApSet.concat(
          processosSelecionados[i].notasAp
        );
        this.exemplosNotasApSet = this.exemplosNotasApSet.concat(
          processosSelecionados[i].exemplosNotasAp
        );
        this.termosIndSet = this.termosIndSet.concat(
          processosSelecionados[i].termosInd
        );
      }
      // Valida-se agora o bloco descritivo
      for (let i = 0; i < processosSelecionados.length; i++) {
        await this.validaBlocoDescritivo(processosSelecionados[i]);
      }
      this.validacaoTerminada = true;
    },

    fechoValidacao: async function() {
      this.numeroErros = 0;
      this.mensagensErro = [];
      this.notasApSet = [];
      this.exemplosNotasApSet = [];
      this.termosIndSet = [];
      this.validacaoTerminada = false;
    },

    validaBlocoDescritivo: async function(p) {
      this.validaDescricao(p);
      this.validaNotasAp(p);
      this.validaExemplosNotasAp(p);
      this.validaNotasEx(p);
      this.validaTIs(p);
    },

    validaDescricao: function(p) {
      // Descrição
      if (p.descricao == '') {
        this.mensagensErro.push({
          sobre: 'Descrição',
          mensagem: 'A descrição não pode ser vazia.',
        });
        this.numeroErros++;
      }
    },

    validaNotasAp: async function(p) {
      var filtradas;
      for (let i = 0; i < p.notasAp.length; i++) {
        filtradas = this.notasApSet.filter((n) => n.nota == p.notasAp[i].nota);

        if (filtradas.length > 1) {
          this.mensagensErro.push({
            sobre:
              'Processo: ' + p.codigo + '; Nota de Aplicação(' + (i + 1) + ')',
            mensagem:
              '[' + p.notasAp[i].nota + '] noutro processo selecionado.',
          });
          this.numeroErros++;
        }
      }
      if (this.notaDuplicada(p.notasAp)) {
        this.mensagensErro.push({
          sobre: 'Nota de Aplicação(' + (i + 1) + ')',
          mensagem: 'A última nota encontra-se duplicada.',
        });
        this.numeroErros++;
      }
    },

    notaDuplicada: function(notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1].nota;
        var duplicados = notas.filter((n) => n.nota == lastNota);
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
        var duplicados = exemplos.filter((e) => e.exemplo == lastExemplo);
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
        var duplicados = termos.filter((t) => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    validaExemplosNotasAp: async function(p) {
      var filtrados;
      for (let i = 0; i < p.exemplosNotasAp.length; i++) {
        filtrados = this.exemplosNotasApSet.filter(
          (e) => e.exemplo == p.exemplosNotasAp[i].exemplo
        );
        if (filtrados.length > 1) {
          this.mensagensErro.push({
            sobre:
              'Processo: ' +
              p.codigo +
              '; Exemplo de nota de Aplicação(' +
              (i + 1) +
              ')',
            mensagem:
              '[' +
              p.exemplosNotasAp[i].exemplo +
              '] noutro processo selecionado.',
          });
          this.numeroErros++;
        }
      }
      if (this.exemploDuplicado(p.exemplosNotasAp)) {
        this.mensagensErro.push({
          sobre: 'Exemplo de nota de Aplicação(' + (i + 1) + ')',
          mensagem: 'O último exemplo encontra-se duplicado.',
        });
        this.numeroErros++;
      }
    },

    validaNotasEx: async function(p) {
      // Notas de Exclusão
      if (this.notaDuplicada(p.notasEx)) {
        this.mensagensErro.push({
          sobre: 'Nota de Exclusão(' + p.notasEx.length + ')',
          mensagem: 'A última nota encontra-se duplicada.',
        });
        this.numeroErros++;
      }
    },

    validaTIs: async function(p) {
      // Termos de Índice
      var filtrados;
      for (let i = 0; i < p.termosInd.length; i++) {
        filtrados = this.termosIndSet.filter(
          (t) => t.termo == p.termosInd[i].termo
        );
        if (filtrados.length > 1) {
          this.mensagensErro.push({
            sobre:
              'Processo: ' + p.codigo + '; Termo de Índice(' + (i + 1) + ')',
            mensagem:
              '[' + p.termosInd[i].termo + '] noutro processo selecionado.',
          });
          this.numeroErros++;
        }
      }
      if (this.tiDuplicado(p.termosInd)) {
        this.numeroErros++;
        this.mensagensErro.push({
          sobre: 'Termo de Índice(' + (i + 1) + ')',
          mensagem: 'O último ti encontra-se duplicado.',
        });
      }
    },
    // ----------Fim da validação ----------------------------
  },

  created: async function() {
    try {
      //await this.infoUserEnt();
      await this.loadEntidades();
      await this.loadProcessos();
    } catch (e) {
      console.log('Erro ao carregar a informação inicial: ' + e);
    }
  },
};
</script>

<style scoped>
#stepper-card {
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);
}
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
