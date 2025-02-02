// TypeScript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PriceEmpireService {
  private apiUrl = '/v3/items/prices/test';
  private apiKey = 'cca5670b-2372-4f3f-b090-5e5309408922';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.apiUrl, { headers });
  }
}