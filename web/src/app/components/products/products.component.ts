import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProductData } from '../../models/product-data';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

// Import child components
import { ProductsHeaderComponent } from './header/header.component';
import { ProductsFiltersComponent, FilterCriteria } from './filters/filters.component';
import { ProductsStatsComponent } from './stats/stats.component';
import { ProductCardComponent } from './card/card.component';
import { ProductsTableComponent } from './table/table.component';
import { ProductDetailModalComponent } from './detail-modal/detail-modal.component';
import { PaginationComponent } from './pagination/pagination.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductsHeaderComponent,
    ProductsFiltersComponent,
    ProductsStatsComponent,
    ProductCardComponent,
    ProductsTableComponent,
    ProductDetailModalComponent,
    PaginationComponent,
    EmptyStateComponent
  ]
})
export class ProductsComponent implements OnInit, OnDestroy {
  productData: ProductData = { products: [], sizes: [] };
  isConnected = false;
  isTableView = false;
  Math = Math;
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;

  searchText = '';
  selectedSize = '';

  selectedProduct: Product | null = null;
  showDetailModal = false;

  filteredProducts: Product[] = [];

  private subscriptions = new Subscription();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.productService.productData$.subscribe(data => {
        this.productData = data;
        this.applyFilters();
      })
    );

    this.subscriptions.add(
      this.productService.isConnected$.subscribe(connected => {
        this.isConnected = connected;
      })
    );

    this.productService.fetchData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onFiltersChanged(filters: any): void {
    this.searchText = filters.searchText;
    this.selectedSize = filters.selectedSize;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.productData.products.filter(product => {
      const searchMatch = !this.searchText ||
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.sku.toLowerCase().includes(this.searchText.toLowerCase());

      let sizeMatch = true;
      if (this.selectedSize) {
        sizeMatch = this.productService.getSizesForProduct(product).some(size =>
          size.name === this.selectedSize && size.stock > 0
        );
      }

      return searchMatch && sizeMatch;
    });

    this.currentPage = 1;
    this.calculateTotalPages();
  }

  showProductDetail(product: Product): void {
    this.selectedProduct = product;
    this.showDetailModal = true;
  }

  closeProductDetail(): void {
    this.showDetailModal = false;
    this.selectedProduct = null;
  }

  refreshData(): void {
    this.productService.fetchData();
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredProducts.length);
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.scrollToTop();
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPage = items;
    this.calculateTotalPages();
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    } else if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  onToggleView(isTable: boolean): void {
    this.isTableView = isTable;

    if (this.isTableView) {
      this.itemsPerPage = 18;
    } else {
      this.itemsPerPage = 9;
    }

    this.calculateTotalPages();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}