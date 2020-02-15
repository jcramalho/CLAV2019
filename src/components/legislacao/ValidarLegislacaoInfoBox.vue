<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-3" @click="validarLegislacao"
      >Validar Diploma</v-btn
    >

    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="70%">
      <v-card>
        <v-card-title
          >Erros detetados na validação:
          {{ mensagensErro.length }}</v-card-title
        >
        <v-card-text>
          <v-row v-for="(m, i) in mensagensErro" :key="i">
            <v-col cols="2">
              <div class="info-label">{{ m.sobre }}</div>
            </v-col>
            <v-col>
              <div class="info-content">{{ m.mensagem }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="red darken-4" dark @click="dialog = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Validação não detetou erros ........... -->
    <v-dialog v-model="dialogSemErros" width="30%">
      <v-card>
        <v-card-title>Validação sem erros</v-card-title>
        <v-card-text>
          <p>A informação introduzida não apresenta erros.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="indigo darken-1" dark @click="dialogSemErros = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  props: ["l", "acao"],

  data() {
    return {
      dialog: false,
      dialogSemErros: false,

      mensagensErro: [],
      numeroErros: 0
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    }
  },

  methods: {
    async validarLegislacaoCriacao() {
      let parseAno = this.l.numero.split("/");
      let anoDiploma = parseInt(parseAno[1]);

      //Tipo
      if (this.l.tipo == "" || this.l.tipo == null) {
        this.mensagensErro.push({
          sobre: "Tipo do Diploma",
          mensagem: "O tipo do diploma não pode ser vazio."
        });
        this.numeroErros++;
      }

      // Fonte diploma
      if (this.l.diplomaFonte == "" || this.l.diplomaFonte == null) {
        this.mensagensErro.push({
          sobre: "Fonte do Diploma",
          mensagem: "A fonte do diploma não pode ser vazio."
        });
        this.numeroErros++;
      }

      // Número Diploma
      if (this.l.numero == "" || this.l.numero == null) {
        this.mensagensErro.push({
          sobre: "Número do Diploma",
          mensagem: "O número do diploma não pode ser vazio."
        });
        this.numeroErros++;
      } else {
        try {
          let existeNumero = await this.$request(
            "get",
            "/api/legislacao/numero/" + encodeURIComponent(this.l.numero)
          );

          if (existeNumero.data) {
            this.mensagensErro.push({
              sobre: "Número do Diploma",
              mensagem: "O número do diploma já existente na BD."
            });
            this.numeroErros++;
          } else if (!/[0-9]+(-\w)?\/[0-9]+$/.test(this.l.numero)) {
            this.mensagensErro.push({
              sobre: "Número do Diploma",
              mensagem: "O número do diploma está no formato errado."
            });
            this.numeroErros++;
          } else if (anoDiploma < 2000) {
            if (!/[0-9]+(-\w)?\/[0-9]\d{1}$/.test(this.l.numero)) {
              this.mensagensErro.push({
                sobre: "Número do Diploma",
                mensagem:
                  "Anos de diploma anteriores a 2000 devem ter apenas os dois últimos dígitos!"
              });
              this.numeroErros++;
            }
          }
        } catch (err) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem:
              "Não consegui verificar a existência do número do diploma."
          });
        }
      }

      // Data
      if (this.l.data == "" || this.l.data == null) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data não pode ser vazia."
        });
        this.numeroErros++;
      } else if (!/[0-9]+\/[0-9]+\/[0-9]+/.test(this.l.data)) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data está no formato errado."
        });
        this.numeroErros++;
      } else {
        let date = new Date();

        let ano = parseInt(this.l.data.slice(0, 4));
        let mes = parseInt(this.l.data.slice(5, 7));
        let dia = parseInt(this.l.data.slice(8, 10));

        let dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (mes > 12) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem: "A data apresenta o mês errado."
          });
          this.numeroErros++;
        } else if (dia > dias[mes - 1]) {
          if (mes == 2) {
            if (!(ano % 4 == 0 && mes == 2 && dia == 29)) {
              this.mensagensErro.push({
                sobre: "Data",
                mensagem: "A data apresenta o dia do mês errado."
              });
              this.numeroErros++;
            }
          } else {
            this.mensagensErro.push({
              sobre: "Data",
              mensagem: "A data apresenta o dia do mês errado."
            });
            this.numeroErros++;
          }
        } else if (ano > parseInt(date.getFullYear())) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem:
              "Ano inválido! Por favor selecione uma data anterior à atual"
          });
          this.numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes > parseInt(date.getMonth() + 1)
        ) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem:
              "Mês inválido! Por favor selecione uma data anterior à atual"
          });
          this.numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes == parseInt(date.getMonth() + 1) &&
          dia > parseInt(date.getDate())
        ) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem:
              "Dia inválido! Por favor selecione uma data anterior à atual"
          });
          this.numeroErros++;
        }
      }

      // Sumário
      if (this.l.sumario == "" || this.l.sumario == null) {
        this.mensagensErro.push({
          sobre: "Sumário",
          mensagem: "O sumário não pode ser vazio."
        });
        this.numeroErros++;
      }
    },

    validarLegislacaoAlteracao() {
      let parseAno = this.l.numero.split("/");
      let anoDiploma = parseInt(parseAno[1]);

      //Tipo
      if (this.l.tipo == "" || this.l.tipo == null) {
        this.mensagensErro.push({
          sobre: "Tipo do Diploma",
          mensagem: "O tipo do diploma não pode ser vazio."
        });
        this.numeroErros++;
      }

      // Fonte diploma
      if (this.l.diplomaFonte == "" || this.l.diplomaFonte == null) {
        this.mensagensErro.push({
          sobre: "Fonte do Diploma",
          mensagem: "A fonte do diploma não pode ser vazio."
        });
        this.numeroErros++;
      }

      // Número Diploma
      if (this.l.numero == "" || this.l.numero == null) {
        this.mensagensErro.push({
          sobre: "Número do Diploma",
          mensagem: "O número do diploma não pode ser vazio."
        });
        this.numeroErros++;
      } else if (!/[0-9]+(-\w)?\/[0-9]+$/.test(this.l.numero)) {
        this.mensagensErro.push({
          sobre: "Número do Diploma",
          mensagem: "O número do diploma está no formato errado."
        });
        this.numeroErros++;
      } else if (anoDiploma < 2000) {
        if (!/[0-9]+(-\w)?\/[0-9]\d{1}$/.test(this.l.numero)) {
          this.mensagensErro.push({
            sobre: "Número do Diploma",
            mensagem:
              "Anos de diploma anteriores a 2000 devem ter apenas os dois últimos dígitos!"
          });
          this.numeroErros++;
        }
      }

      // Data
      if (this.l.data == "" || this.l.data == null) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data não pode ser vazia."
        });
        this.numeroErros++;
      } else if (!/[0-9]+\/[0-9]+\/[0-9]+/.test(this.l.data)) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data está no formato errado."
        });
        this.numeroErros++;
      } else {
        let date = new Date();

        let ano = parseInt(this.l.data.slice(0, 4));
        let mes = parseInt(this.l.data.slice(5, 7));
        let dia = parseInt(this.l.data.slice(8, 10));

        let dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (mes > 12) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem: "A data apresenta o mês errado."
          });
          this.numeroErros++;
        } else if (dia > dias[mes - 1]) {
          if (mes == 2) {
            if (!(ano % 4 == 0 && mes == 2 && dia == 29)) {
              this.mensagensErro.push({
                sobre: "Data",
                mensagem: "A data apresenta o dia do mês errado."
              });
              this.numeroErros++;
            }
          } else {
            this.mensagensErro.push({
              sobre: "Data",
              mensagem: "A data apresenta o dia do mês errado."
            });
            this.numeroErros++;
          }
        } else if (ano > parseInt(date.getFullYear())) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem:
              "Ano inválido! Por favor selecione uma data anterior à atual"
          });
          this.numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes > parseInt(date.getMonth() + 1)
        ) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem:
              "Mês inválido! Por favor selecione uma data anterior à atual"
          });
          this.numeroErros++;
        } else if (
          ano == parseInt(date.getFullYear()) &&
          mes == parseInt(date.getMonth() + 1) &&
          dia > parseInt(date.getDate())
        ) {
          this.mensagensErro.push({
            sobre: "Data",
            mensagem:
              "Dia inválido! Por favor selecione uma data anterior à atual"
          });
          this.numeroErros++;
        }
      }

      // Sumário
      if (this.l.sumario == "" || this.l.sumario == null) {
        this.mensagensErro.push({
          sobre: "Sumário",
          mensagem: "O sumário não pode ser vazio."
        });
        this.numeroErros++;
      }
    },

    async validarLegislacao() {
      switch (this.acao) {
        case "Criação":
          await this.validarLegislacaoCriacao();
          break;

        case "Alteração":
          this.validarLegislacaoAlteracao();

        default:
          break;
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

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
