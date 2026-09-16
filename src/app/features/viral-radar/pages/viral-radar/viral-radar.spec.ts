import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ViralRadar } from './viral-radar';

describe('ViralRadar', () => {
  let component: ViralRadar;
  let fixture: ComponentFixture<ViralRadar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViralRadar],
    }).compileComponents();

    fixture = TestBed.createComponent(ViralRadar);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with link tab selected', () => {
    expect(component.activeTab()).toBe('link');
  });

  it('should return validation error when search value is empty', () => {
    component.searchValue.set('');

    expect(component.validationError()).toBe(
      'Preencha o campo para continuar.',
    );

    expect(component.isFormValid()).toBe(false);
  });

  it('should accept a valid Instagram link', () => {
    component.searchValue.set(
      'https://www.instagram.com/reel/DdSWcs1xIpL/',
    );

    expect(component.validationError()).toBeNull();
    expect(component.isFormValid()).toBe(true);
  });

  it('should reject a link from another domain', () => {
    component.searchValue.set(
      'https://www.google.com/test',
    );

    expect(component.validationError()).toBe(
      'Por favor, insira um link válido do Instagram.',
    );

    expect(component.isFormValid()).toBe(false);
  });

  it('should reject an invalid URL', () => {
    component.searchValue.set('teste');

    expect(component.validationError()).toBe(
      'Por favor, insira um link válido do Instagram.',
    );
  });

  it('should change to profile tab and clear previous state', () => {
    component.searchValue.set(
      'https://www.instagram.com/reel/test/',
    );

    component.result.set('Resultado anterior');
    component.hasSubmitted.set(true);

    component.selectTab('profile');

    expect(component.activeTab()).toBe('profile');
    expect(component.searchValue()).toBe('');
    expect(component.result()).toBeNull();
    expect(component.hasSubmitted()).toBe(false);
  });

  it('should accept a valid Instagram username with @', () => {
    component.selectTab('profile');
    component.searchValue.set('@silvestre_fc.store');

    expect(component.validationError()).toBeNull();
    expect(component.isFormValid()).toBe(true);
  });

  it('should accept a valid Instagram username without @', () => {
    component.selectTab('profile');
    component.searchValue.set('silvestre_fc.store');

    expect(component.validationError()).toBeNull();
    expect(component.isFormValid()).toBe(true);
  });

  it('should reject an Instagram username containing spaces', () => {
    component.selectTab('profile');
    component.searchValue.set('silvestre fc store');

    expect(component.validationError()).toBe(
      'Por favor, insira um nome de usuário válido do Instagram.',
    );

    expect(component.isFormValid()).toBe(false);
  });

  it('should not analyze when form is invalid', async () => {
    component.searchValue.set('teste');

    await component.analyze();

    expect(component.hasSubmitted()).toBe(true);
    expect(component.result()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('should analyze a valid Instagram profile', async () => {
    vi.useFakeTimers();

    component.selectTab('profile');
    component.searchValue.set('@silvestre_fc.store');

    const analyzePromise = component.analyze();

    expect(component.isLoading()).toBe(true);
    expect(component.result()).toBeNull();

    await vi.runAllTimersAsync();
    await analyzePromise;

    expect(component.isLoading()).toBe(false);

    expect(component.result()).toBe(
      'Perfil @silvestre_fc.store encontrado.',
    );
  });

  it('should analyze a valid Instagram link', async () => {
    vi.useFakeTimers();

    component.searchValue.set(
      'https://www.instagram.com/reel/DdSWcs1xIpL/',
    );

    const analyzePromise = component.analyze();

    expect(component.isLoading()).toBe(true);

    await vi.runAllTimersAsync();
    await analyzePromise;

    expect(component.isLoading()).toBe(false);
    expect(component.result()).toContain(
      'https://www.instagram.com/reel/DdSWcs1xIpL/',
    );
  });

  it('should update search value from input event', () => {
    const input = document.createElement('input');
    input.value = '@silvestre_fc.store';

    component.updateSearchValue({
      target: input,
    } as unknown as Event);

    expect(component.searchValue()).toBe('@silvestre_fc.store');
  });

  it('should switch to profile tab when user clicks the profile tab', () => {
    const element = fixture.nativeElement as HTMLElement;

    const tabs = element.querySelectorAll<HTMLButtonElement>(
      '.search-card__tab',
    );

    expect(tabs.length).toBe(2);

    tabs[1].click();
    fixture.detectChanges();

    const heading = element.querySelector(
      '.search-card__description h2',
    );

    const input = element.querySelector<HTMLInputElement>(
      '.search-card__input',
    );

    expect(component.activeTab()).toBe('profile');

    expect(heading?.textContent?.trim()).toBe(
      'Pesquise um perfil',
    );

    expect(input?.placeholder).toBe('@perfil');

    expect(
      tabs[1].getAttribute('aria-selected'),
    ).toBe('true');
  });


  it('should update search value when user types in the input', () => {
    const element = fixture.nativeElement as HTMLElement;

    const input = element.querySelector<HTMLInputElement>(
      '.search-card__input',
    );

    expect(input).not.toBeNull();

    if (!input) {
      return;
    }

    input.value =
      'https://www.instagram.com/reel/DdSWcs1xIpL/';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();

    expect(component.searchValue()).toBe(
      'https://www.instagram.com/reel/DdSWcs1xIpL/',
    );
  });

  it('should display validation error when user submits an invalid link', () => {
    const element = fixture.nativeElement as HTMLElement;

    const input = element.querySelector<HTMLInputElement>(
      '.search-card__input',
    );

    const analyzeButton =
      element.querySelector<HTMLButtonElement>(
        '.search-card__button',
      );

    expect(input).not.toBeNull();
    expect(analyzeButton).not.toBeNull();

    if (!input || !analyzeButton) {
      return;
    }

    input.value = 'teste';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();

    analyzeButton.click();

    fixture.detectChanges();

    const error = element.querySelector(
      '.search-card__error',
    );

    expect(error?.textContent?.trim()).toBe(
      'Por favor, insira um link válido do Instagram.',
    );

    expect(
      input.getAttribute('aria-invalid'),
    ).toBe('true');

    expect(
      input.getAttribute('aria-describedby'),
    ).toBe('search-error');
  });

  it('should display required field error when user submits an empty search', () => {
    const element = fixture.nativeElement as HTMLElement;

    const analyzeButton =
      element.querySelector<HTMLButtonElement>(
        '.search-card__button',
      );

    expect(analyzeButton).not.toBeNull();

    if (!analyzeButton) {
      return;
    }

    analyzeButton.click();

    fixture.detectChanges();

    const error = element.querySelector(
      '.search-card__error',
    );

    expect(error?.textContent?.trim()).toBe(
      'Preencha o campo para continuar.',
    );
  });

  it('should display loading state while analyzing a valid profile', async () => {
    vi.useFakeTimers();

    const element = fixture.nativeElement as HTMLElement;

    const tabs = element.querySelectorAll<HTMLButtonElement>(
      '.search-card__tab',
    );

    tabs[1].click();

    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>(
      '.search-card__input',
    );

    const analyzeButton =
      element.querySelector<HTMLButtonElement>(
        '.search-card__button',
      );

    expect(input).not.toBeNull();
    expect(analyzeButton).not.toBeNull();

    if (!input || !analyzeButton) {
      return;
    }

    input.value = '@silvestre_fc.store';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();

    analyzeButton.click();

    fixture.detectChanges();

    expect(analyzeButton.textContent?.trim()).toBe(
      'Analisando...',
    );

    expect(analyzeButton.disabled).toBe(true);

    await vi.runAllTimersAsync();

    fixture.detectChanges();

    expect(analyzeButton.disabled).toBe(false);
  });

  it('should display profile result after successful analysis', async () => {
    vi.useFakeTimers();

    const element = fixture.nativeElement as HTMLElement;

    const tabs = element.querySelectorAll<HTMLButtonElement>(
      '.search-card__tab',
    );

    tabs[1].click();

    fixture.detectChanges();

    const input = element.querySelector<HTMLInputElement>(
      '.search-card__input',
    );

    const analyzeButton =
      element.querySelector<HTMLButtonElement>(
        '.search-card__button',
      );

    expect(input).not.toBeNull();
    expect(analyzeButton).not.toBeNull();

    if (!input || !analyzeButton) {
      return;
    }

    input.value = '@silvestre_fc.store';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    fixture.detectChanges();

    analyzeButton.click();

    await vi.runAllTimersAsync();

    fixture.detectChanges();

    const result = element.querySelector(
      '.search-card__result',
    );

    expect(result).not.toBeNull();

    expect(result?.textContent?.trim()).toBe(
      'Perfil @silvestre_fc.store encontrado.',
    );

    expect(
      result?.getAttribute('role'),
    ).toBe('status');

    expect(
      result?.getAttribute('aria-live'),
    ).toBe('polite');
  });

});