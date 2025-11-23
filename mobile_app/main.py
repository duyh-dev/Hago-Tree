from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Optional

from kivy.app import App
from kivy.clock import Clock
from kivy.lang import Builder
from kivy.properties import BooleanProperty, DictProperty, ListProperty, ObjectProperty, StringProperty
from kivy.uix.behaviors import ButtonBehavior
from kivy.uix.image import AsyncImage
from kivy.uix.screenmanager import Screen

from database import Database
from api import ApiClient
from westie_adapter import ensure_login, using_westie

KV_FILE = Path(__file__).with_name("app.kv")


class HeroCard(ButtonBehavior, AsyncImage):
    """Tappable hero image used on the home screen."""

    product_id = StringProperty("")


class ProductListScreen(Screen):
    search_query = StringProperty("")
    sort_desc = BooleanProperty(False)
    in_stock_only = BooleanProperty(False)
    products = ListProperty([])
    db: Database = ObjectProperty(None)  # type: ignore

    def on_pre_enter(self):
        self.refresh_products()

    def refresh_products(self) -> None:
        sort_by = "price" if self.ids.sort_spinner.text == "Giá" else "name"
        results = self.db.get_products(
            search=self.search_query,
            sort_by=sort_by,
            descending=self.sort_desc,
            in_stock_only=self.in_stock_only,
        )
        self.products = [dict(row) for row in results]

    def on_search_text(self, text: str) -> None:
        self.search_query = text
        self.refresh_products()

    def on_toggle_stock(self, value: bool) -> None:
        self.in_stock_only = value
        self.refresh_products()

    def on_sort_toggle(self) -> None:
        self.sort_desc = not self.sort_desc
        self.refresh_products()


class ProductDetailScreen(Screen):
    product: Dict = DictProperty({})
    db: Database = ObjectProperty(None)  # type: ignore

    def on_pre_enter(self):
        product_id = self.product.get("id")
        if product_id:
            row = self.db.get_product(product_id)
            if row:
                self.product = dict(row)

    def add_to_cart(self, quantity: int = 1) -> None:
        pid = self.product.get("id")
        if pid:
            self.db.set_cart_quantity(pid, quantity)
            self.ids.feedback.text = "Đã thêm vào giỏ"


class CartScreen(Screen):
    items = ListProperty([])
    db: Database = ObjectProperty(None)  # type: ignore

    def on_pre_enter(self):
        self.refresh_cart()

    def refresh_cart(self) -> None:
        self.items = [
            {
                **dict(prod),
                "quantity": qty,
            }
            for prod, qty in self.db.get_cart()
        ]

    def change_qty(self, product_id: str, delta: int) -> None:
        for item in self.items:
            if item["id"] == product_id:
                new_qty = max(0, item["quantity"] + delta)
                self.db.set_cart_quantity(product_id, new_qty)
                break
        self.refresh_cart()


class ProfileScreen(Screen):
    profile = DictProperty({})
    db: Database = ObjectProperty(None)  # type: ignore
    api: ApiClient = ObjectProperty(None)  # type: ignore

    def on_pre_enter(self):
        saved = self.db.load_profile()
        if saved:
            self.profile = dict(saved)

    def logout(self):
        self.db.clear_profile()
        self.profile = {}


class LoginScreen(Screen):
    db: Database = ObjectProperty(None)  # type: ignore
    api: ApiClient = ObjectProperty(None)  # type: ignore
    error = StringProperty("")

    def attempt_login(self):
        email = self.ids.email.text
        password = self.ids.password.text

        payload = ensure_login(email, password, self.api.login)
        if payload and payload.get("token"):
            self.db.save_profile(
                {
                    "id": payload.get("user", {}).get("id", email),
                    "email": email,
                    "name": payload.get("user", {}).get("name", ""),
                    "token": payload["token"],
                    "avatar_url": payload.get("user", {}).get("avatar"),
                    "updated_at": payload.get("user", {}).get("updated_at"),
                }
            )
            self.manager.current = "profile"
        else:
            self.error = "Sai thông tin đăng nhập"


class HomeScreen(Screen):
    featured = ListProperty([])
    db: Database = ObjectProperty(None)  # type: ignore

    def on_pre_enter(self):
        rows = self.db.get_products(sort_by="updated_at", descending=True)[:6]
        self.featured = [dict(row) for row in rows]

    def go_to_product(self, product_id: str) -> None:
        screen: ProductDetailScreen = self.manager.get_screen("detail")  # type: ignore
        screen.product = {"id": product_id}
        self.manager.current = "detail"


class HagoTreeApp(App):
    db: Database
    api: ApiClient

    def build(self):
        Builder.load_file(str(KV_FILE))
        self.db = Database()
        self.api = ApiClient()
        root = Builder.load_string("""
ScreenManager:
    HomeScreen:
    ProductListScreen:
    ProductDetailScreen:
    CartScreen:
    ProfileScreen:
    LoginScreen:
        """)
        for screen in root.screens:
            screen.db = self.db  # type: ignore
            if isinstance(screen, (ProfileScreen, LoginScreen)):
                screen.api = self.api  # type: ignore
        Clock.schedule_once(lambda *_: self.bootstrap())
        return root

    def bootstrap(self) -> None:
        # Initial hydration from API if possible
        try:
            products = self.api.fetch_products()
            self.db.upsert_products(products)
            self._refresh_all_lists()
        except Exception:
            # Offline-first: fallback to cache
            pass

    def _refresh_all_lists(self) -> None:
        for screen in self.root.screens:  # type: ignore
            if isinstance(screen, (HomeScreen, ProductListScreen, CartScreen)):
                screen.on_pre_enter()

    def on_pause(self):
        return True

    def on_resume(self):
        self.bootstrap()


if __name__ == "__main__":
    HagoTreeApp().run()
