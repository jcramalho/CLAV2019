<template>
  <v-dialog :value="true" width="90%" @click:outside="$emit('fechar');">
    <v-card>
      <v-card-title
        class="indigo darken-4 title white--text mb-4"
        dark
      >Validação da UI: {{ elemento.codigo + " - " + elemento.titulo }}</v-card-title>

      <v-card-text>
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
        <!-- Cota -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="codCota"
          campoText="Cota"
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
        <!-- Data Inicial -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="dataInicial"
          campoText="Data Inicial"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />
        <!-- Data Final -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="dataFinal"
          campoText="Data Final"
          tipo="string"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        />

        <!-- Produtoras -->
        <ValidaCampo
          v-if="!!novoHistorico.dados.produtor.dados.entProdutoras[0]"
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="produtor"
          campoText="Entidades Produtoras"
          tipo="array"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        >
          <template v-slot:campo>
            <span>
              <ul>
                <li
                  v-for="(v, i) in novoHistorico.dados.produtor.dados.entProdutoras"
                  :key="i"
                >{{ v }}</li>
              </ul>
            </span>
          </template>
        </ValidaCampo>
        <ValidaCampo
          v-else
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="produtor"
          campoText="Tipologias Produtoras"
          tipo="array"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        >
          <template v-slot:campo>
            <span>
              <ul>
                <li
                  v-for="(v, i) in novoHistorico.dados.produtor.dados.tipologiasProdutoras"
                  :key="i"
                >{{ v }}</li>
              </ul>
            </span>
          </template>
        </ValidaCampo>
        <!-- Classes Associadas -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="classesAssociadas"
          campoText="Classes Associadas"
          tipo="array"
          :permitirEditar="false"
          @corAlterada="validadeClasse"
        >
          <template v-slot:campo>
            <ul>
              <li
                v-for="(v, i) in novoHistorico.dados.classesAssociadas.dados"
                :key="i"
              >{{ v.codigo }}</li>
            </ul>
          </template>
        </ValidaCampo>
        <!-- Notas -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="notas"
          campoText="Notas"
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
        <!-- Localização -->
        <ValidaCampo
          :dadosOriginais="elemento"
          :novoHistorico="novoHistorico.dados"
          campoValue="localizacao"
          campoText="Localização"
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
