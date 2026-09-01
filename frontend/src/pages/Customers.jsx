import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    country: "",
    contact_person: "",
    email: "",
    phone: ""
  });


  // =========================
  // CUSTOMERS GET
  // =========================

  const getCustomers = () => {

    axios
      .get("http://127.0.0.1:8000/customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Customers:", error);
      });

  };


  useEffect(() => {

    getCustomers();

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
  // CUSTOMER CREATE
  // =========================

  const handleCreate = (event) => {

    event.preventDefault();

    axios
      .post(
        "http://127.0.0.1:8000/customers",
        formData
      )
      .then(() => {

        getCustomers();

        setFormData({
          company_name: "",
          country: "",
          contact_person: "",
          email: "",
          phone: ""
        });

        setShowForm(false);

      })
      .catch((error) => {

        console.error("Customer create error:", error);

      });

  };


  // =========================
  // CUSTOMER UPDATE
  // =========================

  const handleUpdate = (event) => {

    event.preventDefault();

    axios
      .put(
        `http://127.0.0.1:8000/customers/${editingCustomer.id}`,
        formData
      )
      .then(() => {

        getCustomers();

        setEditingCustomer(null);

        setFormData({
          company_name: "",
          country: "",
          contact_person: "",
          email: "",
          phone: ""
        });

        setShowForm(false);

      })
      .catch((error) => {

        console.error("Customer update error:", error);

      });

  };


  // =========================
  // CUSTOMER DELETE
  // =========================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Bu müşteriyi silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(
        `http://127.0.0.1:8000/customers/${id}`
      )
      .then(() => {

        getCustomers();

      })
      .catch((error) => {

        console.error("Customer delete error:", error);

      });

  };


  // =========================
  // EDIT BUTTON
  // =========================

  const handleEdit = (customer) => {

    setEditingCustomer(customer);

    setFormData({
      company_name: customer.company_name,
      country: customer.country,
      contact_person: customer.contact_person,
      email: customer.email,
      phone: customer.phone
    });

    setShowForm(true);

  };


  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = customers.filter((customer) => {

    const searchText = search.toLowerCase();

    return (
      customer.company_name
        ?.toLowerCase()
        .includes(searchText) ||

      customer.country
        ?.toLowerCase()
        .includes(searchText) ||

      customer.contact_person
        ?.toLowerCase()
        .includes(searchText)
    );

  });


  return (

    <div className="customers-page">

      <div className="page-actions">

        <input
          type="text"
          placeholder="Müşteri ara..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <button
          onClick={() => {

            setEditingCustomer(null);

            setFormData({
              company_name: "",
              country: "",
              contact_person: "",
              email: "",
              phone: ""
            });

            setShowForm(true);

          }}
        >
          + Yeni Müşteri
        </button>

      </div>


      {showForm && (

        <section className="form-section">

          <h2>
            {editingCustomer
              ? "Müşteri Düzenle"
              : "Yeni Müşteri"}
          </h2>


          <form
            onSubmit={
              editingCustomer
                ? handleUpdate
                : handleCreate
            }
          >

            <input
              name="company_name"
              placeholder="Firma adı"
              value={formData.company_name}
              onChange={handleChange}
              required
            />

            <input
              name="country"
              placeholder="Ülke"
              value={formData.country}
              onChange={handleChange}
              required
            />

            <input
              name="contact_person"
              placeholder="Yetkili kişi"
              value={formData.contact_person}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="E-posta"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Telefon"
              value={formData.phone}
              onChange={handleChange}
              required
            />


            <div className="form-buttons">

              <button type="submit">

                {editingCustomer
                  ? "Güncelle"
                  : "Kaydet"}

              </button>

              <button
                type="button"
                onClick={() => {

                  setShowForm(false);

                  setEditingCustomer(null);

                }}
              >
                İptal
              </button>

            </div>

          </form>

        </section>

      )}


      <section className="data-section">

        <h2>
          Müşteriler ({filteredCustomers.length})
        </h2>


        <div className="table customer-table">

          <div className="table-header">

            <span>Firma</span>
            <span>Ülke</span>
            <span>Yetkili</span>
            <span>E-posta</span>
            <span>Telefon</span>
            <span>İşlem</span>

          </div>


          {filteredCustomers.map((customer) => (

            <div
              className="table-row"
              key={customer.id}
            >

              <span>
                {customer.company_name}
              </span>

              <span>
                {customer.country}
              </span>

              <span>
                {customer.contact_person}
              </span>

              <span>
                {customer.email}
              </span>

              <span>
                {customer.phone}
              </span>

              <span className="action-buttons">

                <button
                  onClick={() =>
                    handleEdit(customer)
                  }
                >
                  Düzenle
                </button>

                <button
                  onClick={() =>
                    handleDelete(customer.id)
                  }
                >
                  Sil
                </button>

              </span>

            </div>

          ))}


          {filteredCustomers.length === 0 && (

            <div className="empty-message">
              Müşteri bulunamadı.
            </div>

          )}

        </div>

      </section>

    </div>

  );
}

export default Customers;