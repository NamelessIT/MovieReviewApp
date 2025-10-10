import React from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (selectedItem: { selected: number }) => void;
}
const Pagination: React.FC<PaginationProps> = ({ currentPage,totalPages,onPageChange }) => {
    return (
        <ReactPaginate
            pageRangeDisplayed={2} // Số trang hiển thị trong vùng trang hiện tại
            marginPagesDisplayed={2} // Số trang hiển thị ở hai bên
            onPageChange={onPageChange} // Hàm gọi khi trang được thay đổi
            containerClassName="pagination justify-content-center" // Lớp CSS cho container phân trang
            pageClassName="page-item" // Lớp CSS cho mỗi mục trang
            pageLinkClassName="page-link" // Lớp CSS cho liên kết trang
            previousClassName="page-item" // Lớp CSS cho nút trang trước
            previousLinkClassName="page-link" // Lớp CSS cho liên kết nút trang trước
            nextClassName="page-item" // Lớp CSS cho nút trang sau
            nextLinkClassName="page-link"   // Lớp CSS cho liên kết nút trang sau
            breakClassName="page-item" // Lớp CSS cho mục ngắt
            breakLinkClassName="page-link" // Lớp CSS cho liên kết mục ngắt
            activeClassName="active" // Lớp CSS cho trang hiện tại
            forcePage={currentPage - 1} // ReactPaginate uses zero-based index
            previousLabel="< Trước" // Label cho nút trang trước
            nextLabel="Sau >" // Label cho nút trang sau
            pageCount={totalPages} // Tổng số trang
            renderOnZeroPageCount={null} // Handle case when there are no pages
            />
    );
};export default Pagination;