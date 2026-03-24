import { useState, useEffect } from "react";
import { getInventory } from "../services/getInventory";

export function useInventoryHooks() {
  const [inventory, setinventory] = useState<any[]>([]);
  const [inventoryLoading, setinventoryLoading] = useState(true);
  const [inventoryError, setinventoryError] = useState<string | null>(null);

  useEffect(() => {
    fetchinventory();
  }, []);

  const fetchinventory = async () => {
    setinventoryLoading(true);
    try {
      const response = await getInventory();
      setinventory(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setinventoryError(error.message || "Failed to fetch stocked data");
    } finally {
      setinventoryLoading(false);
    }
  };

//   const handleAddinventory = async (email : any) => {
//     try {
//       const response = await addinventory(email);
//       if (response.success) {
//         await fetchinventory();
//       } else {
//         throw new Error(response.message || "Failed to add inventory");
//       }
//     } catch (error: any) {
//       console.error("Error adding inventory:", error);
//       setinventoryError(error.message || "Failed to add inventory");
//     }
//   };

  return {
    inventory,
    inventoryLoading,
    inventoryError,
    // addinventory: handleAddinventory,
    refetchinventory: fetchinventory,
  };
}
