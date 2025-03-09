import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Size } from '../../../models/size';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductsTableComponent {
  @Input() products: Product[] = [];
  @Output() viewDetails = new EventEmitter<Product>();
  
  Math = Math;

  constructor(private productService: ProductService) {}

  getSizesForProduct(product: Product): Size[] {
    return this.productService.getSizesForProduct(product);
  }

  onDetailClick(product: Product): void {
    this.viewDetails.emit(product);
  }
}
