import { useState, useEffect } from "react";
import useFetchData from "../../hooks/useFetchData";
import FilmsService from "../../service/admin/FilmService";
import { LayoutWrapper } from "../../components/admin/LayoutWrapper";
import Pagination from "../../components/pagination/Pagination";
import { confirmDelete } from "../../components/common/Alert";
const Films = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  //phân trang
  const rowsPerPage = 6; // Mặc định 5 hàng mỗi trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại, bắt đầu từ 1
  const [filterFilms, setFilterFilms] = useState([]); // dữ liệu phim
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  //lấy danh sách film và phân trang
    const { data: response, loading: filmsLoading, error: filmsError } = useFetchData(
      () => FilmsService.getAllFilmsWithPagination(currentPage, rowsPerPage),
      [currentPage, rowsPerPage]
    );
  
 
  const handlePageChange = (event) => {
    // `event.selected` là index của trang (bắt đầu từ 0) do react-paginate cung cấp.
    // Chúng ta cần +1 để nó khớp với state `currentPage` (bắt đầu từ 1).
    setCurrentPage(event.selected + 1);
  };
  //load dữ liệu
  const loadFilms = async () => {
    try{;
      setFilterFilms(response?.data);
      setTotalPages(response?.data.totalPages || 1);
    }catch(error){
      console.error("Error loading films:", error);
    }
  }
  //đổ dữ liệu khi có sự thay đổi
  useEffect(() => {
    loadFilms();
  }, [response]);

  //Xóa film
  const onDelete = async (filmId) => {
      try {
        await FilmsService.delete(filmId);
        loadFilms();
        // Tải lại danh sách phim sau khi xóa
      } catch (error) {
        console.error("Error deleting film:", error);
      }
  };
  return (
    <LayoutWrapper>
      <div className="container">
        {/* Filter/Search card */}
        <div className="card border-0 shadow-sm mb-4">
          <h1 className="fw-bold m-2">Quản lý danh sách phim</h1>       
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="position-relative" style={{ width: "300px" }}>
                <i
                  className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted"
                />
                <input
                  className="form-control ps-5"
                  placeholder="Tìm kiếm theo tên phim..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div>
                <button className="btn btn-md btn-dark"  onClick={() => onAdd("add")}>
                  <i className="bi bi-plus me-2"></i>
                  Thêm phim mới
                </button>
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
            {filmsError && <div className="text-danger small">Error: {filmsError}</div>}
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
                        <th scope="col">IsDeleted</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Updated At</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(filterFilms?.data || []).map((film) => (
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
                              {film.isDeleted.toString().toUpperCase()}
                            </span>
                          </td>
                          <td>{film.createdAt.substring(0, 10)}</td>
                          <td>{film.updatedAt?.substring(0, 10)}</td>
                          <td className="text-end">
                              <div className="d-flex justify-content-evenly">
                                  <button type="button" className="btn btn-primary" onClick={() => onEdit("edit")}>
                                      <i className="bi bi-pencil"></i>
                                  </button>
                                  <div className="ps-2 border-secondary border-start ">
                                      <button type="button" className="btn btn-danger" onClick={() => confirmDelete("Phim", film.id, () => onDelete(film.id))}>
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
