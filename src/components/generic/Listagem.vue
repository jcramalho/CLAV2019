<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
      <!-- HEADER -->
      <v-col class="py-0 my-0">
        <v-btn
          @click="goBack"
          rounded
          class="white--text mb-6"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="default-button"
        >
          <unicon
            name="arrow-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 37.261"
            fill="#ffffff"
          />
          <p class="ml-2">Voltar</p>
        </v-btn>
        <v-card flat style="border-radius: 10px !important;">
          <p
            class="content-title-1 py-5"
            style="color: #4da0d0 !important;  text-align:center;"
          >
            Consultar {{ tipo }}
          </p>
          <div
            class="info-content mx-12 mb-8"
            :class="{
              'margin-mdUp': $vuetify.breakpoint.mdAndUp,
              'margin-smDown': $vuetify.breakpoint.smAndDown
            }"
          >
            <v-tooltip top color="info" open-delay="500">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="search"
                  v-on="on"
                  label="Filtrar"
                  style="text-align: center !important;"
                  class="centered-input mt-n1 mb-2 px-8"
                  single-line
                  clearable
                  hide-details
                ></v-text-field>
              </template>
              <span>Filtrar {{ tipo }}</span>
            </v-tooltip>
          </div>
          <v-card-text>
            <v-data-table
              class="mx-8 mb-8 pa-4"
              id="list-table"
              :headers="headers"
              :items="lista"
              :search="search"
              :footer-props="footer_props"
              v-if="this.headers[this.cabecalho.length - 1]"
            >
              <template v-slot:no-results>
                <v-alert
                  :value="true"
                  color="error"
                  icon="warning"
                  class="font-weight-medium my-3"
                  id="alerta-erro"
                  >Não foram encontrados resultados para
                  <b>"{{ search }}"</b>.</v-alert
                >
              </template>

              <template v-slot:item="props">
                <ListagemTI
                  v-if="tipo === 'Termos de Índice'"
                  :item="props.item"
                  @rowClicked="go($event.idClasse)"
                  style="cursor: pointer;"
                />

                <ListagemTE
                  v-else-if="
                    tipo == 'Entidades' || tipo == 'Tipologias de Entidade'
                  "
                  :item="props.item"
                  @rowClicked="go($event.id)"
                  @iconClicked="
                    switchOperacao($event.operacao.descricao, $event.item.id)
                  "
                  style="cursor: pointer;"
                />

                <ListagemLegislacao
                  v-else-if="tipo == 'Legislação'"
                  :item="props.item"
                  @rowClicked="go($event.numero)"
                  @iconClicked="
                    switchOperacao($event.operacao.descricao, $event.item.id)
                  "
                  style="cursor: pointer;"
                />

                <ListagemNot
                  v-else-if="tipo == 'Notícias'"
                  :item="props.item"
                  @rowClicked="go($event.id)"
                  @iconClicked="
                    switchOperacao($event.operacao.descricao, props.item.id)
                  "
                  style="cursor: pointer;"
                />

                <tr
                  v-else-if="tipo == 'Autos de Eliminação'"
                  @click="go(props.item.id)"
                  style="cursor: pointer;"
                >
                  <td v-for="(campo, index) in props.item" v-bind:key="index">
                    <div v-if="props.item">
                      <div v-if="index === 'entidade'">
                        <a :href="'/entidades/ent_' + campo">{{ campo }}</a>
                      </div>
                      <div v-else>{{ campo }}</div>
                    </div>
                  </td>
                </tr>

                <tr v-else @click="go(props.item.id)" style="cursor: pointer;">
                  <td v-for="(campo, index) in props.item" v-bind:key="index">
                    <div>{{ campo }}</div>
                  </td>
                </tr>
              </template>

              <template v-slot:footer.page-text="props">
                Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
                {{ props.itemsLength }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ListagemTI from "@/components/generic/ListagemTI";
import ListagemTE from "@/components/generic/ListagemTE";
import ListagemE from "@/components/generic/ListagemE";
import ListagemLegislacao from "@/components/generic/ListagemLegislacao";
import ListagemNot from "@/components/generic/ListagemNot";

export default {
  props: ["lista", "tipo", "cabecalho", "campos", "ids"],
  components: {
    ListagemTI,
    ListagemTE,
    ListagemLegislacao,
    ListagemNot
  },
  data: () => ({
    search: "",
    headers: [],
    dialog: false,
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    }
  }),
  methods: {
    go(id) {
      let idLeg = "";
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades/ent_" + id);
          break;
        case "Tipologias de Entidade":
          this.$router.push("/tipologias/tip_" + id);
          break;
        case "Legislação":
          for (let i = 0; i < this.ids.length; i++) {
            if (this.ids[i].numero === id) {
              idLeg = this.ids[i].id;
              break;
            }
          }
          this.$router.push("/legislacao/" + idLeg);
          break;
        case "Termos de Índice":
          this.$router.push("/classes/consultar/c" + id);
          break;
        case "Autos de Eliminação":
          this.$router.push("/autosEliminacao/ae_" + id);
          break;
        case "Notícias":
          this.$router.push("/noticias/" + id);
          break;
      }
    },

    goEditar(id) {
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades/editar/ent_" + id);
          break;
        case "Tipologias de Entidade":
          this.$router.push("/tipologias/editar/tip_" + id);
          break;
        case "Legislação":
          this.$router.push("/legislacao/editar/" + id);
          break;
        case "Notícias":
          this.$router.push("/noticias/editar/" + id);
          break;
        // case "Termos de Índice":
        //   this.$router.push("/classes/consultar/c" + id);
        //   break;
        // case "Autos de Eliminação":
        //   this.$router.push("/autosEliminacao/ae_" + id);
        //   break;
        default:
          this.$router.push("/");
          break;
      }
    },

    switchOperacao(op, id) {
      switch (op) {
        case "Alteração":
          this.goEditar(id);
          break;

        case "Remoção":
          break;

        default:
          break;
      }
    },
    goBack() {
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades");
          break;
        case "Tipologias de Entidade":
          this.$router.push("/tipologias");
          break;
        case "Legislação":
          this.$router.push("/legislacao");
          break;
        case "Notícias":
          this.$router.push("/noticias");
          break;
        // case "Termos de Índice":
        //   this.$router.push("/classes/consultar/c" + id);
        //   break;
        // case "Autos de Eliminação":
        //   this.$router.push("/autosEliminacao/ae_" + id);
        //   break;
        default:
          this.$router.push("/");
          break;
      }
    }
  },
  created: function() {
    try {
      for (let i = 0; i < this.cabecalho.length; i++) {
        switch (this.campos[i]) {
          case "operacoes":
            this.headers[i] = {
              text: this.cabecalho[i],
              value: this.campos[i],
              align: "end",
              width: "10%"
            };
            break;
          case "entidades":
            this.headers[i] = {
              text: this.cabecalho[i],
              value: this.campos[i],
              width: "12%"
            };
            break;
          case "numero":
            this.headers[i] = {
              text: this.cabecalho[i],
              value: this.campos[i],
              width: "10%"
            };
            break;
          default:
            this.headers[i] = {
              text: this.cabecalho[i],
              value: this.campos[i]
            };
            break;
        }
      }
    } catch (e) {
      return e;
    }
  }
};
</script>
<style scoped>
.centered-input >>> input {
  text-align: center;
}
.centered-input >>> .v-text-field__slot {
  margin-left: 30px !important;
}
.margin-mdUp {
  margin-right: 10% !important;
  margin-left: 10% !important;
}
.margin-smDown {
  margin-right: 2% !important;
  margin-left: 2% !important;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
#list-table {
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.32);
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);
  border-radius: 10px;
  background-color: #f4f5f7;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
