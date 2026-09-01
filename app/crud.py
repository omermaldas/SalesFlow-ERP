from .models import (
    Customer,
    Order,
    Product,
    StockMovement,
    Supplier,
    PurchaseOrder
)

from .schemas import (
    CustomerCreate,
    CustomerUpdate,
    ProductCreate,
    ProductUpdate,
    OrderCreate,
    OrderUpdate,
    StockMovementCreate,
    StockMovementUpdate,
    SupplierCreate,
    SupplierUpdate,
    PurchaseOrderCreate,
    PurchaseOrderUpdate
)

from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException


def create_customer(db: Session, customer: CustomerCreate):

    db_customer = Customer(
        company_name=customer.company_name,
        country=customer.country,
        contact_person=customer.contact_person,
        email=customer.email,
        phone=customer.phone
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


def get_customers(db: Session):
    return db.query(Customer).all()


def get_customer_by_id(db: Session, customer_id: int):
    return db.query(Customer).filter(
        Customer.id == customer_id
    ).first()


def update_customer(
    db: Session,
    customer_id: int,
    customer_data: CustomerUpdate
):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return None

    customer.company_name = customer_data.company_name
    customer.country = customer_data.country
    customer.contact_person = customer_data.contact_person
    customer.email = customer_data.email
    customer.phone = customer_data.phone

    db.commit()
    db.refresh(customer)

    return customer


def delete_customer(db: Session, customer_id: int):

    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        return None

    db.delete(customer)
    db.commit()

    return customer


def create_product(db: Session, product: ProductCreate):

    db_product = Product(
        name=product.name,
        sku=product.sku,
        brand=product.brand,
        category=product.category,
        price=product.price,
        stock=product.stock
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


def get_products(db: Session):
    return db.query(Product).all()


def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(
        Product.id == product_id
    ).first()


def update_product(
    db: Session,
    product_id: int,
    product_data: ProductUpdate
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    product.name = product_data.name
    product.sku = product_data.sku
    product.brand = product_data.brand
    product.category = product_data.category
    product.price = product_data.price
    product.stock = product_data.stock

    db.commit()
    db.refresh(product)

    return product


def delete_product(db: Session, product_id: int):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    db.delete(product)
    db.commit()

    return product


def create_order(db: Session, order: OrderCreate):

    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    product = db.query(Product).filter(
        Product.id == order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if order.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    if product.stock < order.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    product.stock -= order.quantity

    db_order = Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        status=order.status,
        order_date=datetime.now()
    )

    stock_movement = StockMovement(
        product_id=product.id,
        quantity=order.quantity,
        movement_type="OUT",
        movement_date=datetime.now()
    )

    db.add(db_order)
    db.add(stock_movement)

    db.commit()
    db.refresh(db_order)

    return db_order


def get_orders(db: Session):
    return db.query(Order).all()


def get_order_by_id(db: Session, order_id: int):
    return db.query(Order).filter(
        Order.id == order_id
    ).first()


def update_order(
    db: Session,
    order_id: int,
    order_data: OrderUpdate
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return None

    if order_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    product = db.query(Product).filter(
        Product.id == order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    stock_movement = db.query(StockMovement).filter(
        StockMovement.product_id == order.product_id,
        StockMovement.movement_type == "OUT",
        StockMovement.quantity == order.quantity
    ).first()

    quantity_difference = order_data.quantity - order.quantity

    if quantity_difference > 0:

        if product.stock < quantity_difference:
            raise HTTPException(
                status_code=400,
                detail="Insufficient stock"
            )

        product.stock -= quantity_difference

    elif quantity_difference < 0:

        product.stock += abs(quantity_difference)

    if stock_movement:
        stock_movement.quantity = order_data.quantity
        stock_movement.movement_date = datetime.now()

    order.quantity = order_data.quantity
    order.status = order_data.status

    db.commit()
    db.refresh(order)

    return order


def delete_order(db: Session, order_id: int):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return None

    product = db.query(Product).filter(
        Product.id == order.product_id
    ).first()

    stock_movement = db.query(StockMovement).filter(
        StockMovement.product_id == order.product_id,
        StockMovement.movement_type == "OUT",
        StockMovement.quantity == order.quantity
    ).first()

    if product:
        product.stock += order.quantity

    if stock_movement:
        db.delete(stock_movement)

    db.delete(order)

    db.commit()

    return order


def create_stock_movement(
    db: Session,
    movement: StockMovementCreate
):

    product = db.query(Product).filter(
        Product.id == movement.product_id
    ).first()

    if not product:
        return None

    if movement.quantity <= 0:
        return None

    if movement.movement_type == "IN":

        product.stock += movement.quantity

    elif movement.movement_type == "OUT":

        if product.stock < movement.quantity:
            return None

        product.stock -= movement.quantity

    else:
        return None

    db_movement = StockMovement(
        product_id=movement.product_id,
        quantity=movement.quantity,
        movement_type=movement.movement_type,
        movement_date=datetime.now()
    )

    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)

    return db_movement


def get_stock_movements(db: Session):
    return db.query(StockMovement).all()


def get_stock_movement_by_id(
    db: Session,
    movement_id: int
):

    return db.query(StockMovement).filter(
        StockMovement.id == movement_id
    ).first()


def get_stock_movements_by_product(
    db: Session,
    product_id: int
):

    return db.query(StockMovement).filter(
        StockMovement.product_id == product_id
    ).all()


def update_stock_movement(
    db: Session,
    movement_id: int,
    movement_data: StockMovementUpdate
):

    movement = db.query(StockMovement).filter(
        StockMovement.id == movement_id
    ).first()

    if not movement:
        return None

    product = db.query(Product).filter(
        Product.id == movement.product_id
    ).first()

    if not product:
        return None

    if movement_data.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    if movement_data.movement_type not in ["IN", "OUT"]:
        raise HTTPException(
            status_code=400,
            detail="Movement type must be IN or OUT"
        )

    new_stock = product.stock

    if movement.movement_type == "IN":
        new_stock -= movement.quantity

    elif movement.movement_type == "OUT":
        new_stock += movement.quantity

    if movement_data.movement_type == "IN":

        new_stock += movement_data.quantity

    elif movement_data.movement_type == "OUT":

        if new_stock < movement_data.quantity:
            raise HTTPException(
                status_code=400,
                detail="Insufficient stock"
            )

        new_stock -= movement_data.quantity

    product.stock = new_stock

    movement.quantity = movement_data.quantity
    movement.movement_type = movement_data.movement_type
    movement.movement_date = datetime.now()

    db.commit()
    db.refresh(movement)

    return movement


def delete_stock_movement(
    db: Session,
    movement_id: int
):

    movement = db.query(StockMovement).filter(
        StockMovement.id == movement_id
    ).first()

    if not movement:
        return None

    product = db.query(Product).filter(
        Product.id == movement.product_id
    ).first()

    if not product:
        return None

    if movement.movement_type == "IN":

        if product.stock < movement.quantity:
            raise HTTPException(
                status_code=400,
                detail="Stock cannot be lower than movement quantity"
            )

        product.stock -= movement.quantity

    elif movement.movement_type == "OUT":

        product.stock += movement.quantity

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid movement type"
        )

    db.delete(movement)
    db.commit()

    return movement


def create_supplier(
    db: Session,
    supplier: SupplierCreate
):

    db_supplier = Supplier(
        company_name=supplier.company_name,
        country=supplier.country,
        contact_person=supplier.contact_person,
        email=supplier.email,
        phone=supplier.phone
    )

    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)

    return db_supplier


def get_suppliers(db: Session):
    return db.query(Supplier).all()


def get_supplier_by_id(
    db: Session,
    supplier_id: int
):

    return db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()


def update_supplier(
    db: Session,
    supplier_id: int,
    supplier_data: SupplierUpdate
):

    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:
        return None

    supplier.company_name = supplier_data.company_name
    supplier.country = supplier_data.country
    supplier.contact_person = supplier_data.contact_person
    supplier.email = supplier_data.email
    supplier.phone = supplier_data.phone

    db.commit()
    db.refresh(supplier)

    return supplier


def delete_supplier(
    db: Session,
    supplier_id: int
):

    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id
    ).first()

    if not supplier:
        return None

    db.delete(supplier)
    db.commit()

    return supplier


def create_purchase_order(
    db: Session,
    purchase_order: PurchaseOrderCreate
):

    supplier = db.query(Supplier).filter(
        Supplier.id == purchase_order.supplier_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    product = db.query(Product).filter(
        Product.id == purchase_order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if purchase_order.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than 0"
        )

    if purchase_order.status not in [
        "Pending",
        "Ordered",
        "Received",
        "Cancelled"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid purchase order status"
        )

    db_purchase_order = PurchaseOrder(
        supplier_id=purchase_order.supplier_id,
        product_id=purchase_order.product_id,
        quantity=purchase_order.quantity,
        status=purchase_order.status,
        order_date=datetime.now()
    )

    db.add(db_purchase_order)

    if purchase_order.status == "Received":

        product.stock += purchase_order.quantity

        stock_movement = StockMovement(
            product_id=product.id,
            quantity=purchase_order.quantity,
            movement_type="IN",
            movement_date=datetime.now()
        )

        db.add(stock_movement)

    db.commit()
    db.refresh(db_purchase_order)

    return db_purchase_order


def get_purchase_orders(db: Session):
    return db.query(PurchaseOrder).all()


def get_purchase_orders_by_supplier(
    db: Session,
    supplier_id: int
):

    return db.query(PurchaseOrder).filter(
        PurchaseOrder.supplier_id == supplier_id
    ).all()


def get_purchase_order_by_id(
    db: Session,
    purchase_order_id: int
):

    return db.query(PurchaseOrder).filter(
        PurchaseOrder.id == purchase_order_id
    ).first()


def update_purchase_order(
    db: Session,
    purchase_order_id: int,
    purchase_order_data: PurchaseOrderUpdate
):

    purchase_order = db.query(PurchaseOrder).filter(
        PurchaseOrder.id == purchase_order_id
    ).first()

    if not purchase_order:
        return None

    supplier = db.query(Supplier).filter(
        Supplier.id == purchase_order.supplier_id
    ).first()

    product = db.query(Product).filter(
        Product.id == purchase_order.product_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    old_status = purchase_order.status
    new_status = purchase_order_data.status

    if old_status != "Received" and new_status == "Received":

        product.stock += purchase_order_data.quantity

        stock_movement = StockMovement(
            product_id=product.id,
            quantity=purchase_order_data.quantity,
            movement_type="IN",
            movement_date=datetime.now()
        )

        db.add(stock_movement)

    elif old_status == "Received" and new_status != "Received":

        stock_movement = db.query(StockMovement).filter(
            StockMovement.product_id == product.id,
            StockMovement.movement_type == "IN",
            StockMovement.quantity == purchase_order.quantity
        ).first()

        product.stock -= purchase_order.quantity

        if stock_movement:
            db.delete(stock_movement)

    elif old_status == "Received" and new_status == "Received":

        quantity_difference = (
            purchase_order_data.quantity
            - purchase_order.quantity
        )

        if quantity_difference > 0:

            product.stock += quantity_difference

        elif quantity_difference < 0:

            if product.stock < abs(quantity_difference):
                raise HTTPException(
                    status_code=400,
                    detail="Stock cannot be lower than purchase order quantity"
                )

            product.stock -= abs(quantity_difference)

        stock_movement = db.query(StockMovement).filter(
            StockMovement.product_id == product.id,
            StockMovement.movement_type == "IN",
            StockMovement.quantity == purchase_order.quantity
        ).first()

        if stock_movement:
            stock_movement.quantity = purchase_order_data.quantity
            stock_movement.movement_date = datetime.now()

    purchase_order.quantity = purchase_order_data.quantity
    purchase_order.status = purchase_order_data.status

    db.commit()
    db.refresh(purchase_order)

    return purchase_order


def delete_purchase_order(
    db: Session,
    purchase_order_id: int
):

    purchase_order = db.query(PurchaseOrder).filter(
        PurchaseOrder.id == purchase_order_id
    ).first()

    if not purchase_order:
        return None

    product = db.query(Product).filter(
        Product.id == purchase_order.product_id
    ).first()

    if purchase_order.status == "Received" and product:

        product.stock -= purchase_order.quantity

        stock_movement = db.query(StockMovement).filter(
            StockMovement.product_id == product.id,
            StockMovement.movement_type == "IN",
            StockMovement.quantity == purchase_order.quantity
        ).first()

        if stock_movement:
            db.delete(stock_movement)

    db.delete(purchase_order)

    db.commit()

    return purchase_order