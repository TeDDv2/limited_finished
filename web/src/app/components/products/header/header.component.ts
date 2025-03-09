import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductsHeaderComponent {
  @Input() isConnected = false;
  @Input() isTableView = false;
  @Output() viewToggle = new EventEmitter<boolean>();
  @Output() refresh = new EventEmitter<void>();

  toggleView(): void {
    this.viewToggle.emit(!this.isTableView);
  }

  refreshData(): void {
    this.refresh.emit();
  }
}