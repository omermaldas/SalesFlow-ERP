import { useEffect, useState } from "react";
import axios from "axios";

function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingSupplier, setEditingSupplier] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    country: "",
    contact_person: "",
    email: "",
    phone: ""
  });


  // =========================
  // GET SUPPLIERS
  // =========================

  const getSuppliers = () => {

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

  };


  useEffect(() => {

    getSuppliers();

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
  // CREATE
  // =========================

  const handleCreate = (event) => {

    event.preventDefault();


    axios
      .post(
        "http://127.0.0.1:8000/suppliers",
        formData
      )
      .then(() => {

        getSuppliers();

        resetForm();

      })
      .catch((error) => {

        console.error(
          "Supplier create error:",
          error
        );

      });

  };


  // =========================
  // UPDATE
  // =========================

  const handleUpdate = (event) => {

    event.preventDefault();


    const supplierData = {
      company_name: formData.company_name,
      country: formData.country,
      contact_person: formData.contact_person,
      email: formData.email,
      phone: formData.phone
    };


    axios
      .put(
        `http://127.0.0.1:8000/suppliers/${editingSupplier.id}`,
        supplierData
      )
      .then(() => {

        getSuppliers();

        resetForm();

      })
      .catch((error) => {

        console.error(
          "Supplier update error:",
          error
        );

      });

  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Bu tedarikçiyi silmek istediğinize emin misiniz?"
    );


    if (!confirmDelete) {
      return;
    }


    axios
      .delete(
        `http://127.0.0.1:8000/suppliers/${id}`
      )
      .then(() => {

        getSuppliers();

      })
      .catch((error) => {

        console.error(
          "Supplier delete error:",
          error
        );

      });

  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (supplier) => {

    setEditingSupplier(supplier);

    setFormData({
      company_name: supplier.company_name,
      country: supplier.country,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone
    });

    setShowForm(true);

  };


  // =========================
  // RESET
  // =========================

  const resetForm = () => {

    setFormData({
      company_name: "",
      country: "",
      contact_person: "",
      email: "",
      phone: ""
    });

    setEditingSupplier(null);

    setShowForm(false);

  };


  // =========================
  // SEARCH
  // =========================

  const filteredSuppliers =
    suppliers.filter((supplier) => {

      const searchText =
        search.toLowerCase();

      return (
        supplier.company_name
          ?.toLowerCase()
          .includes(searchText) ||

        supplier.country
          ?.toLowerCase()
          .includes(searchText) ||

        supplier.contact_person
          ?.toLowerCase()
          .includes(searchText) ||

        supplier.email
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  return (

    <div className="suppliers-page">


      {/* ACTIONS */}

      <div className="page-actions">

        <input
          type="text"
          placeholder="Tedarikçi ara..."
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
          + Yeni Tedarikçi
        </button>

      </div>


      {/* FORM */}

      {showForm && (

        <section className="form-section">

          <h2>

            {editingSupplier
              ? "Tedarikçi Düzenle"
              : "Yeni Tedarikçi"}

          </h2>


          <form
            onSubmit={
              editingSupplier
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

                {editingSupplier
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


      {/* TABLE */}

      <section className="data-section">

        <h2>
          Tedarikçiler ({filteredSuppliers.length})
        </h2>


        <div className="table">


          <div className="table-header">

            <span>
              Firma
            </span>

            <span>
              Ülke
            </span>

            <span>
              Yetkili
            </span>

            <span>
              E-posta
            </span>

            <span>
              Telefon
            </span>

            <span>
              İşlem
            </span>

          </div>


          {filteredSuppliers.map(
            (supplier) => (

              <div
                className="table-row"
                key={supplier.id}
              >

                <span>
                  {supplier.company_name}
                </span>

                <span>
                  {supplier.country}
                </span>

                <span>
                  {supplier.contact_person}
                </span>

                <span>
                  {supplier.email}
                </span>

                <span>
                  {supplier.phone}
                </span>


                <span className="action-buttons">

                  <button
                    onClick={() =>
                      handleEdit(supplier)
                    }
                  >
                    Düzenle
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(supplier.id)
                    }
                  >
                    Sil
                  </button>

                </span>

              </div>

            )
          )}


          {filteredSuppliers.length === 0 && (

            <div className="empty-message">
              Tedarikçi bulunamadı.
            </div>

          )}

        </div>

      </section>

    </div>

  );

}

export default Suppliers;
