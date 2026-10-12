import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const toggleSearch = () => setSearchVisible((v) => !v);

  return (
    <header className="container">
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">
              <img src="/img/header-logo.png" alt="Bosa Noga" />
            </NavLink>

            <div className="collapase navbar-collapse" id="navbarMain">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    Главная
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/catalog"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    Каталог
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    О магазине
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/contacts"
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active" : "")
                    }
                  >
                    Контакты
                  </NavLink>
                </li>
              </ul>

              <div>
                <div className="header-controls-pics">
                  <div
                    className="header-controls-pic header-controls-search"
                    onClick={toggleSearch}
                  />
                  <NavLink
                    to="/cart"
                    className="header-controls-pic header-controls-cart"
                  >
                    <div className="header-controls-cart-full">0</div>
                  </NavLink>
                </div>

                <form
                  className={
                    "header-controls-search-form form-inline " +
                    (searchVisible ? "" : "invisible")
                  }
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (searchValue.trim()) {
                      navigate(
                        `/catalog?q=${encodeURIComponent(searchValue.trim())}`,
                      );
                    }
                    setSearchVisible(false);
                    setSearchValue("");
                  }}
                >
                  <input
                    className="form-control"
                    placeholder="Поиск"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
