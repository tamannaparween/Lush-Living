import type { CartItem } from "@/features/cart/types/cart.types";
import { initialProducts } from "../data/products.data";
import type { Product } from "../types/product.types";
import { getStorageItem, setStorageItem } from "@/lib/storage/local-storage";

const STORAGE_KEY = "lush-living-products";

export function getProducts(): Product[] {
  return getStorageItem<Product[]>(STORAGE_KEY, initialProducts);
}

export function saveProducts(products: Product[]): void {
  setStorageItem(STORAGE_KEY, products);
}

export function getActiveProducts(): Product[] {
  return getProducts().filter((product) => product.status === "active");
}

export function getFeaturedProducts(): Product[] {
  return getActiveProducts().filter((product) => product.featured);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

export function addProduct(product: Product): void {
  const products = getProducts();
  saveProducts([...products, product]);
}

export function updateProduct(updatedProduct: Product): void {
  const products = getProducts();

  const updatedProducts = products.map((product) =>
    product.id === updatedProduct.id ? updatedProduct : product,
  );

  saveProducts(updatedProducts);
}

export function deleteProduct(id: string): void {
  const products = getProducts();
  saveProducts(products.filter((product) => product.id !== id));
}

// Cart-related functions
export function getCartProducts(): Product[] {
  return getStorageItem<CartItem[]>("lush-living-cart", []).map((cartItem) => {
    const product = getProductById(cartItem.productId);
    if (!product) {
      throw new Error(`Product not found for ID: ${cartItem.productId}`);
    }
    return product;
  });
}
