import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
  readonly hasSubmitted = signal(false);

  readonly validationError = computed<string | null>(() => {
    const value = this.searchValue().trim();

    if (!value) {
      return 'Preencha o campo para continuar.';
    }
    if (this.activeTab() === 'link' && !this.isValidInstagramUrl(value)) {
      return 'Por favor, insira um link válido do Instagram.';
    }
    if (this.activeTab() === 'profile' && !this.isValidInstagramUserName(value)) {
      return 'Por favor, insira um nome de usuário válido do Instagram.';
    }

    return null;
  });

  readonly isFormValid = computed(() => this.validationError() === null);

  selectTab(tab: RadarTab): void {
    this.activeTab.set(tab);
    this.searchValue.set('');
    this.result.set(null);
    this.hasSubmitted.set(false);
  }

  updateSearchValue(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchValue.set(input.value);
    this.result.set(null);
  }

  async analyze(): Promise<void> {
   this.hasSubmitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    const value = this.searchValue().trim();

    this.isLoading.set(true);
    this.result.set(null);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    this.result.set(
      this.activeTab() === 'link'
        ? `Link analisado com sucesso: ${value}`
        : `Perfil @${this.normalizeUsername(value)} encontrado.`,
    );

    this.isLoading.set(false);
  }

    private isValidInstagramUrl(value: string): boolean {
    try {
      const url = new URL(value);

      return (
        url.protocol === 'https:' &&
        ['instagram.com', 'www.instagram.com'].includes(url.hostname)
      );
    } catch {
      return false;
    }
  }

  private isValidInstagramUserName(value: string): boolean {
    const username = this.normalizeUsername(value);
    return /^[a-zA-Z0-9._]+$/.test(username);
  }

  private normalizeUsername(value: string): string {
    return value.trim().replace(/^@/, '');
  }

}