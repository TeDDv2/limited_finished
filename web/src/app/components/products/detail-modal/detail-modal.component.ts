import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { Size } from '../../../models/size';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailModalComponent {
  @Input() product: Product | null = null;
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private productService: ProductService) {}

  getSizesForProduct(): Size[] {
    if (!this.product) return [];
    return this.productService.getSizesForProduct(this.product);
  }

  getMaxStock(): number {
    if (!this.product) return 0;
    return this.productService.getMaxStock(this.product);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}