<template>
  <v-col>
    <!-- Infobox com os resultados da VALIDAÇÂO -->
    <v-btn 
      v-bind:disabled="c.codigo == ''"
      dark 
      rounded 
      class="ma-2 indigo darken-4" 
      @click="validarClasse">
        Validar classe
    </v-btn>

    <!-- Erros na Validação ....................... -->
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

    <!-- Validação não detetou erros ........... -->
    <v-row justify-center>
      <v-dialog v-model="dialogSemErros" persistent max-width="60%">
        <v-card>
          <v-card-title class="headline">Validação sem erros</v-card-title>
          <v-card-text>
            <p>A informação introduzida não apresenta erros.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="green darken-1 white--text"
              text
              @click="dialogSemErros = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: ["c","original"],
  data() {
    return {
      dialog: false,
      dialogSemErros: false,

      mensagensErro: [],
      numeroErros: 0,

      codeFormats: {
        1: /^[0-9]{3}$/,
        2: /^[0-9]{3}\.[0-9]{2}$/,
        3: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}$/,
        4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/
      },

      formatoCodigo: {
        1: "ddd (d - digito)",
        2: "ddd.dd (d - digito)",
        3: "ddd.dd.ddd (d - digito)",
        4: "ddd.dd.ddd.dd (d - digito)"
      }
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    }
  },

  methods: {
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

    // Valida a informação introduzida e verifica se a classe pode ser criada

    validarClasse: async function() {

      // Codigo: não pode ser alterado

      // Título: não pode ser alterado

      // Descrição: qq valor exceto vazio
      if (this.c.descricao == "") {
        this.mensagensErro.push({
          sobre: "Descrição",
          mensagem: "A descrição não pode ser vazia."
        });
        this.numeroErros++;
      }

      // Notas de Aplicação
      for (let i = 0; i < this.c.notasAp.length; i++) {
          let index = this.original.notasAp.findIndex(x => x.nota === this.c.notasAp[i].nota)
          
          if(index == -1){
              try {
                    var existeNotaAp = await this.$request(
                        "post",
                        "/api/classes/verificarNA",
                        { na: this.c.notasAp[i].nota }
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
      if (this.notaDuplicada(this.c.notasAp)) {
        this.mensagensErro.push({
          sobre: "Nota de Aplicação(" + (i + 1) + ")",
          mensagem: "A última nota encontra-se duplicada."
        });
        this.numeroErros++;
      }

      // Exemplos de notas de Aplicação
      for (let i = 0; i < this.c.exemplosNotasAp.length; i++) {
          let obj = this.original.exemplosNotasAp.find(x => x.exemplo === this.c.exemplosNotasAp[i].exemplo);
          let index = this.original.exemplosNotasAp.indexOf(obj);

          if(index == -1){
            try {
                    var existeExemploNotaAp = await this.$request(
                        "post",
                        "/api/classes/verificarExemploNA",
                        { exemplo: this.c.exemplosNotasAp[i].exemplo }
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
          let obj = this.original.termosInd.find(x => x.termo === this.c.termosInd[i].termo);
          let index = this.original.termosInd.indexOf(obj);

          if(index == -1){
            try {
                    var existeTI = await this.$request(
                        "post",
                        "/api/classes/verificarTI",
                        {ti: this.c.termosInd[i].termo}
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
          this.mensagensErro.push({
            sobre: "PCA (prazo)",
            mensagem: "Tem de indicar o PCA ou preencher o campo da nota."
          });
          this.numeroErros++;
        } else if (this.c.pca.valor < 0 || this.c.pca.valor > 200) {
          this.mensagensErro.push({
            sobre: "PCA (prazo)",
            mensagem: "Prazo fora dos limites."
          });
          this.numeroErros++;
        }
        // PCA: forma e subforma de contagem
        if (this.c.pca.formaContagem == "") {
          this.mensagensErro.push({
            sobre: "PCA (forma de contagem)",
            mensagem: "A forma de contagem não pode ser vazia."
          });
          this.numeroErros++;
        } else if (
          this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
          this.c.pca.subFormaContagem == ""
        ) {
          this.mensagensErro.push({
            sobre: "PCA (subforma de contagem)",
            mensagem:
              'Quando a forma de contagem é "Disposição legal" a subforma não pode ser vazia.'
          });
          this.numeroErros++;
        }
        // DF
        if (
          (!this.c.df.valor || this.c.df.valor == "NE") &&
          this.c.df.notas == ""
        ) {
          this.mensagensErro.push({
            sobre: "DF",
            mensagem: "Tem de indicar o DF ou preencher o campo da nota."
          });
          this.numeroErros++;
        }
      }
      // Com subdivisão
      else if (this.c.nivel == 3 && this.c.temSubclasses4Nivel) {
        var subclasse = {};
        // PCA: prazo
        for (let i = 0; i < this.c.subclasses.length; i++) {
          subclasse = this.c.subclasses[i];
          if (
            (!subclasse.pca.valor || subclasse.pca.valor == "") &&
            subclasse.pca.notas == ""
          ) {
            this.mensagensErro.push({
              sobre: "PCA (prazo) da subclasse " + subclasse.codigo,
              mensagem: "O prazo é de preenchimento obrigatório."
            });
            this.numeroErros++;
          } else if (subclasse.pca.valor < 0 || subclasse.pca.valor > 200) {
            this.mensagensErro.push({
              sobre: "PCA (prazo) da subclasse " + subclasse.codigo,
              mensagem: "O prazo está fora dos limites."
            });
            this.numeroErros++;
          }
          // PCA: forma e subforma de contagem
          if (subclasse.pca.formaContagem == "") {
            this.mensagensErro.push({
              sobre: "PCA (forma de contagem) da subclasse " + subclasse.codigo,
              mensagem: "A forma de contagem não pode ser vazia."
            });
            this.numeroErros++;
          } else if (
            subclasse.pca.formaContagem ==
              "vc_pcaFormaContagem_disposicaoLegal" &&
            subclasse.pca.subFormaContagem == ""
          ) {
            this.mensagensErro.push({
              sobre:
                "PCA (subforma de contagem) da subclasse " + subclasse.codigo,
              mensagem:
                'Quando a forma de contagem é "Disposição legal" a subforma não pode ser vazia.'
            });
            this.numeroErros++;
          }
          // DF
          if (
            (!subclasse.df.valor || subclasse.df.valor == "NE") &&
            subclasse.df.notas == ""
          ) {
            this.mensagensErro.push({
              sobre: "DF",
              mensagem: "Tem de indicar o DF ou preencher o campo da nota."
            });
            this.numeroErros++;
          }
        }
      }
      if (this.numeroErros > 0) {
        this.dialog = true;
      } else {
        this.dialogSemErros = true;
      }
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
