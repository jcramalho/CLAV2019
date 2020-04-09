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
  props: ["l", "acao", "original"],

  data() {
    return {
      dialog: false,
      dialogSemErros: false,

      mensagensErro: [],
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    },
  },

  methods: {
    async validarLegislacaoCriacao() {
      let numeroErros = 0;

      //Tipo
      if (this.l.tipo === "" || this.l.tipo === null) {
        this.mensagensErro.push({
          sobre: "Tipo de Diploma",
          mensagem: "O tipo de diploma não pode ser vazio.",
        });
        numeroErros++;
      }

      // Número Diploma
      if (this.l.numero === "" || this.l.numero === null) {
        this.mensagensErro.push({
          sobre: "Número de Diploma",
          mensagem: "O número de diploma não pode ser vazio.",
        });
        numeroErros++;
      } else {
        try {
          let existeNumero = await this.$request(
            "get",
            "/legislacao/numero?valor=" + encodeURIComponent(this.l.numero)
          );

          if (existeNumero.data) {
            this.mensagensErro.push({
              sobre: "Número de Diploma",
              mensagem: "O número de diploma já existente na BD.",
            });
            this.numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem:
              "Não consegui verificar a existência do número do diploma.",
          });
        }
      }

      // Data
      if (this.l.data === "" || this.l.data === null) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data não pode ser vazia.",
        });
        numeroErros++;
      } else if (!/[0-9]+\-[0-9]+\-[0-9]+/.test(this.l.data)) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data está no formato errado.",
        });
        numeroErros++;
      }

      // Sumário
      if (this.l.sumario === "" || this.l.sumario === null) {
        this.mensagensErro.push({
          sobre: "Sumário",
          mensagem: "O sumário não pode ser vazio.",
        });
        numeroErros++;
      }

      return numeroErros;
    },

    validarLegislacaoAlteracao(dados) {
      let numeroErros = 0;

      // Sumário
      if (dados.sumario === "" || dados.sumario === null) {
        this.mensagensErro.push({
          sobre: "Sumário",
          mensagem: "O sumário não pode ser vazio.",
        });
        numeroErros++;
      }

      return numeroErros;
    },

    async validarLegislacao() {
      let erros = 0;
      let dataObj = JSON.parse(JSON.stringify(this.l));

      switch (this.acao) {
        case "Criação":
          erros = await this.validarLegislacaoCriacao();
          break;

        case "Alteração":
          for (const key in dataObj) {
            if (
              typeof dataObj[key] === "string" &&
              dataObj[key] === this.original[key]
            ) {
              if (key !== "id") delete dataObj[key];
            }
          }

          erros = this.validarLegislacaoAlteracao(dataObj);
          break;

        default:
          break;
      }

      if (erros > 0) {
        this.dialog = true;
      } else {
        this.dialogSemErros = true;
      }
    },

    limpaErros: function() {
      this.numeroErros = 0;
      this.mensagensErro = [];
    },
  },
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
