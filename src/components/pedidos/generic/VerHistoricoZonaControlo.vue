<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel v-for="(item, i) in object" :key="i">
        <v-expansion-panel-header
          :class="`info-header-${item.cor}`"
          v-if="item.dados.codigo && item.dados.referencia"
        >
          {{
            item.dados.codigo +
              ", " +
              item.dados.referencia +
              " - " +
              item.dados.titulo
          }}
          <v-tooltip v-if="item.nota" bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="verNota(item.nota)">
                message
              </v-icon>
            </template>
            <span>Ver nota relativa ao campo...</span>
          </v-tooltip>
        </v-expansion-panel-header>
        <v-expansion-panel-header
          :class="`info-header-${item.cor}`"
          v-else-if="item.dados.codigo"
        >
          {{ item.dados.codigo + " - " + item.dados.titulo }}
          <v-tooltip v-if="item.nota" bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="verNota(item.nota)">
                message
              </v-icon>
            </template>
            <span>Ver nota relativa ao campo...</span>
          </v-tooltip>
        </v-expansion-panel-header>
        <v-expansion-panel-header :class="`info-header-${item.cor}`" v-else>
          {{ item.dados.referencia + " - " + item.dados.titulo }}
          <v-tooltip v-if="item.nota" bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="verNota(item.nota)">
                message
              </v-icon>
            </template>
            <span>Ver nota relativa ao campo...</span>
          </v-tooltip>
        </v-expansion-panel-header>
        <v-expansion-panel-content :class="`info-background-${backColor}`">
          <v-row v-if="item.dados.codigo">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Código da classe</div>
            </v-col>
            <v-col>
              {{ item.dados.codigo }}
            </v-col>
          </v-row>
          <v-row v-if="item.dados.referencia">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Referência</div>
            </v-col>
            <v-col>
              {{ item.dados.referencia }}
            </v-col>
          </v-row>
          <v-row v-if="item.dados.titulo">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Título</div>
            </v-col>
            <v-col>
              {{ item.dados.titulo }}
            </v-col>
          </v-row>
          <v-row v-if="item.dados.prazoConservacao">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">
                Prazo de Conservação Administrativa
              </div>
            </v-col>
            <v-col>
              {{ item.dados.prazoConservacao }}
              <span v-if="item.dados.prazoConservacao == '1'">Ano</span
              ><span v-else>Anos</span>
            </v-col>
          </v-row>
          <v-row v-if="item.dados.destino">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Destino Final</div>
            </v-col>
            <v-col v-if="item.dados.destino === 'E'" style="width:80%;">
              Eliminação
            </v-col>
            <v-col v-else-if="item.dados.destino === 'C'" style="width:80%;">
              Conservação
            </v-col>
            <v-col v-else style="width:80%;">
              {{ item.dados.destino }}
            </v-col>
          </v-row>
          <v-row
            v-if="
              item.dados.ni &&
                (item.dados.destino === 'C' ||
                  item.dados.destino === 'Conservação')
            "
          >
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">
                Natureza de intervenção
              </div>
            </v-col>
            <v-col>{{ item.dados.ni }}</v-col>
          </v-row>
          <v-row
            v-if="
              item.dados.dono &&
                item.dados.dono.length > 0 &&
                (item.dados.destino === 'C' ||
                  item.dados.destino === 'Conservação')
            "
          >
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Donos do PN</div>
            </v-col>
            <v-col
              ><li v-for="(d, i) in item.dados.dono" :key="i">
                {{ d }}
              </li></v-col
            >
          </v-row>
          <v-row>
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Data de Início</div>
            </v-col>
            <v-col>
              {{ item.dados.dataInicio }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">Data de Fim</div>
            </v-col>
            <v-col>{{ item.dados.dataFim }}</v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">
                N.º de agregações
              </div>
            </v-col>
            <v-col>{{ item.dados.agregacoes.length }}</v-col>
          </v-row>
          <v-row v-if="item.dados.uiPapel">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">
                Medição das UI em papel (m.l.)
              </div>
            </v-col>
            <v-col>{{ item.dados.uiPapel }}</v-col>
          </v-row>
          <v-row v-if="item.dados.uiDigital">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">
                Medição das UI em digital (Gb)
              </div>
            </v-col>
            <v-col>{{ item.dados.uiDigital }}</v-col>
          </v-row>
          <v-row v-if="item.dados.uiOutros">
            <v-col cols="4">
              <div :class="`info-descricao-${item.cor}`">
                Medição das UI noutros suportes
              </div>
            </v-col>
            <v-col>{{ item.dados.uiOutros }}</v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- Ver nota dialog -->
    <v-dialog v-model="dialogVerNota.visivel" width="50%">
      <v-card>
        <v-card-title class="indigo darken-4 title white--text">
          Nota
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <v-textarea
                :value="dialogVerNota.nota"
                auto-grow
                outlined
                readonly
                color="indigo"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="red darken-4" dark @click="fecharDialogVerNota()">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: ["info", "tipo"],

  data() {
    return {
      object: [],
      dialogVerNota: {
        visivel: false,
        nota: ""
      },
      backColor: "azul"
    };
  },

  created: function() {
    if (this.tipo) {
      this.object = JSON.parse(JSON.stringify(this.info));
      this.backColor = "laranja";
    } else {
      for (var zc of this.info)
        this.object.push({
          cor: "azul",
          dados: zc,
          nota: null
        });
    }
  },
  methods: {
    verNota(nota) {
      this.dialogVerNota.nota = nota;
      this.dialogVerNota.visivel = true;
    },

    fecharDialogVerNota() {
      this.dialogVerNota.nota = "";
      this.dialogVerNota.visivel = false;
    }
  }
};
</script>
<style scoped>
.info-descricao-verde {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #c8e6c9 !important; /* lighten-4 */
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-vermelho {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #ffcdd2; /* lighten-4 */
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-amarelo {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #ffe0b2; /* lighten-4 */
  font-weight: bold;
  border-radius: 3px;
}

.info-descricao-azul {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  width: 100%;
  background-color: #c5cae9; /* lighten-4 */
  font-weight: bold;
  border-radius: 3px;
}

.info-header-verde {
  background: #c8e6c9;
}

.info-header-vermelho {
  background: #ffcdd2;
}

.info-header-amarelo {
  background: #ffe0b2;
}

.info-header-azul {
  background: #e8eaf6;
}

.info-background-azul {
  background: #e8eaf6;
}

.info-background-laranja {
  background: #fff3e0;
}
</style>
