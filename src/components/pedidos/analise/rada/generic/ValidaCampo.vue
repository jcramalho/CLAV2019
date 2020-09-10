<template>
  <div>
    <v-row dense class="ma-1">
      <v-col cols="2">
        <div
          :class="['info-descricao', `info-descricao-${novoHistorico[campoValue].cor}`]"
        >{{campoText}}</div>
      </v-col>
      <v-col>
        <div v-if="editaCampo == campoValue">
          <v-form ref="form">
            <slot name="input" v-bind:items="{ campoEditado , updateValue }"></slot>
          </v-form>
        </div>
        <div class="info-conteudo" v-else>
          <slot name="campo">
            <span
              v-if="tipo == 'string' && !!novoHistorico[campoValue].dados"
            >{{novoHistorico[campoValue].dados}}</span>
            <span v-else-if="(tipo == 'array') && !!novoHistorico[campoValue].dados[0]">
              <ul>
                <li v-for="(v, i) in novoHistorico[campoValue].dados" :key="i">
                  {{ v }}
                  <v-badge v-if="!dadosOriginais[campoValue].some(e => e == v)" right dot inline></v-badge>
                </li>
              </ul>
            </span>
            <span v-else>[Campo não preenchido na submissão do pedido]</span>
          </slot>
          <!-- <span
            v-if="tipo == 'string' && !!novoHistorico[campoValue].dados"
          >{{novoHistorico[campoValue].dados}}</span>
          <span v-else-if="(tipo == 'array') && !!novoHistorico[campoValue].dados[0]">
            <ul>
              <li v-for="(v, i) in novoHistorico[campoValue].dados" :key="i">
                {{ v }}
                <v-badge v-if="!dadosOriginais[campoValue].some(e => e == v)" right dot inline></v-badge>
              </li>
            </ul>
          </span>
          <span v-else>[Campo não preenchido na submissão do pedido]</span>-->
        </div>
      </v-col>
      <v-col cols="auto" v-if="editaCampo != campoValue">
        <span v-if="!foiEditado">
          <v-icon class="mr-1" color="green" @click="verifica(campoValue)">check</v-icon>
          <v-icon class="mr-1" color="red" @click="anula(campoValue)">clear</v-icon>
        </span>
        <!-- Ver como vai ser a edição. -->
        <v-icon
          v-if="permitirEditar"
          class="mr-1"
          color="orange"
          @click="editaCampo = campoValue;
                  campoEditado = novoHistorico[campoValue].dados"
        >create</v-icon>

        <v-badge
          color="indigo darken-4"
          content="1"
          :value="!!novoHistorico[campoValue].nota"
          overlap
        >
          <v-icon @click="abrirNotaDialog">add_comment</v-icon>
        </v-badge>
      </v-col>
      <v-col cols="auto" v-else>
        <span>
          <v-icon class="mr-1" color="green" @click="editarCampo">check</v-icon>
          <v-icon class="mr-1" color="red" @click="editaCampo = null; campoEditado = null">clear</v-icon>
        </span>
      </v-col>
    </v-row>

    <AdicionarNota
      :dialog="notaVisivel"
      v-if="notaVisivel"
      :campoText="campoText"
      :notaAtual="this.novoHistorico[this.campoValue].nota"
      @fechar="notaVisivel = false"
      @adicionar="adicionarNota"
    ></AdicionarNota>
  </div>
</template>

<script>
import AdicionarNota from "@/components/pedidos/analise/rada/generic/AdicionarNota";

export default {
  props: {
    permitirEditar: {
      type: Boolean,
      default: true,
    },
    tipo: {},
    dadosOriginais: {},
    novoHistorico: {},
    campoValue: {},
    campoText: {},
  },

  components: { AdicionarNota },
  data: () => ({
    campoEditado: null,
    editaCampo: null,
    foiEditado: false,
    campoEditado: null,
    notaVisivel: false,
    notaCampo: null,
  }),
  methods: {
    updateValue(e) {
      this.campoEditado = e;
    },
    editarCampo() {
      if (this.$refs.form.validate()) {
        switch (this.tipo) {
          case "string":
            if (
              this.campoEditado !== this.novoHistorico[this.campoValue].dados
            ) {
              this.novoHistorico[this.campoValue].dados = this.campoEditado;
              if (this.campoEditado !== this.dadosOriginais[this.campoValue]) {
                this.novoHistorico[this.campoValue].cor = "amarelo";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = true;
              } else {
                this.novoHistorico[this.campoValue].cor = "verde";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = false;
              }
              this.editaCampo = null;
              this.campoEditado = null;
            }

            break;
          case "array":
            if (
              !(
                this.campoEditado.length ==
                  this.novoHistorico[this.campoValue].dados.length &&
                this.campoEditado.every(
                  (val, index) =>
                    val === this.novoHistorico[this.campoValue].dados[index]
                )
              )
            ) {
              this.novoHistorico[this.campoValue].dados = this.campoEditado;
              if (
                this.campoEditado.length ==
                  this.dadosOriginais[this.campoValue].length &&
                this.campoEditado.every(
                  (val, index) =>
                    val === this.dadosOriginais[this.campoValue][index]
                )
              ) {
                this.novoHistorico[this.campoValue].cor = "verde";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = false;
              } else {
                this.novoHistorico[this.campoValue].cor = "amarelo";
                this.$emit(
                  "corAlterada",
                  this.novoHistorico[this.campoValue].cor
                );
                this.foiEditado = true;
              }
              this.editaCampo = null;
              this.campoEditado = null;
            }
            break;
        }
      }
    },
    abrirNotaDialog() {
      this.notaVisivel = true;
      this.notaCampo = this.campoText;
    },
    verifica(campo) {
      this.novoHistorico[campo].cor = "verde";
      this.$emit("corAlterada", this.novoHistorico[campo].cor);
    },
    anula(campo) {
      this.novoHistorico[campo].cor = "vermelho";
      this.$emit("corAlterada", this.novoHistorico[campo].cor);
    },
    adicionarNota(nota) {
      this.novoHistorico[this.campoValue].nota = nota;
      this.notaVisivel = false;
    },
  },
};
</script>