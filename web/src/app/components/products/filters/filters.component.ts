import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

export interface FilterCriteria {
  searchText: string;
  selectedSize: string;
}

@Component({
  selector: 'app-product-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductsFiltersComponent implements OnInit {
  @Input() searchText = '';
  @Input() selectedSize = '';
  @Output() filtersChanged = new EventEmitter<FilterCriteria>();

  availableSizes: string[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAvailableSizes();
  }

  loadAvailableSizes(): void {
    this.availableSizes = this.productService.getAvailableSizes();
  }

  onSearchChange(): void {
    this.emitFilterChanges();
  }

  onSizeChange(): void {
    this.emitFilterChanges();
  }

  private emitFilterChanges(): void {
    this.filtersChanged.emit({
      searchText: this.searchText,
      selectedSize: this.selectedSize
    });
  }
}