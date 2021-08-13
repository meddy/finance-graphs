import React from "react";
import { Line } from "react-chartjs-2";
import { AmountTuple } from "./App";

interface SpendingOverTimeProps {
  data: AmountTuple[];
}

export default function SpendingOvertime(props: SpendingOverTimeProps) {
  const spending = props.data;
  return (
    <Line
      data={{
        labels: spending.map((monthAmount) => monthAmount[0]),
        datasets: [
          {
            label: "Spending",
            data: spending.map((monthAmount) => monthAmount[1]),
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      }}
      options={{
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }}
    />
  );
}
