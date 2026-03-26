"use client";
import { useState, useCallback } from "react";

export function usePagination(itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback((page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const itemsOffset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    totalPages,
    totalItems,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    itemsOffset,
    itemsPerPage,
  };
}
