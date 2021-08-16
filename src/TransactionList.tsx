import { Amount, DataRow } from "./App";
import { Dayjs } from "dayjs";

interface TransactionListProps {
  data: DataRow[];
  date?: Dayjs;
}

export default function TransactionList(props: TransactionListProps) {
  const { data, date } = props;
  const transactions = data
    .reduce<Amount[]>((acc, row) => {
      for (const amount of acc) {
        if (date && !row.date.isSame(date, "month")) {
          return acc;
        }

        if (row.description === amount[0]) {
          amount[1] += row.amount;
          return acc;
        }
      }

      return acc.concat([[row.description, row.amount]]);
    }, [])
    .sort((amountA, amountB) => amountB[1] - amountA[1]);

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
