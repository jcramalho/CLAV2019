<template>
  <v-dialog :value="true" width="90%" @click:outside="$emit('fechar');">
    <v-card>
      <v-card-title
        class="indigo darken-4 title white--text mb-4"
        dark
      >Validação da classe Área Orgânico-Funcional {{elemento.tipo}}: {{ elemento.codigo + " - " + elemento.titulo }}</v-card-title>

      <v-card-text>
        <!-- {{ elemento }}
        {{ novoHistorico}}-->
        <!-- Código -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="codigo"
          campoText="Código"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />

        <!-- Titulo -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="titulo"
          campoText="Título"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />
        <!-- Descrição -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="descricao"
          campoText="Descrição"
          tipo="string"
          @corAlterada="validadeClasse"
        >
          <template v-slot:input="props">
            <v-text-field
              :rules="[v => !!v || 'Campo obrigatório']"
              solo
              v-model="props.items.campoEditado"
              @input="props.items.updateValue"
            ></v-text-field>
          </template>
        </ValidaCampo>
        <!-- Pai -->
        <ValidaCampo
          v-if="!!novoHistorico.dados.eFilhoDe.dados"
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="eFilhoDe"
          campoText="Classe pai"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />
        <!-- Tipo -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="tipo"
          campoText="Tipo"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="indigo darken-4" dark @click="$emit('fechar')">Voltar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/rada/generic/ValidaCampo";

export default {
  props: ["elemento", "novoHistorico"],
  components: {
    ValidaCampo,
  },
  data() {
    return {
      nota: null,
    };
  },
  methods: {
    validadeClasse(cor) {
      let existemV = Object.keys(this.novoHistorico.dados).some((k) => {
        return this.novoHistorico.dados[k].cor === "vermelho";
      });

      if (existemV) {
        this.novoHistorico.cor = "vermelho";
      } else {
        let existemA = Object.keys(this.novoHistorico.dados).some((k) => {
          return this.novoHistorico.dados[k].cor === "amarelo";
        });

        if (existemA) {
          this.novoHistorico.cor = "amarelo";
        } else {
          this.novoHistorico.cor = "verde";
        }
      }
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}
</style>
