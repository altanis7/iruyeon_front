/**
 * localStorage 기반 Mock 데이터 관리
 * - 새로고침 시에도 데이터 유지
 * - 타입 안전성 보장
 */

export class MockStorage<T> {
  private key: string;
  private initialData: T;

  constructor(key: string, initialData: T) {
    this.key = `msw_${key}`; // 네임스페이스 추가
    this.initialData = initialData;
    this.initialize();
  }

  private initialize(): void {
    const stored = localStorage.getItem(this.key);
    if (!stored) {
      this.save(this.initialData);
    }
  }

  get(): T {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : this.initialData;
  }

  save(data: T): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  update(updater: (data: T) => T): void {
    const current = this.get();
    const updated = updater(current);
    this.save(updated);
  }

  reset(): void {
    this.save(this.initialData);
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
