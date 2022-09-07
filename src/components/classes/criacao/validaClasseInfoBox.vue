<template>
  <v-col>
    <!-- Infobox com os resultados da VALIDAÇÂO -->
    <v-btn
      v-bind:disabled="c.codigo == ''"
      dark
      rounded
      class="ma-2 indigo darken-4"
      @click="validarClasse"
    >
      Validar
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
          <v-btn class="red darken-4 white--text" rounded dark @click="dialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Validação não detetou erros ........... -->
    <v-dialog v-model="dialogSemErros" persistent max-width="60%">
      <v-card>
        <v-card-title class="headline">Validação sem erros</v-card-title>
        <v-card-text>
          <p>A informação introduzida não apresenta erros.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green darken-1 white--text" text @click="dialogSemErros = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  props: ["c"],
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
        4: /^[0-9]{3}\.[0-9]{2}\.[0-9]{3}\.[0-9]{3}$/,
      },

      formatoCodigo: {
        1: "ddd (d - digito)",
        2: "ddd.dd (d - digito)",
        3: "ddd.dd.ddd (d - digito)",
        4: "ddd.dd.ddd.dd (d - digito)",
      },
    };
  },

  watch: {
    dialog: function (val) {
      if (!val) this.limpaErros();
    },
  },

  methods: {
    notaDuplicada: function (notas) {
      if (notas.length > 1) {
        var lastNota = notas[notas.length - 1].nota;
        lastNota = lastNota.trim();
        var duplicados = notas.filter((n) => n.nota == lastNota);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    exemploDuplicado: function (exemplos) {
      if (exemplos.length > 1) {
        var lastExemplo = exemplos[exemplos.length - 1].exemplo;
        lastExemplo = lastExemplo.trim();
        var duplicados = exemplos.filter((e) => e.exemplo == lastExemplo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    tiDuplicado: function (termos) {
      if (termos.length > 1) {
        var lastTermo = termos[termos.length - 1].termo;
        lastTermo = lastTermo.trim();
        var duplicados = termos.filter((t) => t.termo == lastTermo);
        if (duplicados.length > 1) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },

    // Verifica se o código introduzido pelo utilizador já existe na BD....................

    verificaExistenciaCodigo: async function (codigo) {
      var response = await this.$request(
        "get",
        "/classes/codigo?valor=" + encodeURIComponent(codigo)
      );
      return response.data;
    },

    // Valida a informação introduzida e verifica se a classe pode ser criada

    validaCodigo: async function () {
      // Codigo
      if (this.c.codigo) {
        if (this.c.nivel > 1) {
          if (!this.c.pai.codigo) {
            this.mensagensErro.push({
              sobre: "Código do Pai",
              mensagem: "Para classes de níveis superiores a 1 deve especificar um pai.",
            });
            this.numeroErros++;
          } else {
            if (!this.c.codigo.includes(this.c.pai.codigo)) {
              this.mensagensErro.push({
                sobre: "Código",
                mensagem: "O código do pai deve ser prefixo do código da classe.",
              });
              this.numeroErros++;
            }
          }
          // if (!this.codeFormats[this.c.nivel].test(this.c.codigo)) {
          //   this.mensagensErro.push({
          //     sobre: "Código",
          //     mensagem:
          //       "Formato de código inválido! Deve ser: " +
          //       this.formatoCodigo[this.c.nivel]
          //   });
          //   this.numeroErros++;
          // }
        }
        try {
          if (!this.codeFormats[this.c.nivel].test(this.c.codigo)) {
            this.mensagensErro.push({
              sobre: "Código",
              mensagem:
                "Formato de código inválido! Deve ser: " +
                this.formatoCodigo[this.c.nivel],
            });
            this.numeroErros++;
          }
          var existe = await this.verificaExistenciaCodigo(this.c.codigo);
          if (existe) {
            this.mensagensErro.push({
              sobre: "Código",
              mensagem: "Código já existente na base de dados...",
            });
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência do código.",
          });
        }
      } else {
        this.mensagensErro.push({
          sobre: "Código",
          mensagem: "O código da classe não foi especificado.",
        });
        this.numeroErros++;
      }
    },

    validaTitulo: async function () {
      // Título
      if (this.c.titulo == "") {
        this.mensagensErro.push({
          sobre: "Título",
          mensagem: "O título não pode ser vazio.",
        });
        this.numeroErros++;
      } else {
        try {
          var existeTitulo = await this.$request(
            "get",
            "/classes/titulo?valor=" + encodeURIComponent(this.c.titulo)
          );
          if (existeTitulo.data) {
            this.mensagensErro.push({
              sobre: "Título",
              mensagem: "Título já existente na BD.",
            });
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência do título.",
          });
        }
      }
    },

    validaMeta: async function () {
      await this.validaCodigo();
      await this.validaTitulo();
    },

    validaDescricao: function () {
      // Descrição
      if (this.c.descricao == "") {
        this.mensagensErro.push({
          sobre: "Descrição",
          mensagem: "A descrição não pode ser vazia.",
        });
        this.numeroErros++;
      }
    },

    validaNotasAp: async function () {
      // Notas de Aplicação
      if(this.c.notasAp.length > 0){
        console.log(JSON.stringify(this.c.notasAp))
        this.c.notasAp = this.c.notasAp.map(function(n){ 
          n.nota = n.nota.trim();
          return n;});
      }
      for (var i = 0; i < this.c.notasAp.length; i++) {
        try {
          var existeNotaAp = await this.$request(
            "get",
            "/notasAp/notaAp?valor=" + encodeURIComponent(this.c.notasAp[i].nota)
          );
          if (existeNotaAp.data) {
            this.mensagensErro.push({
              sobre: "Nota de Aplicação(" + (i + 1) + ")",
              mensagem: "[" + this.c.notasAp[i].nota + "] já existente na BD.",
            });
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da NotaAp.",
          });
        }
      }
      if (this.notaDuplicada(this.c.notasAp)) {
        this.mensagensErro.push({
          sobre: "Nota de Aplicação(" + (i + 1) + ")",
          mensagem: "A última nota encontra-se duplicada.",
        });
        this.numeroErros++;
      }
    },

    validaExemplosNotasAp: async function () {
      // Exemplos de notas de Aplicação
      if(this.c.exemplosNotasAp.length > 0){
        this.c.exemplosNotasAp = this.c.exemplosNotasAp.map(function(e){ 
          e.exemplo = e.exemplo.trim();
          return e;});
      }
      for (var i = 0; i < this.c.exemplosNotasAp.length; i++) {
        try {
          var existeExemploNotaAp = await this.$request(
            "get",
            "/exemplosNotasAp/exemploNotaAp?valor=" +
              encodeURIComponent(this.c.exemplosNotasAp[i].exemplo)
          );
          if (existeExemploNotaAp.data) {
            this.mensagensErro.push({
              sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
              mensagem: "[" + this.c.exemplosNotasAp[i].exemplo + "] já existente na BD.",
            });
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência do exemploNotaAp.",
          });
        }
      }
      if (this.exemploDuplicado(this.c.exemplosNotasAp)) {
        this.mensagensErro.push({
          sobre: "Exemplo de nota de Aplicação(" + (i + 1) + ")",
          mensagem: "O último exemplo encontra-se duplicado.",
        });
        this.numeroErros++;
      }
    },

    validaNotasEx: async function () {
      // Notas de Exclusão
      if (this.notaDuplicada(this.c.notasEx)) {
        this.mensagensErro.push({
          sobre: "Nota de Exclusão(" + this.c.notasEx.length + ")",
          mensagem: "A última nota encontra-se duplicada.",
        });
        this.numeroErros++;
      }
    },

    validaTIs: async function () {
      // Termos de Índice
      for (var i = 0; i < this.c.termosInd.length; i++) {
        try {
          var existeTI = await this.$request(
            "get",
            "/termosIndice/termoIndice?valor=" +
              encodeURIComponent(this.c.termosInd[i].termo)
          );
          if (existeTI.data) {
            this.mensagensErro.push({
              sobre: "Termo de Índice(" + (i + 1) + ")",
              mensagem: "[" + this.c.termosInd[i].termo + "] já existente na BD.",
            });
            this.numeroErros++;
          }
        } catch (e) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência do Termo de índice.",
          });
        }
      }
      if (this.tiDuplicado(this.c.termosInd)) {
        this.numeroErros++;
        this.mensagensErro.push({
          sobre: "Termo de Índice(" + (i + 1) + ")",
          mensagem: "O último ti encontra-se duplicado.",
        });
      }
    },

    validaBlocoDescritivo: async function () {
      await this.validaDescricao();
      await this.validaNotasAp();
      await this.validaExemplosNotasAp();
      await this.validaNotasEx();
      await this.validaTIs();
    },

    validaBlocoContexto: function () {
      // Um PN Transversal tem de ter 1 dono ou 1 participante
      if (
        this.c.procTrans == "S" &&
        this.c.donos.length == 0 &&
        this.c.participantes.length == 0
      ) {
        this.mensagensErro.push({
          sobre: "Invariante da Transversalidade",
          mensagem: "Um processo Transversal deve ter um dono ou um participante.",
        });
        this.numeroErros++;
      }
    },

    validaDecisoesSemSub: async function () {
      // Decisões
      // Sem subdivisão
      if (this.c.nivel == 3 && !this.c.temSubclasses4Nivel) {
        // PCA: prazo
        if (!this.c.pca.valor && this.c.pca.notas == "") {
          this.mensagensErro.push({
            sobre: "PCA (prazo)",
            mensagem: "Tem de indicar o PCA ou preencher o campo da nota.",
          });
          this.numeroErros++;
        } else if (this.c.pca.valor < 0 || this.c.pca.valor > 200) {
          this.mensagensErro.push({
            sobre: "PCA (prazo)",
            mensagem: "Prazo fora dos limites.",
          });
          this.numeroErros++;
        }
        // PCA: forma e subforma de contagem
        if (this.c.pca.formaContagem == "") {
          this.mensagensErro.push({
            sobre: "PCA (forma de contagem)",
            mensagem: "A forma de contagem não pode ser vazia.",
          });
          this.numeroErros++;
        } else if (
          this.c.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
          this.c.pca.subFormaContagem == ""
        ) {
          this.mensagensErro.push({
            sobre: "PCA (subforma de contagem)",
            mensagem:
              'Quando a forma de contagem é "Disposição legal" a subforma não pode ser vazia.',
          });
          this.numeroErros++;
        }
        // DF
        if ((!this.c.df.valor || this.c.df.valor == "NE") && this.c.df.notas == "") {
          this.mensagensErro.push({
            sobre: "DF",
            mensagem: "Tem de indicar o DF ou preencher o campo da nota.",
          });
          this.numeroErros++;
        }
      }
    },

    validaDecisoesComSub: function () {
      // Com subdivisão
      if (this.c.nivel == 3 && this.c.temSubclasses4Nivel) {
        var subclasse = {};

        for (var i = 0; i < this.c.subclasses.length; i++) {
          // Unicidade do título
          if (
            this.c.subclasses.filter((s) => s.titulo == this.c.subclasses[i].titulo)
              .length > 1
          ) {
            this.mensagensErro.push({
              sobre: "Título da subclasse " + this.c.subclasses[i].codigo,
              mensagem: "Está repetido noutra subclasse.",
            });
          }
          // PCA: prazo
          subclasse = this.c.subclasses[i];
          if (
            (!subclasse.pca.valor || subclasse.pca.valor == "") &&
            subclasse.pca.notas == ""
          ) {
            this.mensagensErro.push({
              sobre: "PCA (prazo) da subclasse " + subclasse.codigo,
              mensagem: "O prazo é de preenchimento obrigatório.",
            });
            this.numeroErros++;
          } else if (subclasse.pca.valor < 0 || subclasse.pca.valor > 200) {
            this.mensagensErro.push({
              sobre: "PCA (prazo) da subclasse " + subclasse.codigo,
              mensagem: "O prazo está fora dos limites.",
            });
            this.numeroErros++;
          }
          // PCA: forma e subforma de contagem
          if (subclasse.pca.formaContagem == "") {
            this.mensagensErro.push({
              sobre: "PCA (forma de contagem) da subclasse " + subclasse.codigo,
              mensagem: "A forma de contagem não pode ser vazia.",
            });
            this.numeroErros++;
          } else if (
            subclasse.pca.formaContagem == "vc_pcaFormaContagem_disposicaoLegal" &&
            subclasse.pca.subFormaContagem == ""
          ) {
            this.mensagensErro.push({
              sobre: "PCA (subforma de contagem) da subclasse " + subclasse.codigo,
              mensagem:
                'Quando a forma de contagem é "Disposição legal" a subforma não pode ser vazia.',
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
              mensagem: "Tem de indicar o DF ou preencher o campo da nota.",
            });
            this.numeroErros++;
          }
        }
      }
    },

    validarClasse: async function () {
      console.log(JSON.stringify(this.c))
      var i = 0;

      await this.validaMeta();
      await this.validaBlocoDescritivo();
      await this.validaBlocoContexto();
      await this.validaDecisoesSemSub();
      await this.validaDecisoesComSub();

      if (this.numeroErros > 0) {
        this.dialog = true;
      } else {
        this.dialogSemErros = true;
      }
    },

    limpaErros: function () {
      this.numeroErros = 0;
      this.mensagensErro = [];
    },
  },
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
