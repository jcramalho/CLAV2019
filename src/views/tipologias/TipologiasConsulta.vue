<template>
    <Consulta   tipo="Tipologias"
                v-bind:objeto="tipologia"
                v-bind:titulo="titulo"
                v-bind:listaProcD="processosDono"
                v-bind:listaEnt="entidades"
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
        entidades: [],
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

            // Informações sobre a tipologia
            var response = await axios.get(lhost + "/api/tipologias/" + this.idTipologia);
            this.titulo = response.data.designacao;
            this.tipologia = await this.preparaTipologia(response.data);

            // Processos cuja tipologia em questão é dona de 
            var processosDono = await axios.get(lhost + "/api/tipologias/" + this.idTipologia + "/intervencao/dono");
            this.processosDono = processosDono.data;

            // Entidades que pertencem à tipologia em questão
            var entidades = await axios.get(lhost + "/api/tipologias/" + this.idTipologia + "/elementos");
            this.entidades = entidades.data;
        }
        catch(e){
            console.log(e)
        }
    },
}
</script>