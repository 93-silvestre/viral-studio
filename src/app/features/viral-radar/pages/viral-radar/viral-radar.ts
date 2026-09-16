import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';

import {
  LucideLink,
  LucideRadar,
  LucideSearch,
  LucideUserRound,
} from '@lucide/angular';

type RadarTab = 'link' | 'profile';

@Component({
  selector: 'app-viral-radar',
  imports: [
    LucideLink,
    LucideRadar,
    LucideSearch,
    LucideUserRound,
  ],
  templateUrl: './viral-radar.html',
  styleUrl: './viral-radar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViralRadar {
  readonly activeTab = signal<RadarTab>('link');
  readonly searchValue = signal('');
  readonly isLoading = signal(false);
  readonly result = signal<string | null>(null);

  selectTab(tab: RadarTab): void {
    this.activeTab.set(tab);
    this.searchValue.set('');
    this.result.set(null);
  }

  updateSearchValue(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchValue.set(input.value);
  }

  async analyze(): Promise<void> {
    const value = this.searchValue().trim();

    if (!value) {
      return;
    }

    this.isLoading.set(true);
    this.result.set(null);

    await new Promise((resolve) => {
      setTimeout(resolve, 1200);
    });

    this.result.set(
      this.activeTab() === 'link'
        ? 'Link analisado com sucesso.'
        : `Perfil @${value.replace('@', '')} encontrado.`,
    );

    this.isLoading.set(false);
  }
}