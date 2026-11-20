import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/flights';

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.endpoint).pipe(
      map(flights => flights ?? []),
      catchError(error => {
        console.error('Unable to load flights', error);
        return throwError(() => new Error('We could not load flights. Please check that the mock API is running and try again.'));
      })
    );
  }

  getFlightById(id: string): Observable<Flight | undefined> {
    return this.getFlights().pipe(map(flights => flights.find(flight => flight.id === id)));
  }
}
