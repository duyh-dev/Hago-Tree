import sqlite3
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

DB_NAME = "hago_tree.db"


class Database:
    """Lightweight SQLite helper for local-first storage.

    The schema caches server data (products, user profile, cart) and keeps
    enough metadata for optimistic syncing.
    """

    def __init__(self, path: Optional[Path] = None) -> None:
        self.path = (path or Path(DB_NAME)).expanduser()
        self.conn = sqlite3.connect(self.path)
        self.conn.row_factory = sqlite3.Row
        self._ensure_schema()

    def _ensure_schema(self) -> None:
        cur = self.conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                currency TEXT DEFAULT 'VND',
                thumbnail_url TEXT,
                hero_image_url TEXT,
                description TEXT,
                care_notes TEXT,
                stock INTEGER DEFAULT 0,
                updated_at TEXT
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS cart (
                product_id TEXT PRIMARY KEY,
                quantity INTEGER NOT NULL,
                synced INTEGER DEFAULT 0,
                FOREIGN KEY(product_id) REFERENCES products(id)
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS profile (
                id TEXT PRIMARY KEY,
                email TEXT,
                name TEXT,
                token TEXT,
                avatar_url TEXT,
                updated_at TEXT
            )
            """
        )
        self.conn.commit()

    # Product helpers
    def upsert_products(self, products: Iterable[Dict[str, Any]]) -> None:
        cur = self.conn.cursor()
        cur.executemany(
            """
            INSERT INTO products (
                id, name, price, currency, thumbnail_url, hero_image_url,
                description, care_notes, stock, updated_at
            ) VALUES (
                :id, :name, :price, :currency, :thumbnail_url, :hero_image_url,
                :description, :care_notes, :stock, :updated_at
            )
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                price=excluded.price,
                currency=excluded.currency,
                thumbnail_url=excluded.thumbnail_url,
                hero_image_url=excluded.hero_image_url,
                description=excluded.description,
                care_notes=excluded.care_notes,
                stock=excluded.stock,
                updated_at=excluded.updated_at
            """,
            list(products),
        )
        self.conn.commit()

    def get_products(
        self,
        search: str = "",
        sort_by: str = "name",
        descending: bool = False,
        in_stock_only: bool = False,
    ) -> List[sqlite3.Row]:
        clauses: List[str] = []
        params: List[Any] = []
        if search:
            clauses.append("name LIKE ?")
            params.append(f"%{search}%")
        if in_stock_only:
            clauses.append("stock > 0")
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        direction = "DESC" if descending else "ASC"
        query = f"SELECT * FROM products {where} ORDER BY {sort_by} {direction}"
        cur = self.conn.cursor()
        cur.execute(query, params)
        return list(cur.fetchall())

    def get_product(self, product_id: str) -> Optional[sqlite3.Row]:
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        return cur.fetchone()

    # Cart helpers
    def set_cart_quantity(self, product_id: str, quantity: int) -> None:
        cur = self.conn.cursor()
        if quantity <= 0:
            cur.execute("DELETE FROM cart WHERE product_id = ?", (product_id,))
        else:
            cur.execute(
                """
                INSERT INTO cart (product_id, quantity, synced)
                VALUES (?, ?, 0)
                ON CONFLICT(product_id) DO UPDATE SET quantity = excluded.quantity, synced = 0
                """,
                (product_id, quantity),
            )
        self.conn.commit()

    def get_cart(self) -> List[Tuple[sqlite3.Row, int]]:
        cur = self.conn.cursor()
        cur.execute(
            """
            SELECT p.*, c.quantity FROM cart c
            JOIN products p ON p.id = c.product_id
            ORDER BY p.name ASC
            """
        )
        rows = cur.fetchall()
        return [(row, row["quantity"]) for row in rows]

    def mark_cart_synced(self, product_ids: Iterable[str]) -> None:
        cur = self.conn.cursor()
        cur.executemany(
            "UPDATE cart SET synced = 1 WHERE product_id = ?",
            [(pid,) for pid in product_ids],
        )
        self.conn.commit()

    # Profile helpers
    def save_profile(self, profile: Dict[str, Any]) -> None:
        cur = self.conn.cursor()
        cur.execute(
            """
            INSERT INTO profile (id, email, name, token, avatar_url, updated_at)
            VALUES (:id, :email, :name, :token, :avatar_url, :updated_at)
            ON CONFLICT(id) DO UPDATE SET
                email=excluded.email,
                name=excluded.name,
                token=excluded.token,
                avatar_url=excluded.avatar_url,
                updated_at=excluded.updated_at
            """,
            profile,
        )
        self.conn.commit()

    def load_profile(self) -> Optional[sqlite3.Row]:
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM profile LIMIT 1")
        return cur.fetchone()

    def clear_profile(self) -> None:
        cur = self.conn.cursor()
        cur.execute("DELETE FROM profile")
        self.conn.commit()

    def close(self) -> None:
        self.conn.close()
