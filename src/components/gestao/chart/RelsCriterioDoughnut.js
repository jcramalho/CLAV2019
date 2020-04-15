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
          text: "Critérios de justificação"
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/indicadores/critstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i) {
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return (
                  elem.indicador === "CriterioJustificacaoComplementaridadeInfo"
                );
=======
                return elem.indicador === 'CriterioJustificacaoComplementaridadeInfo'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "CriterioJustificacaoDensidadeInfo";
=======
                return elem.indicador === 'CriterioJustificacaoDensidadeInfo'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "CriterioJustificacaoGestionario";
=======
                return elem.indicador === 'CriterioJustificacaoGestionario'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "CriterioJustificacaoLegal";
=======
                return elem.indicador === 'CriterioJustificacaoLegal'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return (
                  elem.indicador ===
                  "CriterioJustificacaoUtilidadeAdministrativa"
                );
=======
                return elem.indicador === 'CriterioJustificacaoUtilidadeAdministrativa'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
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
