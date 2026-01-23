from __future__ import annotations

import os
import time
from typing import Dict, List, Optional

import requests

API_BASE_URL = os.getenv("HAGO_API_BASE", "https://api.hagotree.example.com")
TIMEOUT = 10


class ApiClient:
    """HTTP client used to sync with the Hago Tree backend."""

    def __init__(self, base_url: str = API_BASE_URL, token: Optional[str] = None) -> None:
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"

    def _url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def fetch_products(self) -> List[Dict]:
        res = self.session.get(self._url("products"), timeout=TIMEOUT)
        res.raise_for_status()
        return res.json()

    def fetch_product(self, product_id: str) -> Dict:
        res = self.session.get(self._url(f"products/{product_id}"), timeout=TIMEOUT)
        res.raise_for_status()
        return res.json()

    def login(self, email: str, password: str) -> Dict:
        res = self.session.post(
            self._url("auth/login"),
            json={"email": email, "password": password},
            timeout=TIMEOUT,
        )
        res.raise_for_status()
        payload = res.json()
        token = payload.get("token")
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"
        return payload

    def sync_cart(self, cart: List[Dict[str, int]]) -> Dict:
        res = self.session.post(self._url("cart/sync"), json={"items": cart}, timeout=TIMEOUT)
        res.raise_for_status()
        return res.json()

    def fetch_orders(self) -> List[Dict]:
        res = self.session.get(self._url("orders"), timeout=TIMEOUT)
        res.raise_for_status()
        return res.json()

    def refresh_inventory(self, product_ids: List[str]) -> Dict[str, int]:
        res = self.session.post(
            self._url("products/availability"),
            json={"ids": product_ids},
            timeout=TIMEOUT,
        )
        res.raise_for_status()
        return res.json()

    def ping(self) -> float:
        start = time.time()
        res = self.session.get(self._url("health"), timeout=TIMEOUT)
        res.raise_for_status()
        return time.time() - start
