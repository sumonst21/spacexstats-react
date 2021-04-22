import { chartColors } from 'stylesheet';
import { Chart } from 'chart.js';

Chart.defaults.font.family = 'Noto Sans';
Chart.defaults.color = chartColors.white;
Chart.defaults.borderColor = chartColors.white;

const commonChartOptions = {
  plugins: {
    title: {
      display: false,
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: chartColors.white,
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default {
  // Colors used by charts
  DEFAULTCHARTOPTIONS: {
    ...commonChartOptions,
  },
  DEFAULTBARCHARTOPTIONS: {
    ...commonChartOptions,
    pan: {
      enabled: true,
      mode: 'x',
      rangeMin: {
        x: 0,
      },
    },
    zoom: {
      enabled: true,
      drag: false,
      mode: 'x',
      rangeMin: {
        x: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          fontColor: chartColors.white,
        },
      },

      y: {
        grid: {
          display: true,
          color: chartColors.white,
          zeroLineColor: chartColors.white,
        },
        ticks: {
          fontColor: chartColors.white,
        },
      },
    },
  },
};
