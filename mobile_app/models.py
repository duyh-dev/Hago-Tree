from dataclasses import dataclass
from typing import Optional


@dataclass
class Product:
    id: str
    name: str
    price: float
    currency: str = "VND"
    thumbnail_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    description: str = ""
    care_notes: str = ""
    stock: int = 0


@dataclass
class CartItem:
    product_id: str
    quantity: int


@dataclass
class Profile:
    id: str
    email: str
    name: str
    token: Optional[str] = None
    avatar_url: Optional[str] = None
