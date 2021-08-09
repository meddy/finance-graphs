import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { Line } from "react-chartjs-2";
import dayjs, { Dayjs } from "dayjs";

enum TransactionType {
  credit = "credit",
  debit = "debit",
}

interface ParsedRow {
  Date: string;
  Description: string;
  "Original Description": string;
  Amount: string;
  "Transaction Type": TransactionType;
  Category: string;
  "Account Name": string;
  Labels: string;
  Notes: string;
}

interface DataRow {
  date: Dayjs;
  paymentMethod: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
  category: string;
  accountName: string;
}

type AmountTuple = [string, number];

function App() {
  const [data, setData] = useState<DataRow[]>([]);

  const spending = data
    .filter((row) => (row.transactionType = TransactionType.debit))
    .reduce<Array<[string, number]>>((acc, row) => {
      const monthAmount: AmountTuple = [
        row.date.format("MMM YYYY"),
        row.amount,
      ];
      for (const totalAmount of acc) {
        if (totalAmount[0] === monthAmount[0]) {
          totalAmount[1] += monthAmount[1];
          return acc;
        }
      }

      acc.push(monthAmount);

      return acc;
    }, []);

  const config = {
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
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div className="container mx-auto p-8">
      <input
        type="file"
        id="input"
        accept=".csv,text/csv"
        onChange={(event) => {
          if (!(event.currentTarget.files && event.currentTarget.files[0])) {
            return;
          }

          const data: DataRow[] = [];
          Papa.parse(event.currentTarget.files[0], {
            header: true,
            step: (result, parser) => {
              const resultData = result.data as unknown as ParsedRow;
              if (result.errors.length) {
                console.error("Failed to parse row.", result.errors);
                return;
              }

              data.push({
                date: dayjs(resultData.Date),
                paymentMethod: resultData["Account Name"],
                description: resultData.Description,
                amount: Number(resultData.Amount),
                transactionType: resultData["Transaction Type"],
                category: resultData.Category,
                accountName: resultData["Account Name"],
              });
            },
            complete: () => {
              setData(
                data.sort((rowA, rowB) => {
                  if (rowA.date.isBefore(rowB.date)) {
                    return -1;
                  }
                  if (rowA.date.isAfter(rowB.date)) {
                    return 1;
                  }

                  return 0;
                })
              );
            },
          });
        }}
      />
      <Line data={config} options={options} />
    </div>
  );
}

export default App;
