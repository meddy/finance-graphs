import { Line } from "react-chartjs-2";
import { AmountTuple, DataRow } from "./App";

interface SpendingOverTimeProps {
  data: DataRow[];
}

export default function SpendingOvertime(props: SpendingOverTimeProps) {
  const { data } = props;
  const spending = data.reduce<AmountTuple[]>((acc, row) => {
    const monthAmount: AmountTuple = [row.date.format("MMM YYYY"), row.amount];
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
    />
  );
}
