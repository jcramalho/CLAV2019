<template>
  <div>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Prazo de Conservação Administrativa</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          readonly
          type="number"
          v-model="classe.pca"
          solo
          label="Sem prazo de conservação administrativa"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- Nota PCA -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Nota sobre o PCA</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field
          solo
          clearable
          readonly
          v-model="classe.notaPCA"
          label="Sem notas sobre o PCA"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- FORMA DE CONTAGEM -->
    <v-card outlined>
      <v-row>
        <v-col md="3" sm="3">
          <div class="info-label">Forma de Contagem do PCA</div>
        </v-col>
        <v-col sm="9" md="9" style="padding-right: 20px;">
          <!-- :items="formaContagem.formasContagem" -->
          <v-select
            :items="formaContagem.formasContagem"
            readonly
            v-model="classe.formaContagem.forma"
            item-text="label"
            label="Sem forma de contagem do PCA"
            solo
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="classe.formaContagem.subforma">
        <v-col md="3" sm="3">
          <div class="info-label">Subforma de Contagem do PCA</div>
        </v-col>
        <v-col sm="9" md="9" style="padding-right: 20px;">
          <!-- :items="formaContagem.subFormasContagem" -->
          <v-select
            :items="formaContagem.subFormasContagem"
            readonly
            v-model="classe.formaContagem.subforma"
            item-text="label"
            solo
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <!-- Justificação PCA -->
      <v-col md="3" sm="3">
        <div class="info-label">Justificação do PCA</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-card outlined v-if="!!classe.justificacaoPCA[0]">
          <v-row v-for="(criterio, cindex) in classe.justificacaoPCA" :key="cindex">
            <v-col cols="3">
              <div style="padding-left: 15px;" class="info-label">{{ criterio.tipo }}</div>
            </v-col>
            <v-col
              cols="9"
              v-if="criterio.tipo == 'Critério Gestionário'"
              style="padding-right: 20px;"
            >
              <v-textarea
                readonly
                auto-grow
                outlined
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
                  readonly
                  rows="1"
                  :value="criterio.nota"
                  v-model="criterio.nota"
                ></v-textarea>
                <v-card-text>
                  <ul v-if="criterio.tipo == 'Critério de Utilidade Administrativa'">
                    <li
                      v-for="(relacao, relindex) in criterio.relacoes"
                      :key="relindex"
                    >{{ relacao.codigo + " - " + relacao.titulo }}</li>
                  </ul>
                  <ul v-else>
                    <li
                      v-for="(relacao, relindex) in criterio.relacoes"
                      :key="relindex"
                    >{{ relacao }}</li>
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
        >Não existe justificação do Prazo de Conservação Administrativa!</v-alert>
      </v-col>
    </v-row>
    <v-divider style="border: 2px solid; border-radius: 1px;"></v-divider>
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Destino Final</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-select
          readonly
          v-model="classe.df"
          :items="['Conservação', 'Conservação Parcial', 'Eliminação']"
          solo
          label="Sem destino final"
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
    <!-- Nota DF -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Nota sobre o DF</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-text-field solo clearable readonly v-model="classe.notaDF" label="Sem notas sobre o DF"></v-text-field>
      </v-col>
    </v-row>
    <!-- Justificação DF -->
    <v-row>
      <v-col md="3" sm="3">
        <div class="info-label">Justificação do DF</div>
      </v-col>
      <v-col sm="9" md="9">
        <v-card outlined v-if="!!classe.justificacaoDF[0]">
          <v-row v-for="(criterio, cindex) in classe.justificacaoDF" :key="cindex">
            <v-col cols="3">
              <div style="padding-left: 15px;" class="info-label">{{ criterio.tipo }}</div>
            </v-col>
            <v-col style="padding-right: 20px;">
              <v-card outlined>
                <v-textarea
                  readonly
                  auto-grow
                  outlined
                  rows="1"
                  :value="criterio.nota"
                  v-model="criterio.nota"
                ></v-textarea>
                <v-card-text>
                  <ul v-if="criterio.tipo != 'Critério Legal'">
                    <li
                      v-for="(relacao, relindex) in criterio.relacoes"
                      :key="relindex"
                    >{{ relacao.codigo + " - " + relacao.titulo }}</li>
                  </ul>
                  <ul v-else>
                    <li
                      v-for="(relacao, relindex) in criterio.relacoes"
                      :key="relindex"
                    >{{ relacao }}</li>
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
        >Não existe justificação do Destino Final!</v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["classe", "formaContagem"]
};
</script>