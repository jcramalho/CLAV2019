<template>
  <div>
    <v-card class="ma-4">
      <v-app-bar color="expansion-panel-heading" dark>
        <v-toolbar-title class="card-heading">Importar Auto de Eliminação</v-toolbar-title>
      </v-app-bar>
      <v-card-text class="panel-body">
        <div class="ma-3">
          A Plataforma CLAV permite a submissão de Autos de Eliminação (AE) através da
          importação de ficheiros. Para tal são disponibilizados dois tipos de formulários que
          devem ser preenchidos previamente offline:
          <li>
            Um formulário para as classes / séries (veja
            <a :href="`${publicPath}documentos/Formulario_auto_importacao_classes_series.csv`" download>aqui</a>)
          </li>
          <li>
            um formulário para as agregações simples / unidades de instalação (veja
            <a :href="`${publicPath}documentos/Formulario_auto_importacao_agregacoes_UI.csv`" download>aqui</a>)
          </li>

          <p>
            Consulte
            <a
              :href="
                    `${publicPath}documentos/Instrucoes_preenchimento_AE_por_submissao.pdf`
                  "
            >aqui</a>
            as instruções de preenchimento.
          </p>
        </div>
        
        <v-stepper v-model="steps" vertical>
          <v-stepper-step :complete="steps > 1" step="1">Seleção de fonte e fundo</v-stepper-step>

          <v-stepper-content step="1">
            <v-row>
              <v-col :md="3">
                <div class="info-label">
                  Fonte de legitimação
                  <InfoBox
                    header="Fonte de Legitimação"
                    :text="myhelp.AutoEliminacao.Campos.FonteLegitimacao"
                    helpColor="indigo darken-4"
                    dialogColor="#E0F2F1"
                  />
                </div>
              </v-col>
              <v-col>
                <v-radio-group row v-model="tipo" :mandatory="true" :disabled="steps > 1">
                  <v-radio value="TS_LC">
                    <template v-slot:label>
                      <div class="mt-2">
                        TS/LC
                        <InfoBox
                          header="Fonte de Legitimação - TS/LC"
                          :text="myhelp.AutoEliminacao.Campos.TS_LC"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="PGD_LC">
                    <template v-slot:label>
                      <div class="mt-2">
                        PGD/LC
                        <InfoBox
                          header="Fonte de Legitimação - PGD/LC"
                          :text="myhelp.AutoEliminacao.Campos.PGD_LC"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="PGD">
                    <template v-slot:label>
                      <div class="mt-2">
                        PGD
                        <InfoBox
                          header="Fonte de Legitimação - PGD"
                          :text="myhelp.AutoEliminacao.Campos.PGD"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="RADA">
                    <template v-slot:label>
                      <div class="mt-2">
                        RADA
                        <InfoBox
                          header="Fonte de Legitimação - RADA"
                          :text="myhelp.AutoEliminacao.Campos.RADA"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="RADA_CLAV">
                    <template v-slot:label>
                      <div class="mt-2">
                        RADA/CLAV
                        <InfoBox
                          header="Fonte de Legitimação - RADA/CLAV"
                          :text="myhelp.AutoEliminacao.Campos.RADA_CLAV"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <div v-if="tipo=='PGD_LC'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portariaLC"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else-if="tipo=='TS_LC'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="tabelasSelecao"
                    return-object
                    item-text="titulo"
                    v-model="auto.legislacao"
                    solo 
                    dense
                  />
                </div>
                <div v-else-if="tipo=='PGD'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portaria"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else-if="tipo=='RADA'">
                  <v-autocomplete
                        label="Selecione a fonte de legitimação"
                        :items="portariaRada"
                        v-model="auto.legislacao"
                        solo
                        dense
                      ></v-autocomplete>
                </div>
                <div v-else>
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="tsRada"
                    item-text="titulo"
                    return-object
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="3">
                <div class="info-label">Fundo</div>
              </v-col>
              <v-col class="mt-2">
                <v-autocomplete
                  deletable-chips
                  label="Selecione a(s) entidade(s) produtora(s) da documentação"
                  :items="entidades"
                  v-model="auto.fundo"
                  solo
                  dense
                  chips
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-btn class="ma-2" color="indigo darken-4" dark @click="filtrarDonos(); steps = 2" :disabled="!auto.legislacao || auto.fundo.length==0">Continuar</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="steps > 2" step="2">Importação dos ficheiros de submissão</v-stepper-step>

          <v-stepper-content step="2">
            <v-row>
              <v-col :md="3">
                <div class="info-label">Ficheiro classes / séries</div>
              </v-col>
              <v-col class="mt-2">
                <input type="file" id="fileSerie" @change="previewFileSerie" />
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="3">
                <div class="info-label">Ficheiro agregações / unidades de instalação</div>
              </v-col>
              <v-col class="mt-2">
                <input type="file" id="fileAgreg" @change="previewFileAgreg" />
              </v-col>
            </v-row>
            
            <v-btn @click="steps=1; cleanFiles()" color="indigo darken-4" dark class="ma-2">Voltar</v-btn>
            <v-btn class="ma-2" color="indigo darken-4" dark @click="converter()" :disabled="!fileSerie" v-if="fileSerie">Validar Ficheiros e Continuar</v-btn>
            <v-btn class="ma-2" color="red darken-4" dark @click="cleanFiles">Limpar</v-btn>
          </v-stepper-content>

          <v-stepper-step step="3">Validação de classes / séries e agregações / unidades de instalação</v-stepper-step>

          <v-stepper-content step="3">
            <ValidarAE 
              :auto="auto" 
              :donos="donos" 
              :submit="submit" 
              :tipo="tipo"
            />
            <v-btn @click="steps = 2; cleanFiles()" color="indigo darken-4" dark class="ma-2">Voltar</v-btn>
            <v-btn
              medium
              color="indigo darken-4"
              dark
              @click="validar"
              :disabled="!fileSerie || !auto.fundo "
              class="ma-2"
            >Validar e Submeter</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
    
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title
          class="teal darken-4 title white--text"
          dark
        >Pedido de importação de auto de eliminação submetido com sucesso</v-card-title>

        <v-card-text>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Codigo do pedido</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ codigoPedido }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fonte de Legitimação</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ auto.legislacao }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fundo</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="(f,i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="2">
              <div class="info-label">Ficheiro de Série</div>
            </v-col>

            <v-col class="info-content">
              <div>Ficheiro em anexo validado com sucesso!</div>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="2">
              <div class="info-label">Ficheiro Agregações / Unidades de Instalação</div>
            </v-col>

            <v-col class="info-content">
              <div>Ficheiro em anexo validado com sucesso!</div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="$router.push('/')">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="valDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title
          class="teal darken-4 title white--text"
          dark
        >Validação de auto de eliminação executada com sucesso</v-card-title>

        <v-card-text>
          Caso pretenda finalizar o mesmo e submeter o Auto de Eliminação, selecione "Confirmar". Caso ainda pretenda realizar alguma alteração ao AE, clique em "Voltar".
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-4" text @click="valDialog=false">Voltar</v-btn>
          <v-btn color="green darken-4" text @click="valDialog=false; submit()">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errosValDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="title" dark>Ficheiros anexo com {{errosVal.numErros}} erros</v-card-title>

        <v-card-text v-if="errosVal.erros">
          <v-row ma-2 v-for="(m, i) in errosVal.erros" :key="i">
            <v-col cols="4">
              <div class="info-label">{{ m.sobre }}</div>
            </v-col>
            <v-col class="info-content">
              <div>{{ m.mensagem }}</div>
              <div></div>
              <div v-if="m.linhasSerie && m.linhasSerie.length>0">
                Erro em ficheiro Classe / Série nas linhas:
                <span v-for="l in m.linhasSerie" :key="l">{{l}};</span>
              </div>
              <div v-if="m.linhasUI && m.linhasUI.length>0">
                Erro em ficheiro Agregações / UI nas linhas:
                <span v-for="l in m.linhasUI" :key="l">{{l}};</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else>
          <div>{{errosVal.msg}}</div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="errosValDialog = false; errosVal.erros=[]; errosVal.numErros=0;">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro no pedido de importação de auto de eliminação</v-card-title>

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
const conversor = require("@/plugins/conversor").csv2Json;
const conversorTS = require("@/plugins/conversor").excel2JsonTS;
const validador = require("@/plugins/conversor").validarCSVs;
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;
import ValidarAE from "@/components/autosEliminacao/importacao/ValidarAutoEliminacao.vue"

export default {
  props: ["entidades"],
  components: {
    InfoBox,
    ValidarAE
  },
  data: () => ({
    classes: [],
    steps: 1,
    codigoPedido: "",
    auto: {
      legislacao: "",
      fundo: [],
      zonaControlo: []
    },
    portariaLC: [],
    portaria: [],
    portariaRada: [],
    tabelasSelecao: [],
    tsRada: [],
    fundo: [],
    donos: [],
    fileSerie: null,
    fileAgreg: null,
    tipo: "TS_LC",
    flagAE: false,
    successDialog: false,
    success: "",
    erroDialog: false,
    erro: "",
    errosValDialog: false,
    errosVal: {
      erros: [],
      numErros: 0
    },
    valDialog: false,
    publicPath: process.env.BASE_URL,
    myhelp: help
  }),
  methods: {
    validar: async function() {
      for(var zc of this.auto.zonaControlo) {
        if(zc.nrAgregacoes ==0 && zc.agregacoes.length==0) {
          this.errosVal.erros.push({
            sobre: "Nº de Agregações",
            mensagem: "O numero de agregações deve ser superior a 0 (zero)"
          })
          this.errosVal.numErros++;
        }
        if(zc.notasPCA && !zc.validaNotaPCA) {
          this.errosVal.erros.push({
            sobre: "Notas do PCA",
            mensagem: "É necessária confirmação de cumprimento da nota do PCA \""+zc.notasPCA+"\""
          })
          this.errosVal.numErros++;
        } 
        if(zc.notaDF && !zc.validaNotaDF) {
          this.errosVal.erros.push({
            sobre: "Nota do DF",
            mensagem: "É necessária confirmação de cumprimento da nota do DF \""+zc.notaDF+"\""
          })
          this.errosVal.numErros++;
        } 
        if((this.tipo=="TS_LC" || this.tipo=="PGD_LC") && zc.destino=="CP" && !zc.validaJustificaDF) {
          for(var just of zc.justificaDF)
            this.errosVal.erros.push({
              sobre: "Notas do PCA",
              mensagem: "É necessária confirmação de cumprimento da justificação do DF \""+just+"\"\n"
            })
            this.errosVal.numErros++;
        } 
        if(!zc.destino || zc.destino=="") {
          this.errosVal.erros.push({
            sobre: "Destino Final",
            mensagem: "Preenchimento incorreto ou não preenchimento na classe " + zc.codigo + " - " + zc.referencia
          })
          this.errosVal.numErros++
        }
        else if((zc.destino=="C" || zc.destino=="Conservação") && this.tipo!="RADA" && this.tipo!="PGD" && zc.dono.length===0) {
          this.errosVal.erros.push({
            sobre: "Dono do PN",
            mensagem: "Preenchimento incorreto ou não preenchimento na classe " + zc.codigo + " - " + zc.referencia
          })
          this.errosVal.numErros++
        }
        var pca = parseInt(zc.prazo) || parseInt(zc.prazoConservacao) || 0;
        var dataInicio = parseInt(zc.dataInicio)
        var currentTime = new Date()

        for(var ag of zc.agregacoes) {
          var dataContagem = parseInt(ag.dataContagem) || 0
          var res1 = pca + dataContagem + 1
          var res2 = dataContagem - dataInicio
          if(res1 > currentTime.getFullYear()) {
            this.errosVal.erros.push({
              sobre: "Data Contagem",
              mensagem: "A Data de Contagem deve ser igual ou inferior à subtração do PCA ao ano corrente. Classe: "+ zc.codigo + " - " + zc.referencia+" - Agregação: "+ag.codigo
            })
            this.errosVal.numErros++
          }
          if(res2 < 0) {
            this.errosVal.erros.push({
              sobre: "Data Contagem",
              mensagem: "A Data de Contagem não pode ser inferior à Data de Início da Classe. Classe: "+ zc.codigo + " - " + zc.referencia+" - Agregação: "+ag.codigo
            })
            this.errosVal.numErros++
          }
        }
      }
      if(this.errosVal.numErros>0) this.errosValDialog = true;
      else this.valDialog = true;
    },
    submit: async function() {
      for(var zc of this.auto.zonaControlo) {
        if(this.tipo=="PGD_LC" || this.tipo=="TS_LC")
          delete zc["referencia"];
        
        if(zc.destino === "Conservação") zc.destino = "C"
        else if(zc.destino === "Eliminação") zc.destino = "E"
        
        for(var ag of zc.agregacoes) 
          if(zc.destino === "C") ag.ni = "Participante"
        
      }

      var user = this.$verifyTokenUser();

      this.auto.responsavel = user.email;
      this.auto.entidade = user.entidade;
      this.auto.tipo = this.tipo;
      var tipo = this.tipo
      if (tipo == "PGD_LC" || tipo == "TS_LC") tipo = tipo.replace(/_/g,"/");
      tipo = "AE " + tipo;

      var pedidoParams = {
        tipoPedido: "Importação",
        tipoObjeto: tipo,
        novoObjeto: this.auto,
        user: { email: user.email },
        entidade: user.entidade,
        token: this.$store.state.token,
        historico: []
      };

      pedidoParams.objetoOriginal = this.auto;
      
      const codigoPedido = await this.$request(
        "post",
        "/pedidos",
        pedidoParams
      );
      
      this.$router.push('/pedidos/submissao/'+codigoPedido.data)

    },
    converter: async function() {
      validador(this.fileSerie, this.fileAgreg, this.tipo)
        .then(() => {
          conversor(this.fileSerie, this.fileAgreg, this.tipo)
            .then(async res => {
              //VERIFICA SE O FICHEIRO DE CLASSES ESTÁ VAZIO
              if(res.auto.zonaControlo.length===0) {
                this.flagAE = true;
                this.erro = "Verificar se preencheu o ficheiro das classes / séries."
              }

              var currentDate = new Date();
              this.auto.zonaControlo = res.auto.zonaControlo;
              if (this.tipo == "TS_LC") {
                //VERIFICA AS CLASSES DA LC
                this.auto.zonaControlo.forEach(zc => {
                  var classe = this.classes.find(
                    elem => elem.codigo == zc.codigo
                  );
                  if (!classe) {
                    this.flagAE = true;
                    this.erro =
                      "<p>A junção de código de classe e número de referência está a ser utilizada como identificador.</p>" +
                      "<p>O código <b>"+ zc.codigo +
                      "</b> introduzido não pertence a nenhuma junção entre código e referência nas classes presentes em "+this.auto.legislacao.split(" - ")[0]+".</p>";
                    return; //ERROS
                  }
                  var pca = classe.pca.valor;
                  if(parseInt(zc.dataInicio) < currentDate.getFullYear() - parseInt(pca)) {
                    this.flagAE = true;
                    this.erro = "A Data de inicio da classe " +
                     zc.codigo
                     +"deve ser inferior à subtração do Prazo de conservação administrativa ao ano corrente."
                    return;
                  }
                  this.auto.referencial = this.auto.legislacao + "#" + this.auto.referencial
                  delete this.auto["legislacao"]

                  delete zc["referencia"];
                  
                  zc.titulo = classe.titulo;
                  zc.prazoConservacao = classe.pca.valores;
                  zc.notasPCA = classe.pca.notas;
                  zc.notaDF = classe.df.nota;
                  if(classe.df.justificacao)
                    zc.justificaDF = classe.df.justificacao.map(just => {return just.conteudo})
                  zc.validaNotaDF = false;
                  zc.validaNotaPCA = false;
                  zc.validaJustificaDF = false;
                  if(zc.agregacoes.length > 0) zc.nrAgregacoes = zc.agregacoes.length;
                  if(classe.df.valor == "E")
                    zc.destino = "Eliminação";
                  else if(classe.df.valor == "C")
                    zc.destino = "Conservação";
                  else zc.destino = classe.df.valor;
                });
              }
              else {
                if(this.tipo == "RADA_CLAV") {
                  this.auto.referencial = this.auto.legislacao + "#" + this.auto.referencial
                  delete this.auto["legislacao"]
                }
                this.auto.zonaControlo.forEach(zc => {
                  var classe = this.classes.find(
                    elem => {
                      var codigo = elem.codigo || ''
                      var referencia = elem.referencial || ''
                      return codigo == zc.codigo && referencia == zc.referencia 
                    }
                  )

                  if (!classe) {
                    this.flagAE = true;
                    if(zc.codigo && zc.referencia) 
                      this.erro =
                        "<p>A junção de código de classe e número de referência está a ser utilizada como identificador.</p>" +
                        "<p>O código <b>"+ zc.codigo + "</b> e Referência <b>"+ zc.referencia +
                        "</b> introduzidos não pertencem a nenhuma junção entre código e referência nas classes presentes em "+this.auto.legislacao.split(" - ")[0]+".</p>";
                    else if(zc.codigo) 
                      this.erro =
                        "<p>A junção de código de classe e número de referência está a ser utilizada como identificador.</p>" +
                        "<p>O código <b>"+ zc.codigo +
                        "</b> introduzido não pertence a nenhuma junção entre código e referência nas classes presentes em "+this.auto.legislacao.split(" - ")[0]+".</p>";
                    else
                      this.erro =
                        "<p>A junção de código de classe e número de referência está a ser utilizada como identificador.</p>" +
                        "<p>A Referência <b>"+ zc.referencia +
                        "</b> introduzida não pertence a nenhuma junção entre código e referência nas classes presentes em "+this.auto.legislacao.split(" - ")[0]+".</p>";
                    return; //ERROS
                  } 
                  else if((this.tipo == "PGD" || this.tipo=="RADA") && classe.df.valor == "C") {
                    this.flagAE = true;
                    this.erro = "Classe / Série com " + (zc.codigo ? "Codigo <b>"+zc.codigo+"</b> " : "") + (zc.referencia ? "Número de referência <b>"+ zc.referencia +"</b> " : "") 
                      + "com destino final de conservação.";
                    return;
                  }
                  
                  var pca = classe.pca.valor;
                  if(parseInt(zc.dataInicio) < currentDate.getFullYear() - parseInt(pca)) {
                    this.flagAE = true;
                    if(zc.codigo && zc.referencia)
                      this.erro = "A Data de inicio da classe " +
                        zc.codigo +" - "+zc.referencia
                        +"deve ser inferior à subtração do Prazo de conservação administrativa ao ano corrente."
                    else if(zc.codigo)
                      this.erro = "A Data de inicio da classe " +
                        zc.codigo
                        +"deve ser inferior à subtração do Prazo de conservação administrativa ao ano corrente."
                    else 
                      this.erro = "A Data de inicio da classe " +
                        zc.referencia
                        +"deve ser inferior à subtração do Prazo de conservação administrativa ao ano corrente."
                    return;
                  }
                  
                  zc.idClasse = classe.idClasse;
                  zc.titulo = classe.titulo;
                  zc.prazoConservacao = classe.pca.valores;
                  zc.notasPCA = classe.pca.notas;
                  zc.notaDF = classe.df.nota;
                  if(classe.df.justificacao)
                    zc.justificaDF = classe.df.justificacao.map(just => {return just.conteudo})
                  zc.validaNotaDF = false;
                  zc.validaNotaPCA = false;
                  zc.validaJustificaDF = false;
                  if(zc.agregacoes.length > 0) zc.nrAgregacoes = zc.agregacoes.length;
                  if(classe.df.valor == "E")
                    zc.destino = "Eliminação";
                  else if(classe.df.valor == "C")
                    zc.destino = "Conservação";
                  else zc.destino = classe.df.valor;
                })
              }
              if (this.flagAE) {
                this.erroDialog = true;
                this.cleanFiles()  
              }
              else this.steps=3;
            })
            .catch(err => {
              this.erro = err;
              this.erroDialog = true;
              this.cleanFiles();
            });
        })
        .catch(err => {
          this.errosVal = err;
          this.errosValDialog = true;
          this.cleanFiles();
        });
    },

    cleanFiles: function () {
      this.fileSerie = null;
      this.fileAgreg = null;
      document.getElementById("fileSerie").value = ""
      document.getElementById("fileAgreg").value = ""
    },

    previewFileSerie: function(ev) {
      const file = ev.target.files[0];
      var fileName = file.name.split(".");
      if (fileName[fileName.length - 1] == "csv") {
        const reader = new FileReader();
        reader.onload = e => (this.fileSerie = e.target.result);
        reader.readAsArrayBuffer(file);
      } else {
        ev.target = null
        this.erro =
          "Por favor verifique se o ficheiro está no formato <strong>.csv</strong>";
        this.erroDialog = true;
        this.fileSerie = null;
      }
    },
    previewFileAgreg: function(ev) {
      const file = ev.target.files[0];
      var fileName = file.name.split(".");
      if (fileName[fileName.length - 1] == "csv") {
        const reader = new FileReader();
        reader.onload = e => (this.fileAgreg = e.target.result);
        reader.readAsArrayBuffer(file);
      } else {
        ev.target = null
        this.erro =
          "Por favor verifique se o ficheiro está no formato <strong>.csv</strong>";
        this.erroDialog = true;
        this.fileAgreg = null;
      }
    },
    validaPCAeDF: function(classe) {
      if((!classe.pca.valores || classe.pca.valores=="NE") && !classe.pca.notas) return false;
      else if((!classe.df.valor || classe.df.valor=="NE") && !classe.df.nota) return false;
      else return true
    },
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push(l.tipo + " " + l.numero + " - " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
    prepararClassesCompletas: async function(classes, nivel4) {
      try {
        var myClasses = [];
        for (var c of classes) {
          if (c.df.valor && c.df.valor !== "NE") myClasses.push(c);
          else {
            var indexs = 0;
            for (var n of nivel4) {
              if (n.codigo.includes(c.codigo)) {
                myClasses.push(n);
                indexs++;
              } else break;
            }
            nivel4.splice(0, indexs);
          }
        }
        return myClasses;
      } catch (error) {
        return [];
      }
    },
    filtrarDonos: async function() {
      if(typeof this.auto.legislacao != "string") {
        this.auto.referencial = this.auto.legislacao.codigo;
        this.auto.legislacao = this.auto.legislacao.titulo;
      }
      this.donos = this.entidades

      for(var f of this.auto.fundo)
        this.donos = this.donos.filter(e => !e.includes(f))

      if(this.tipo == "TS_LC") {
        var response = await this.$request(
          "get",
          "/tabelasSelecao/"+this.auto.referencial
        );
        this.classes = response.data.classes.filter(c=> c.nivel>2).map(c => {
            return {
              idClasse: "c"+c.codigo+"_"+this.auto.referencial,
              nivel: c.nivel,
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: {valor: c.df.valor, nota: c.df.nota || ""},
              pca: {valores: c.pca.valores, notas: c.pca.nota || ""},
            }
          })
        this.classes = this.classes.filter(c => this.validaPCAeDF(c))
        
      }
      else if(this.tipo == "PGD" || this.tipo == "PGD_LC"|| this.tipo=="RADA") {
        var response = await this.$request(
          "get",
          "/legislacao"
        )

        var legAux = this.auto.legislacao.split(" - ")
        legAux = legAux[0].split(" ")
        var indLeg = legAux.length - 1;

        var leg = response.data.filter(l => l.numero == this.auto.legislacao.split(" ")[indLeg])
        
        if(this.tipo=="PGD") 
          var response2 = await this.$request(
            "get",
            "/pgd/pgd_"+leg[0].id
          )
        else  if(this.tipo=="PGD_LC")
          var response2 = await this.$request(
            "get",
            "/pgd/pgd_lc_"+leg[0].id
          )
        else 
          var response2 = await this.$request(
            "get",
            "/rada/old/tsRada_"+leg[0].id
          )
        this.classes = response2.data.filter(c=> c.nivel>2).map(c => {
            return {
              idClasse: c.classe,
              nivel: c.nivel,
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: {valor: c.df, nota: c.notaDF},
              pca: {valores: c.pca, notas: c.notaPCA},
            }
        })
        //if(this.tipo == "PGD" || this.tipo=="RADA") this.classes = this.classes.filter(c=> c.df.valor!="C")

      } else if(this.tipo == "RADA_CLAV") {
        var response = await this.$request(
          "get",
          "/rada/"+this.auto.referencial
        )
        this.classes = response.data.tsRada.filter(c=> c.df && c.pca).map(c=> {
          return {
            idClasse: c.classes.split("#")[1],
            codigo: c.codigo,
            referencia: c.referencia,
            titulo: c.titulo,
            df: {valor: c.df.df, nota: c.df.notadf},
            pca: {valores: c.pca.pca, notas: c.pca.notaPCA}
          }
        })
        this.classes = this.classes.filter(c=> c.df.valor!="C")
      }
      else this.classes = [];

    }
  },
  created: async function() {
    try {
      var user = this.$verifyTokenUser()
      let user_entidade = await this.$request(
        "get",
        "/entidades/" + user.entidade
      );

      this.auto.fundo.push(
        user_entidade.data.sigla +
          " - " +
          user_entidade.data.designacao
      );
      
      var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
      this.portariaLC = await this.prepararLeg(response.data);
      var response2 = await this.$request("get", "/pgd");
      this.portaria = await this.prepararLeg(response2.data);
      var response3 = await this.$request("get", "/legislacao?fonte=RADA");
      this.portariaRada = await this.prepararLeg(response3.data);
      var response5 = await this.$request("get","/tabelasSelecao")
      this.tabelasSelecao = response5.data.map(ts=>{return {
          titulo: ts.designacao,
          codigo: ts.id.split("clav#")[1]
        }
      });
      var response4 = await this.$request("get","/rada");
      this.tsRada = response4.data
    } catch (e) {
      this.portariaLC = [];
      this.portaria = [];
      this.portariaRada = [];
      this.tabelasSelecao = [];
      this.tsRada = [];
    }
  },
  watch: {
    tipo: function() {
      this.auto.legislacao = null;
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
  color: #1a237e; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #696969;
}

.expansion-panel-heading {
  background-color: #1a237e !important;
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
