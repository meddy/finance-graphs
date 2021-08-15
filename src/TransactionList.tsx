import { AmountTuple, DataRow } from "./App";
import { Dayjs } from "dayjs";

interface TransactionListProps {
  data: DataRow[];
  date?: Dayjs;
}

export default function TransactionList(props: TransactionListProps) {
  const { data, date } = props;
  const transactions = data
    .reduce<AmountTuple[]>((acc, row) => {
      for (const amountTuple of acc) {
        if (date && !row.date.isSame(date, "month")) {
          continue;
        }
        if (row.description === amountTuple[0]) {
          amountTuple[1] += row.amount;
          return acc;
        }
      }

      acc.push([row.description, row.amount]);

      return acc;
    }, [])
    .sort((amountTupleA, amountTupleB) => amountTupleB[1] - amountTupleA[1]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(([description, amount]) => (
          <tr key={description}>
            <td>{description}</td>
            <td>{formatter.format(amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
