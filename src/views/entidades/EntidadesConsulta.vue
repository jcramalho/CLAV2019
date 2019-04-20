<template>
    <Consulta   tipo="Entidades" 
                v-bind:objeto="entidade"
                v-bind:listaTip = "tipologias"
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
        tipologias: [],
        titulo: '',
    }),
    methods: {
        preparaEntidade: async function(ent, tip){
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
    },
        created: async function () {
        try {
            this.idEntidade = window.location.pathname.split('/')[2];

            var response = await axios.get(lhost + "/api/entidades/" + this.idEntidade);
            this.titulo = response.data.designacao;
            this.entidade = await this.preparaEntidade(response.data);
            var tipologias = await axios.get(lhost + "/api/entidades/" + this.idEntidade + "/tipologias");
            this.tipologias = tipologias.data;
        }
        catch(e){
            console.log(e)
        }
        }
}
</script>
