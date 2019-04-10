<template>
    <Consulta   tipo="Tipologias"
                v-bind:objeto="tipologia"
                v-bind:titulo="titulo"
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
    }),
    created: async function () {
        try {
            this.idTipologia = window.location.pathname.split('/')[2];

            var response = await axios.get(lhost + "/api/tipologias/" + this.idTipologia);
            this.titulo = response.data.designacao;
            this.tipologia = await this.preparaTipologia(response.data);
        }
        catch(e){
            console.log(e)
        }
    },
    methods: {
        preparaTipologia: async function(tip){
            try {
                var myTipologia = {
                    designacao: tip.designacao,
                    sigla: tip.sigla,
                    dono: '',
                    participacao: '',
                    entidades: '',
                }
                return myTipologia
            } catch (e) {
                return {}
            }
        }
    }
}
</script>