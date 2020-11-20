<template>
<v-app v-if="authenticated">
    <MainPageHeader :n="notificacoes ? notificacoes.length : '0'" @drawerNotificacoes="drawerNotificacoes()" @drawerDefinicoes="drawerDefinicoes()" />
    <v-snackbar v-model="snackbar" :color="color" :top="true" :timeout="0">
        {{ text }}
        <v-btn icon color="white" @click="fecharSnackbar">
            <unicon name="remove-icon" width="15" height="15" viewBox="0 0 20.71 20.697" fill="#ffffff" />
        </v-btn>
    </v-snackbar>

    <v-main :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
        <router-view />
        <Notificacoes v-if="this.$store.state.name != ''" :drawer="drawN" :notificacoes="notificacoes" @removerNotificacao="removerNotificacao($event)" />
        <Definicoes v-if="this.$store.state.name != ''" :drawer="drawD" :socket="socket" />
    </v-main>

    <PageFooter />
</v-app>
</template>

<script>
import PageFooter from '@/components/PageFooter.vue'; // @ is an alias to /src
import MainPageHeader from '@/components/MainPageHeader.vue'; // @ is an alias to /src
import Definicoes from '@/components/principal/Definicoes.vue';
import Notificacoes from '@/components/principal/Notificacoes.vue';
import io from 'socket.io-client';
import {
    bus
} from './main';
const lhost = require('@/config/global').host;

export default {
    name: 'App',
    components: {
        PageFooter,
        MainPageHeader,
        Definicoes,
        Notificacoes,
    },
    watch: {
        async $route(to, from) {
            //verifica se o utilizador está autenticado
            if (this.$store.state.token != '') {
                var user = this.$verifyTokenUser();
                this.level = user.level;
            }
            // else {
            //   if(this.socket) this.socket.disconnect();
            // }

            this.authenticated = false;
            //verifica se o utilizador tem de estar autenticado para aceder à rota
            if (to.matched.some((record) => !record.meta.levels.includes(0))) {
                if (this.$store.state.token != '' && this.level > 0) {
                    //se está autenticado, verifica se tem permissões suficientes para a ceder a página
                    if (
                        to.matched.some((record) => record.meta.levels.includes(this.level))
                    ) {
                        this.authenticated = true;
                    } else {
                        this.text = 'Não tem permissões para aceder a esta página!';
                        this.color = 'error';
                        this.snackbar = true;
                        this.$router.push('/');
                    }
                } else {
                    this.text =
                        'Não tem permissões para aceder a esta página! Por favor faça login.';
                    this.color = 'error';
                    this.snackbar = true;
                    this.$router.push('/users/autenticacao');
                }
            } else {
                this.authenticated = true;
            }

            if (this.$route.query.erro) {
                //msg de erro
                this.text = this.$route.query.erro;
                this.color = 'error';
                this.snackbar = true;
                this.$router.push(this.$route.path);
            } else if (this.$route.query.sucesso) {
                //msg de sucesso
                this.text = this.$route.query.sucesso;
                this.color = 'success';
                this.snackbar = true;
                this.$router.push(this.$route.path);
            }
        },
    },
    methods: {
        fecharSnackbar() {
            this.snackbar = false;
        },
        sizeUpdate(size) {
            this.size = size;
        },
        drawerNotificacoes() {
            this.drawD = false;
            // this.drawE = false;
            this.drawN = !this.drawN;
        },
        drawerDefinicoes() {
            // this.drawE = false;
            this.drawN = false;
            this.drawD = !this.drawD;
        },
        drawerEstatisticas() {
            this.drawD = false;
            this.drawN = false;
            // this.drawE = !this.drawE;
        },
        removerNotificacao(msg) {
            const index = this.notificacoes.indexOf(msg);
            if (index > -1) {
                this.notificacoes.splice(index, 1);
            }
            this.socket.emit('remove', msg);
        },
        consume() {
            this.notificacoes = [];
            var email = this.$verifyTokenUser().email;
            if (email) {
                this.socket = io.connect('http://localhost:7779', {
                    reconnectionAttempts: 1
                }); //lhost.replace('/v2', '')
                this.socket.emit('email', {
                    email: email,
                });
                this.socket.on(this.$verifyTokenUser().email, (data) => {
                    this.notificacoes.push(JSON.parse(data));
                });
            }
        },
    },
    created() {
        if (this.$store.state.token != '') this.consume();
        bus.$on('notificacoes', (d) => {
            this.consume();
        });
    },
    data: () => ({
        socket: null,
        drawD: false,
        // drawE: false,
        drawN: false,
        snackbar: false,
        notificacoes: [],
        authenticated: false,
        color: '',
        text: '',
        classeOps: ['Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'],
        entidadeOps: ['Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'],
        tipologiaOps: ['Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'],
        legislacaoOps: ['Listar', 'Consultar', 'Inserir', 'Alterar', 'Desativar'],
        level: 0,
    }),
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&display=swap');

#app {
    font-family: 'Montserrat', sans-serif;
}

.v-alert {
    text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.v-application .body-2 {
    font-family: 'Montserrat', sans-serif !important;
}

.v-application .caption {
    font-family: 'Montserrat', sans-serif !important;
}

.v-application--wrap {
    background-color: #f3f7fc;
}

.v-application p {
    margin-bottom: 0 !important;
}

.v-application a {
    color: #1976d2 !important;
}

.v-application a:hover {
    color: #1a237e;
    background-color: transparent;
}

.v-application--is-ltr .v-text-field__prefix {
    padding-right: 12px !important;
}

.v-application--is-ltr .v-treeview-node__toggle--open {
    color: #46c354 !important;
}

.v-btn {
    text-transform: none !important;
    font-weight: 600 !important;
    outline: none !important;
}

.v-btn__content {
    width: 100%;
    white-space: normal;
}

.v-card__subtitle,
.v-card__text {
    line-height: 1.8rem !important;
}

.v-chip {
    white-space: normal !important;
}

.v-chip .v-chip__close.v-icon {
    color: #b71c1c !important;
}

.v-content {
    padding: 5.125rem 0 1.75rem !important;
    color: #606060 !important;
}

.v-data-table td {
    padding-top: 10px;
    padding-bottom: 10px;
}

.v-expansion-panel-header__icon {
    margin-left: -29px !important;
}

.theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .theme--light.v-text-field.v-input--is-disabled .v-input__slot::before {
    border-image: repeating-linear-gradient(to right,
            rgba(1, 85, 181, 0.38) 0px,
            rgba(1, 85, 181, 0.38) 2px,
            transparent 2px,
            transparent 4px) 1 repeat !important;
}

.theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
    color: rgb(255, 255, 255) !important;
}

.v-form .v-label {
    margin: 0 !important;
}

.v-input__slot {
    margin-bottom: 0 !important;
}

.v-input__slot::before {
    border-color: #4da0d0 !important;
}

.v-input--selection-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
}

.v-input--switch--inset .v-input--switch__track,
.v-input--switch--inset .v-input--selection-controls__input {
    margin: auto !important;
}

.theme--light.v-input input,
.theme--light.v-input textarea,
.theme--light.v-select .v-select__selection--comma {
    color: #000000 !important;
    font-weight: bold !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}

.theme--light.v-input--is-disabled input,
.theme--light.v-input--is-disabled textarea {
    color: rgba(0, 0, 0, 0.38) !important;
}

.v-icon.v-icon.v-icon--link {
    color: #0155b5;
}

.theme--light.v-text-field--filled>.v-input__control>.v-input__slot {
    background: none !important;
}

.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    fill: #ffffff !important;
    border-radius: 40px;
}

.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
    border-radius: 40px;
    background-color: #002a8f !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 40px;
}

.theme--light.v-list-item:hover::before {
    opacity: 0.1;
    background-color: #4da0d0;
    border-radius: 40px;
}

.theme--light.v-list-item::before {
    background-color: #4da0d0;
    border-radius: 40px;
}

.theme--light.v-list {
    background: #f1f6f8 !important;
}

.v-list-item__title,
.v-list-item__subtitle {
    white-space: normal !important;
}

.v-menu__content {
    border-radius: 0px 0px 10px 10px !important;
}

.v-ripple__container {
    border-radius: 40px !important;
    color: rgba(0, 85, 181, 0.3) !important;
}

.v-snack__wrapper {
    border-radius: 40px !important;
}

.v-stepper {
    border-radius: none !important;
    box-shadow: none !important;
}

.v-stepper__header {
    box-shadow: none !important;
    border-bottom: 2px solid #d8d8d8;
}

.v-stepper__label {
    display: flex !important;
}

.theme--light.v-stepper .v-stepper__step--editable:hover {
    background: none !important;
}

.theme--light.v-stepper .v-stepper__step--active .v-stepper__label {
    font-weight: bold !important;
    color: rgb(26, 35, 126) !important;
    text-shadow: 0px 1px 2px rgba(26, 35, 126, 0.22) !important;
}

.theme--light.v-stepper .v-stepper__step--complete .v-stepper__label {
    color: rgba(43, 158, 54, 0.5) !important;
}

.theme--light.v-tabs .v-tab:hover::before {
    border-radius: 40px !important;
}

.theme--dark.v-tabs .v-tab:hover::before {
    border-radius: 40px !important;
}

.v-tab::before {
    border-radius: 40px !important;
}

.v-text-field .v-label {
    left: 0 !important;
    right: 0 !important;
    margin: auto !important;
}

.v-text-field .v-label {
    max-width: 100% !important;
}

.v-text-field>.v-input__control>.v-input__slot::after {
    border-width: 2px !important;
}

.v-text-field input {
    letter-spacing: 3px;
}

#alerta-erro {
    border-radius: 40px !important;
    text-align: center !important;
}

b {
    font-weight: 500 !important;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}

#botao-shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
        0 2px 4px -1px rgba(0, 0, 0, 0.36) !important;
    outline: none !important;
}

.content-title-1 {
    font-size: 2rem;
    font-weight: 600;
    color: #4da0d0;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.32);
    padding-bottom: 2rem;
    text-align: center;
}

.content-title-2 {
    font-size: 1.2rem;
    font-weight: 500;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);
}

.content-text {
    color: #666666 !important;
    font-size: 1rem;
    word-spacing: 2px;
    line-height: 1.8;
}

#default-button {
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4),
        0 2px 4px -1px rgba(0, 0, 0, 0.36) !important;
    outline: none !important;
}

#default-chip {
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
}

#default-button:hover {
    background: linear-gradient(to right, #353d83 0%, #216fc7 100%);
}

label {
    margin-bottom: 0 !important;
}
</style>
