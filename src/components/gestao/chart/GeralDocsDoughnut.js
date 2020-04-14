import { Doughnut } from "vue-chartjs";

export default {
  /* eslint-disable */
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "Ativos",
          "Revogados",
        ],
        datasets: [
          {
            backgroundColor: [
              "#43A047",
              "#D32F2F",
            ],
            data: [0, 0]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Diplomas Legislativos'
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/indicadores/legVigor")
      .then(res => {
        console.log(res)
        this.info.datasets[0].data[0] = res.data[0].valor;
        this.info.datasets[0].data[1] = res.data[1].valor;
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};
