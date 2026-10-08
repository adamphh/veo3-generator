from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ProductData(BaseModel):
    title: str
    price_original: Optional[str] = None
    price_sale: Optional[str] = None
    discount_percentage: Optional[str] = None
    sold_count: Optional[str] = None
    rating_star: Optional[str] = "5.0"
    rating_count: Optional[str] = None
    description: str = ""
    usp_list: List[str] = []
    image_urls: List[str] = []
    freeship_tag: bool = True
    flash_sale_tag: bool = False
    platform: str = "shopee"

class BaseProvider(ABC):
    @abstractmethod
    async def extract_product_data(self, url: str) -> ProductData:
        pass
