import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BingoService {

  constructor(private httpClient: HttpClient) {
  }

  generateBingoToken(): Observable<any> {
    return this.httpClient.get<any>('assets/cards.json').pipe(
      map((data) => data));
  }
}
