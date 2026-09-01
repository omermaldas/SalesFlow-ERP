import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Orders from "./pages/Orders";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockMovements from "./pages/StockMovements";

function App() {

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [activePage, setActivePage] = useState("Dashboard");


  // =========================
  // DASHBOARD DATA
  // =========================

  const getDashboardData = () => {

    axios
      .get("http://127.0.0.1:8000/customers")
      .then((response) => {

        setCustomers(response.data);

      })
      .catch((error) => {

        console.error(
          "Customers error:",
          error
        );

      });


    axios
      .get("http://127.0.0.1:8000/products")
      .then((response) => {

        setProducts(response.data);

      })
      .catch((error) => {

        console.error(
          "Products error:",
          error
        );

      });

  };


  // =========================
  // DASHBOARD REFRESH
  // =========================

  useEffect(() => {

    getDashboardData();

  }, [activePage]);


  return (

    <div className="app">


      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="logo">
          SalesFlow ERP
        </div>


        <nav>


          {/* DASHBOARD */}

          <button
            className={`menu-item ${
              activePage === "Dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Dashboard")
            }
          >
            Dashboard
          </button>


          {/* CUSTOMERS */}

          <button
            className={`menu-item ${
              activePage === "Müşteriler"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Müşteriler")
            }
          >
            Müşteriler
          </button>


          {/* SUPPLIERS */}

          <button
            className={`menu-item ${
              activePage === "Tedarikçiler"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Tedarikçiler")
            }
          >
            Tedarikçiler
          </button>


          {/* PRODUCTS */}

          <button
            className={`menu-item ${
              activePage === "Ürünler"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Ürünler")
            }
          >
            Ürünler
          </button>


          {/* ORDERS */}

          <button
            className={`menu-item ${
              activePage === "Siparişler"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Siparişler")
            }
          >
            Siparişler
          </button>


          {/* PURCHASE ORDERS */}

          <button
            className={`menu-item ${
              activePage === "Satın Alma"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Satın Alma")
            }
          >
            Satın Alma
          </button>


          {/* STOCK MOVEMENTS */}

          <button
            className={`menu-item ${
              activePage === "Stok Hareketleri"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("Stok Hareketleri")
            }
          >
            Stok Hareketleri
          </button>


        </nav>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">


        {/* TOP BAR */}

        <header className="topbar">

          <h1>
            {activePage}
          </h1>


          <div className="user-info">
            ERP Yönetim Sistemi
          </div>

        </header>


        {/* =========================
            DASHBOARD
        ========================= */}

        {activePage === "Dashboard" && (

          <>

            <section className="dashboard">


              {/* CUSTOMER COUNT */}

              <div className="stat-card">

                <span>
                  Müşteri Sayısı
                </span>

                <strong>
                  {customers.length}
                </strong>

              </div>


              {/* PRODUCT COUNT */}

              <div className="stat-card">

                <span>
                  Ürün Sayısı
                </span>

                <strong>
                  {products.length}
                </strong>

              </div>


              {/* TOTAL STOCK */}

              <div className="stat-card">

                <span>
                  Toplam Stok
                </span>

                <strong>

                  {products.reduce(
                    (total, product) =>
                      total +
                      Number(
                        product.stock || 0
                      ),
                    0
                  )}

                </strong>

              </div>


              {/* SYSTEM STATUS */}

              <div className="stat-card">

                <span>
                  Durum
                </span>

                <strong>
                  Aktif
                </strong>

              </div>


            </section>


            {/* =========================
                RECENT PRODUCTS
            ========================= */}

            <section className="data-section">

              <h2>
                Son Ürünler
              </h2>


              <div className="table">


                <div className="table-header">

                  <span>
                    Ürün
                  </span>

                  <span>
                    SKU
                  </span>

                  <span>
                    Kategori
                  </span>

                  <span>
                    Stok
                  </span>

                </div>


                {products
                  .slice(0, 5)
                  .map(
                    (product) => (

                      <div
                        className="table-row"
                        key={product.id}
                      >

                        <span>
                          {product.name}
                        </span>

                        <span>
                          {product.sku}
                        </span>

                        <span>
                          {product.category}
                        </span>

                        <span>
                          {product.stock}
                        </span>

                      </div>

                    )
                  )}


              </div>

            </section>

          </>

        )}


        {/* =========================
            CUSTOMERS
        ========================= */}

        {activePage === "Müşteriler" && (

          <Customers />

        )}


        {/* =========================
            SUPPLIERS
        ========================= */}

        {activePage === "Tedarikçiler" && (

          <Suppliers />

        )}


        {/* =========================
            PRODUCTS
        ========================= */}

        {activePage === "Ürünler" && (

          <Products />

        )}


        {/* =========================
            ORDERS
        ========================= */}

        {activePage === "Siparişler" && (

          <Orders />

        )}


        {/* =========================
            PURCHASE ORDERS
        ========================= */}

        {activePage === "Satın Alma" && (

          <PurchaseOrders />

        )}


        {/* =========================
            STOCK MOVEMENTS
        ========================= */}

        {activePage === "Stok Hareketleri" && (

          <StockMovements />

        )}


        {/* =========================
            OTHER PAGES
        ========================= */}

        {activePage !== "Dashboard" &&
          activePage !== "Müşteriler" &&
          activePage !== "Tedarikçiler" &&
          activePage !== "Ürünler" &&
          activePage !== "Siparişler" &&
          activePage !== "Satın Alma" &&
          activePage !== "Stok Hareketleri" && (

            <section className="data-section">

              <h2>
                {activePage}
              </h2>

              <p>
                Bu bölüm hazırlanıyor.
              </p>

            </section>

          )}


      </main>

    </div>

  );

}

export default App;
