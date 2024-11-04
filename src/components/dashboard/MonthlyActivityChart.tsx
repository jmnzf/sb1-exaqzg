import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { format, subMonths } from 'date-fns';
import { ApexOptions } from 'apexcharts';

const generateMonthlyData = () => {
  const data = {
    projects: [],
    cases: [],
    incidents: []
  };
  
  const months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMM'));
    data.projects.push(Math.floor(Math.random() * 10));
    data.cases.push(Math.floor(Math.random() * 20));
    data.incidents.push(Math.floor(Math.random() * 8));
  }
  
  return { months, data };
};

export default function MonthlyActivityChart() {
  const { months, data } = generateMonthlyData();

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: false
      },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: '#6B7280'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function (val: number) {
          return val + " items"
        }
      },
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetY: -8,
      labels: {
        colors: '#6B7280'
      },
      markers: {
        radius: 12
      }
    },
    colors: ['#4F46E5', '#10B981', '#EF4444']
  };

  const series = [
    {
      name: 'Projects',
      data: data.projects
    },
    {
      name: 'Support Cases',
      data: data.cases
    },
    {
      name: 'Incidents',
      data: data.incidents
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Activity</h3>
      <div className="h-80">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}