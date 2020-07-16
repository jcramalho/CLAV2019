<template>
  <div>
    <!--Navbar para xl/lg/md/sm screens-->
    <v-app-bar
      app
      dense
      hide-on-scroll
      id="default-toolbar"
      class="white--text toolbar hidden-xs-only"
    >
      <v-toolbar-title
        @click="goRoute('/', 'O que é')"
        style="cursor:pointer;"
        :class="{
          'toolbar-title-sm': $vuetify.breakpoint.smOnly
        }"
      >
        <v-tooltip bottom color="success">
          <template v-slot:activator="{ on }">
            <span
              v-on="on"
              :class="{
                'title-letters-lg': $vuetify.breakpoint.lgAndUp,
                'title-letters-md': $vuetify.breakpoint.mdAndDown
              }"
              class="d-inline font-weight-bold text-wrap"
            >
              CLAV -
            </span>
          </template>
          <span>Voltar à página inicial</span>
        </v-tooltip>
        <span
          v-on="on"
          v-if="this.$store.state.name == ''"
          :class="{
            'subtitle-letter-lg': $vuetify.breakpoint.lgAndUp,
            'subtitle-letter-md': $vuetify.breakpoint.mdAndDown,
            'subtitle-letter-sm': $vuetify.breakpoint.smOnly
          }"
          class="d-inline font-weight-light text-wrap"
        >
          Classificação e Avaliação da Informação Pública
        </span>
        <span
          v-on="on"
          v-if="this.$store.state.name != ''"
          :class="{
            'subtitle-letter-lg': $vuetify.breakpoint.lgAndUp,
            'subtitle-letter-md': $vuetify.breakpoint.mdAndDown,
            'subtitle-letter-sm': $vuetify.breakpoint.smOnly
          }"
          class="d-inline font-weight-light text-wrap"
        >
          {{ this.$store.state.entidade.split("_")[1] }}
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        :color="color"
        :top="true"
      >
        {{ text }}
        <v-btn text @click="fecharSnackbar">Fechar</v-btn>
      </v-snackbar>
      <v-btn
        v-if="this.$store.state.name === ''"
        to="/users/autenticacao"
        rounded
        color="#399D44"
        :class="{
          'px-12': $vuetify.breakpoint.lgAndUp,
          'px-8': $vuetify.breakpoint.mdAndDown
        }"
        class="green--text text--darken-3 mt-1"
        id="authenticate-button"
      >
        <unicon
          name="login-icon"
          width="21"
          height="21"
          viewBox="0 0 20.711 20.862"
          fill="#ffffff"
        />
        <p class="d-inline ml-3 white--text">Iniciar Sessão</p>
      </v-btn>
      <v-btn
        v-if="this.$store.state.name != ''"
        @click="drawerNotificacoes"
        icon
        color="blue"
      >
        <v-badge color="red" :content="n" overlap>
          <unicon
            name="perfil-icon"
            width="24"
            height="24"
            viewBox="0 0 20.71 23.677"
            fill="#e5e5e5"
          />
        </v-badge>
      </v-btn>
      <v-btn
        v-if="this.$store.state.name != ''"
        @click="drawerDefinicoes"
        text
        rounded
        dark
        id="user-button"
      >
        <p>{{ $store.state.name }}</p>
        <unicon
          name="arrow-down-icon"
          width="15"
          height="15"
          viewBox="0 0 26.358 20.71"
          fill="#e5e5e5"
        />
      </v-btn>
      <template v-slot:extension>
        <v-tabs
          grow
          dark
          show-arrows
          hide-slider
          id="tab-bar"
          :icons-and-text="$vuetify.breakpoint.mdAndDown"
        >
          <v-container
            class="pa-0"
            v-for="tab in tabsAcessiveis"
            :key="tab.titulo"
          >
            <v-tab
              v-if="!tab.menu"
              :class="{ active: tab.titulo == tabAtiva }"
              @click="goRoute(tab.url, tab.titulo)"
              style="height: 49px;"
            >
              <p class="hidden-lg-and-up">{{ tab.titulo }}</p>
              <unicon
                v-if="tab.icon"
                :name="tab.icon.nome"
                width="22"
                height="22"
                :viewBox="tab.icon.viewbox"
              />
              <p class="ml-3 hidden-md-and-down">{{ tab.titulo }}</p>
            </v-tab>
            <v-menu v-if="tab.menu" offset-y open-on-hover nudge-top="2">
              <template v-slot:activator="{ on }">
                <v-tab
                  v-on="on"
                  :class="{ active: tab.titulo == tabAtiva }"
                  style="height: 48px;"
                >
                  <p class="hidden-lg-and-up">{{ tab.titulo }}</p>
                  <unicon
                    v-if="tab.icon"
                    :name="tab.icon.nome"
                    width="22"
                    height="22"
                    :viewBox="tab.icon.viewbox"
                  />
                  <p class="ml-3 hidden-md-and-down">{{ tab.titulo }}</p>
                </v-tab>
              </template>
              <v-list rounded dark id="dark-background-list">
                <v-list-item
                  v-for="menuLink in tab.menu"
                  :key="menuLink.opcao"
                  @click="goRoute(menuLink.url, tab.titulo)"
                >
                  <v-list-item-title class="text-wrap">{{
                    menuLink.opcao
                  }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-container>
        </v-tabs>
      </template>
      <!--
      <v-btn
        color="red"
        v-if="this.$store.state.name != ''"
        @click="testJWT"
      >
        JWT
      </v-btn>-->
    </v-app-bar>
    <!--Navbar para xs (mobile) screens-->
    <v-app-bar
      flat
      id="mobile-toolbar"
      class="hidden-sm-and-up toolbar white--text"
    >
      <v-toolbar-title @click="goRoute('/', 'O que é')" style="cursor:pointer;">
        <p class="title-letters-md font-weight-bold d-inline">CLAV -</p>
        <p
          class="subtitle-letter-md font-weight-light d-inline text-wrap"
          v-if="this.$store.state.name == ''"
        >
          Classificação e Avaliação da Informação Pública
        </p>
        <p
          class="subtitle-letter-md font-weight-light d-inline text-wrap"
          v-if="this.$store.state.name != ''"
        >
          {{ this.$store.state.entidade.split("_")[1] }}
        </p>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="this.$store.state.name != ''"
        @click="drawerNotificacoes"
        icon
        color="blue"
      >
        <v-badge color="red" :content="n" overlap>
          <unicon
            name="perfil-icon"
            width="24"
            height="24"
            viewBox="0 0 20.71 23.677"
            fill="#e5e5e5"
          />
        </v-badge>
      </v-btn>
      <v-btn
        v-if="this.$store.state.name != ''"
        @click="drawerDefinicoes"
        text
        dark
        rounded
        class="mr-8"
        id="user-button"
      >
        <p class="text-wrap">{{ $store.state.name }}</p>
        <unicon
          name="arrow-down-icon"
          width="15"
          height="15"
          viewBox="0 0 26.358 20.71"
          fill="#e5e5e5"
        />
      </v-btn>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="fade-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon dark>
            <unicon
              name="menu-icon"
              width="24"
              height="24"
              viewBox="0 0 20.71 17.258"
              fill="#ffffff"
            />
          </v-btn>
        </template>
        <v-card class="toolbar">
          <v-app-bar dark flat id="mobile-toolbar" class="toolbar">
            <v-toolbar-title
              v-if="this.$store.state.name == ''"
              @click="goRoute('/', 'O que é')"
              style="cursor:pointer;"
            >
              <p class="title-letters-md font-weight-bold d-inline">CLAV</p>
            </v-toolbar-title>
            <v-toolbar-title
              v-if="this.$store.state.name != ''"
              @click="goRoute('/', 'O que é')"
              style="cursor:pointer;"
            >
              <p class="title-letters-md font-weight-bold d-inline">CLAV -</p>
              <p
                class="subtitle-letter-md font-weight-light d-inline text-wrap"
              >
                {{ this.$store.state.entidade.split("_")[1] }}
              </p>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              to="/users/autenticacao"
              @click="dialog = false"
              v-if="this.$store.state.name === ''"
              rounded
              color="#399D44"
              class="blue--text text--darken-3 px-3 mr-3"
              id="authenticate-button-mobile"
            >
              <unicon
                name="login-icon"
                width="20"
                height="20"
                viewBox="0 0 20.711 20.862"
                fill="#ffffff"
              />
              <p class="d-inline ml-3 white--text">Iniciar Sessão</p>
            </v-btn>
            <v-btn icon dark @click="dialog = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-list rounded color="rgba(0,0,0,0)" dark two-line>
            <v-container
              class="pa-0"
              v-for="tab in tabsAcessiveis"
              :key="tab.titulo"
            >
              <v-list-item
                v-if="!tab.menu"
                @click="
                  goRoute(tab.url, tab.titulo);
                  dialog = false;
                "
              >
                <v-list-item-title class="px-2 font-weight-bold">
                  <unicon
                    v-if="tab.icon"
                    :name="tab.icon.nome"
                    width="24"
                    height="24"
                    :viewBox="tab.icon.viewbox"
                    fill="#f3f7fc"
                  />
                  <p class="d-inline mobile-menu-link">{{ tab.titulo }}</p>
                </v-list-item-title>
              </v-list-item>
              <v-list-group v-if="tab.menu" no-action>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title class="px-2 font-weight-bold">
                      <unicon
                        v-if="tab.icon"
                        :name="tab.icon.nome"
                        width="24"
                        height="24"
                        :viewBox="tab.icon.viewbox"
                      />
                      <p class="d-inline mobile-menu-link">{{ tab.titulo }}</p>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="menuLink in tab.menu"
                  :key="menuLink.opcao"
                  @click="
                    goRoute(menuLink.url, tab.titulo);
                    dialog = false;
                  "
                >
                  <v-list-item-content>
                    <v-list-item-title class="text-wrap"
                      >- {{ menuLink.opcao }}</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-container>
          </v-list>
        </v-card>
      </v-dialog>
    </v-app-bar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["n"],
  data() {
    return {
      snackbar: false,
      dialog: false,
      color: "",
      timeout: 4000,
      text: "",
      counter: 10,
      level: 0,
      tabAtiva: "O que é",
      navbar: [
        {
          titulo: "O que é",
          icon: {
            nome: "home-icon",
            viewbox: "0 0 25.71 25.81"
          },
          level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
          url: "/"
        },
        // ? Registo visivel so para sessao nao iniciada?
        {
          titulo: "Registo na Clav",
          icon: {
            nome: "registo-icon",
            viewbox: "0 0 25.71 25.809"
          },
          menu: [
            {
              opcao: "Como registar-se na CLAV",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/comoreg"
            },
            {
              opcao: "Indicação de representante da entidade",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/indirepr"
            }
          ]
        },
        {
          titulo: "Gestão da Plataforma",
          icon: {
            nome: "gestao-icon",
            viewbox: "0 0 20.83 20.831"
          },
          menu: [
            {
              opcao: "Pedidos",
              level: [1, 3, 3.5, 4, 5, 6, 7],
              url: "/pedidos"
            },
            {
              opcao: "Pendentes",
              level: [1, 3, 3.5, 4, 5, 6, 7],
              url: "/pendentes"
            },
            // ?
            {
              opcao: "Invariantes",
              level: [6, 7],
              url: "/invariantes"
            },
            {
              opcao: "Utilizadores",
              level: [5, 6, 7],
              url: "/users"
            },
            {
              opcao: "Vocabulários Controlados",
              level: [1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/vocabularios"
            },
            {
              opcao: "Chaves API",
              level: [7],
              url: "/gestao/api/listagem"
            },
            {
              opcao: "Administração",
              level: [7],
              url: "/gestao/home"
            }
          ]
        },
        {
          titulo: "Operações",
          icon: {
            nome: "operacoes-icon",
            viewbox: "0 0 25.71 26.68"
          },
          menu: [
            {
              opcao: "Lista Consolidada",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/lcinfo"
            },
            {
              opcao: "Tabelas de Seleção",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/tsinfo"
            },
            // ?
            {
              opcao: "Relatórios de Avaliação de Documentação Acumulada",
              level: [1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/radainfo"
            },
            {
              opcao: "Autos de Eliminação",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/autosEliminacao"
            },
            {
              opcao: "Entidades",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/entidades"
            },
            {
              opcao: "Tipologias de Entidades",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/tipologias"
            },
            {
              opcao: "Legislação",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/legislacao"
            },
            {
              opcao: "Termos de Índice",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/termosIndice"
            },
            {
              opcao: "Exportação de dados",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/exportar"
            },
            // ?
            {
              opcao: "API de dados",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/docs"
            }
          ]
        },
        {
          titulo: "Documentação",
          icon: {
            nome: "documentacao-icon",
            viewbox: "0 0 25.71 29.383"
          },
          menu: [
            {
              opcao: "Documentos Metodológicos",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "docsmetdl"
            },
            {
              opcao: "Manuais",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/manuais"
            },
            {
              opcao: "Formulários e instruções para a CLAV",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/forminstrs"
            },
            {
              opcao: "Produção Técnica e Científica",
              level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
              url: "/prodtec"
            }
          ]
        },
        {
          titulo: "Estatísticas",
          icon: {
            nome: "estatisticas-icon",
            viewbox: "0 0 20.71 20.75"
          },
          menu: [
            {
              opcao: "Métricas Gerais",
              level: [3.5, 4, 5, 6, 7],
              url: "/gestao/gerais"
            },
            {
              opcao: "Métricas de API",
              level: [3.5, 4, 5, 6, 7],
              url: "/gestao/metrica"
            },
            {
              opcao: "Métricas de Classes",
              level: [3.5, 4, 5, 6, 7],
              url: "/gestao/classes"
            },
            {
              opcao: "Tabela de Indicadores",
              level: [3.5, 4, 5, 6, 7],
              url: "/gestao/tabela"
            }
          ]
        },
        {
          titulo: "Notícias",
          icon: {
            nome: "noticias-icon",
            viewbox: "0 0 25.71 25.71"
          },
          level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
          url: "/noticias"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["token"]),

    tabsAcessiveis: function() {
      return this.filtraTabs(this.navbar);
    }
  },
  watch: {
    //apenas atualiza o nível quando o valor do token muda
    async token(oldToken, newToken) {
      this.level = this.$userLevel();
    }
  },
  created: async function() {
    this.level = this.$userLevel();
  },
  methods: {
    goRoute: function(url, novaTab) {
      this.tabAtiva = novaTab;
      this.$router.push(url);
    },
    filtraTabs: function(navbar) {
      var filtered = [];
      for (var i = 0; i < navbar.length; i++) {
        var levelsSet = new Set();

        if (navbar[i].menu) {
          navbar[i].menu.forEach(m => m.level.forEach(l => levelsSet.add(l)));
        } else {
          navbar[i].level.forEach(l => levelsSet.add(l));
        }

        var levels = Array.from(levelsSet);
        if (
          levels.includes(this.level) &&
          navbar[i].menu &&
          ((this.level > 0 &&
            this.$store.state.token != "" &&
            this.$store.state.name != "") ||
            this.level === 0)
        ) {
          filtered.push({
            titulo: navbar[i].titulo,
            icon: navbar[i].icon,
            menu: navbar[i].menu.filter(o => o.level.includes(this.level))
          });
        } else if (
          levels.includes(this.level) &&
          !navbar[i].menu &&
          ((this.level > 0 &&
            this.$store.state.token != "" &&
            this.$store.state.name != "") ||
            this.level === 0)
        ) {
          filtered.push({
            titulo: navbar[i].titulo,
            icon: navbar[i].icon,
            level: navbar[i].level,
            url: navbar[i].url
          });
        }
      }
      return filtered;
    },
    drawerNotificacoes() {
      this.$emit("drawerNotificacoes");
    },
    drawerDefinicoes() {
      this.$emit("drawerDefinicoes");
    },
    fecharSnackbar() {
      this.snackbar = false;
    },
    async testJWT() {
      var res = this.$verifyTokenUser();
      alert(JSON.stringify(res));
    }
  }
};
</script>
<style scoped>
/*Nota: Testar compatibilidade entre browsers*/
.toolbar {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
}
#default-toolbar {
  height: 106px !important;
}
#mobile-toolbar {
  height: 60px !important;
}
#tab-bar {
  margin-top: 15px;
  background: rgba(0, 0, 0, 0.1);
}
.button-pad {
  padding: 0px 20px;
}
.title-letters-lg {
  font-size: 2.4rem;
}
.title-letters-md {
  font-size: 1.8rem;
}
.subtitle-letter-md {
  padding-left: 6px;
  font-size: 1rem;
  vertical-align: text-bottom;
}
.subtitle-letter-lg {
  padding-left: 12px;
  vertical-align: text-bottom;
}
.toolbar-title-sm {
  padding-top: 8px !important;
  line-height: 1 !important;
}
.subtitle-letter-sm {
  vertical-align: unset !important;
}
#authenticate-button,
#authenticate-button-mobile {
  box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.4),
    0 2px 4px -1px rgba(255, 255, 255, 0.36) !important;
  text-decoration: none;
  background-color: #46c354 !important;
}
#authenticate-button-mobile {
  height: 29px !important;
}
#authenticate-button:before,
#authenticate-button-mobile:before {
  background-color: #46c354 !important;
}
#user-button::before {
  background-color: transparent !important;
}
#user-button {
  outline: none !important;
  padding: 0 4px !important;
}
#authenticate-button:hover,
#authenticate-button-mobile:hover {
  background-color: rgb(70, 195, 84, 0.8) !important;
}
#authenticate-button:hover:before,
#authenticate-button-mobile:hover:before {
  color: green;
}
#authenticate-icon {
  vertical-align: bottom;
}
.v-tab {
  text-transform: none !important;
  font-weight: 600 !important;
  color: #f3f7fc !important;
  fill: #f3f7fc !important;
  opacity: 1 !important;
  min-width: 250px !important;
}
.v-tabs-slider {
  background-color: #f3f7fc !important;
}
.theme--dark.v-footer,
.theme--dark.v-sheet,
.theme--dark.v-card {
  color: #e5e5e5 !important;
}
.active {
  color: #0057b7 !important;
  background-color: #f3f7fc !important;
  border-radius: 10px 10px 0px 0px;
  fill: #0057b7 !important;
}
.v-menu__content {
  text-align: center;
  border-radius: 0px 0px 10px 10px !important;
  background-color: #09337f !important;
  max-width: 180px !important;
}
#dark-background-list {
  background-color: #09337f !important;
}
.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.v-list-item__title {
  font-size: 0.85rem !important;
  font-weight: 500;
}
.mobile-menu-link {
  margin-left: 20px;
  margin-top: 10px;
}
.v-application .primary--text {
  color: #3899b7 !important;
  fill: #3899b7 !important;
}
</style>
