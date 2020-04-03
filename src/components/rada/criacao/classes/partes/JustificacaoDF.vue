<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Destino Final</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-select
          :rules="[v => rule(v)]"
          :disabled="disable_df()"
          v-model="newSerie.df"
          :items="['Conservação', 'Conservação Parcial', 'Eliminação']"
          label="Destino Final"
          solo
          clearable
        >
          <template v-slot:selection="data">
            <v-chip>
              <v-avatar
                v-if="data.item != 'Conservação Parcial'"
                left
                color="amber accent-3"
              >{{ data.item[0] }}</v-avatar>
              <v-avatar v-else left color="amber accent-3">CP</v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Justificação do DF</div>
        <v-row no-gutters>
          <v-col v-if="existeLegislacao" sm="5" md="5" xs="12">
            <v-btn class="ma-2" color="indigo darken-2" dark @click="adicionaLegal">Critério Legal</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="9" md="9">
        <v-card outlined v-if="!!newSerie.justificacaoDF[0]">
          <v-row v-for="(criterio, cindex) in newSerie.justificacaoDF" :key="cindex">
            <v-col cols="3">
              <div style="padding-left: 15px;" class="info-label">
                <v-icon
                  v-if="criterio.tipo == 'Critério Legal'"
                  @click="removeCriterio(cindex, criterio.tipo)"
                  color="red darken-2"
                  dark
                  small
                >remove_circle_outline</v-icon>
                {{ criterio.tipo }}
              </div>
              <!-- @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')" -->
            </v-col>
            <v-col style="padding-right: 20px;">
              <v-card outlined>
                <v-textarea
                  auto-grow
                  outlined
                  clearable
                  rows="1"
                  :value="criterio.nota"
                  v-model="criterio.nota"
                ></v-textarea>
                <v-card-text>
                  <ul>
                    <li v-for="(relacao, relindex) in criterio.relacoes" :key="relindex">
                      {{ relacao }}
                      <v-icon
                        v-if="criterio.tipo == 'Critério Legal'"
                        @click="removeRelacao(relindex, criterio, cindex)"
                        color="red darken-2"
                        dark
                        small
                      >remove_circle_outline</v-icon>
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
              <!-- <p>{{ criterio }}</p>  -->
            </v-col>
          </v-row>
        </v-card>
        <v-alert
          v-else
          border="left"
          dense
          icon="warning"
          color="amber accent-3"
        >Não existe justificação do Destino Final</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const labels = require("@/config/labels").criterios;

export default {
  props: ["newSerie", "classes", "rules"],
  computed: {
    existeLegislacao() {
      // Se já existir critério legal, não aparece botão
      if (this.newSerie.justificacaoDF.some(e => e.tipo == "Critério Legal")) {
        return false;
      } else {
        // Se for uma série
        if (this.newSerie.tipo == "Série") {
          return this.newSerie.legislacao.length > 0;
        } else {
          // Se for uma subsérie, ir buscar a legislação do pai
          let pai = this.classes.find(e => e.codigo == this.newSerie.eFilhoDe);

          // Se não existir o pai ou não tiver legislacao, não mostra o botão. (PODE SER OTIMIZADO)
          if (pai == undefined || pai.legislacao.length == 0) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  },
  methods: {
    rule(v) {
      if (this.rules && (v == "" || v == null)) {
        return "Campo Obrigatório";
      } else {
        return true;
      }
    },
    // Verificar pela relação existente visto que a gestão feita não permite ter coisas erradas
    disable_df() {
      if (
        this.newSerie.justificacaoDF.some(
          e =>
            e.tipo == "Critério de Complementaridade Informacional" ||
            e.tipo == "Critério de Densidade Informacional"
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    removeRelacao(index, criterio, indexCriterio) {
      if (criterio.relacoes.length > 1) {
        criterio.relacoes.splice(index, 1);
      } else {
        this.removeCriterio(indexCriterio, criterio.tipo);
      }
    },
    removeCriterio(index, tipo) {
      this.newSerie.justificacaoDF.splice(index, 1);
    },
    adicionaLegal() {
      let relacoesLegis = [];
      if (this.newSerie.tipo == "Série") {
        relacoesLegis = this.newSerie.legislacao.map(item => {
          return item.tipo + " " + item.numero;
        });
      } else {
        let pai = this.classes.find(e => e.codigo == this.newSerie.eFilhoDe);

        relacoesLegis = pai.legislacao.map(item => {
          return item.tipo + " " + item.numero;
        });
      }
      this.newSerie.justificacaoDF.push({
        tipo: "Critério Legal",
        nota: labels.textoCriterioLegal,
        relacoes: relacoesLegis
      });
    }
  }
};
</script>
