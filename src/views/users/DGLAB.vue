<template>
<v-content :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }">
    <p class="content-title-1">Painel de controlo DGLAB</p>
    <v-row>
        <v-col cols=3 class="noticias ma-0 pa-0 mt-3" align="center">
            <div align="left" class="separador ma-0">
                Noticias
            </div>
            <Noticias/>
        </v-col>
        <v-col cols=9>
            <GestaoPedidos :pedidos="pedidos" />
            <ListaPendentes/>
        </v-col>
    </v-row>
</v-content>
</template>

<script>
import GestaoPedidos from "@/components/users/GestaoPedidos";
import ListaPendentes from "@/components/pendentes/ListaPendentes";
import Noticias from "@/components/noticias/Noticias";

export default {
    components: {
        GestaoPedidos,
        Noticias,
        ListaPendentes
    },
    data() {
        return {
            loading: true,
            pedidos: [],
        };
    },

    async created() {
        try {
            let {
                email
            } = this.$verifyTokenUser();

            const {
                data
            } = await this.$request(
                "get",
                `/pedidos?criadoPor=${email}`
            );

            this.pedidos = this.atualizaPedidos(data);

            this.loading = false;
        } catch (e) {
            console.log("e", e);
        }
    },

    methods: {
        atualizaPedidos(pedido) {
            return pedido.map((p) => {
                const dados = {};
                dados.codigo = p.codigo;
                dados.tipo = `${p.objeto.tipo} - ${p.objeto.acao}`;
                dados.data = this.converteData(p.data);
                dados.estado = p.estado;

                return dados;
            });
        },

        converteData(data) {
            let novaData = new Date(data);

            let ano = novaData.getFullYear();
            let mes = novaData.getMonth() + 1;
            let dia = novaData.getDate();

            if (dia < 10) {
                dia = "0" + dia;
            }
            if (mes < 10) {
                mes = "0" + mes;
            }

            return `${dia}-${mes}-${ano}`;
        },
    }
}
</script>

<style>
.noticias {
  border-radius: 10px;
}

.separador {
    color: white;
    padding: 6%;
    margin: 5px;
    font-weight: 400;
    width: 100%;
    min-height: 50px;
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
    font-size: 14pt;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}
</style>