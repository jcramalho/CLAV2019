<template>
  <v-row>
    <v-col md="3" sm="3">
      <div class="info-label">Justificação do PCA</div>
      <v-row no-gutters>
        <v-col>
          <v-btn
            v-if="existeGestionario"
            class="ma-2"
            color="indigo darken-2"
            dark
            @click="adicionaGestionario"
            rounded
          >
            Critério Gestionário
            <v-icon small dark right>add_circle_outline</v-icon>
          </v-btn>

          <v-btn
            v-if="existeLegislacao"
            class="ma-2"
            color="indigo darken-2"
            dark
            @click="adicionaLegal"
            rounded
          >
            Critério Legal
            <v-icon small dark right>add_circle_outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col sm="9" md="9">
      <!-- {{ newSerie.justificacaoPCA }} -->
      <v-card outlined v-if="!!newSerie.justificacaoPCA[0]">
        <v-row
          v-for="(criterio, cindex) in newSerie.justificacaoPCA"
          :key="cindex"
        >
          <v-col cols="3">
            <div style="padding-left: 15px;" class="info-label">
              <v-icon
                v-if="criterio.tipo != 'Critério de Utilidade Administrativa'"
                @click="removeCriterio(cindex, criterio.tipo)"
                color="red darken-2"
                dark
                small
                >remove_circle_outline</v-icon
              >
              {{ criterio.tipo }}
            </div>
            <!-- @click="removerCriterioTodo(c.pca.justificacao, cindex, 'PCA')" -->
          </v-col>
          <v-col
            cols="9"
            v-if="criterio.tipo == 'Critério Gestionário'"
            style="padding-right: 20px;"
          >
            <v-textarea
              auto-grow
              outlined
              clearable
              rows="1"
              :value="criterio.nota"
              v-model="criterio.nota"
            ></v-textarea>
          </v-col>
          <v-col v-else style="padding-right: 20px;">
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
                <ul
                  v-if="criterio.tipo == 'Critério de Utilidade Administrativa'"
                >
                  <li
                    v-for="(relacao, relindex) in criterio.relacoes"
                    :key="relindex"
                  >
                    {{ relacao.codigo + " - " + relacao.titulo }}
                  </li>
                </ul>
                <ul v-else>
                  <li
                    v-for="(relacao, relindex) in criterio.relacoes"
                    :key="relindex"
                  >
                    {{ relacao }}
                    <v-icon
                      @click="removeRelacao(relindex, criterio, cindex)"
                      color="red darken-2"
                      dark
                      small
                      >remove_circle_outline</v-icon
                    >
                  </li>
                </ul>
              </v-card-text>
            </v-card>
            <!-- <p>{{ criterio }}</p>  -->
          </v-col>
        </v-row>
      </v-card>
      <v-alert v-else border="left" dense icon="warning" color="amber accent-3"
        >Não existe justificação do Prazo de Conservação Administrativa</v-alert
      >
    </v-col>
  </v-row>
</template>

<script>
const labels = require("@/config/labels").criterios;

export default {
  props: ["newSerie", "classes", "rules"],
  computed: {
    existeGestionario() {
      if (
        this.newSerie.justificacaoPCA.some(
          e => e.tipo == "Critério Gestionário"
        )
      ) {
        return false;
      } else {
        return true;
      }
    },
    existeLegislacao() {
      // Se já existir critério legal, não aparece botão
      if (this.newSerie.justificacaoPCA.some(e => e.tipo == "Critério Legal")) {
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
    removeRelacao(index, criterio, indexCriterio) {
      if (criterio.relacoes.length > 1) {
        criterio.relacoes.splice(index, 1);
      } else {
        this.removeCriterio(indexCriterio, criterio.tipo);
      }
    },
    removeCriterio(index, tipo) {
      this.newSerie.justificacaoPCA.splice(index, 1);
    },
    adicionaGestionario() {
      this.newSerie.justificacaoPCA.push({
        tipo: "Critério Gestionário",
        nota: labels.textoCriterioJustificacaoGestionario
      });
    },
    adicionaLegal() {
      let relacoesLegis = [];
      if (this.newSerie.tipo == "Série") {
        relacoesLegis = this.newSerie.legislacao.map(legis => legis.legislacao);
      } else {
        let pai = this.classes.find(e => e.codigo == this.newSerie.eFilhoDe);
        relacoesLegis = pai.legislacao.map(legis => legis.legislacao);
      }
      this.newSerie.justificacaoPCA.push({
        tipo: "Critério Legal",
        nota: labels.textoCriterioLegal,
        relacoes: relacoesLegis
      });
    }
  }
};
</script>
