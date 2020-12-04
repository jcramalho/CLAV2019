<template>
<div>
    <!--Navbar para xl/lg/md/sm screens-->
    <v-app-bar app dense id="default-toolbar" class="white--text toolbar hidden-xs-only">
        <v-toolbar-title @click="go('/')" style="cursor:pointer;" :class="{
          'toolbar-title-sm': $vuetify.breakpoint.smOnly,
        }">
            <v-img id="logo" contain height="60px" :src="require('./../assets/CLAV-LOGO-TEST-11.svg')" />
            <!--v-tooltip bottom color="info">
                <template v-slot:activator="{ on }">
                    <v-img v-on="on" src="./../assets/CLAV-LOGO-TEST-12.png" max-width="125px" contain>
                        <template v-slot:placeholder>
                            <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                            >
                                <v-progress-circular
                                    indeterminate
                                    color="grey lighten-5"
                                ></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                </template>
                <span>Voltar à página inicial</span>
            </v-tooltip>
            <span v-if="this.$store.state.name == ''" :class="{
            'subtitle-letter-lg': $vuetify.breakpoint.lgAndUp,
            'subtitle-letter-md': $vuetify.breakpoint.mdAndDown,
            'subtitle-letter-sm': $vuetify.breakpoint.smOnly,
          }" class="d-inline font-weight-light text-wrap">Classificação e Avaliação da Informação Pública</span>
            <span v-if="this.$store.state.name != ''" :class="{
            'subtitle-letter-lg': $vuetify.breakpoint.lgAndUp,
            'subtitle-letter-md': $vuetify.breakpoint.mdAndDown,
            'subtitle-letter-sm': $vuetify.breakpoint.smOnly,
          }" class="d-inline font-weight-light text-wrap">{{ this.$store.state.entidade.split('_')[1] }}</span-->
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-snackbar v-model="snackbar" :timeout="timeout" :color="color" :top="true">
            {{ text }}
            <v-btn icon color="white" @click="fecharSnackbar">
                <unicon name="remove-icon" width="15" height="15" viewBox="0 0 20.71 20.697" fill="#ffffff" />
            </v-btn>
        </v-snackbar>
        <v-btn v-if="this.$store.state.name === ''" to="/users/autenticacao" rounded color="#399D44" :class="{
          'px-12': $vuetify.breakpoint.lgAndUp,
          'px-8': $vuetify.breakpoint.mdAndDown,
        }" class="green--text text--darken-3 mt-1" id="authenticate-button">
            <unicon name="login-icon" width="21" height="21" viewBox="0 0 20.711 20.862" fill="#ffffff" />
            <p class="d-inline ml-3 white--text">Iniciar Sessão</p>
        </v-btn>
        <v-btn v-if="this.$store.state.name != ''" @click="drawerNotificacoes" icon color="blue">
            <v-badge color="red" overlap v-if="n > 0">
                <unicon name="perfil-icon" width="24" height="24" viewBox="0 0 20.71 23.677" fill="#e5e5e5" />
                <template v-slot:badge>
                    {{ n }}
                </template>
            </v-badge>
            <unicon v-else name="perfil-icon" width="24" height="24" viewBox="0 0 20.71 23.677" fill="#e5e5e5" />
        </v-btn>
        <v-btn v-if="this.$store.state.name != ''" @click="drawerDefinicoes" text rounded dark id="user-button">
            <p>{{ $store.state.name }}</p>
            <unicon name="arrow-down-icon" width="15" height="15" viewBox="0 0 37.262 20.71" fill="#e5e5e5" />
        </v-btn>
        <template v-slot:extension>
            <v-tabs grow dark show-arrows hide-slider id="tab-bar" :icons-and-text="$vuetify.breakpoint.mdAndDown">
                <v-container class="pa-0" v-for="tab in tabsAcessiveis" :key="tab.titulo">
                    <v-tab v-if="!tab.menu" :class="{ active: tab.titulo == tabAtiva }" @click="go(tab.url)" style="height: 49px;">
                        <p class="hidden-lg-and-up">{{ tab.titulo }}</p>
                        <unicon v-if="tab.icon" :name="tab.icon.nome" width="22" height="22" :viewBox="tab.icon.viewbox" />
                        <p class="ml-3 hidden-md-and-down">{{ tab.titulo }}</p>
                    </v-tab>
                    <v-menu v-if="tab.menu" offset-y open-on-hover max-height="75%">
                        <template v-slot:activator="{ on }">
                            <v-tab v-on="on" :class="{ active: tab.titulo == tabAtiva }" style="height: 48px;">
                                <p class="hidden-lg-and-up">{{ tab.titulo }}</p>
                                <unicon v-if="tab.icon" :name="tab.icon.nome" width="22" height="22" :viewBox="tab.icon.viewbox" />
                                <p class="ml-3 hidden-md-and-down">{{ tab.titulo }}</p>
                            </v-tab>
                        </template>
                        <v-list rounded dark id="dark-background-list">
                            <v-list-item v-for="(menuLink, i) in tab.menu" :key="menuLink.opcao" @mouseleave="hover = false">
                                <v-row>
                                    <v-col>
                                        <v-row @click="go(menuLink.url)" @mouseover="hover = true; activeItem = i" justify="center">
                                            {{ menuLink.opcao }}
                                        </v-row>
                                        <v-row v-if="hover && i === activeItem && menuLink.acoes" class="ma-0 pa-0" justify="center">
                                            <v-col v-for="action in menuLink.acoes" :key="action.name" cols=4>
                                                <v-btn @click.prevent="go(action.url)" icon class="white--text">
                                                    <unicon :name="action.icon" width="20" height="20" viewBox="0 0 20.71 20.697" fill="#ffffff" />
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
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
    <v-app-bar flat id="mobile-toolbar" class="hidden-sm-and-up toolbar white--text">
        <v-toolbar-title @click="goRoute('/')" style="cursor: pointer;">
            <p class="title-letters-md font-weight-bold d-inline">CLAV -</p>
            <p class="subtitle-letter-md font-weight-light d-inline text-wrap" v-if="this.$store.state.name == ''">
                Classificação e Avaliação da Informação Pública
            </p>
            <p class="subtitle-letter-md font-weight-light d-inline text-wrap" v-if="this.$store.state.name != ''">
                {{ this.$store.state.entidade.split('_')[1] }}
            </p>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="this.$store.state.name != ''" @click="drawerNotificacoes" icon color="blue">
            <v-badge color="red" :content="n" overlap>
                <unicon name="perfil-icon" width="24" height="24" viewBox="0 0 20.71 23.677" fill="#e5e5e5" />
            </v-badge>
        </v-btn>
        <v-btn v-if="this.$store.state.name != ''" @click="drawerDefinicoes" text dark rounded class="mr-8" id="user-button">
            <p class="text-wrap">{{ $store.state.name }}</p>
            <unicon name="arrow-down-icon" width="15" height="15" viewBox="0 0 37.262 20.71" fill="#e5e5e5" />
        </v-btn>
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="fade-transition">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon dark>
                    <unicon name="menu-icon" width="24" height="24" viewBox="0 0 20.71 17.258" fill="#ffffff" />
                </v-btn>
            </template>
            <v-card class="toolbar">
                <v-app-bar dark flat id="mobile-toolbar" class="toolbar">
                    <v-toolbar-title v-if="this.$store.state.name == ''" @click="goRoute('/')" style="cursor:pointer;">
                        <p class="title-letters-md font-weight-bold d-inline">CLAV</p>
                    </v-toolbar-title>
                    <v-toolbar-title v-if="this.$store.state.name != ''" @click="goRoute('/')" style="cursor:pointer;">
                        <p class="title-letters-md font-weight-bold d-inline">CLAV -</p>
                        <p class="subtitle-letter-md font-weight-light d-inline text-wrap">
                            {{ this.$store.state.entidade.split('_')[1] }}
                        </p>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn to="/users/autenticacao" @click="dialog = false" v-if="this.$store.state.name === ''" rounded color="#399D44" class="blue--text text--darken-3 px-3 mr-3" id="authenticate-button-mobile">
                        <unicon name="login-icon" width="20" height="20" viewBox="0 0 20.711 20.862" fill="#ffffff" />
                        <p class="d-inline ml-3 white--text">Iniciar Sessão</p>
                    </v-btn>
                    <v-btn icon dark @click="dialog = false">
                        <v-icon color="red">close</v-icon>
                    </v-btn>
                </v-app-bar>
                <v-list rounded color="rgba(0,0,0,0)" dark two-line>
                    <v-container class="pa-0" v-for="tab in tabsAcessiveis" :key="tab.titulo">
                        <v-list-item v-if="!tab.menu" @click="
                            goRoute(tab.url);
                            dialog = false;">
                            <v-list-item-title class="px-2 font-weight-bold">
                                <unicon v-if="tab.icon" :name="tab.icon.nome" width="24" height="24" :viewBox="tab.icon.viewbox" fill="#f3f7fc" />
                                <p class="d-inline mobile-menu-link">{{ tab.titulo }}</p>
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="tab.menu" no-action>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="px-2 font-weight-bold">
                                        <unicon v-if="tab.icon" :name="tab.icon.nome" width="24" height="24" :viewBox="tab.icon.viewbox" />
                                        <p class="d-inline mobile-menu-link">{{ tab.titulo }}</p>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item v-for="menuLink in tab.menu" :key="menuLink.opcao" @click="
                                goRoute(menuLink.url);
                                dialog = false;">
                                <v-list-item-content>
                                    <v-list-item-title class="text-wrap"> {{ menuLink.opcao }} </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item>
                    </v-container>
                </v-list>
            </v-card>
        </v-dialog>
    </v-app-bar>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';

export default {
    props: ['n'],
    data() {
        return {
            logotipo: require("@/assets/n1.svg"),
            hover: false,
            activeItem: -1,
            snackbar: false,
            dialog: false,
            color: '',
            timeout: 4000,
            text: '',
            counter: 10,
            level: 0,
            tabAtiva: 'CLAV',
            docs: null, 
            navbar: [{
                    titulo: 'CLAV',
                    icon: {
                        nome: 'home-icon',
                        viewbox: '0 0 25.71 25.81',
                    },
                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    url: '/',
                },
                {
                    titulo: 'Registo na CLAV',
                    icon: {
                        nome: 'registo-icon',
                        viewbox: '0 0 25.71 25.809',
                    },
                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    url: '/registo',
                },
                {
                    titulo: 'Operações',
                    icon: {
                        nome: 'operacoes-icon',
                        viewbox: '0 0 25.71 26.68',
                    },
                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    menu: [{
                            opcao: 'Lista Consolidada',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/lcInfo',
                            acoes: [{
                                    url: '/classes/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/classes/criar',
                                    level: [1, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    url: '/classes/editar',
                                    level: [4, 5, 6, 7],
                                    icon: 'alterar-icon'
                                }
                            ]
                        },
                        {
                            opcao: 'Tabelas de Seleção',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/tsInfo',
                            acoes: [{
                                    url: '/ts/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/ts/criar',
                                    level: [1, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    url: '/ts/importar/csv',
                                    level: [4, 5, 6, 7],
                                    icon: 'importar-icon'
                                }
                            ]
                        },
                        {
                            opcao: 'Relatórios de Avaliação de Documentação Acumulada',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/radaInfo',
                            acoes: [{
                                    url: '/rada/consultar',
                                    level: [4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/rada/criar',
                                    level: [4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                            ]
                        },
                        {
                            opcao: 'Autos de Eliminação',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/autosEliminacaoInfo',
                            acoes: [{
                                    url: '/autosEliminacao/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/autosEliminacao/criar',
                                    level: [1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    url: '/autosEliminacao/importar',
                                    level: [1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'importar-icon'
                                }
                            ]
                        },
                        {
                            opcao: 'Planos de preservação digital',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/planosDePreservacaoDigital',
                            acoes: [{
                                    url: '/ppd/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/ppd/criar',
                                    level: [1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    level: [1, 2, 3, 3.5, 4, 5, 6, 7],
                                    url: '/ppd/importar',
                                    icon: 'importar-icon'
                                }
                            ]
                        },
                        {
                            opcao: 'Entidades',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/entidades',
                            acoes: [{
                                    url: '/entidades/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/entidades/criar',
                                    level: [1, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    url: '/entidades/editar/',
                                    level: [4, 5, 6, 7],
                                    icon: 'alterar-icon'
                                }
                            ]
                        },
                        {
                            opcao: 'Tipologias de Entidades',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/tipologias',
                            acoes: [{
                                    url: '/tipologias/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/tipologias/criar',
                                    level: [1, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    url: '/tipologias/editar/',
                                    level: [4, 5, 6, 7],
                                    icon: 'alterar-icon'
                                }
                            ]
                        },
                        {
                            opcao: 'Legislação',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/legislacao',
                            acoes: [{
                                    url: '/legislacao/consultar',
                                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'consultar-icon'
                                },
                                {
                                    url: '/legislacao/criar',
                                    level: [1, 3, 3.5, 4, 5, 6, 7],
                                    icon: 'criar-icon'
                                },
                                {
                                    url: '/legislacao/editar/',
                                    level: [4, 5, 6, 7],
                                    icon: 'alterar-icon'
                                }
                            ]

                        },
                        {
                            opcao: 'Termos de Índice',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/termosIndiceInfo',
                            acoes: [{
                                url: '/termosIndice',
                                level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                icon: 'consultar-icon'
                            }]
                        },
                        {
                            opcao: 'Exportação de dados',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/exportar',
                        },
                        {
                            opcao: 'API de dados',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/docs',
                            acoes: [{
                                url: 'http://clav.di.uminho.pt/v2/docs/',
                                level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                                icon: 'api-icon'
                            }]
                        },
                    ],
                },
                {
                    titulo: 'Gestão de Pedidos',
                    icon: {
                        nome: 'pedido-novo-icon',
                        viewbox: '0 0 20.83 20.831',
                    },
                    menu: [
                        {
                            opcao: 'Pendentes',
                            level: [1, 3, 3.5, 4, 5, 6, 7],
                            url: '/pendentes',
                        },
                        {
                            opcao: 'Pedidos novos',
                            level: [1, 3, 3.5, 4, 5, 6, 7],
                            url: '/pedidos',
                        }]
                },
                {
                    titulo: 'Estatística',
                    icon: {
                        nome: 'estatisticas-icon',
                        viewbox: '0 0 20.71 20.75',
                    },
                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    menu: [{
                            opcao: 'Métricas Gerais',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/gestao/gerais',
                        },
                        {
                            opcao: 'Métricas de API',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/gestao/metrica',
                        },
                        {
                            opcao: 'Métricas de Classes',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/gestao/classes',
                        },
                        {
                            opcao: 'Tabela de Indicadores',
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/gestao/tabela',
                        },
                    ],
                },
                {
                    titulo: 'Documentação',
                    icon: {
                        nome: 'documentacao-icon',
                        viewbox: '0 0 25.71 29.383',
                    },
                    level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                    menu: [{
                            opcao: "Documentação Técnica de Apoio",
                            level: [0, 1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/docsporclasse',
                        }, {
                            opcao: 'Adicionar Documentação',
                            level: [4, 5, 6, 7],
                            url: '/documentacaoApoioInfo'
                        }]
                },
                {
                    titulo: 'Gestão da Plataforma',
                    icon: {
                        nome: 'gestao-icon',
                        viewbox: '0 0 20.83 20.831',
                    },
                    menu: [
                        {
                            opcao: 'Utilizadores',
                            level: [5, 6, 7],
                            url: '/usersInfo',
                        },
                        {
                            opcao: 'Utilizadores com chaves API',
                            level: [7],
                            url: '/gestao/api/listagem',
                        },
                        {
                            opcao: 'Perfis de utilizadores',
                            level: [1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: "/permissoesAcesso",
                        },
                        {
                            opcao: 'Vocabulários Controlados',
                            level: [1, 2, 3, 3.5, 4, 5, 6, 7],
                            url: '/vocabularios',
                        },
                        {
                            opcao: 'Invariantes',
                            level: [6, 7],
                            url: '/invariantes',
                        },
                        {
                            opcao: 'Administração',
                            level: [7],
                            url: '/gestaoInfo',
                        },
                        {
                            opcao: 'Importação/Exportação de Dados',
                            level: [4, 5, 6, 7],
                            url: '/importExportInfo',
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        ...mapGetters(['token']),

        tabsAcessiveis: function () {
            return this.filtraTabs(this.navbar);
        },
    },
    watch: {
        //apenas atualiza o nível quando o valor do token muda
        async token(oldToken, newToken) {
            this.level = this.$userLevel();
        },
        '$route.meta.tabAtiva': function (newValue) {
            this.tabAtiva = newValue;
        },

        '$store.state.name': function (newValue) {
            this.navbar[0].titulo = newValue ? this.$store.state.entidade.split('_')[1] : 'CLAV';
        },
    },
    created: async function () {
        this.level = this.$userLevel();
        this.tabAtiva = this.$route.meta.tabAtiva;
    },
    methods: {
        go: function (url, param) {
            if (url.startsWith("http")) {
                window.location.href = url;
            } else {
                    this.$router.push(url);
            }
        },
        filtraTabs: function (navbar) {
            var filtered = [];
            for (var i = 0; i < navbar.length; i++) {
                var levelsSet = new Set();

                if (navbar[i].menu) {
                    navbar[i].menu.forEach((m) =>
                        m.level.forEach((l) => levelsSet.add(l))
                    );
                } else {
                    navbar[i].level.forEach((l) => levelsSet.add(l));
                }

                var levels = Array.from(levelsSet);
                if (
                    levels.includes(this.level) &&
                    navbar[i].menu &&
                    ((this.level > 0 &&
                            this.$store.state.token != '' &&
                            this.$store.state.name != '') ||
                        this.level === 0)
                ) {
                    var menu = navbar[i].menu.filter((o) => o.level.includes(this.level));
                    for(var j = 0; j < menu.length; j++)
                        if(navbar[i].menu[j].acoes)
                            menu[j].acoes = menu[j].acoes.filter((o) => o.level ? o.level.includes(this.level) : false);

                    filtered.push({
                        titulo: navbar[i].titulo,
                        icon: navbar[i].icon,
                        menu: menu,
                    });
                } else if (
                    levels.includes(this.level) &&
                    !navbar[i].menu &&
                    ((this.level > 0 &&
                            this.$store.state.token != '' &&
                            this.$store.state.name != '') ||
                        this.level === 0)
                ) {
                    filtered.push({
                        titulo: navbar[i].titulo,
                        icon: navbar[i].icon,
                        level: navbar[i].level,
                        url: navbar[i].url,
                    });
                }
            }
            return filtered;
        },
        drawerNotificacoes() {
            this.$emit('drawerNotificacoes');
        },
        drawerDefinicoes() {
            this.$emit('drawerDefinicoes');
        },
        fecharSnackbar() {
            this.snackbar = false;
        },
        async testJWT() {
            var res = this.$verifyTokenUser();
            alert(JSON.stringify(res));
        },
    },
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
