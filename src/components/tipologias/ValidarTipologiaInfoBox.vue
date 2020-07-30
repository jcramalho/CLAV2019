<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-3" @click="validarTipologia">
      Validar Tipologia
    </v-btn>

    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="70%">
      <v-card>
        <v-card-title>
          Erros detetados na validação: {{ mensagensErro.length }}
        </v-card-title>
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
          <v-btn class="red darken-4" dark @click="dialog = false">
            Fechar
          </v-btn>
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
          <v-btn class="indigo accent-4" dark @click="dialogSemErros = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import { eNUV } from "@/utils/validadores";

export default {
  props: ["t", "acao", "original"],
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
    async validarTipologiaCriacao() {
      let numeroErros = 0;

      // Designação
      if (eNUV(this.t.designacao)) {
        this.mensagensErro.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio.",
        });
        numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/tipologias/designacao?valor=" +
              encodeURIComponent(this.t.designacao)
          );

          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Nome da Tipologia",
              mensagem: "Nome da tipologia já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação.",
          });
        }
      }

      // Sigla
      if (eNUV(this.t.sigla)) {
        this.mensagensErro.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia.",
        });
        numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/tipologias/sigla?valor=" + encodeURIComponent(this.t.sigla)
          );
          if (existeSigla.data) {
            this.mensagensErro.push({
              sobre: "Sigla",
              mensagem: "Sigla já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da sigla.",
          });
        }
      }

      return numeroErros;
    },

    async validarTipologiasAlteracao(dados) {
      let numeroErros = 0;

      // Designação
      if (eNUV(dados.designacao)) {
        this.mensagensErro.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio.",
        });
        numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/tipologias/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Nome da Tipologia",
              mensagem: "Nome da tipologia já existente na BD.",
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação.",
          });
        }
      }

      return numeroErros;
    },

    async validarTipologia() {
      let erros = 0;
      let dataObj = JSON.parse(JSON.stringify(this.t));

      switch (this.acao) {
        case "Criação":
          erros = await this.validarTipologiaCriacao();
          break;

        case "Alteração":
          for (const key in dataObj) {
            if (
              typeof dataObj[key] === "string" &&
              dataObj[key] === this.original[key]
            ) {
              if (key !== "sigla") delete dataObj[key];
            }
          }

          erros = await this.validarTipologiasAlteracao(dataObj);
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
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
