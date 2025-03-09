// filter.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from './product.service';

export interface FilterState {
  searchText: string;
  selectedSize: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private initialState: FilterState = {
    searchText: '',
    selectedSize: ''
  };

  private filterStateSubject = new BehaviorSubject<FilterState>(this.initialState);
  filterState$: Observable<FilterState> = this.filterStateSubject.asObservable();

  constructor(private productService: ProductService) {}

  updateFilters(filters: Partial<FilterState>): void {
    const currentState = this.filterStateSubject.value;
    this.filterStateSubject.next({ ...currentState, ...filters });
  }

  resetFilters(): void {
    this.filterStateSubject.next(this.initialState);
  }

  getFilteredProducts(products: Product[]): Product[] {
    const { searchText, selectedSize } = this.filterStateSubject.value;

    return products.filter(product => {
      const searchMatch = !searchText ||
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchText.toLowerCase());

      let sizeMatch = true;
      if (selectedSize) {
        sizeMatch = this.productService.getSizesForProduct(product).some(size =>
          size.name === selectedSize && size.stock > 0
        );
      }

      return searchMatch && sizeMatch;
    });
  }
}