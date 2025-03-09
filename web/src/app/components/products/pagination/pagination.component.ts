// pagination.component.ts
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Přidáno

@Component({
  selector: 'app-product-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]  // Přidáno FormsModule
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() itemsPerPage = 9;

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  pageNumbers: (number | string)[] = [];
  Math = Math;  // Přidáno Math objekt

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPages'] || changes['currentPage']) {
      this.calculatePageNumbers();
    }
  }

  calculatePageNumbers(): void {
    this.pageNumbers = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      this.pageNumbers.push(1);

      if (this.currentPage > 2) {
        if (this.currentPage > 3) {
          this.pageNumbers.push('...');
        }
        this.pageNumbers.push(this.currentPage - 1);
      }

      if (this.currentPage !== 1 && this.currentPage !== this.totalPages) {
        this.pageNumbers.push(this.currentPage);
      }

      if (this.currentPage < this.totalPages - 1) {
        this.pageNumbers.push(this.currentPage + 1);
        if (this.currentPage < this.totalPages - 2) {
          this.pageNumbers.push('...');
        }
      }

      this.pageNumbers.push(this.totalPages);
    }
  }

  goToPage(page: number | string): void {
    if (page === '...') return;

    const pageNum = Number(page);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages) {
      this.pageChange.emit(pageNum);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  changeItemsPerPage(value: number): void {
    this.itemsPerPageChange.emit(value);
  }
}