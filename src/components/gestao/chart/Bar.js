import { Bar } from "vue-chartjs";
const lhost = require("@/config/global").host;
import axios from "axios";
import { throws } from "assert";

export default {
  extends: Bar,
  data() {
    return {
      info: {
        labels: [],
        datasets: [
          {
            label: "GET",
            backgroundColor: "#f87979",
            data: [0, 0, 0, 0, 0, 40, 39, 60, 40, 20, 12, 11]
          },
          {
            label: "POST",
            backgroundColor: "#05CBE1",
            data: [40, 20, 12, 39, 10, 40, 39, 60, 40, 20, 12, 11]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    axios
      .get(lhost + "/api/stats")
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._id != "" && res.data[i]._id != "unknown route") {
            // alert(JSON.stringify(res.data[i]))
            this.info.labels.push(res.data[i]._id);
            var index = this.info.labels.indexOf(res.data[i]._id);
            this.info.datasets[0].data[index] = res.data[i].nCallsGet;
            this.info.datasets[1].data[index] = res.data[i].nCallsPost;
          }
        }
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};
