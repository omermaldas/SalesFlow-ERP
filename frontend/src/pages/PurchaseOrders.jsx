import { useEffect, useState } from "react";
import axios from "axios";

function PurchaseOrders() {

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    supplier_id: "",
    product_id: "",
    quantity: "",
    status: "Pending"
  });


  // =========================
  // DATA
  // =========================

  const getData = () => {

    axios
      .get("http://127.0.0.1:8000/purchase-orders")
      .then((response) => {
        setPurchaseOrders(response.data);
      })
      .catch((error) => {
        console.error(
          "Purchase orders error:",
          error
        );
      });


    axios
      .get("http://127.0.0.1:8000/suppliers")
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error(
          "Suppliers error:",
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
  // NEW PURCHASE ORDER
  // =========================

  const openCreateForm = () => {

    setEditingId(null);

    setFormData({
      supplier_id: "",
      product_id: "",
      quantity: "",
      status: "Pending"
    });

    setShowForm(true);

  };


  // =========================
  // EDIT
  // =========================

  const openEditForm = (purchaseOrder) => {

    setEditingId(purchaseOrder.id);

    setFormData({
      supplier_id: purchaseOrder.supplier_id,
      product_id: purchaseOrder.product_id,
      quantity: purchaseOrder.quantity,
      status: purchaseOrder.status
    });

    setShowForm(true);

  };


  // =========================
  // SAVE
  // =========================

  const handleSubmit = (event) => {

    event.preventDefault();


    const data = {
      quantity: Number(formData.quantity),
      status: formData.status
    };


    if (editingId) {

      axios
        .put(
          `http://127.0.0.1:8000/purchase-orders/${editingId}`,
          data
        )
        .then(() => {

          getData();

          setShowForm(false);

          setEditingId(null);

        })
        .catch((error) => {

          console.error(
            "Purchase order update error:",
            error
          );

        });

    } else {

      axios
        .post(
          "http://127.0.0.1:8000/purchase-orders",
          {
            supplier_id: Number(
              formData.supplier_id
            ),
            product_id: Number(
              formData.product_id
            ),
            quantity: Number(
              formData.quantity
            ),
            status: formData.status
          }
        )
        .then(() => {

          getData();

          setShowForm(false);

        })
        .catch((error) => {

          console.error(
            "Purchase order create error:",
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
      "Bu satın alma siparişini silmek istediğinize emin misiniz?"
    );


    if (!confirmed) {
      return;
    }


    axios
      .delete(
        `http://127.0.0.1:8000/purchase-orders/${id}`
      )
      .then(() => {

        getData();

      })
      .catch((error) => {

        console.error(
          "Purchase order delete error:",
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
          + Yeni Satın Alma
        </button>

      </div>


      {/* FORM */}

      {showForm && (

        <section className="form-section">

          <h2>
            {editingId
              ? "Satın Alma Düzenle"
              : "Yeni Satın Alma"}
          </h2>


          <form onSubmit={handleSubmit}>


            {!editingId && (

              <>

                <select
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Tedarikçi seçin
                  </option>

                  {suppliers.map(
                    (supplier) => (

                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.company_name}
                      </option>

                    )
                  )}

                </select>


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

              </>

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
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Ordered">
                Ordered
              </option>

              <option value="Received">
                Received
              </option>

              <option value="Cancelled">
                Cancelled
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
          Satın Alma ({purchaseOrders.length})
        </h2>


        <div className="table">


          <div className="table-header">

            <span>
              Tedarikçi
            </span>

            <span>
              Ürün
            </span>

            <span>
              Miktar
            </span>

            <span>
              Durum
            </span>

            <span>
              İşlemler
            </span>

          </div>


          {purchaseOrders.map(
            (purchaseOrder) => {

              const supplier =
                suppliers.find(
                  (item) =>
                    item.id ===
                    purchaseOrder.supplier_id
                );

              const product =
                products.find(
                  (item) =>
                    item.id ===
                    purchaseOrder.product_id
                );


              return (

                <div
                  className="table-row"
                  key={purchaseOrder.id}
                >

                  <span>
                    {supplier
                      ? supplier.company_name
                      : purchaseOrder.supplier_id}
                  </span>

                  <span>
                    {product
                      ? product.name
                      : purchaseOrder.product_id}
                  </span>

                  <span>
                    {purchaseOrder.quantity}
                  </span>

                  <span>
                    {purchaseOrder.status}
                  </span>

                  <span>

                    <button
                      onClick={() =>
                        openEditForm(
                          purchaseOrder
                        )
                      }
                    >
                      Düzenle
                    </button>


                    <button
                      onClick={() =>
                        handleDelete(
                          purchaseOrder.id
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


          {purchaseOrders.length === 0 && (

            <div className="empty-message">
              Satın alma kaydı bulunamadı.
            </div>

          )}

        </div>

      </section>

    </div>

  );

}

export default PurchaseOrders;
