from pydantic import BaseModel, Field
from typing import Literal


class CustomerCreate(BaseModel):
    company_name: str
    country: str
    contact_person: str
    email: str
    phone: str


class CustomerUpdate(BaseModel):
    company_name: str
    country: str
    contact_person: str
    email: str
    phone: str


class ProductCreate(BaseModel):
    name: str
    sku: str
    brand: str
    category: str
    price: int = Field(gt=0)
    stock: int = Field(ge=0)


class ProductUpdate(BaseModel):
    name: str
    sku: str
    brand: str
    category: str
    price: int = Field(gt=0)
    stock: int = Field(ge=0)


class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int = Field(gt=0)
    status: Literal[
        "Pending",
        "Approved",
        "Preparing",
        "Shipped",
        "Completed",
        "Cancelled"
    ]


class OrderUpdate(BaseModel):
    quantity: int = Field(gt=0)
    status: Literal[
        "Pending",
        "Approved",
        "Preparing",
        "Shipped",
        "Completed",
        "Cancelled"
    ]


class StockMovementCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    movement_type: Literal["IN", "OUT"]


class StockMovementUpdate(BaseModel):
    quantity: int = Field(gt=0)
    movement_type: Literal["IN", "OUT"]


class SupplierCreate(BaseModel):
    company_name: str
    country: str
    contact_person: str
    email: str
    phone: str


class SupplierUpdate(BaseModel):
    company_name: str
    country: str
    contact_person: str
    email: str
    phone: str


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    product_id: int
    quantity: int = Field(gt=0)
    status: Literal[
        "Pending",
        "Ordered",
        "Received",
        "Cancelled"
    ]


class PurchaseOrderUpdate(BaseModel):
    quantity: int = Field(gt=0)
    status: Literal[
        "Pending",
        "Ordered",
        "Received",
        "Cancelled"
    ]