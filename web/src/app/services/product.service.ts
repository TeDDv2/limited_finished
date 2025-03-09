import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductData } from '../models/product-data';
import { Product } from '../models/product';
import { Size } from '../models/size';
import { environment } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private socket: Socket;
  private productDataSubject = new BehaviorSubject<ProductData>({ products: [], sizes: [] });
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  private productPidsSet = new Set<string>();

  public productData$ = this.productDataSubject.asObservable();
  public isConnected$ = this.isConnectedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket = io(environment.apiUrl);
    this.setupSocketListeners();
  }

  /**
   * Setup socket.io event listeners
   */
  private setupSocketListeners(): void {
    this.socket.on('connect', () => {
      this.isConnectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      this.isConnectedSubject.next(false);
    });

    this.socket.on('connected', (message: string) => {
      console.log(message);
    });

    this.socket.on('update', (data: ProductData) => {
      if (data && data.products && data.sizes) {
        this.updateProductData(data);
      } else {
        console.error('Update data is missing products or sizes');
      }
    });
  }

  /**
   * Fetch initial product data from API
   */
  fetchData(): void {
    this.http.get<ProductData>(`${environment.apiUrl}/api/products`)
      .subscribe({
        next: (data) => {
          if (data && data.products && data.sizes) {
            this.updateProductData(data);
          } else {
            console.error('Data missing in the response');
          }
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.isConnectedSubject.next(false);
        }
      });
  }

  /**
   * Get sizes for a specific product
   */
  getSizesForProduct(product: Product): Size[] {
    const currentData = this.productDataSubject.getValue();
    return currentData.sizes.filter(size => size.pid === product.pid);
  }

  /**
   * Check if a product is new (not in the existing PIDs set)
   */
  isNewProduct(pid: string): boolean {
    return !this.productPidsSet.has(pid);
  }

  /**
   * Get the total stock across all products
   */
  getTotalStock(): number {
    const currentData = this.productDataSubject.getValue();
    let total = 0;

    for (const product of currentData.products) {
      for (const size of this.getSizesForProduct(product)) {
        total += size.stock;
      }
    }

    return total;
  }

  /**
   * Get the count of new products
   */
  getNewProductsCount(): number {
    const currentData = this.productDataSubject.getValue();
    return currentData.products.filter(product => this.isNewProduct(product.pid)).length;
  }

  /**
   * Get max stock for a product across all sizes
   */
  getMaxStock(product: Product): number {
    const sizes = this.getSizesForProduct(product);
    if (sizes.length === 0) return 0;

    let max = 0;
    for (const size of sizes) {
      if (size.stock > max) max = size.stock;
    }

    return max;
  }

  /**
   * Get all unique size names from all products
   */
  getAllSizeNames(): string[] {
    const currentData = this.productDataSubject.getValue();
    const sizeNamesSet = new Set<string>();

    currentData.sizes.forEach(size => {
      sizeNamesSet.add(size.name);
    });

    return Array.from(sizeNamesSet).sort((a, b) => {
      return parseFloat(a) - parseFloat(b);
    });
  }

  /**
   * Update product data and track existing PIDs
   */
  private updateProductData(data: ProductData): void {
    const currentPids = new Set<string>();

    data.products.forEach((product: Product) => {
      currentPids.add(product.pid);
    });

    this.productDataSubject.next(data);
    this.productPidsSet = currentPids;
  }

  /**
   * Clean up method to be called when service is no longer needed
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getAvailableSizes(): string[] {
    const currentData = this.productDataSubject.getValue();
    const sizeNamesSet = new Set<string>();

    currentData.sizes.forEach(size => {
      if (size.stock > 0) {
        sizeNamesSet.add(size.name);
      }
    });

    return Array.from(sizeNamesSet).sort((a, b) => {
      return parseFloat(a) - parseFloat(b);
    });
  }
}