import { LayoutWrapper } from '../../components/admin/LayoutWrapper';
import useFetchData from '../../hooks/useFetchData';
import HomePageService from '../../service/admin/HomePageService';
const statsCards = [
    {
      href: "bi bi-people",
      title: "Total Users",
      value: "5",
      subtitle: "Last 7 days",
      iconColor: "text-primary",
      iconBg: "bg-primary bg-opacity-10",
    },
    {
      href: "bi bi-film",
      title: "Total Films",
      value: "50",
      subtitle: "Last 7 days",
      iconColor: "text-success",
      iconBg: "bg-success bg-opacity-10",
    },
    {
      href: "bi bi-chat",
      title: "Total Reviews",
      value: "18",
      subtitle: "Last 7 days",
      iconColor: "text-warning",
      iconBg: "bg-warning bg-opacity-10",
    },
  ]

  const topReviewedFilms = [
    { rank: 1, title: "Dune", reviews: 5 },
    { rank: 2, title: "No Time to Die", reviews: 3 },
    { rank: 3, title: "The Batman", reviews: 3 },
    { rank: 4, title: "Top Gun: Maverick", reviews: 3 },
    { rank: 5, title: "Everything Everywhere All at Once", reviews: 2 },
    { rank: 6, title: "Black Panther: Wakanda Forever", reviews: 1 },
    { rank: 7, title: "Avatar: The Way of Water", reviews: 1 },
  ]


const Homepage = () => {
  const { data: user, loading: userLoading} = useFetchData(HomePageService.GetTotalUser);
  const { data: films, loading: filmsLoading } = useFetchData(HomePageService.GetTotalFilm);
  const { data: reviews, loading: reviewsLoading } = useFetchData(HomePageService.GetTotalReview);
  const { data: TopRatedFilms, loading: TopRatedFilmsLoading } = useFetchData(HomePageService.GetTopRatedFilms);
  const { data: FilmReviewCounts, loading: FilmReviewCountsLoading } = useFetchData(HomePageService.GetTopReviewFilms);
  const isLoading = userLoading || filmsLoading || reviewsLoading || TopRatedFilmsLoading || FilmReviewCountsLoading;
  if (isLoading) {
    return <div>Đang tải dữ liệu thống kê...</div>; 
  }
  const FilmReviewCountsData = FilmReviewCounts.data;
  const TopRatedFilmsData = TopRatedFilms.data;
  //cập nhật giá trị sau khi truy vấn dữ liệu từ API
  const ListValueStatsCards = [user.data, films.data, reviews.data];
  const finalStatsCards = statsCards.map((card, index) => {
        return {
            ...card,
            value: String(ListValueStatsCards[index]),
        };
    });
  return (
    <>
    <LayoutWrapper>
        <div className="container">
          <h1 className="display-6 fw-bold mb-4">Overview</h1>

          <div className="row">
            {finalStatsCards.map((stat, index) => (
              <div key={index} className="col-12 col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className={`${stat.iconBg} p-2 rounded`}>
                       <i className={`${stat.href}`}></i>
                      </div>
                      <h6 className="card-subtitle text-muted mb-0 fw-medium">{stat.title}</h6>
                    </div>
                    <h2 className="card-title display-5 fw-bold mb-1">{stat.value}</h2>
                    {/* <p className="card-text text-muted small mb-0">{stat.subtitle}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row mt-5">
          {/* Top Reviewed Films Card */}
          <div className="col-12 col-lg-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Top Reviewed Films</h5>
                <div className="list-group list-group-flush">
                  {FilmReviewCountsData.map((film, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2"
                    >
                      <div className="d-flex gap-3">
                        <span className="text-muted fw-medium" style={{ minWidth: "20px" }}>
                          {index+1}.
                        </span>
                        <span>{film.title}</span>
                      </div>
                      <span className="text-muted small">
                        {film.totalReview} review{film.totalReview !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Top Rated Films Card */}
          <div className="col-12 col-lg-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Top Rated Films</h5>
                <div className="list-group list-group-flush">
                  {TopRatedFilmsData.map((film, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2"
                    >
                      <div className="d-flex gap-3">
                        <span className="text-muted fw-medium" style={{ minWidth: "20px" }}>
                          {index+1  }.
                        </span>
                        <span>{film.title}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <span className="fw-medium">{film.averageRating.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
          

        </div>
    </LayoutWrapper>
    </>
    
  );
};

export default Homepage;  