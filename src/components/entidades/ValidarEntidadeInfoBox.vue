<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-3" @click="validarEntidade"
      >Validar Entidade</v-btn
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
  props: ["e", "acao"],
  data() {
    return {
      dialog: false,
      dialogSemErros: false,

      mensagensErro: [],
      numeroErros: 0,
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    },
  },

  methods: {
    async validarEntidadeCriacao() {
      // Designação
      if (this.e.designacao === "" || this.e.designacao === null) {
        this.mensagensErro.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio.",
        });
        this.numeroErros++;
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
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
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
        this.numeroErros++;
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
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
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
        this.numeroErros++;
      }

      // SIOE
      if (this.e.sioe !== "" && this.e.sioe !== null) {
        if (this.e.sioe.length > 12) {
          this.mensagensErro.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
          });
          this.numeroErros++;
        }
      }

      // Data Criação
      // if (this.l.data == "" || this.l.data == null) {
      //   this.mensagensErro.push({
      //     sobre: "Data",
      //     mensagem: "A data não pode ser vazia."
      //   });
      //   this.numeroErros++;
      // } else
      if (!/[0-9]+\-[0-9]+\-[0-9]+/.test(this.l.dataCriacao)) {
        this.mensagensErro.push({
          sobre: "Data",
          mensagem: "A data está no formato errado.",
        });
        this.numeroErros++;
      }
    },

    validarEntidadeAlteracao() {
      // Internacional
      if (this.e.internacional == "" || this.e.internacional == null) {
        this.mensagensErro.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção.",
        });
        this.numeroErros++;
      }

      // SIOE
      if (this.e.sioe != "" && this.e.sioe != null) {
        if (this.e.sioe.length > 12) {
          this.mensagensErro.push({
            sobre: "SIOE",
            mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
          });
          this.numeroErros++;
        }
      }
    },

    validarEntidadeExtincao() {
      let numeroErros = 0;

      // Data Extinção
      if (
        this.e.dataExtincao === "" ||
        this.e.dataExtincao === null ||
        this.e.dataExtincao === undefined
      ) {
        this.mensagensErro.push({
          sobre: "Data de extinção",
          mensagem: "A data não pode ser vazia.",
        });
        this.numeroErros++;
      } else if (!/[0-9]+\-[0-9]+\-[0-9]+/.test(this.e.dataExtincao)) {
        this.mensagensErro.push({
          sobre: "Data de extinção",
          mensagem: "A data está no formato errado.",
        });
        this.numeroErros++;
      }

      return numeroErros;
    },

    async validarEntidade() {
      switch (this.acao) {
        case "Criação":
          await this.validarEntidadeCriacao();
          break;

        case "Alteração":
          this.validarEntidadeAlteracao();
          break;

        case "Extinção":
          this.validarEntidadeExtincao();
          break;

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
