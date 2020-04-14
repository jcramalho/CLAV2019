import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "Justificação de Complementaridade de Informação",
          "Justificação de Densidade de Informação",
          "Justificação Gestionária",
          "Justificação Legal",
          "Justificação de Utilidade Administrativa"
        ],
        datasets: [
          {
            backgroundColor: [
              "#E57373",
              "#D32F2F",
              "#7986CB",
              "#5C6BC0",
              "#26A69A",
              "#00897B"
            ],
            data: [0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Critérios de justificação'
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/stats/critstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i){
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'CriterioJustificacaoComplementaridadeInfo'
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'CriterioJustificacaoDensidadeInfo'
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'CriterioJustificacaoGestionario'
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'CriterioJustificacaoLegal'
              }).valor;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'CriterioJustificacaoUtilidadeAdministrativa'
              }).valor;
              break;
            default:
              break;
          }
        }
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};
