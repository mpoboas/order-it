import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly localStorageKey = 'responsibleName';

  getResponsibleName(): string | null {
    const storedData = localStorage.getItem(this.localStorageKey);
    if (storedData) {
      const { name } = JSON.parse(storedData);
      return name;
    }
    return null;
  }

  setResponsibleName(name: string): void {
    const data = { name };
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  clearResponsibleName(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
