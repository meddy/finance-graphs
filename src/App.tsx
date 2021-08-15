import { useState } from "react";
import Papa from "papaparse";
import dayjs, { Dayjs } from "dayjs";
import SpendingOvertime from "./SpendingOverTime";
import TransactionList from "./TransactionList";

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

export interface DataRow {
  date: Dayjs;
  paymentMethod: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
  category: string;
  accountName: string;
}

export type AmountTuple = [string, number];

export default function App() {
  const [data, setData] = useState<DataRow[]>([]);
  const dataFiltered = data.filter((row) => {
    return (
      row.transactionType === TransactionType.debit &&
      row.description !== "Wealthfront Inc." &&
      row.description !== "Vanguard"
    );
  });

  const onUpload = (file: File) => {
    const data: DataRow[] = [];
    Papa.parse(file, {
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
          onUpload(event.currentTarget.files[0]);
        }}
      />
      <SpendingOvertime data={dataFiltered} />
      <TransactionList data={dataFiltered} />
    </div>
  );
}
