import "./App.css";
import tmdb from "./Assets/tmdb.svg";

function Footer() {
  return (
    <>
      <footer class="py-4 border-top footer-color">
        <div class="container-md d-flex flex-wrap justify-content-between align-items-center">
          <div class="col-md-4 d-flex align-items-center">
            <span class=" text-muted">2023 Movie Rater</span>
          </div>
          <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li class="ms-3">
              <div>
                <img src={tmdb} alt="d" />
              </div>
            </li>
            <li class="ms-3 text-muted">TMDB for Movie Data</li>
          </ul>
        </div>
      </footer>
    </>
  );
}

export default Footer;
