import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly responsibleLocalStorageKey = 'responsibleName';
  private readonly adminLocalStorageKey = 'adminName';
  private readonly allowedAdminAccessKey = 'allowedAdminAccess';

  getResponsibleName(): string | null {
    return this.getNameFromLocalStorage(this.responsibleLocalStorageKey);
  }

  setResponsibleName(name: string): void {
    this.setNameInLocalStorage(this.responsibleLocalStorageKey, name);
  }

  clearResponsibleName(): void {
    this.clearNameInLocalStorage(this.responsibleLocalStorageKey);
  }

  getAdminName(): string | null {
    return this.getNameFromLocalStorage(this.adminLocalStorageKey);
  }

  setAdminName(name: string): void {
    this.setNameInLocalStorage(this.adminLocalStorageKey, name);
  }

  clearAdminName(): void {
    this.clearNameInLocalStorage(this.adminLocalStorageKey);
  }

  private getNameFromLocalStorage(key: string): string | null {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      const { name } = JSON.parse(storedData);
      return name;
    }
    return null;
  }

  private setNameInLocalStorage(key: string, name: string): void {
    const data = { name };
    localStorage.setItem(key, JSON.stringify(data));
  }

  private clearNameInLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  getAllowedAdminAccess(): boolean {
    return localStorage.getItem(this.allowedAdminAccessKey) === 'true';
  }

  setAllowedAdminAccess(allowed: boolean): void {
    localStorage.setItem(this.allowedAdminAccessKey, allowed.toString());
  }
}
