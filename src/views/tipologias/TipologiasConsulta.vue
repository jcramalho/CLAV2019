<template>
    <Consulta   tipo="Tipologias"
                v-bind:objeto="tipologia"
                v-bind:titulo="titulo"
                v-bind:listaProcD="processosDono"
                />
</template>

<script>
import Consulta from "@/components/generic/Consulta.vue";
import axios from 'axios';
const lhost = require('@/config/global').host

export default {
    components: {
        Consulta
    },
    data: () => ({
        idTipologia: '',
        tipologia: {},
        titulo: '',
        processosDono: [],
    }),
    methods: {
        preparaTipologia: async function(tip){
            try {
                var myTipologia = {
                    designacao: {
                        campo: "Designação",
                        text: tip.designacao,
                    },
                    sigla: {
                        campo: "Sigla",
                        text: tip.sigla,
                    },
                    participacao: '',
                    entidades: '',
                }
                return myTipologia
            } catch (e) {
                return {}
            }
        },
    },
    created: async function () {
        try {
            this.idTipologia = window.location.pathname.split('/')[2];

            var response = await axios.get(lhost + "/api/tipologias/" + this.idTipologia);
            this.titulo = response.data.designacao;
            this.tipologia = await this.preparaTipologia(response.data);
            var processosDono = await axios.get(lhost + "/api/tipologias/" + this.idTipologia + "/intervencao/dono");
            this.processosDono = processosDono.data;
        }
        catch(e){
            console.log(e)
        }
    },
}
</script>