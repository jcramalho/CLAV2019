<template>
    <Consulta   tipo="Legislação"
                v-bind:objeto="legislacao"
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
        idLegislacao: '',
        legislacao: {},
        titulo: '',
    }),
    created: async function () {
        try {
            this.idLegislacao = window.location.pathname.split('/')[2];

            var response = await axios.get(lhost + "/api/legislacao/" + this.idLegislacao);
            this.titulo = response.data.tipo + " " + await this.parseEntidades(response.data.entidades) + " " + response.data.numero
            this.legislacao = await this.preparaLegislacao(response.data)
        }
        catch(e){
            console.log(e)
        }
    },
    methods: {
        parseEntidades: async function(ent){
            try {
                var entidades = '';
                for(var i=0; i < ent.length; i++){
                    entidades = entidades + ent[i] + " "
                }
                return entidades
            } catch (e) {
                return {}
            }
        },
        preparaLegislacao: async function(leg){
            try {
                console.log(leg)
                var myLegislacao = {
                    data: {
                        campo: "Data",
                        text: leg.data,
                    },
                    sumario: {
                        campo: "Sumário",
                        text: leg.sumario,
                    },
                    link: {
                        campo: "Link",
                        text:leg.link,
                    },
                    regula: '',
                }
                return myLegislacao
            } catch (e) {
                return {}
            }
        }
    }
}
</script>

