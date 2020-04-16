<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-3" @click="validarEntidade">
      Validar Entidade
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
  props: ["e", "acao", "original"],
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
    async validarEntidadeCriacao() {
      let numeroErros = 0;

      // Designação
      if (this.e.designacao === "" || this.e.designacao === null) {
        this.mensagensErro.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio.",
        });
        numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/entidades/designacao?valor=" +
              encodeURIComponent(this.e.designacao)
          );
          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Nome da Entidade",
              mensagem: "Nome da entidade já existente na BD.",
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
      if (this.e.sigla === "" || this.e.sigla === null) {
        this.mensagensErro.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia.",
        });
        numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/entidades/sigla?valor=" + encodeURIComponent(this.e.sigla)
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

      // Internacional
      if (this.e.internacional === "" || this.e.internacional === null) {
        this.mensagensErro.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção.",
        });
        numeroErros++;
      }

      // SIOE
      if (this.e.sioe !== "" && this.e.sioe !== null) {
        if (this.e.sioe.length > 12) {
          this.mensagensErro.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
          });
          numeroErros++;
        }
      }

      // Data Criação
      // if (this.e.dataCriacao === "" || this.e.dataCriacao === null || this.e.dataCriacao === undefined) {
      //   this.mensagensErro.push({
      //     sobre: "Data de Criação",
      //     mensagem: "A data de criação não pode ser vazia."
      //   });
      //   this.numeroErros++;
      // } else
      if (
        this.e.dataCriacao !== undefined &&
        this.e.dataCriacao !== "" &&
        this.e.dataCriacao !== null &&
        !/[0-9]+-[0-9]+-[0-9]+/.test(this.e.dataCriacao)
      ) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data está no formato errado.",
        });
        numeroErros++;
      }

      return numeroErros;
    },

    async validarEntidadeAlteracao(dados) {
      let numeroErros = 0;

      // Designação
      if (dados.designacao === "" || dados.designacao === null) {
        this.mensagensErro.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio.",
        });
        numeroErros++;
      } else if (dados.designacao !== undefined) {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/entidades/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Nome da Entidade",
              mensagem: "Nome da entidade já existente na BD.",
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

      // Internacional
      if (dados.internacional === "" || dados.internacional === null) {
        this.mensagensErro.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção.",
        });
        numeroErros++;
      }

      // SIOE
      if (dados.sioe !== "" && dados.sioe !== null) {
        if (dados.sioe !== undefined)
          if (dados.sioe.length > 12) {
            this.mensagensErro.push({
              sobre: "SIOE",
              mensagem:
                "O campo SIOE tem de ter menos que 12 digitos numéricos.",
            });
            numeroErros++;
          }
      }

      // Data Criação
      if (
        dados.dataCriacao !== undefined &&
        !/[0-9]+-[0-9]+-[0-9]+/.test(dados.dataCriacao)
      ) {
        this.mensagensErro.push({
          sobre: "Data de Criação",
          mensagem: "A data de criação está no formato errado.",
        });
        numeroErros++;
      }

      return numeroErros;
    },

    validarEntidadeExtincao(dados) {
      let numeroErros = 0;

      // Data Extinção
      if (
        dados.dataExtincao === "" ||
        dados.dataExtincao === null ||
        dados.dataExtincao === undefined
      ) {
        this.mensagensErro.push({
          sobre: "Data de extinção",
          mensagem: "A data não pode ser vazia.",
        });
        numeroErros++;
      } else if (!/[0-9]+-[0-9]+-[0-9]+/.test(dados.dataExtincao)) {
        this.mensagensErro.push({
          sobre: "Data de extinção",
          mensagem: "A data está no formato errado.",
        });
        numeroErros++;
      }

      return numeroErros;
    },

    async validarEntidade() {
      let erros = 0;
      let dataObj = JSON.parse(JSON.stringify(this.e));

      switch (this.acao) {
        case "Criação":
          erros = await this.validarEntidadeCriacao();
          break;

        case "Alteração":
          for (const key in dataObj) {
            if (
              typeof dataObj[key] === "string" &&
              dataObj[key] === this.original[key]
            ) {
              if (key !== "sigla") delete dataObj[key];
            }

            if (key === "dataExtincao") delete dataObj[key];
          }

          erros = await this.validarEntidadeAlteracao(dataObj);
          break;

        case "Extinção":
          for (const key in dataObj) {
            if (key !== "sigla" && key !== "dataExtincao") delete dataObj[key];
          }

          erros = this.validarEntidadeExtincao(dataObj);
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
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
