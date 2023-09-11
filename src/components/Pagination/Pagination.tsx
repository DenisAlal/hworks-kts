import * as React from "react";
import { getPaginationItems } from "lib/pagination.ts";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import PageLink from "./PageLink";
import styles from "./Pagination.module.scss";

export type TabsProps = {
  className?: string;
  currentPage: number;
  lastPage: number;
  maxLength: number;
  setCurrentPage: (page: number) => void;
};
const Pagination: React.FC<TabsProps> = (props) => {
  const { currentPage, lastPage, maxLength, setCurrentPage } = props;

  const pageNums = getPaginationItems(currentPage, lastPage, maxLength);
  return (
    <nav className={styles.pagination}>
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <ArrowLeftIcon height={24} width={24} className={styles.backArrow} />
      </button>
      {pageNums.map((pageNum, id) => (
        <PageLink
          key={id}
          active={currentPage === pageNum}
          disabled={isNaN(pageNum)}
          onClick={() => setCurrentPage(pageNum)}
        >
          {!isNaN(pageNum) ? pageNum : "..."}
        </PageLink>
      ))}
      <button
        disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <ArrowLeftIcon height={24} width={24} className={styles.nextArrow} />
      </button>
    </nav>
  );
};

export default Pagination;
