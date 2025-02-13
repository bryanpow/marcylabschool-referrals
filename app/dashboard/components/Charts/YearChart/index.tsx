"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import YearChartLoading from "./YearChartLoading";
import { ChartData, formatLineChartData } from "@/app/utils/chartutils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [], // Will be set dynamically
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 100,
  },
};

const YearChart = ({ userStats, loaded, setLoaded }: { userStats: any, loaded: any, setLoaded: any }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [maxY, setMaxY] = useState(100);
  const [chartKey, setChartKey] = useState(0); // Key to force re-render of chart

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userStats?.monthlyData) {
      const { series, categories } = formatLineChartData(userStats.monthlyData);
      setChartData({ series: series || [], categories: categories || [] });
    }
  }, [userStats]);

  useEffect(() => {
    if (chartData) {
      const maxDataPoint = Math.max(...chartData.series.flatMap((serie) => serie.data));
      
      // Round up to the nearest 10
      const yAxisMax = Math.ceil((maxDataPoint + maxDataPoint * 0.1) / 10) * 10;
      
      if (yAxisMax !== maxY) {
        setMaxY(yAxisMax);
        setChartKey((prevKey) => prevKey + 1); // Force re-render with updated y-axis
      }
    }
  }, [chartData, maxY]);

  const chartOptions: ApexOptions = {
    ...options,
    yaxis: {
      ...options.yaxis,
      min: 0,
      max: maxY, // Dynamically set y-axis max rounded to nearest 10
    },
    xaxis: {
      ...options.xaxis,
      categories: chartData?.categories || [],
    },
  };

  return (
    <div className="col-span-12 xl:col-span-8">
      <div className={`${!loaded ? "block" : "hidden"}`}>
        <YearChartLoading />
      </div>

      <div
        className={`col-span-12  rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8 ${
          !loaded ? "hidden" : "block"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            <div className="flex min-w-47.5">
              <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-[black'">Total Points</p>
              </div>
            </div>
            <div className="flex min-w-47.5">
              <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
              </span>
              <div className="w-full">
                <p className="font-semibold text-medium">Total Referrals</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div id="chartOne" className=" -ml-5">
            <ReactApexChart
              key={chartKey} // Force re-render with new key
              options={chartOptions}
              series={chartData?.series || []}
              type="area"
              height={350}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearChart;
