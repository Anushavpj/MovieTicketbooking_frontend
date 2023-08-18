import React, { useEffect, useState, useContext} from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";
import { Link } from "react-router-dom";
import { AuthStatus } from "../../context/context";


const Home = () => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const {authStatus} = useContext (AuthStatus)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://movieappbackend.azurewebsites.net/api/Movie/Reterive/All"
        );
        setMovieList(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookTicket = (movieId) => {
    const isAuthenticated = localStorage.getItem("accessToken") !== null;

    if (isAuthenticated) {
      // User is logged in, allow booking ticket
      // Redirect to the booking page with the movie ID
      window.location.href = `/booking/${movieId}`;
    } else {
      // User is not logged in, show a toast message to login
      toast.error("Please login to book tickets", { autoClose: 3000 });
    }
  };

  return (
    <section id="home" className="mt-5">
      <div className="container mt-5 pt-5">
        {!loading ? (
          <div className="row">
            {movieList.map((movie) => (
              <div className="col-md-4 mb-5" key={movie.id}>
                <a href="#" className="card-flip">
                  <div className="card-flip-inner">
                    <div
                      className="card-flip-front"
                      style={{
                        backgroundImage: `url(${movie.movieImage})`,
                        minHeight: "20rem",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* <div className="d-flex flex-column h-100 ignore-dark-mode">
                        <h2 className="fs-lg fw-normal mb-0 mt-auto">
                          Branding
                        </h2>
                      </div> */}
                    </div>
                    <div className="card-flip-back bg-secondary">
                      <div className="d-flex flex-column h-100 px-sm-2 pt-sm-2 px-lg-0 pt-lg-0 px-xl-3 pt-xl-3">
                        <h3 className="h4">{movie.movieName}</h3>
                        <ul className="text-body ps-4 mb-3">
                          <li>
                            <strong>Genre:</strong> {movie.genre}
                          </li>
                          <li>
                            <strong>Languages:</strong>{" "}
                            {movie.languages
                              .split(",")
                              .map((language, index) => (
                                <span key={index}>{language}</span>
                              ))}
                          </li>
                          <li>
                            <strong>Description:</strong> {movie.description}
                          </li>
                        </ul>
                        {authStatus ?(
                        <>
                          <Link
                            to={"/booking/" + movie.id}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Book Ticket
                          </Link>
                        </>
                      ):(
                        <> 
                        <p> Please login to book ticket </p>
                        </>
                      )}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="row min-vh-100 justify-content-center align-items-center">
            <div className="col-3 d-flex justify-content-center align-items-center">
              <div className="spinner-grow text-muted" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </section>
  );
};

export default Home;
