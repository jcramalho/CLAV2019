<template>
  <div>
    <v-row class="justify-start align-start">
      <!-- Guardar trabalho......................... -->
      <v-col>
        <v-btn
          dark
          rounded
          class="ma-2 indigo darken-4"
          @click="guardarTrabalho"
          v-bind:disabled="c.codigo == ''"
        >
          Guardar trabalho
        </v-btn>
      </v-col>

      <valida-classe-info-box :c="c" />

      <!-- Criar classe......................... -->
      <v-col>
        <v-btn
          v-bind:disabled="c.codigo == ''"
          dark
          rounded
          class="ma-2 indigo darken-4"
          @click="criarClasse"
        >
          Criar classe
        </v-btn>
      </v-col>

      <!-- Cancelar criação......................... -->
      <v-col>
        <v-btn
          v-bind:disabled="c.codigo == ''"
          dark
          rounded
          class="ma-2 red darken-4"
          @click="eliminarClasse"
        >
          Cancelar criação
        </v-btn>
      </v-col>
    </v-row>

    <!-- Erros de Validação .................................... -->
    <v-row justify-center>
      <v-dialog v-model="errosValidacao" width="60%">
        <v-card>
          <v-card-title class="headline">
            Erros detetados na validação
          </v-card-title>
          <v-card-text>
            <p>
              Há erros de validação. Selecione "Validar" para ver extamente
              quais e proceder à sua correção.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red darken-4"
              round
              dark
              @click="errosValidacao = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Trabalho pendente guardado com sucesso ........... -->
    <v-row justify-center>
      <v-dialog v-model="pendenteGuardado" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Trabalho pendente guardado
          </v-card-title>
          <v-card-text>
            <p>
              Os seus dados foram guardados para que possa retomar o trabalho
              mais tarde.
            </p>
            <p>{{ pendenteGuardadoInfo }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="criacaoPendenteTerminada"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Pedido de criação de classe submetido com sucesso ........... -->
    <v-row justify-center>
      <v-dialog v-model="dialogClasseCriada" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Pedido de Criação de Classe Submetido
          </v-card-title>
          <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="criacaoClasseTerminada">
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Cancelamento da criação duma classe: confirmação ........... -->
    <v-row justify-center>
      <v-dialog v-model="pedidoEliminado" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Cancelamento e eliminação do pedido de criação de classe
          </v-card-title>
          <v-card-text>
            <p>Selecionou o cancelamento da criação da classe.</p>
            <p>Toda a informação introduzida será eliminada.</p>
            <p>
              Confirme a decisão para ser reencaminhado para a página principal.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cancelarCriacaoClasse">
              Confirmo
            </v-btn>
            <v-btn color="red darken-1" text @click="pedidoEliminado = false">
              Enganei-me, desejo continuar o trabalho
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-snackbar
        v-model="loginErrorSnackbar"
        :timeout="8000"
        color="error"
        :top="true"
      >
        {{ loginErrorMessage }}
        <v-btn text @click="loginErrorSnackbar = false">Fechar</v-btn>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script>
import ValidaClasseInfoBox from "@/components/classes/criacao/validaClasseInfoBox.vue";

export default {
  props: ["c", "pendenteId"],
  components: {
    ValidaClasseInfoBox
  },
  data() {
    return {
      pendenteGuardado: false,
      pendenteGuardadoInfo: "",
      dialogClasseCriada: false,
      pedidoEliminado: false,
      pedidoCriado: false,
      mensagemPedidoCriadoOK: "",
      loginErrorSnackbar: false,
      loginErrorMessage: "Precisa de fazer login para criar a Classe!",
      numeroErros: 0,
      errosValidacao: false,

      codeFormats: {
        1: /^[0-9]{3}$/,
        2: /^[0-9]{3}\.[0-9]{2}$/,
        3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
        4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/
      }
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    }
  },

  methods: {
    // Permite guardar o trabalho para ser retomado depois
    guardarTrabalho: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var userBD = this.$verifyTokenUser();
          var pendenteParams = {
            numInterv: 1,
            acao: "Criação",
            tipo: "Classe",
            objeto: this.c,
            criadoPor: userBD.email,
            user: { email: userBD.email },
            token: this.$store.state.token
          };
          var response = this.$request("post", "/pendentes", pendenteParams);
          this.pendenteGuardado = true;
          this.pendenteGuardadoInfo = JSON.stringify(response.data);
        }
      } catch (error) {
        return error;
      }
    },

    criacaoPendenteTerminada: function() {
      this.$router.push("/");
    },

    // Verifica se o código introduzido pelo utilizador já existe na BD....................

    verificaExistenciaCodigo: async function(codigo) {
      var response = await this.$request(
        "get",
        "/classes/codigo?valor=" + encodeURIComponent(codigo)
      );
      return response.data;
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

    // Valida a classe antes de a criar

    validaClasse: async function() {
      var i = 0,
        numeroErros = 0;

      // Codigo
      if (this.c.codigo) {
        if (this.c.nivel > 1) {
          if (!this.c.pai.codigo) {
            numeroErros++;
          } else {
            if (!this.c.codigo.includes(this.c.pai.codigo)) {
              numeroErros++;
            }
          }
          if (!this.codeFormats[this.c.nivel].test(this.c.codigo)) {
            numeroErros++;
          }
        }
        try {
          var existe = await this.verificaExistenciaCodigo(this.c.codigo);
          if (existe) {
            numeroErros++;
          }
        } catch (e) {
          //console.log("Erro na verificação da existência do código da classe.");
        }
      } else {
        numeroErros++;
      }

      // Título
      if (this.c.titulo == "") {
        numeroErros++;
      } else {
        try {
          alert("Existência de título");
          var existeTitulo = await this.$request(
            "get",
            "/classes/titulo?valor=" + encodeURIComponent(this.c.titulo)
          );
          if (existeTitulo.data) {
            numeroErros++;
          }
        } catch (e) {
          //console.log("Erro na verificação da existência do título da classe.");
        }
      }

      // Descrição
      if (this.c.descricao == "") {
        numeroErros++;
      }

      // Notas de Aplicação
      for (i = 0; i < this.c.notasAp.length; i++) {
        try {
          var existeNotaAp = await this.$request(
            "get",
            "/notasAp/notaAp?valor=" +
              encodeURIComponent(this.c.notasAp[i].nota)
          );
          if (existeNotaAp.data) {
            numeroErros++;
          }
        } catch (e) {
          numeroErros++;
        }
      }
      if (this.notaDuplicada(this.c.notasAp)) {
        numeroErros++;
      }

      // Exemplos de notas de Aplicação
      for (i = 0; i < this.c.exemplosNotasAp.length; i++) {
        try {
          var existeExemploNotaAp = await this.$request(
            "get",
            "/exemplosNotasAp/exemploNotaAp?valor=" +
              encodeURIComponent(this.c.exemplosNotasAp[i].exemplo)
          );
          if (existeExemploNotaAp.data) {
            numeroErros++;
          }
        } catch (e) {
          numeroErros++;
        }
      }
      if (this.exemploDuplicado(this.c.exemplosNotasAp)) {
        numeroErros++;
      }

      // Notas de Exclusão
      if (this.notaDuplicada(this.c.notasEx)) {
        numeroErros++;
      }

      // Termos de Índice
      for (i = 0; i < this.c.termosInd.length; i++) {
        try {
          var existeTI = await this.$request(
            "get",
            "/termosIndice/termoIndice?valor=" +
              encodeURIComponent(this.c.termosInd[i].termo)
          );
          if (existeTI.data) {
            numeroErros++;
          }
        } catch (e) {
          numeroErros++;
        }
      }
      if (this.tiDuplicado(this.c.termosInd)) {
        numeroErros++;
      }

      // Decisões
      // Sem subdivisão
      if (this.c.nivel == 3 && !this.c.temSubclasses4Nivel) {
        // PCA: prazo
        if (
          this.c.pca.valor < 0 ||
          this.c.pca.valor > 200 ||
          (!this.c.pca.valor && this.c.pca.notas == "")
        ) {
          numeroErros++;
        }
        // PCA: forma e subforma de contagem
        if (this.c.pca.formaContagem == "") {
          numeroErros++;
        } else if (
          this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
          this.c.pca.subFormaContagem == ""
        ) {
          numeroErros++;
        }
      }
      // Com subdivisão
      else if (this.c.nivel == 3 && this.c.temSubclasses4Nivel) {
        var subclasse = {};
        // PCA: prazo
        for (i = 0; i < this.c.subclasses.length; i++) {
          subclasse = this.c.subclasses[i];
          if (
            subclasse.pca.valor < 0 ||
            subclasse.pca.valor > 200 ||
            (!subclasse.pca.valor && subclasse.pca.notas == "")
          ) {
            numeroErros++;
          }
          // PCA: forma e subforma de contagem
          if (subclasse.pca.formaContagem == "") {
            numeroErros++;
          } else if (
            subclasse.pca.formaContagem ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            subclasse.pca.subFormaContagem == ""
          ) {
            numeroErros++;
          }
        }
      }
      return numeroErros;
    },

    // Valida a informação introduzida e verifica se a classe pode ser criada

    validarClasse2: async function() {
      var i = 0;
      this.numeroErros = 0;

      // Codigo
      if (this.c.codigo) {
        if (this.c.nivel > 1) {
          if (!this.c.pai.codigo) {
            this.numeroErros++;
          } else {
            if (!this.c.codigo.includes(this.c.pai.codigo)) {
              this.numeroErros++;
            }
          }
          if (!this.codeFormats[this.c.nivel].test(this.c.codigo)) {
            this.numeroErros++;
          }
        }
        try {
          var existe = await this.verificaExistenciaCodigo(this.c.codigo);
          if (existe) {
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
        }
      } else {
        this.numeroErros++;
      }

      // Título
      if (this.c.titulo == "") {
        this.numeroErros++;
      } else {
        try {
          var existeTitulo = await this.$request(
            "get",
            "/classes/titulo?valor=" + encodeURIComponent(this.c.titulo)
          );
          if (existeTitulo.data) {
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
        }
      }

      // Descrição
      if (this.c.descricao == "") {
        this.numeroErros++;
      }

      // Notas de Aplicação
      for (i = 0; i < this.c.notasAp.length; i++) {
        try {
          var existeNotaAp = await this.$request(
            "get",
            "/notasAp/notaAp?valor=" +
              encodeURIComponent(this.c.notasAp[i].nota)
          );
          if (existeNotaAp.data) {
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
        }
      }
      if (this.notaDuplicada(this.c.notasAp)) {
        this.numeroErros++;
      }

      // Exemplos de notas de Aplicação
      for (i = 0; i < this.c.exemplosNotasAp.length; i++) {
        try {
          var existeExemploNotaAp = await this.$request(
            "get",
            "/exemplosNotasAp/exemploNotaAp?valor=" +
              encodeURIComponent(this.c.exemplosNotasAp[i].exemplo)
          );
          if (existeExemploNotaAp.data) {
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
        }
      }
      if (this.exemploDuplicado(this.c.exemplosNotasAp)) {
        this.numeroErros++;
      }

      // Notas de Exclusão
      if (this.notaDuplicada(this.c.notasEx)) {
        this.numeroErros++;
      }

      // Termos de Índice
      for (i = 0; i < this.c.termosInd.length; i++) {
        try {
          var existeTI = await this.$request(
            "get",
            "/termosIndice/termoIndice?valor=" +
              encodeURIComponent(this.c.termosInd[i].termo)
          );
          if (existeTI.data) {
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
        }
      }
      if (this.tiDuplicado(this.c.termosInd)) {
        this.numeroErros++;
      }

      // Decisões
      // Sem subdivisão
      if (this.c.nivel == 3 && !this.c.temSubclasses4Nivel) {
        // PCA: prazo
        if (!this.c.pca.valor && this.c.pca.notas == "") {
          this.numeroErros++;
        } else if (this.c.pca.valor < 0 || this.c.pca.valor > 200) {
          this.numeroErros++;
        }
        // PCA: forma e subforma de contagem
        if (this.c.pca.formaContagem == "") {
          this.numeroErros++;
        } else if (
          this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
          this.c.pca.subFormaContagem == ""
        ) {
          this.numeroErros++;
        }
        // DF
        if (
          (!this.c.df.valor || this.c.df.valor == "NE") &&
          this.c.df.notas == ""
        ) {
          this.numeroErros++;
        }
      }
      // Com subdivisão
      else if (this.c.nivel == 3 && this.c.temSubclasses4Nivel) {
        var subclasse = {};
        
        for (i = 0; i < this.c.subclasses.length; i++) {
          // Unicidade do título
          if(this.c.subclasses.filter(s => s.titulo == this.c.subclasses[i].titulo).length > 1){
            this.mensagensErro.push({
              sobre: "Título da subclasse " + this.c.subclasses[i].codigo,
              mensagem: "Está repetido noutra subclasse."
            });
          }
          // PCA: prazo
          subclasse = this.c.subclasses[i];
          if (!subclasse.pca.valor && subclasse.pca.notas == "") {
            this.numeroErros++;
          } else if (subclasse.pca.valor < 0 || subclasse.pca.valor > 200) {
            this.numeroErros++;
          }
          // PCA: forma e subforma de contagem
          if (subclasse.pca.formaContagem == "") {
            this.numeroErros++;
          } else if (
            subclasse.pca.formaContagem ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            subclasse.pca.subFormaContagem == ""
          ) {
            this.numeroErros++;
          }
          // DF
          if (
            (!subclasse.df.valor || subclasse.df.valor == "NE") &&
            subclasse.df.notas == ""
          ) {
            this.numeroErros++;
          }
        }
      }
      return this.numeroErros;
    },

    // Lança o pedido de criação da classe no worflow

    criarClasse: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var erros = await this.validarClasse2();
          if (erros == 0) {
            var userBD = this.$verifyTokenUser();
            var pedidoParams = {
              tipoPedido: "Criação",
              tipoObjeto: "Classe",
              novoObjeto: this.c,
              user: { email: userBD.email },
              entidade: userBD.entidade,
              token: this.$store.state.token
            };

            var response = await this.$request(
              "post",
              "/pedidos",
              pedidoParams
            );
            this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
            this.dialogClasseCriada = true;
          } else {
            this.errosValidacao = true;
          }
        }
      } catch (error) {
        return error;
      }
    },

    criacaoClasseTerminada: function() {
      this.$router.push("/");
    },

    // Cancela a criação da classe
    eliminarClasse: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoClasse: function() {
      this.$router.push("/");
    }
  }
};
</script>
<style>
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

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
