// empty-state.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EmptyStateComponent {
  @Input() message = 'Žádné produkty k zobrazení';
  @Input() buttonText = 'Načíst produkty';
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}