<template>
  <div>
    <!--Navbar para large screens-->
    <v-app-bar
      app
      dense
      hide-on-scroll
      id="default-toolbar"
      class="hidden-md-and-down toolbar white--text"
    >
      <v-toolbar-title @click="goHome" style="cursor:pointer;">
        <p class="title-letters-lg font-weight-bold">CLAV -</p>
        <p
          class="subtitle-letter-lg font-weight-light text-wrap"
          v-if="this.$store.state.name == ''"
        >
          Classificação e Avaliação da Informação Pública
        </p>
        <p class="subtitle-letter-lg" v-if="this.$store.state.name != ''">
          {{ this.$store.state.entidade.split("_")[1] }}
        </p>
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
        to="/users/autenticacao"
        v-if="this.$store.state.name === ''"
        rounded
        color="#67CC72"
        class="green--text text--darken-3 px-12 mt-1"
        id="authenticate-button"
      >
        <unicon
          name="login-icon"
          width="21"
          height="21"
          viewBox="0 0 20.711 20.862"
          fill="#ffffff"
        />
        <p class="icon-text white--text">Iniciar Sessão</p>
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
        <v-tabs grow dark show-arrows slider-color="#f3f7fc" id="tab-bar">
          <v-tab active-class="active">
            <unicon
              name="home-icon"
              width="22"
              height="22"
              viewBox="0 0 25.71 25.81"
            />
            <p class="icon-text">O que é</p>
          </v-tab>

          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                <unicon
                  name="registo-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 25.809"
                />
                <p class="icon-text">Registo na Clav</p>
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Como registar-se na CLAV</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Indicação de representante da entidade</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- Falta Gestão da Plataforma, será feito após refactor, pois há diferentes levels de acesso 
          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                <unicon
                  name="registo-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 25.809"
                />
                <p class="icon-text">Gestão da Plataforma</p>
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Como registar-se na CLAV</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Indicação de representante da entidade</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
          -->

          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                <unicon
                  name="operacoes-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 26.68"
                />
                <p class="icon-text">Operações</p>
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Lista Consolidada</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Tabelas de Seleção</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Autos de Eliminação</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Entidades</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Tipologias de Entidades</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Legislação</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Termos de Índice</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Exportação de dados</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >API de dados</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                <unicon
                  name="documentacao-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 29.383"
                />
                <p class="icon-text">Documentação</p>
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Documentos Metodológicos</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap">Manuais</v-list-item-title>
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Formulários e instruções para a CLAV</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Produção Técnica e Científica</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu
            offset-y
            open-on-hover
            nudge-top="2"
            v-if="
              $store.state.token != '' &&
                level >= 3.5 &&
                $store.state.name != ''
            "
          >
            <template v-slot:activator="{ on }">
              <v-tab
                v-on="on"
                active-class="active"
                @click="$router.push('/gestao/gerais')"
              >
                <unicon
                  name="estatisticas-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 20.71 20.75"
                />
                <p class="icon-text">Estatísticas</p>
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="$router.push('/gestao/gerais')">
                <v-list-item-title class="text-wrap"
                  >Métricas Gerais</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="$router.push('/gestao/metrica')">
                <v-list-item-title class="text-wrap"
                  >Métricas de API</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="$router.push('/gestao/classes')">
                <v-list-item-title class="text-wrap"
                  >Métricas de Classes</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="$router.push('/gestao/tabela')">
                <v-list-item-title class="text-wrap"
                  >Tabela de Indicadores</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tab active-class="active">
            <unicon
              name="noticias-icon"
              width="22"
              height="22"
              viewBox="0 0 25.71 25.71"
            />
            <p class="icon-text">Notícias</p>
          </v-tab>
        </v-tabs>
      </template>
      <!--v-btn
        color="red"
        v-if="this.$store.state.name != ''"
        @click="testJWT"
      >
        JWT
      </v-btn-->
    </v-app-bar>
    <!--Navbar para medium/small screens-->
    <v-app-bar
      app
      dense
      hide-on-scroll
      id="default-toolbar"
      class="hidden-lg-and-up hidden-xs-only toolbar white--text"
    >
      <v-toolbar-title @click="goHome" style="cursor:pointer;">
        <p class="title-letters-md font-weight-bold">CLAV -</p>
        <p
          class="subtitle-letter-md font-weight-light text-wrap"
          v-if="this.$store.state.name == ''"
        >
          Classificação e Avaliação da Informação Pública
        </p>
        <p
          class="subtitle-letter-md font-weight-light text-wrap"
          v-if="this.$store.state.name != ''"
        >
          {{ this.$store.state.entidade.split("_")[1] }}
        </p>
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
        to="/users/autenticacao"
        v-if="this.$store.state.name === ''"
        rounded
        color="#67CC72"
        class="blue--text text--darken-3 px-5 mt-1"
        id="authenticate-button"
      >
        <unicon
          name="login-icon"
          width="20"
          height="20"
          viewBox="0 0 20.711 20.862"
          fill="#ffffff"
        />
        <p class="icon-text white--text">Iniciar Sessão</p>
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
          icons-and-text
          slider-color="#f3f7fc"
          id="tab-bar"
        >
          <v-tab active-class="active">
            O que é
            <unicon
              name="home-icon"
              width="22"
              height="22"
              viewBox="0 0 25.71 25.81"
            />
          </v-tab>

          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                Registo na Clav
                <unicon
                  name="registo-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 25.809"
                />
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Como registar-se na CLAV</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Indicação de representante da entidade</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                Operações
                <unicon
                  name="operacoes-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 26.68"
                />
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Lista Consolidada</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Tabelas de Seleção</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Autos de Eliminação</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Entidades</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Tipologias de Entidades</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Legislação</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Termos de Índice</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Exportação de dados</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >API de dados</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y open-on-hover nudge-top="2">
            <template v-slot:activator="{ on }">
              <v-tab v-on="on" active-class="active">
                Documentação
                <unicon
                  name="documentacao-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 25.71 29.383"
                />
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Documentos Metodológicos</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap">Manuais</v-list-item-title>
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Formulários e instruções para a CLAV</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="alert('')">
                <v-list-item-title class="text-wrap"
                  >Produção Técnica e Científica</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu
            offset-y
            open-on-hover
            nudge-top="2"
            v-if="
              $store.state.token != '' &&
                level >= 3.5 &&
                $store.state.name != ''
            "
          >
            <template v-slot:activator="{ on }">
              <v-tab
                v-on="on"
                active-class="active"
                @click="$router.push('/gestao/gerais')"
              >
                Estatísticas
                <unicon
                  name="estatisticas-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 20.71 20.75"
                />
              </v-tab>
            </template>
            <v-list rounded dark id="dark-background-list">
              <v-list-item @click="$router.push('/gestao/gerais')">
                <v-list-item-title class="text-wrap"
                  >Métricas Gerais</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="$router.push('/gestao/metrica')">
                <v-list-item-title class="text-wrap"
                  >Métricas de API</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="$router.push('/gestao/classes')">
                <v-list-item-title class="text-wrap"
                  >Métricas de Classes</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="$router.push('/gestao/tabela')">
                <v-list-item-title class="text-wrap"
                  >Tabela de Indicadores</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
          <v-tab active-class="active">
            Notícias
            <unicon
              name="noticias-icon"
              width="22"
              height="22"
              viewBox="0 0 25.71 25.71"
            />
          </v-tab>
        </v-tabs>
      </template>
      <!--v-btn
        color="red"
        v-if="this.$store.state.name != ''"
        @click="testJWT"
      >
        JWT
      </v-btn-->
    </v-app-bar>
    <!--Navbar para mobile screens-->
    <v-app-bar
      flat
      id="mobile-toolbar"
      class="hidden-sm-and-up toolbar white--text"
    >
      <v-toolbar-title @click="goHome" style="cursor:pointer;">
        <p class="title-letters-md font-weight-bold">CLAV -</p>
        <p
          class="subtitle-letter-md font-weight-light text-wrap"
          v-if="this.$store.state.name == ''"
        >
          Classificação e Avaliação da Informação Pública
        </p>
        <p
          class="subtitle-letter-md font-weight-light text-wrap"
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
              @click="goHome"
              style="cursor:pointer;"
            >
              <p class="title-letters-md font-weight-bold">CLAV</p>
            </v-toolbar-title>
            <v-toolbar-title
              v-if="this.$store.state.name != ''"
              @click="goHome"
              style="cursor:pointer;"
            >
              <p class="title-letters-md font-weight-bold">CLAV -</p>
              <p class="subtitle-letter-md font-weight-light text-wrap">
                {{ this.$store.state.entidade.split("_")[1] }}
              </p>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              to="/users/autenticacao"
              @click="dialog = false"
              v-if="this.$store.state.name === ''"
              rounded
              color="#67CC72"
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
              <p class="icon-text white--text">Iniciar Sessão</p>
            </v-btn>
            <v-btn icon dark @click="dialog = false">
              <v-icon color="red">close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-list rounded color="rgba(0,0,0,0)" dark two-line>
            <v-list-item
              @click="
                $router.push('/');
                dialog = false;
              "
            >
              <v-list-item-title class="px-2 font-weight-bold">
                <unicon
                  name="home-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 25.71 25.81"
                  fill="#f3f7fc"
                />
                <p class="inline mobile-menu-link">
                  O que é
                </p>
              </v-list-item-title>
            </v-list-item>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="px-2 font-weight-bold">
                    <unicon
                      name="registo-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 25.71 25.809"
                      fill="#f3f7fc"
                    />
                    <p class="inline mobile-menu-link">
                      Registo na Clav
                    </p>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Como registar-se na CLAV</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Indicação de representante da entidade</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="px-2 font-weight-bold">
                    <unicon
                      name="operacoes-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 25.71 26.68"
                      fill="#f3f7fc"
                    />
                    <p class="inline mobile-menu-link">
                      Operações
                    </p>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Lista Consolidada</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Tabelas de Seleção</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Autos de Eliminação</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Entidades</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Tipologias de Entidades</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Legislação</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Termos de Índice</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Exportação de dados</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- API de dados</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="px-2 font-weight-bold">
                    <unicon
                      name="documentacao-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 25.71 29.383"
                      fill="#f3f7fc"
                    />
                    <p class="inline mobile-menu-link">
                      Documentação
                    </p>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Documentos Metodológicos</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Formulários e instruções para a CLAV</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Produção Técnica e Científica</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
              v-if="
                $store.state.token != '' &&
                  level >= 3.5 &&
                  $store.state.name != ''
              "
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="px-2 font-weight-bold">
                    <unicon
                      name="estatisticas-icon"
                      width="24"
                      height="24"
                      viewBox="0 0 20.71 20.75"
                      fill="#f3f7fc"
                    />
                    <p class="inline mobile-menu-link">
                      Estatísticas
                    </p>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Métricas Gerais</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Métricas de API</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Métricas de Classes</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  $router.push('/');
                  dialog = false;
                "
              >
                <v-list-item-content>
                  <v-list-item-title class="text-wrap"
                    >- Tabela de Indicadores</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <v-list-item
              @click="
                $router.push('/');
                dialog = false;
              "
            >
              <v-list-item-title class="px-2 font-weight-bold">
                <unicon
                  name="noticias-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 25.71 25.71"
                  fill="#f3f7fc"
                />
                <p class="inline mobile-menu-link">
                  Notícias
                </p>
              </v-list-item-title>
            </v-list-item>
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
      level: 0
    };
  },
  computed: {
    ...mapGetters(["token"])
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
    goHome() {
      this.$router.push("/");
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
  display: inline;
  font-size: 2.4rem;
}
.title-letters-md {
  display: inline;
  font-size: 1.4rem;
}
.subtitle-letter-md {
  display: inline;
  font-size: 1rem;
  vertical-align: text-bottom;
}
.subtitle-letter-lg {
  display: inline;
  padding-left: 12px;
  font-weight: 400;
}
#authenticate-button,
#authenticate-button-mobile {
  box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.4),
    0 2px 4px -1px rgba(255, 255, 255, 0.36) !important;
  text-decoration: none;
}
#authenticate-button-mobile {
  height: 29px !important;
}
#authenticate-button:before,
#authenticate-button-mobile:before {
  background-color: #67cc72 !important;
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
  background-color: rgba(103, 204, 114, 0.8) !important;
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
  min-width: 200px !important;
}
.v-tabs-slider {
  background-color: #f3f7fc !important;
}
.theme--dark.v-footer,
.theme--dark.v-sheet,
.theme--dark.v-card {
  color: #e5e5e5 !important;
}
.icon-text {
  margin-left: 0.625rem;
  display: inline;
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
.inline {
  display: inline-block;
}
.mobile-menu-link {
  margin-left: 20px;
  margin-top: 10px;
}
.v-application .primary--text {
  color: #3899b7 !important;
}
</style>
