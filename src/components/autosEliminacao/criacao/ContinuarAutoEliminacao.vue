<template>
  <div>
    <v-card class="ma-4">
      <v-app-bar color="expansion-panel-heading" dark>
        <v-toolbar-title class="card-heading">Continuar Auto de Eliminação</v-toolbar-title>
      </v-app-bar>

      <v-card-text>
        <v-stepper v-model="steps" vertical>
          <v-stepper-step :complete="steps > 1" step="1">
            Seleção de Fonte e Fundo
            <span v-if="steps > 1">
              <v-chip 
                class="ma-2"
                color="indigo darken-4"
                text-color="white"
                label
              >
                <v-icon left>description</v-icon>
                {{ auto.legislacao.split(" - ")[0] }}
              </v-chip>
            </span>
            <span v-if="steps > 1">
              <v-chip 
                v-for="fundo in auto.fundo"
                :key="fundo"
                class="ma-2"
                color="indigo darken-4"
                text-color="white"
                label
              >
                <v-icon left>account_balance</v-icon>
                {{ fundo }}
              </v-chip>
            </span>
          </v-stepper-step>



          <v-stepper-step step="2">Identificação de Classes e Agregações</v-stepper-step>

          <v-stepper-content step="2">
            <!-- Adicionar Zona Controlo -->
            <AdicionarZonaControlo
              v-bind:classes="classes"
              v-bind:entidades="entidades"
              v-bind:auto="auto"
              v-bind:classesCompletas="classesCompletas"
              v-bind:donos="donos"
              v-bind:tipo="tipo"
            />

            <!-- Zonas de Controlo -->
            <ListaZonasControlo
              v-bind:auto="auto"
              v-bind:classes="classes"
              v-bind:entidades="entidades"
              v-bind:classesCompletas="classesCompletas"
              v-bind:donos="donos"
              v-bind:tipo="tipo"
            />

            <div class="mx-2">
              <v-btn
                medium
                color="indigo darken-4"
                dark
                @click="guardarTrabalho"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Guardar Trabalho <v-icon right>save</v-icon></v-btn>
              <v-btn
                medium
                color="indigo darken-4"
                dark
                @click="continuarDepois"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Continuar Depois <v-icon right>save</v-icon></v-btn>
              <v-btn
                medium
                color="indigo darken-4"
                dark
                @click="successDialog=true"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Submeter</v-btn>
              
              <v-btn
                medium
                color="red darken-4"
                dark
                @click="eliminar=true"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Eliminar</v-btn>
            </div>
            
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
    <v-dialog v-model="successDialog" width="950" persistent>
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
          <v-btn color="red darken-4" text @click="successDialog=false">Voltar</v-btn>
          <v-btn color="green darken-4" text @click="successDialog=false; submit()">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="eliminar" width="950" persistent>
      <v-card outlined>
        <v-card-title
          class="warning darken-4 title white--text"
          dark
        >Apagar Auto de Eliminação</v-card-title>

        <v-card-text>
          Esta ação elimina toda a informação do auto de eliminação, tem a certeza que deseja continuar?.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-4" text @click="eliminar=false">Cancelar</v-btn>
          <v-btn color="red darken-4" text @click="eliminar=false; eliminarAE()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      color="success"
      v-model="guardadoSuccess"
      timeout="5000"
    >
      Auto de Eliminação guardado com sucesso! 
      <v-btn
        dark
        text
        @click="guardadoSuccess = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Não foi possível criar o pedido de criação de auto de eliminação</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Trabalho pendente guardado com sucesso -->
    <v-dialog v-model="pendenteGuardado" width="60%">
      <v-card>
        <v-card-title>Trabalho pendente guardado</v-card-title>
        <v-card-text>
          <div>
            <strong>
              Os seus dados foram guardados para que possa retomar o trabalho mais
              tarde.
            </strong>
          </div>

          <v-row v-if="auto.legislacao" class="my-2">
            <v-col cols="2">
              <div class="info-label">Fonte de Legitimação:</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ auto.legislacao }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fundo:</div>
            </v-col>

            <v-col v-if="auto.fundo" class="info-content">
              <div v-for="(f,i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
          <v-row v-if="auto.zonaControlo" class="mt-2">
            <v-col cols="2">
              <div class="info-label">Classes e Agregações:</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="c in auto.zonaControlo" :key="c.codigo">
                {{ c.codigo +" - "+c.titulo }}
                <li
                  class="ml-4"
                  v-for="a in c.agregacoes"
                  :key="a.codigo"
                >{{+a.codigo + " - " + a.titulo}}</li>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" dark @click="$router.push('/')">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import AdicionarZonaControlo from "@/components/autosEliminacao/criacao/AdicionarZonaControlo.vue";
import ListaZonasControlo from "@/components/autosEliminacao/criacao/ListaZonasControlo.vue";
const help = require("@/config/help").help;

export default {
  props: ["obj"],
  components: {
    AdicionarZonaControlo,
    ListaZonasControlo
  },
  data: () => ({
    entidades: [],
    portariaLC: [],
    portaria: [],
    portariaRada: [],
    tabelasSelecao: [],
    tsRada: [],
    classes: [],
    classesCompletas: [],
    auto: {
      legislacao: null,
      fundo: [],
      zonaControlo: []
    },
    tipo: "",
    switchRada: false,
    donos: [],
    apagarAE: false,
    steps: 2,
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
    pendenteGuardado: false,
    pendenteGuardadoInfo: null,
    guardadoSuccess: false,
    eliminar: false,
  }),
  created: async function() {
    try {
      var user = this.$verifyTokenUser();
      let user_entidade = await this.$request(
        "get",
        "/entidades/" + user.entidade
      );

      this.auto.fundo.push(
        user_entidade.data.sigla + " - " + user_entidade.data.designacao
      );

      var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
      this.portariaLC = await this.prepararLeg(response.data);
      var response2 = await this.$request("get", "/pgd");
      this.portaria = await this.prepararLeg(response2.data);
      var response3 = await this.$request("get", "/legislacao?fonte=RADA");
      this.portariaRada = await this.prepararLeg(response3.data);
      this.tabelasSelecao.push("Lista Consolidada")
      var response4 = await this.$request("get","/rada");
      this.tsRada = response4.data

      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response.data);
      
      this.auto = this.obj.objeto;
      this.tipo = this.auto.tipo;
      this.switchRada = this.auto.switchRada;

      this.filtrarDonos()
      this.pendenteID = this.obj._id;
    } catch (e) {
      this.portariaLC = [];
      this.portaria = [];
      this.portariaRada = [];
      this.tabelasSelecao = [];
      this.tsRada = [];
      this.auto = this.obj.objeto;
      this.pendenteID = this.obj._id;
    }
  },
  methods: {
    prepararEntidade: async function(ent) {
      try {
        var myEntidades = [];
        for (var e of ent) {
            myEntidades.push(e.sigla + " - " + e.designacao);
        }
        return myEntidades;
      } catch (error) {
        return [];
      }
    },
    prepararClasses: async function(classes) {
      try {
        var myClasses = [];
        for (var c of classes)
          myClasses.push(c.codigo + " - " + c.titulo);
        return myClasses;
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
            if(indexs==0) myClasses.push(c);
          }
        }
        return myClasses;
      } catch (error) {
        return [];
      }
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
    eliminarAE: async function() {
      this.$request("delete", "/pendentes/" + this.obj._id);
      this.$router.push("/");
    },
    submit: async function() {
      this.erro = ""
      for(var zc of this.auto.zonaControlo) {
        if(zc.destino=="C" && zc.dono.length === 0 && this.tipo!='RADA' && this.tipo!='PGD') {
          this.erroDialog = true;
          this.erro = "Dono do PN não preenchido em " + zc.codigo +" - "+zc.titulo+".\n"
        }
      }
      if(this.erro==="") {
        if(this.tipo=="TS_LC") {
          delete this.auto["legislacao"]
          //Para já apenas LC
          this.auto.referencial = "Lista Consolidada#lc1"
        }
        if(this.tipo=="RADA" && this.switchRada) {
          this.auto.referencial = this.auto.legislacao + "#" + this.auto.referencial
          delete this.auto["legislacao"]

        }
        var user = this.$verifyTokenUser();

        this.auto.responsavel = user.email;
        this.auto.entidade = user.entidade;
        this.auto.tipo = this.tipo;

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "Auto de Eliminação",
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


        this.$request("delete", "/pendentes/" + this.obj._id);
        this.$router.push('/pedidos/submissao')
      }
    },
    guardarTrabalho: async function() {
      try {
        this.obj.numInterv++;
        var cDate = Date.now();

        var pendenteParams = {
          _id: this.obj._id,
          dataAtualizacao: cDate,
          numInterv: this.obj.numInterv,
          acao: this.obj.acao,
          tipo: this.obj.tipo,
          objeto: this.auto,
          criadoPor: this.obj.criadoPor,
          user: {
            token: this.$store.state.token
          }
        };

        var response = await this.$request("put", "/pendentes", pendenteParams);
        this.obj = response.data
        this.guardadoSuccess = true;
      } catch (error) {
        return error;
      }
    },
    continuarDepois: async function() {
      try {
        this.obj.numInterv++;
        var cDate = Date.now();

        var pendenteParams = {
          _id: this.obj._id,
          dataAtualizacao: cDate,
          numInterv: this.obj.numInterv,
          acao: this.obj.acao,
          tipo: this.obj.tipo,
          objeto: this.auto,
          criadoPor: this.obj.criadoPor,
          user: {
            token: this.$store.state.token
          }
        };

        var response = await this.$request("put", "/pendentes", pendenteParams);
        this.pendenteGuardado = true;
        this.pendenteGuardadoInfo = JSON.stringify(response.data);
      } catch (error) {
        return error;
      }
    },
    filtrarDonos: async function() {
      if(typeof this.auto.legislacao != "string") {
        this.auto.referencial = this.auto.legislacao.codigo;
        this.auto.legislacao = this.auto.legislacao.titulo;
      }
      this.donos = this.entidades

      for(var f of this.auto.fundo) {
        this.donos = this.donos.filter(e => !e.includes(f))

        for(var zc of this.auto.zonaControlo) {
          zc.dono = zc.dono.filter(e => !e.includes(f))
        }
      }

      if(this.tipo == "TS_LC") {
        var response = await this.$request(
          "get",
          "/classes?nivel=3&info=completa"
        );
        var response2 = await this.$request(
          "get",
          "/classes?nivel=4&info=completa"
        );
        this.classesCompletas = await this.prepararClassesCompletas(
          response.data,
          response2.data
        );
        this.classes = await this.prepararClasses(this.classesCompletas);
      }
      else if(this.tipo == "PGD" || this.tipo == "PGD_LC" || (this.tipo=="RADA" && !this.switchRada)) {
        var response = await this.$request(
          "get",
          "/legislacao"
        )

        var leg = response.data.filter(l => l.numero == this.auto.legislacao.split(" ")[1])

        if(this.tipo=="PGD") 
          var response2 = await this.$request(
            "get",
            "/pgd/pgd_"+leg[0].id
          )
        else if(this.tipo=="PGD_LC")
          var response2 = await this.$request(
            "get",
            "/pgd/pgd_lc_"+leg[0].id
          )
        else 
          var response2 = await this.$request(
            "get",
            "/pgd/rada/tsRada_"+leg[0].id
          )
        this.classesCompletas = response2.data.filter(c=> c.nivel>2).map(c => {
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
        this.classesCompletas = this.classesCompletas.filter(c => this.validaPCAeDF(c))

        this.classes = this.classesCompletas.map(c => {
            if(c.codigo && c.referencia) return ""+c.codigo+" "+c.referencia+" - "+c.titulo
            else if(c.codigo) return ""+c.codigo+" - "+c.titulo
            else if(c.referencia) return ""+c.referencia+" - "+c.titulo
        })
        
      } else if(this.tipo == "RADA" && this.switchRada) {
        var response = await this.$request(
          "get",
          "/rada/"+this.auto.referencial
        )
        this.classesCompletas = response.data.tsRada.filter(c=> c.df && c.pca).map(c=> {
          return {
            idClasse: c.classes.split("#")[1],
            codigo: c.codigo,
            referencia: c.referencia,
            titulo: c.titulo,
            df: {valor: c.df.df, nota: c.df.notadf},
            pca: {valores: c.pca.pca, notas: c.pca.notaPCA}
          }
        })
        this.classes = this.classesCompletas.map(c => {
          if(c.codigo && c.referencia) return ""+c.codigo+" "+c.referencia+" - "+c.titulo
          else if(c.codigo) return ""+c.codigo+" - "+c.titulo
          else if(c.referencia) return ""+c.referencia+" - "+c.titulo
        })
      }
      else {
        this.classes = [];
        this.classesCompletas = [];
      }
    }
  }
};
</script>

<style>
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
</style>