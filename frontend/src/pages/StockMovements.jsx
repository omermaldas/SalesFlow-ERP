import { useEffect, useState } from "react";
import axios from "axios";

function StockMovements() {

  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    movement_type: "IN"
  });


  // =========================
  // DATA
  // =========================

  const getData = () => {

    axios
      .get("http://127.0.0.1:8000/stock-movements")
      .then((response) => {

        setMovements(response.data);

      })
      .catch((error) => {

        console.error(
          "Stock movements error:",
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


  useEffect(() => {

    getData();

  }, []);


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  // =========================
  // CREATE FORM
  // =========================

  const openCreateForm = () => {

    setEditingId(null);

    setFormData({
      product_id: "",
      quantity: "",
      movement_type: "IN"
    });

    setShowForm(true);

  };


  // =========================
  // EDIT FORM
  // =========================

  const openEditForm = (movement) => {

    setEditingId(movement.id);

    setFormData({
      product_id: movement.product_id,
      quantity: movement.quantity,
      movement_type: movement.movement_type
    });

    setShowForm(true);

  };


  // =========================
  // SAVE
  // =========================

  const handleSubmit = (event) => {

    event.preventDefault();


    if (editingId) {

      axios
        .put(
          `http://127.0.0.1:8000/stock-movements/${editingId}`,
          {
            quantity: Number(
              formData.quantity
            ),
            movement_type:
              formData.movement_type
          }
        )
        .then(() => {

          getData();

          setShowForm(false);

          setEditingId(null);

        })
        .catch((error) => {

          console.error(
            "Stock movement update error:",
            error
          );

        });

    } else {

      axios
        .post(
          "http://127.0.0.1:8000/stock-movements",
          {
            product_id: Number(
              formData.product_id
            ),
            quantity: Number(
              formData.quantity
            ),
            movement_type:
              formData.movement_type
          }
        )
        .then(() => {

          getData();

          setShowForm(false);

        })
        .catch((error) => {

          console.error(
            "Stock movement create error:",
            error
          );

        });

    }

  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {

    const confirmed = window.confirm(
      "Bu stok hareketini silmek istediğinize emin misiniz?"
    );


    if (!confirmed) {
      return;
    }


    axios
      .delete(
        `http://127.0.0.1:8000/stock-movements/${id}`
      )
      .then(() => {

        getData();

      })
      .catch((error) => {

        console.error(
          "Stock movement delete error:",
          error
        );

      });

  };


  return (

    <div className="products-page">


      {/* ACTIONS */}

      <div className="page-actions">

        <button
          onClick={openCreateForm}
        >
          + Yeni Stok Hareketi
        </button>

      </div>


      {/* FORM */}

      {showForm && (

        <section className="form-section">

          <h2>
            {editingId
              ? "Stok Hareketi Düzenle"
              : "Yeni Stok Hareketi"}
          </h2>


          <form onSubmit={handleSubmit}>


            {!editingId && (

              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
              >

                <option value="">
                  Ürün seçin
                </option>

                {products.map(
                  (product) => (

                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name}
                    </option>

                  )
                )}

              </select>

            )}


            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Miktar"
              value={formData.quantity}
              onChange={handleChange}
              required
            />


            <select
              name="movement_type"
              value={formData.movement_type}
              onChange={handleChange}
              required
            >

              <option value="IN">
                IN - Giriş
              </option>

              <option value="OUT">
                OUT - Çıkış
              </option>

            </select>


            <div className="form-buttons">

              <button type="submit">
                {editingId
                  ? "Güncelle"
                  : "Kaydet"}
              </button>


              <button
                type="button"
                onClick={() => {

                  setShowForm(false);

                  setEditingId(null);

                }}
              >
                İptal
              </button>

            </div>

          </form>

        </section>

      )}


      {/* TABLE */}

      <section className="data-section">

        <h2>
          Stok Hareketleri ({movements.length})
        </h2>


        <div className="table">


          <div className="table-header">

            <span>
              Ürün
            </span>

            <span>
              Miktar
            </span>

            <span>
              Hareket
            </span>

            <span>
              İşlemler
            </span>

          </div>


          {movements.map(
            (movement) => {

              const product =
                products.find(
                  (item) =>
                    item.id ===
                    movement.product_id
                );


              return (

                <div
                  className="table-row"
                  key={movement.id}
                >

                  <span>
                    {product
                      ? product.name
                      : movement.product_id}
                  </span>

                  <span>
                    {movement.quantity}
                  </span>

                  <span>
                    {movement.movement_type}
                  </span>

                  <span>

                    <button
                      onClick={() =>
                        openEditForm(
                          movement
                        )
                      }
                    >
                      Düzenle
                    </button>


                    <button
                      onClick={() =>
                        handleDelete(
                          movement.id
                        )
                      }
                    >
                      Sil
                    </button>

                  </span>

                </div>

              );

            }
          )}


          {movements.length === 0 && (

            <div className="empty-message">
              Stok hareketi bulunamadı.
            </div>

          )}

        </div>

      </section>

    </div>

  );

}

export default StockMovements;
