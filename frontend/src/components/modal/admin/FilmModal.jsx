import { useState, useEffect } from "react";
import { LayoutWrapper } from "../../admin/LayoutWrapper";
import { useNavigate, useParams } from "react-router-dom";
import FilmsService from "../../../service/admin/FilmService";
import {AlertSuccess, AlertError} from "../../common/Alert.jsx";
const FilmModal = ({onMode}) => {
  // Tên 'filmId' ở đây phải khớp với tên đặt trong Route path (ví dụ: :filmId)
  const { filmId } = useParams();
  const navigate = useNavigate();
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    directorId: "",
    posterUrl: "",
    trailerUrl: "",
    genres: [],
    actors: [],
  });
  // Poster file state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  // New genre and actor input
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showActorDropdown, setShowActorDropdown] = useState(false);
  // Dropdown data
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [loading, setLoadingData] = useState(true);
  // Fetch directors, genres, actors on mount
  const loadData = async () => {
    try {
      setLoadingData(true);
      const dataDirectors = await FilmsService.getAllDirectors();
      setDirectors(dataDirectors.data);
      const dataGenres = await FilmsService.getAllGenres();
      setGenres(dataGenres.data);
      const dataActors = await FilmsService.getAllActors();
      setActors(dataActors.data);
      if (onMode === "edit") {
        const filmData = await FilmsService.getFilmById(filmId);
        setFormData(filmData.data);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // thêm thể loại
  const addGenre = (genre) => {
    if (genre && !formData.genres.some(a => a.id === genre.id)) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, genre],
      }));
      setShowGenreDropdown(false);
    }
  };
  // bỏ thể loại
  const handleRemoveGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }));
  };

  // thêm diễn viên
  const addActor = (actor) => {
    if (actor && !formData.actors.some(a => a.id === actor.id)) {
      setFormData((prev) => ({
        ...prev,
        actors: [...prev.actors, actor],
      }));
      setShowActorDropdown(false);
    }
  };
  // bỏ diễn viên
  const handleRemoveActor = (actor) => {
    setFormData((prev) => ({
      ...prev,
      actors: prev.actors.filter((a) => a !== actor),
    }));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle remove image
  const handleRemoveImage = () => {
        // Clean up preview URL to prevent memory leaks
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        
        setSelectedFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, posterUrl: '' }));
        
    };

  const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        // Store the file and create preview
        setSelectedFile(file);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
    };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      // Submit form data
      const filmPayload = new FormData();
      filmPayload.append("title", formData.title);
      filmPayload.append("releaseDate", formData.releaseDate);
      filmPayload.append("directorId", formData.directorId);
      filmPayload.append("trailerUrl", formData.trailerUrl);
      if (selectedFile) {
        filmPayload.append("posterFile", selectedFile);
      }
      formData.genres.forEach((genre, index) => {
        filmPayload.append(`genres[${index}].id`, genre.id);
        filmPayload.append(`genres[${index}].name`, genre.name);
      });
      formData.actors.forEach((actor, index) => {
        filmPayload.append(`actors[${index}].id`, actor.id);
        filmPayload.append(`actors[${index}].name`, actor.name);
      });
      if(onMode === "add"){
        await FilmsService.create(filmPayload);
        AlertSuccess("Thêm phim thành công");
      } else if(onMode === "edit"){
        await FilmsService.update(filmId, filmPayload);
        AlertSuccess("Cập nhật phim thành công");
      }
      
    } catch (err) {
      console.error("Error submitting form:", err);
      AlertError();
      // setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }finally {
      setLoadingData(false);
      navigate("/admin/films");
    }
  };

  return (
    <LayoutWrapper>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold">{onMode == "edit" ? "Chỉnh sửa phim" : "Thêm phim mới"}</h1>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/films")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại
          </button>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Basic Information */}
                    <div className="col-12">
                      <h5 className="fw-bold text-primary mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Thông tin cơ bản
                      </h5>
                    </div>
                    {/* Loading State  */}
                    {loading && (
                        <div className="text-center p-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="mt-2">Đang tải dữ liệu...</div>
                        </div>
                    )}
                    {/* Title */}
                    <div className="col-md-6">
                      <label htmlFor="title" className="form-label fw-medium">
                        Tên phim <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Nhập tên phim"
                        required
                      />
                    </div>

                    {/* Release Date */}
                    <div className="col-md-6">
                      <label
                        htmlFor="releaseDate"
                        className="form-label fw-medium"
                      >
                        Ngày phát hành <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        name="releaseDate"
                        value={formData.releaseDate.substring(0, 10)}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Director */}
                    <div className="col-md-6">
                      <label
                        htmlFor="directorId"
                        className="form-label fw-medium"
                      >
                        Đạo diễn <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="directorId"
                        name="directorId"
                        value={formData.directorId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn đạo diễn</option>
                        {directors.map((director) => (
                          <option key={director.id} value={director.id}>
                            {director.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Media URLs */}
                    <div className="col-12">
                      <h5 className="fw-bold text-primary mb-3 mt-4">
                        <i className="bi bi-image me-2"></i>
                        Hình ảnh & Video
                      </h5>
                    </div>
                     {/* URL Poster */}
                    <div className="col-md-6">
                      <label
                        htmlFor="posterUrl"
                        className="form-label fw-medium"
                      >
                        URL Poster
                      </label>
                      <div className="col d-flex flex-column align-items-center justify-content-center">
                        {console.log("Image Preview:", imagePreview)}
                        {console.log("FormData Poster URL:", formData.posterUrl)}
                      <img 
                          src={imagePreview || formData.posterUrl || "https://placehold.co/600x400"} 
                          alt="image preview" 
                          className="img-fluid rounded" 
                          style={{ maxHeight: '220px', objectFit: 'cover' }}
                      />
                      <div className="w-100 d-flex justify-content-center mt-2">
                          <input 
                              type="file" 
                              id="file-input" 
                              className="d-none" 
                              accept="image/*"
                              onChange={handleFileSelect}
                          />
                          <label htmlFor="file-input" className="fw-bold btn btn-outline-secondary btn-light">
                              <i className="bi bi-upload me-2"></i>
                              <span>
                                  {selectedFile 
                                      ? "Thay đổi hình ảnh" 
                                      : formData.posterUrl 
                                          ? "Thay đổi hình ảnh" 
                                          : "Thêm hình ảnh"
                                  }
                              </span>
                          </label>
                      </div>
                      {selectedFile && (
                          <div className="alert alert-info mt-2 py-1 px-2 small text-center">
                              <i className="bi bi-info-circle me-1"></i>
                              Ảnh sẽ được tải lên khi bạn lưu sản phẩm
                          </div>
                      )}
                      {(selectedFile || formData.posterUrl) && (
                          <button 
                              type="button" 
                              className="btn btn-sm btn-outline-danger mt-2"
                              onClick={handleRemoveImage}
                          >
                              <i className="bi bi-trash me-1"></i>
                              Xóa ảnh
                          </button>
                      )}
                  </div>
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="trailerUrl"
                        className="form-label fw-medium"
                      >
                        URL Trailer
                      </label>

                      <input
                        type="url"
                        className="form-control"
                        id="trailerUrl"
                        name="trailerUrl"
                        value={formData.trailerUrl}
                        onChange={handleInputChange}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    {/* Genres */}
                    <div className="col-12">
                      <h5 className="fw-bold text-primary mb-3 mt-4">
                        <i className="bi bi-tags me-2"></i>
                        Thể loại
                      </h5>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="form-check ps-0">
                            <input
                              className="form-control"
                              placeholder="Chọn thể loại phim"
                              type="text"
                              onChange={handleInputChange}
                              onFocus={() => setShowGenreDropdown(true)}
                            />
                            {showGenreDropdown && genres.length > 0 && (
                              <div
                                className=" top-100 start-0 end-0 mt-1 bg-white border border-secondary rounded shadow-lg"
                                style={{
                                  zIndex: 1000,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {genres.map((genre) => (
                                  <button
                                    key={genre.id}
                                    type="button"
                                    onClick={() => addGenre(genre)}
                                    className="w-100 text-start px-3 py-2 border-0 bg-white text-dark"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {genre.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {formData.genres?.length > 0 && (
                          <div className="w-100  d-flex flex-wrap rounded">
                            {formData.genres.map((genre, index) => (
                              <button
                                className="btn btn-primary pe-2 m-2"
                                type="button"
                                key={index}
                              >
                                <span>{genre.name}</span>
                                <i
                                  className="bi bi-x-circle ms-2"
                                  onClick={() => handleRemoveGenre(genre)}
                                ></i>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actors */}
                    <div className="col-12">
                      <h5 className="fw-bold text-primary mb-3 mt-4">
                        <i className="bi bi-people me-2"></i>
                        Diễn viên
                      </h5>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="form-check ps-0">
                            <input
                              className="form-control"
                              placeholder="Chọn diễn viên"
                              type="text"
                              onChange={handleInputChange}
                              onFocus={() => setShowActorDropdown(true)}
                            />
                            {showActorDropdown && actors.length > 0 && (
                              <div
                                className=" top-100 start-0 end-0 mt-1 bg-white border border-secondary rounded shadow-lg"
                                style={{
                                  zIndex: 1000,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {actors.map((actor) => (
                                  <button
                                    key={actor.id}
                                    type="button"
                                    onClick={() => addActor(actor)}
                                    className="w-100 text-start px-3 py-2 border-0 bg-white text-dark"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {actor.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {formData.actors?.length > 0 && (
                          <div className="w-100  d-flex flex-wrap rounded">
                            {formData.actors.map((actor, index) => (
                              <button
                                className="btn btn-primary pe-2 m-2"
                                type="button"
                                key={index}
                              >
                                <span>{actor.name}</span>
                                <i
                                  className="bi bi-x-circle ms-2"
                                  onClick={() => handleRemoveActor(actor)}
                                ></i>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12">
                      <hr className="my-4" />
                      <div className="d-flex gap-3 justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-md btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              {onMode === "add" && <i className="bi bi-plus me-2"></i>}
                              {onMode === "edit" ? "Cập nhật phim" : "Thêm phim"} 
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default FilmModal;
