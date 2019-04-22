<template>
    <Consulta   tipo="Entidades" 
                v-bind:objeto="entidade"
                v-bind:listaTip = "tipologias"
                v-bind:titulo="titulo"
                v-bind:listaProcD="processosDono"
                v-bind:listaProcP="processosParticipa"
                v-bind:parts="partsReady"
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
        idEntidade: '',
        entidade: {},
        tipologias: [],
        titulo: '',
        processosDono: [],

        processosParticipa: {
                Apreciador: [],
                Assessor: [],
                Comunicador: [],
                Decisor: [],
                Executor: [],
                Iniciador: [],
            },
        partsReady: false,
    }),
    methods: {
        preparaEntidade: async function(ent){
            try{
                var myEntidade = {
                    sigla: {
                        campo: "Sigla",
                        text: ent.sigla,
                    },
                    estado: {
                        campo: "Estado",
                        text: ent.estado,
                    },
                    sioe: {
                        campo: "SIOE",
                        text: ent.sioe,
                    },
                    internacional: {
                        campo: "Internacional",
                        text: ent.internacional,
                    }
                }
                return myEntidade
            } catch(e){
                return {}
            }
        },
        parseParticipacoes: async function(proc){
            try {
            var tipoPar = "";
            var participa = false;

            for(var i=0; i < proc.length; i++ ){
                tipoPar = proc[i].tipoPar.replace(/.*temParticipante(.*)/, '$1');

                this.processosParticipa[tipoPar].push(
                                { titulo: proc[i].titulo,
                                codigo: proc[i].codigo 
                                })
                participa = true;
                }
                if(participa) this.partsReady = true;
            } catch (e) {
                console.log(e)
            }
        }
    },
    created: async function () {
        try {
            this.idEntidade = window.location.pathname.split('/')[2];

            // Informações sobre a entidade
            var response = await axios.get(lhost + "/api/entidades/" + this.idEntidade);
            this.titulo = response.data.designacao;
            this.entidade = await this.preparaEntidade(response.data);

            // Tipologias onde a entidade se encontra
            var tipologias = await axios.get(lhost + "/api/entidades/" + this.idEntidade + "/tipologias");
            this.tipologias = tipologias.data;

            // Processos em que a entidade participa como dono
            var processosDono = await axios.get(lhost + "/api/entidades/" + this.idEntidade + "/intervencao/dono");
            this.processosDono = processosDono.data;

            // Procesos em que a entidade participa
            var processosParticipa = await axios.get(lhost + "/api/entidades/" + this.idEntidade + "/intervencao/participante");
            await this.parseParticipacoes(processosParticipa.data);
        }
        catch(e){
            console.log(e)
        }
        }
}
</script>
