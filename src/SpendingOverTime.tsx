import { memo } from "react";
import { Line } from "react-chartjs-2";
import { Amount, DataRow } from "./App";
import dayjs, { Dayjs } from "dayjs";

interface SpendingOverTimeProps {
  data: DataRow[];
  onDateClick: (date?: Dayjs) => void;
}

interface EventElement {
  datasetIndex: number;
  index: number;
}

const SpendingOvertime = (props: SpendingOverTimeProps) => {
  const { data, onDateClick } = props;
  const spending = data.reduce<Amount[]>((acc, row) => {
    const monthAmount: Amount = [row.date.format("MMM YYYY"), row.amount];
    for (const totalAmount of acc) {
      if (totalAmount[0] === monthAmount[0]) {
        totalAmount[1] += monthAmount[1];
        return acc;
      }
    }

    acc.push(monthAmount);

    return acc;
  }, []);

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
      getElementAtEvent={(element) => {
        if (!element[0]) {
          onDateClick();
          return;
        }

        const amount = spending[(element[0] as EventElement).index];
        onDateClick(dayjs(amount[0]));
      }}
    />
  );
};

export default memo(SpendingOvertime);
