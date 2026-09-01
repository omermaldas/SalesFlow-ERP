from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import Base, engine, get_db
from . import models
from .schemas import (
    CustomerCreate,
    CustomerUpdate,
    OrderCreate,
    OrderUpdate,
    ProductCreate,
    ProductUpdate,
    StockMovementCreate,
    StockMovementUpdate,
    SupplierCreate,
    SupplierUpdate,
    PurchaseOrderCreate,
    PurchaseOrderUpdate
)
from . import crud
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT version();")
            )

            version = result.scalar()

        return {
            "status": "Bağlantı başarılı",
            "database": version
        }

    except Exception as e:

        return {
            "status": "Bağlantı başarısız",
            "error": str(e)
        }


@app.post("/customers")
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    return crud.create_customer(db, customer)


@app.get("/customers")
def get_customers(
    db: Session = Depends(get_db)
):
    return crud.get_customers(db)


@app.get("/customers/{customer_id}")
def get_customer_by_id(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = crud.get_customer_by_id(
        db,
        customer_id
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@app.put("/customers/{customer_id}")
def update_customer(
    customer_id: int,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db)
):

    customer = crud.update_customer(
        db,
        customer_id,
        customer_data
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@app.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):

    customer = crud.delete_customer(
        db,
        customer_id
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@app.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return crud.create_product(db, product)


@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    return crud.get_products(db)


@app.get("/products/{product_id}")
def get_product_by_id(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = crud.get_product_by_id(
        db,
        product_id
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = crud.update_product(
        db,
        product_id,
        product_data
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = crud.delete_product(
        db,
        product_id
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@app.post("/orders")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    return crud.create_order(db, order)


@app.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):
    return crud.get_orders(db)


@app.get("/orders/{order_id}")
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = crud.get_order_by_id(
        db,
        order_id
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@app.put("/orders/{order_id}")
def update_order(
    order_id: int,
    order_data: OrderUpdate,
    db: Session = Depends(get_db)
):

    order = crud.update_order(
        db,
        order_id,
        order_data
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@app.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = crud.delete_order(
        db,
        order_id
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@app.post("/stock-movements")
def create_stock_movement(
    movement: StockMovementCreate,
    db: Session = Depends(get_db)
):

    result = crud.create_stock_movement(
        db,
        movement
    )

    if not result:
        raise HTTPException(
            status_code=400,
            detail="Invalid product or insufficient stock"
        )

    return result


@app.get("/stock-movements")
def get_stock_movements(
    db: Session = Depends(get_db)
):

    return crud.get_stock_movements(db)


@app.get("/stock-movements/product/{product_id}")
def get_stock_movements_by_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = crud.get_product_by_id(
        db,
        product_id
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return crud.get_stock_movements_by_product(
        db,
        product_id
    )


@app.get("/stock-movements/{movement_id}")
def get_stock_movement_by_id(
    movement_id: int,
    db: Session = Depends(get_db)
):

    movement = crud.get_stock_movement_by_id(
        db,
        movement_id
    )

    if not movement:
        raise HTTPException(
            status_code=404,
            detail="Stock movement not found"
        )

    return movement


@app.put("/stock-movements/{movement_id}")
def update_stock_movement(
    movement_id: int,
    movement_data: StockMovementUpdate,
    db: Session = Depends(get_db)
):

    movement = crud.update_stock_movement(
        db,
        movement_id,
        movement_data
    )

    if not movement:
        raise HTTPException(
            status_code=404,
            detail="Stock movement could not be updated"
        )

    return movement


@app.delete("/stock-movements/{movement_id}")
def delete_stock_movement(
    movement_id: int,
    db: Session = Depends(get_db)
):

    movement = crud.delete_stock_movement(
        db,
        movement_id
    )

    if not movement:
        raise HTTPException(
            status_code=404,
            detail="Stock movement not found"
        )

    return movement


@app.post("/suppliers")
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    return crud.create_supplier(db, supplier)


@app.get("/suppliers")
def get_suppliers(
    db: Session = Depends(get_db)
):
    return crud.get_suppliers(db)


@app.get("/suppliers/{supplier_id}")
def get_supplier_by_id(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = crud.get_supplier_by_id(
        db,
        supplier_id
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


@app.put("/suppliers/{supplier_id}")
def update_supplier(
    supplier_id: int,
    supplier_data: SupplierUpdate,
    db: Session = Depends(get_db)
):

    supplier = crud.update_supplier(
        db,
        supplier_id,
        supplier_data
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


@app.delete("/suppliers/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = crud.delete_supplier(
        db,
        supplier_id
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


@app.post("/purchase-orders")
def create_purchase_order(
    purchase_order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):

    return crud.create_purchase_order(
        db,
        purchase_order
    )


@app.get("/purchase-orders")
def get_purchase_orders(
    db: Session = Depends(get_db)
):

    return crud.get_purchase_orders(db)


@app.get("/purchase-orders/supplier/{supplier_id}")
def get_purchase_orders_by_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = crud.get_supplier_by_id(
        db,
        supplier_id
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return crud.get_purchase_orders_by_supplier(
        db,
        supplier_id
    )


@app.get("/purchase-orders/{purchase_order_id}")
def get_purchase_order_by_id(
    purchase_order_id: int,
    db: Session = Depends(get_db)
):

    purchase_order = crud.get_purchase_order_by_id(
        db,
        purchase_order_id
    )

    if not purchase_order:
        raise HTTPException(
            status_code=404,
            detail="Purchase order not found"
        )

    return purchase_order


@app.put("/purchase-orders/{purchase_order_id}")
def update_purchase_order(
    purchase_order_id: int,
    purchase_order_data: PurchaseOrderUpdate,
    db: Session = Depends(get_db)
):

    purchase_order = crud.update_purchase_order(
        db,
        purchase_order_id,
        purchase_order_data
    )

    if not purchase_order:
        raise HTTPException(
            status_code=404,
            detail="Purchase order could not be updated"
        )

    return purchase_order


@app.delete("/purchase-orders/{purchase_order_id}")
def delete_purchase_order(
    purchase_order_id: int,
    db: Session = Depends(get_db)
):

    purchase_order = crud.delete_purchase_order(
        db,
        purchase_order_id
    )

    if not purchase_order:
        raise HTTPException(
            status_code=404,
            detail="Purchase order not found"
        )

    return purchase_order