<template>
  <div>
    <DespachoAprovacao
      v-if="!!sumario"
      @criar="finalizarPedido"
      :sumario="sumario"
    />
    <ConsultaPedido
      :idp="$route.params.idPedido"
      @pedido_original="pedido = $event"
    />
  </div>
</template>

<script>
import ConsultaPedido from "@/components/pedidos/ConsultaPedido.vue"; // @ is an alias to /src
import DespachoAprovacao from "@/components/pedidos/DespachoAprovacao.vue";
const nanoid = require("nanoid");

export default {
  data() {
    return {
      pedido: null,
      sumario: null,
    };
  },
  watch: {
    pedido(newValue) {
      this.sumario = newValue.objeto.dados.titulo;
    },
  },
  methods: {
    finalizarPedido(despacho) {
      const despachoAprovacao = {
        id: "leg_" + nanoid(),
        numero: "1",
        sumario: despacho.sumario,
        tipo: "Despacho",
        data: despacho.data,
        link: "/rada/" + this.pedido.objeto.dados.id,
        diplomaFonte: "RADA",
        dataRevogacao: despacho.dataRevogacao,
        estado: "Ativo",
        entidadesSel: [
          {
            sigla: "DGLAB",
            designacao:
              "Direção-Geral do Livro, dos Arquivos e das Bibliotecas",
            id: "ent_DGLAB",
          },
        ],
        processosSel: [],
      };

      console.log(despachoAprovacao);
    },
  },
  components: {
    ConsultaPedido,
    DespachoAprovacao,
  },
};
</script>
