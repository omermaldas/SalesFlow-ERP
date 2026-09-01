import { useEffect, useState } from "react";
import axios from "axios";

function Products() {

  const [products, setProducts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    price: "",
    stock: ""
  });


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


  useEffect(() => {

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
  // CREATE
  // =========================

  const handleCreate = (event) => {

    event.preventDefault();

    const productData = {
      name: formData.name,
      sku: formData.sku,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };


    axios
      .post(
        "http://127.0.0.1:8000/products",
        productData
      )
      .then(() => {

        getProducts();

        resetForm();

      })
      .catch((error) => {

        console.error(
          "Product create error:",
          error
        );

      });

  };


  // =========================
  // UPDATE
  // =========================

  const handleUpdate = (event) => {

    event.preventDefault();

    const productData = {
      name: formData.name,
      sku: formData.sku,
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };


    axios
      .put(
        `http://127.0.0.1:8000/products/${editingProduct.id}`,
        productData
      )
      .then(() => {

        getProducts();

        resetForm();

      })
      .catch((error) => {

        console.error(
          "Product update error:",
          error
        );

      });

  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {

    const confirmDelete = window.confirm(
      "Bu ürünü silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) {
      return;
    }


    axios
      .delete(
        `http://127.0.0.1:8000/products/${id}`
      )
      .then(() => {

        getProducts();

      })
      .catch((error) => {

        console.error(
          "Product delete error:",
          error
        );

      });

  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (product) => {

    setEditingProduct(product);

    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock
    });

    setShowForm(true);

  };


  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setFormData({
      name: "",
      sku: "",
      brand: "",
      category: "",
      price: "",
      stock: ""
    });

    setEditingProduct(null);

    setShowForm(false);

  };


  // =========================
  // SEARCH
  // =========================

  const filteredProducts = products.filter(
    (product) => {

      const searchText =
        search.toLowerCase();

      return (
        product.name
          ?.toLowerCase()
          .includes(searchText) ||

        product.sku
          ?.toLowerCase()
          .includes(searchText) ||

        product.brand
          ?.toLowerCase()
          .includes(searchText) ||

        product.category
          ?.toLowerCase()
          .includes(searchText)
      );

    }
  );


  return (

    <div className="products-page">


      {/* ACTIONS */}

      <div className="page-actions">

        <input
          type="text"
          placeholder="Ürün ara..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />


        <button
          onClick={() => {

            setFormData({
              name: "",
              sku: "",
              brand: "",
              category: "",
              price: "",
              stock: ""
            });

            setEditingProduct(null);

            setShowForm(true);

          }}
        >
          + Yeni Ürün
        </button>

      </div>


      {/* FORM */}

      {showForm && (

        <section className="form-section">

          <h2>

            {editingProduct
              ? "Ürün Düzenle"
              : "Yeni Ürün"}

          </h2>


          <form
            onSubmit={
              editingProduct
                ? handleUpdate
                : handleCreate
            }
          >

            <input
              name="name"
              placeholder="Ürün adı"
              value={formData.name}
              onChange={handleChange}
              required
            />


            <input
              name="sku"
              placeholder="SKU"
              value={formData.sku}
              onChange={handleChange}
              required
            />


            <input
              name="brand"
              placeholder="Marka"
              value={formData.brand}
              onChange={handleChange}
              required
            />


            <input
              name="category"
              placeholder="Kategori"
              value={formData.category}
              onChange={handleChange}
              required
            />


            <input
              name="price"
              type="number"
              placeholder="Fiyat"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />


            <input
              name="stock"
              type="number"
              placeholder="Stok"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />


            <div className="form-buttons">

              <button type="submit">

                {editingProduct
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


      {/* PRODUCTS TABLE */}

      <section className="data-section">

        <h2>
          Ürünler ({filteredProducts.length})
        </h2>


        <div className="table product-table">


          <div className="table-header">

            <span>
              Ürün
            </span>

            <span>
              SKU
            </span>

            <span>
              Marka
            </span>

            <span>
              Kategori
            </span>

            <span>
              Fiyat
            </span>

            <span>
              Stok
            </span>

            <span>
              İşlem
            </span>

          </div>


          {filteredProducts.map(
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
                  {product.brand}
                </span>

                <span>
                  {product.category}
                </span>

                <span>
                  {product.price}
                </span>

                <span>
                  {product.stock}
                </span>


                <span className="action-buttons">

                  <button
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    Düzenle
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    Sil
                  </button>

                </span>

              </div>

            )
          )}


          {filteredProducts.length === 0 && (

            <div className="empty-message">
              Ürün bulunamadı.
            </div>

          )}

        </div>

      </section>

    </div>

  );
}

export default Products;
