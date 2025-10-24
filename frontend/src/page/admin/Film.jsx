import { useState, useEffect } from "react";
import FilmsService from "../../service/admin/FilmService";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";
import Pagination from "../../components/pagination/Pagination";
import { confirmDelete } from "../../components/common/Alert";
import { NavLink } from "react-router-dom";
const Films = () => {
  //phân trang
  const rowsPerPage = 6; // Mặc định 5 hàng mỗi trang
  const [filteredFilms, setFilteredFilms] = useState([]); // Danh sách phim
  const [filmsLoading, setFilmsLoading] = useState(false); // Trạng thái tải phim
  const [filmsError, setFilmsError] = useState(null); // Lỗi khi tải phim
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại, bắt đầu từ 1
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [searchTerm, setSearchTerm] = useState(""); // tìm kiếm
  //lấy danh sách film và phân trang
  const loadData = async () => {
    try {
      setFilmsLoading(true);
      const response = await FilmsService.getAllFilmsWithPagination(currentPage,rowsPerPage,searchTerm);
      setFilteredFilms(response.data || []);
      setFilmsError(null);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching films:", error);
      setFilmsError(error.message);
    }finally
    {
      setFilmsLoading(false);
    }
  };

  const handlePageChange = (event) => {
    // `event.selected` là index của trang (bắt đầu từ 0) do react-paginate cung cấp.
    // Chúng ta cần +1 để nó khớp với state `currentPage` (bắt đầu từ 1).
    setCurrentPage(event.selected + 1);
  };
  //Xóa film
  const onDelete = async (filmId) => {
    try {
      await FilmsService.delete(filmId);
      loadData();
    } catch (error) {
      console.error("Error deleting film:", error);
    }
  };
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm]);
  return (
    <LayoutWrapper>
      <div className="container">
        {/* Filter/Search card */}
        <div className="card border-0 shadow-sm mb-4">
          <h1 className="fw-bold m-2">Quản lý danh sách phim</h1>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative" style={{ width: "300px" }}>
                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control ps-5"
                  placeholder="Tìm kiếm theo tên phim..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div>
                <NavLink to="/admin/films/add" className="btn btn-md btn-dark">
                  <i className="bi bi-plus me-2"></i>
                  Thêm phim mới
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* List card (table) */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-3">Films List</h5>
            {filmsLoading && (
              <div className="text-muted small">Loading films…</div>
            )}
            {filmsError && (
              <div className="text-danger small">Error: {filmsError}</div>
            )}
            {!filmsLoading && !filmsError && (
              <>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="text-muted">
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Director</th>
                        <th scope="col">Release Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                        <th scope="col" className="text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filteredFilms?.data || []).map((film) => (
                        <tr key={film.id}>
                          <td className="text-break">{film.id}</td>
                          <td>{film.title}</td>
                          <td>{film.directorName}</td>
                          <td>{film.releaseDate.substring(0, 10)}</td>
                          <td>
                            <span
                              className={
                                "badge rounded-pill " +
                                (film.isDeleted.toString() === "false"
                                  ? "text-bg-success"
                                  : "text-bg-danger")
                              }
                            >
                              {film.isDeleted.toString() === "false"
                                ? "Hoạt động"
                                : "Ngừng hoạt động"}
                            </span>
                          </td>
                          <td>{film.createdAt.substring(0, 10)}</td>
                          <td>{film.updatedAt?.substring(0, 10)}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-evenly">
                              <NavLink to={`/admin/films/edit/${film.id}`} className="btn btn-primary">
                                <i className="bi bi-pencil"></i>
                              </NavLink>
                              {/* <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => onEdit("edit")}
                              >
                                <i className="bi bi-pencil"></i>
                              </button> */}
                              <div className="ps-2 border-secondary border-start ">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    confirmDelete("Phim", film.id, () =>
                                      onDelete(film.id)
                                    )
                                  }
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* {filterFilms?.data.length === 0 && (
                  <div className="text-muted small">No films found.</div>
                )} */}
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default Films;
