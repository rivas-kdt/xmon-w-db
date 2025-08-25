import { useEffect, useState } from "react";
import { shipParts } from "../services/shipParts";
import { getStockedParts } from "../services/getStockedParts";
import toast from "react-hot-toast";

export function useShipHooks({
  t,
  setScanning,
  setHighlightedItem,
}: {
  t: any;
  setScanning: any;
  setHighlightedItem: any;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [stockedParts, setStockedParts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [ selectedItems, setSelectedItems ] = useState<any[]>([]);

  useEffect(() => {
    fetchStockedParts();
  }, []);

  const handleShipPart = async (selected: any[]) => {
    setLoading(true);
    try {
      const responses = [];

      for (const item of selected) {
        const response = await shipParts(item.lot_no, item.ship_quantity);
        responses.push(response);
      }

      setStockedParts((prev) =>
        prev.map((i) =>
          selected.some((s: any) => s.lot_no === i.lot_no)
            ? { ...i, selected: false, added: false, ship_quantity: 0 }
            : i
        )
      );

      fetchStockedParts();
      toast.success("All selected items shipped successfully!");
      setMessage("All selected items shipped successfully!");
      return responses;
    } catch (error: any) {
      console.error("Error in shipping part:", error);
      setError(error.message || "Failed to ship out the parts");
      toast.error(error.message || "Failed to ship out the parts");
    } finally {
      setLoading(false);
    }
  };

  const fetchStockedParts = async () => {
    setFetching(true);
    try {
      const warehouseId = sessionStorage.getItem("warehouseId");
      if (!warehouseId) {
        toast.error("Warehouse ID not found in session storage");
        throw new Error("Warehouse ID not found in session storage");
      }
      const response = await getStockedParts(warehouseId);
      if (!response || response.length === 0) {
        toast.error("No stocked parts found for the given warehouse");
        throw new Error("No stocked parts found for the given warehouse");
      }
      const formattedResponse = response.map((part: any) => ({
        ...part,
        selected: false,
        added: false,
        ship_quantity: 0,
      }));
      setStockedParts(formattedResponse);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch stocked parts");
      setError(error.message || "Failed to fetch stocked parts");
    } finally {
      setFetching(false);
    }
  };

  const toggleItemSelection = (item: any) => {
    setStockedParts((prev) =>
      prev.map((i) =>
        i.lot_no === item.lot_no ? { ...i, selected: !i.selected } : i
      )
    );
  };

  // const toggleItemAdded = (item: any) => {
  //   const selected = item.filter((i: any) => i.selected === true);
  //   setStockedParts((prev) =>
  //     prev.map((i) =>
  //       selected.some((s: any) => s.lot_no === i.lot_no)
  //         ? { ...i, added: !i.added }
  //         : i
  //     )
  //   );
  // };

  const handleScan = (
    data: any,
  ) => {
    if (!data) return;
    setScanning(false);

    try {
      const values = data.split(",");
      if (values.length < 6) {
        toast.error("Invalid QR code format");
        return;
      }
      const scannedLotNo = values[5];

      setStockedParts((prevStockedItems: any) => {
        const index = prevStockedItems.findIndex(
          (item: any) => item.lot_no === scannedLotNo
        );
        if (index !== -1) {
          const updatedStockedItems = [...prevStockedItems];
          const matchedItem = updatedStockedItems[index];
          updatedStockedItems[index] = { ...matchedItem, selected: true };
          setHighlightedItem(matchedItem.lot_no);

          setSelectedItems((prevSelected: any) => {
            const alreadyAdded = prevSelected.some(
              (item: any) => item.lot_no === matchedItem.lot_no
            );
            if (alreadyAdded) return prevSelected;
            return [...prevSelected, { ...matchedItem, ship_quantity: 1 }];
          });

          return updatedStockedItems;
        } else {
          return prevStockedItems;
        }
      });
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Failed to process the scanned QR code");
    }
  };

  const moveSelectedItems = (
    stockedItems: any,
    setHighlightedItem: any
  ) => {
    const itemsToMove = stockedItems.filter((item: any) => item.selected);
    if (itemsToMove.length === 0) {
      return;
    }
    setSelectedItems((prev: any) => [...prev, ...itemsToMove]);
    setStockedParts((prev: any) => prev.filter((item: any) => !item.selected));
    setHighlightedItem(null);
  };

  const removeFromShipping = (
    item: any,
  ) => {
    setSelectedItems((prev: any) =>
      prev.filter((i: any) => i.lot_no !== item.lot_no)
    );
    setStockedParts((prev: any) => [...prev, { ...item, selected: false }]);
  };

  const handleInputChange = (e: any, index: any,) => {
    let inputValue = e.target.value;
    if (inputValue === "") {
      setSelectedItems((prevItems: any) =>
        prevItems.map((item: any, i: any) =>
          i === index ? { ...item, ship_quantity: "" } : item
        )
      );
      return;
    }
    inputValue = inputValue.replace(/^0+(?=\d)/, "");
    const value = Number(inputValue);
    setSelectedItems((prevItems: any) =>
      prevItems.map((item: any, i: any) =>
        i === index ? { ...item, ship_quantity: value } : item
      )
    );
  };

  return {
    message,
    error,
    loading,
    stockedParts,
    toggleItemSelection,
    // toggleItemAdded,
    shipParts: handleShipPart,
    fetchStockedParts,
    fetching,
    handleScan,
    moveSelectedItems,
    removeFromShipping,
    handleInputChange,
    selectedItems
  };
}
