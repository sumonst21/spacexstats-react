import settings from 'settings';
import { chartColors } from 'stylesheet';
import { formatDuration } from 'utils/date';
import { ChartOptions } from 'chart.js';
import deepmerge from 'deepmerge';
import { Crew, Launch, Payload } from 'types';
import { getPayload } from 'utils/launch';

export const getFlightTime = (launch: Launch, payloads: Payload[]) =>
  Math.floor(
    (getPayload(launch, payloads).dragon.flight_time_sec ??
      new Date().getTime() / 1000 - launch.date_unix) / 3600,
  );

export const buildCommercialCrewFlightsChart = (
  dragonLaunches: Launch[],
  payloads: Payload[],
  crew: Crew[],
) => {
  const crewFlights = dragonLaunches.filter((launch) =>
    getPayload(launch, payloads).type.includes('Crew Dragon'),
  );

  const data = {
    labels: crewFlights.map((launch) => launch.name),
    datasets: [
      {
        label: 'NASA',
        backgroundColor: chartColors.blue,
        data: crewFlights.map((launch) => {
          if (launch.name.includes('Abort')) {
            return 1;
          }
          const { reused } = getPayload(launch, payloads);
          return !reused ? getFlightTime(launch, payloads) : 0;
        }),
      },
      {
        label: 'Tourists',
        backgroundColor: chartColors.orange,
        data: crewFlights.map(() => 0),
      },
    ],
  };

  const customOptions: ChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const launch = dragonLaunches.find(
              (launch) => launch.name === tooltipItem.xLabel,
            );
            if (!launch || tooltipItem.yLabel === 0) {
              return '';
            }
            if (
              tooltipItem.datasetIndex === undefined ||
              !data.datasets[tooltipItem.datasetIndex]
            ) {
              return '';
            }
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const flightTime = launch.name.includes('Abort')
              ? '8 minutes 54 seconds'
              : `${getFlightTime(launch, payloads).toLocaleString()} hours`;
            return `${dataset.label}: ${flightTime}`;
          },
          footer: (tooltipItems) => {
            const launch = dragonLaunches.find(
              (launch) => launch.name === tooltipItems[0].xLabel,
            );
            if (!launch) {
              return '';
            }

            const crewCount = crew.filter((person) =>
              person.launches.includes(launch.id),
            ).length;

            return `People: ${crewCount}`;
          },
        },
      },
    },
  };

  const options = deepmerge(settings.DEFAULTBARCHARTOPTIONS, customOptions);
  if (options.scales?.x) {
    options.scales.x.stacked = true;
  }
  if (options.scales?.y) {
    options.scales.y.stacked = true;
    options.scales.y.ticks.callback = (label) =>
      `${Math.ceil(Number(label)).toLocaleString()} hours`;
  }

  return {
    data,
    options,
    totalFlightTime: formatDuration(
      Math.floor(
        crewFlights.reduce(
          (sum, launch) => sum + getFlightTime(launch, payloads),
          0,
        ),
      ),
    ),
  };
};
