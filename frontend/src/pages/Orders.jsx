import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: "",
    status: "Pending"
  });


  // =========================
  // GET ORDERS
  // =========================

  const getOrders = () => {

    axios
      .get("http://127.0.0.1:8000/orders")
      .then((response) => {

        setOrders(response.data);

      })
      .catch((error) => {

        console.error(
          "Orders error:",
          error
        );

      });

  };


  // =========================
  // GET CUSTOMERS
  // =========================

  const getCustomers = () => {

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

  };


  // =========================
  // GET PRODUCTS
  // =========================

  const getProducts = () => {

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
  // INITIAL DATA
  // =========================

  useEffect(() => {

    getOrders();
    getCustomers();
    getProducts();

  }, []);


  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  // =========================
  // CREATE ORDER
  // =========================

  const handleCreate = (event) => {

    event.preventDefault();


    const orderData = {
      customer_id: Number(formData.customer_id),
      product_id: Number(formData.product_id),
      quantity: Number(formData.quantity),
      status: formData.status
    };


    axios
      .post(
        "http://127.0.0.1:8000/orders",
        orderData
      )
      .then(() => {

        getOrders();

        resetForm();

      })
      .catch((error) => {

        console.error(
          "Order create error:",
          error
        );

      });

  };


  // =========================
  // UPDATE ORDER
  // =========================

  const handleUpdate = (event) => {

    event.preventDefault();


    const orderData = {
      quantity: Number(formData.quantity),
      status: formData.status
    };


    axios
      .put(
        `http://127.0.0.1:8000/orders/${editingOrder.id}`,
        orderData
      )
      .then(() => {

        getOrders();

        resetForm();

      })
      .catch((error) => {

        console.error(
          "Order update error:",
          error
        );

      });

  };


  // =========================
  // DELETE ORDER
  // =========================

  const handleDelete = (id) => {

    const confirmDelete =
      window.confirm(
        "Bu siparişi silmek istediğinize emin misiniz?"
      );


    if (!confirmDelete) {

      return;

    }


    axios
      .delete(
        `http://127.0.0.1:8000/orders/${id}`
      )
      .then(() => {

        getOrders();

      })
      .catch((error) => {

        console.error(
          "Order delete error:",
          error
        );

      });

  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (order) => {

    setEditingOrder(order);


    setFormData({
      customer_id: order.customer_id,
      product_id: order.product_id,
      quantity: order.quantity,
      status: order.status
    });


    setShowForm(true);

  };


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setFormData({
      customer_id: "",
      product_id: "",
      quantity: "",
      status: "Pending"
    });


    setEditingOrder(null);

    setShowForm(false);

  };


  // =========================
  // FIND CUSTOMER
  // =========================

  const getCustomerName = (customerId) => {

    const customer =
      customers.find(
        (item) =>
          item.id === customerId
      );


    return customer
      ? customer.company_name
      : `Müşteri #${customerId}`;

  };


  // =========================
  // FIND PRODUCT
  // =========================

  const getProductName = (productId) => {

    const product =
      products.find(
        (item) =>
          item.id === productId
      );


    return product
      ? product.name
      : `Ürün #${productId}`;

  };


  // =========================
  // SEARCH
  // =========================

  const filteredOrders =
    orders.filter((order) => {

      const customerName =
        getCustomerName(
          order.customer_id
        ).toLowerCase();


      const productName =
        getProductName(
          order.product_id
        ).toLowerCase();


      const status =
        order.status
          ?.toLowerCase() || "";


      const searchText =
        search.toLowerCase();


      return (
        customerName.includes(searchText) ||
        productName.includes(searchText) ||
        status.includes(searchText)
      );

    });


  return (

    <div className="orders-page">


      {/* =========================
          ACTIONS
      ========================= */}

      <div className="page-actions">

        <input
          type="text"
          placeholder="Sipariş ara..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />


        <button
          onClick={() => {

            resetForm();

            setShowForm(true);

          }}
        >
          + Yeni Sipariş
        </button>

      </div>


      {/* =========================
          FORM
      ========================= */}

      {showForm && (

        <section className="form-section">

          <h2>

            {editingOrder
              ? "Sipariş Düzenle"
              : "Yeni Sipariş"}

          </h2>


          <form
            onSubmit={
              editingOrder
                ? handleUpdate
                : handleCreate
            }
          >


            {/* CUSTOMER */}

            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              disabled={editingOrder !== null}
              required
            >

              <option value="">
                Müşteri seçin
              </option>


              {customers.map(
                (customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.company_name}
                  </option>

                )
              )}

            </select>


            {/* PRODUCT */}

            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              disabled={editingOrder !== null}
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


            {/* QUANTITY */}

            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Miktar"
              value={formData.quantity}
              onChange={handleChange}
              required
            />


            {/* STATUS */}

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Preparing">
                Preparing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>


            <div className="form-buttons">

              <button type="submit">

                {editingOrder
                  ? "Güncelle"
                  : "Kaydet"}

              </button>


              <button
                type="button"
                onClick={resetForm}
              >
                İptal
              </button>

            </div>

          </form>

        </section>

      )}


      {/* =========================
          ORDERS TABLE
      ========================= */}

      <section className="data-section">

        <h2>
          Siparişler ({filteredOrders.length})
        </h2>


        <div className="table">


          <div className="table-header">

            <span>
              Müşteri
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
              Sipariş Tarihi
            </span>

            <span>
              İşlem
            </span>

          </div>


          {filteredOrders.map(
            (order) => (

              <div
                className="table-row"
                key={order.id}
              >

                <span>
                  {getCustomerName(
                    order.customer_id
                  )}
                </span>


                <span>
                  {getProductName(
                    order.product_id
                  )}
                </span>


                <span>
                  {order.quantity}
                </span>


                <span>
                  {order.status}
                </span>


                <span>

                  {order.order_date
                    ? new Date(
                        order.order_date
                      ).toLocaleString(
                        "tr-TR",
                        {
                          dateStyle: "short",
                          timeStyle: "short"
                        }
                      )
                    : "-"}

                </span>


                <span className="action-buttons">


                  <button
                    onClick={() =>
                      handleEdit(order)
                    }
                  >
                    Düzenle
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(order.id)
                    }
                  >
                    Sil
                  </button>


                </span>

              </div>

            )
          )}


          {filteredOrders.length === 0 && (

            <div className="empty-message">
              Sipariş bulunamadı.
            </div>

          )}

        </div>

      </section>

    </div>

  );

}

export default Orders;
