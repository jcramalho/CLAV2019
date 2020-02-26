<template>
  <div>
    <v-row class="justify-start align-start">
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

      <valida-classe-info-box :c="c" :original="o"/>

      <v-col>
        <v-btn dark rounded class="ma-2 indigo darken-4" @click="alterarClasse">
          Alterar classe
        </v-btn>
      </v-col>
      <v-col>
        <v-btn dark rounded class="ma-2 red darken-4" @click="cancelarAlteracao">
          Cancelar alteração
        </v-btn>
      </v-col>
    </v-row>

    <!-- Erros de Validação .................................... -->
    <v-row justify-center>
    <v-dialog v-model="dialog" width="80%">
      <v-card>
        <v-card-title class="headline">
          Erros detetados na validação: {{ mensagensErro.length }}
        </v-card-title>
        <v-card-text>
          <v-row ma-2 v-for="(m, i) in mensagensErro" :key="i">
            <v-col cols="4">
              <div class="info-label">{{ m.sobre }}</div>
            </v-col>
            <v-col>
              <div class="info-content">{{ m.mensagem }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="red darken-4 white--text"
            rounded
            dark
            @click="dialog = false"
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

    <!-- Pedido de alteração de classe submetido com sucesso ........... -->
    <v-row justify-center>
      <v-dialog v-model="dialogClasseCriada" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">
            Pedido de Alteração de Classe Submetido
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
            <v-btn color="green darken-1" text @click="cancelarAlteracao">
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
import ValidaClasseInfoBox from "@/components/classes/edicao/validaClasseInfoBox.vue";

export default {
  props: ["c", "o", "pendenteId"],
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
      mensagensErro: [],
      errosValidacao: false,
      dialog: false,
      dialogSemErros: false,

      classeOriginal: {},

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
          var userBD = await this.$request(
            "get",
            "/api/users/" + this.$store.state.token + "/token"
          );
          var pendenteParams = {
            numInterv: 1,
            acao: "Alteração",
            tipo: "Classe",
            objeto: this.c,
            criadoPor: userBD.data.email,
            user: { email: userBD.data.email },
            token: this.$store.state.token
          };
          var response = this.$request(
            "post",
            "/api/pendentes",
            pendenteParams
          );
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

    // Valida a informação introduzida e verifica se a classe pode ser alterada

    notaDuplicada: async function(notas) {
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

    validarClasse2: async function() {
      this.numeroErros = 0;

      // Título: não se altera

      // Descrição
      if (this.c.descricao == "") {
        this.mensagensErro.push({
          sobre: "Descrição",
          mensagem: "A descrição não pode ser vazia."
        });
        this.numeroErros++;
      }

      // Notas de Aplicação
      for (let i = 0; i < this.c.notasAp.length; i++) {
          let index = this.o.notasAp.findIndex(x => x.nota === this.c.notasAp[i].nota)
             
          if( index == -1){
              try {
                    var existeNotaAp = await this.$request(
                        "get",
                        "/api/notasAp/notaAp?valor=" +
                        encodeURIComponent(this.c.notasAp[i].nota)
                    );
                    if (existeNotaAp.data) {
                        this.mensagensErro.push({
                            sobre: "Nota de Aplicação(" + (i + 1) + ")",
                            mensagem: "[" + this.c.notasAp[i].nota + "] já existente na BD."
                        });
                        this.numeroErros++;
                    }
                } catch (e) {
                    this.numeroErros++;
                    this.mensagensErro.push({
                        sobre: "Acesso à Ontologia",
                        mensagem: "Não consegui verificar a existência da NotaAp."
                    });
                }
          }
      }
      
      if (await this.notaDuplicada(this.c.notasAp)) {
        this.mensagensErro.push({
          sobre: "Nota de Aplicação(" + (i + 1) + ")",
          mensagem: "A última nota encontra-se duplicada."
        });
        this.numeroErros++;
      }
alert('after dups')
      // Exemplos de notas de Aplicação
      for (let i = 0; i < this.c.exemplosNotasAp.length; i++) {
          let index = this.o.exemplosNotasAp.findIndex(x => x.exemplo === this.c.exemplosNotasAp[i].exemplo)

          if(index == -1){
            try {
                    var existeExemploNotaAp = await this.$request(
                        "get",
                        "/api/exemplosNotasAp/exemploNotaAp?valor=" +
                        encodeURIComponent(this.c.exemplosNotasAp[i].exemplo)
                    );
                    if (existeExemploNotaAp.data) {
                        this.mensagensErro.push({
                            sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
                            mensagem:
                                "[" +
                                this.c.exemplosNotasAp[i].exemplo +
                                "] já existente na BD."
                        });
                        this.numeroErros++;
                    }
            } catch (e) {
                this.numeroErros++;
                this.mensagensErro.push({
                    sobre: "Acesso à Ontologia",
                    mensagem: "Não consegui verificar a existência do exemploNotaAp."
                });
            }
          }
      }
      if (this.exemploDuplicado(this.c.exemplosNotasAp)) {
        this.mensagensErro.push({
          sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
          mensagem: "O último exemplo encontra-se duplicado."
        });
        this.numeroErros++;
      }

      // Notas de Exclusão
      if (this.notaDuplicada(this.c.notasEx)) {
        this.mensagensErro.push({
          sobre: "Nota de Exclusão(" + this.c.notasEx.length + ")",
          mensagem: "A última nota encontra-se duplicada."
        });
        this.numeroErros++;
      }

      // Termos de Índice
      for (let i = 0; i < this.c.termosInd.length; i++) {
          let index = this.o.termosInd.findIndex(x => x.termo === this.c.termosInd[i].termo)

          if(index == -1){
            try {
                    var existeTI = await this.$request(
                        "get",
                        "/api/termosIndice/termoIndice?valor=" +
                          encodeURIComponent(this.c.termosInd[i].termo)
                    );
                    if (existeTI.data) {
                        this.mensagensErro.push({
                            sobre: "Termo de Índice(" + (i + 1) + ")",
                            mensagem:
                                "[" + this.c.termosInd[i].termo + "] já existente na BD."
                        });
                        this.numeroErros++;
                    }
            } catch (e) {
                this.numeroErros++;
                this.mensagensErro.push({
                    sobre: "Acesso à Ontologia",
                    mensagem: "Não consegui verificar a existência do Termo de índice."
                });
            }
          }
      }
      if (this.tiDuplicado(this.c.termosInd)) {
        this.numeroErros++;
        this.mensagensErro.push({
          sobre: "Termo de Índice(" + (i + 1) + ")",
          mensagem: "O último ti encontra-se duplicado."
        });
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
        // PCA: prazo
        for (let i = 0; i < this.c.subclasses.length; i++) {
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

    // Lança o pedido de alteração da classe no worflow

    alterarClasse: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var erros = await this.validarClasse2();
          alert('validei')
          if (erros > 0) {
            this.dialog = true;
          }
          else{
            var userBD = await this.$request(
              "get",
              "/api/users/" + this.$store.state.token + "/token"
            );
            var pedidoParams = {
              tipoPedido: "Alteração",
              tipoObjeto: "Classe",
              novoObjeto: this.c,
              user: { email: userBD.data.email },
              entidade: userBD.data.entidade,
              token: this.$store.state.token
            };

            var response = await this.$request(
              "post",
              "/api/pedidos",
              pedidoParams
            );
            this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
            this.dialogClasseCriada = true;
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

    cancelarAlteracao: function() {
      this.$router.push("/");
    },

    limpaErros: function() {
      this.numeroErros = 0;
      this.mensagensErro = [];
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
