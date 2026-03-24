import { useState, useEffect } from "react";
import { getTransaction } from "../services/getTransaction";

export function useTransactionHooks() {
  const [transaction, setTransaction] = useState<any[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  useEffect(() => {
    fetchtransaction();
  }, []);

  const fetchtransaction = async () => {
    setTransactionLoading(true);
    try {
      const response = await getTransaction();
      setTransaction(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setTransactionError(error.message || "Failed to fetch stocked data");
    } finally {
      setTransactionLoading(false);
    }
  };

  //   const handleAddtransaction = async (email : any) => {
  //     try {
  //       const response = await addtransaction(email);
  //       if (response.success) {
  //         await fetchtransaction();
  //       } else {
  //         throw new Error(response.message || "Failed to add transaction");
  //       }
  //     } catch (error: any) {
  //       console.error("Error adding transaction:", error);
  //       settransactionError(error.message || "Failed to add transaction");
  //     }
  //   };

  return {
    transaction,
    transactionLoading,
    transactionError,
    // addtransaction: handleAddtransaction,
    refetchtransaction: fetchtransaction,
  };
}
