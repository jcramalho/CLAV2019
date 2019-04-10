<template>
    <Consulta   tipo="Entidades" 
                v-bind:objeto="entidade"
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
        idEntidade: '',
        entidade: {},
        titulo: '',
    }),
    created: async function () {
        try {
            this.idEntidade = window.location.pathname.split('/')[2];

            var response = await axios.get(lhost + "/api/entidades/" + this.idEntidade);
            this.titulo = response.data.designacao;
            this.entidade = await this.preparaEntidade(response.data);
        }
        catch(e){
            console.log(e)
        }
    },
    methods: {
        preparaEntidade: async function(ent){
            try{
                var myEntidade = {
                    sigla: ent.sigla,
                    estado: ent.estado,
                    sioe: ent.sioe,
                    internacional: ent.internacional,
                    tipologias: '',
                    intervencao: '',
                }
                return myEntidade
            } catch(e){
                return {}
            }
        }
    }
}
</script>
