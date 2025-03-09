import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductsStatsComponent {
  @Input() products: Product[] = [];

  constructor(private productService: ProductService) {}

  getTotalStock(): number {
    return this.productService.getTotalStock();
  }
}