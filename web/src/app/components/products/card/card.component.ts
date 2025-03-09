import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Size } from '../../../models/size';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() viewDetails = new EventEmitter<Product>();

  constructor(private productService: ProductService) {}

  getSizesForProduct(): Size[] {
    return this.productService.getSizesForProduct(this.product);
  }

  getVisibleSizes(): Size[] {
    const sizes = this.getSizesForProduct();
    return sizes.slice(0, 6);
  }

  getMaxStock(): number {
    return this.productService.getMaxStock(this.product);
  }

  onDetailClick(): void {
    this.viewDetails.emit(this.product);
  }
}