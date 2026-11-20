import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, finalize, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Flight, SearchCriteria } from '../../models/flight.model';
import { FlightService } from '../../core/flight.service';

type TripType = 'one-way' | 'round-trip';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly flightsSubject = new BehaviorSubject<Flight[]>([]);
  private readonly filtersSubject = new BehaviorSubject({ maxPrice: 1500, stops: [] as number[], airlines: [] as string[] });

  readonly Math = Math;
  readonly airports = [
    { code: 'BOM', city: 'Mumbai' },
    { code: 'DEL', city: 'New Delhi' },
    { code: 'BLR', city: 'Bengaluru' }
  ];
  readonly today = new Date().toISOString().slice(0, 10);
  loading = false;
  searched = false;
  errorMessage = '';
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  availableAirlines: string[] = [];
  maxAvailablePrice = 2000;
  readonly form = this.fb.nonNullable.group({
    tripType: this.fb.nonNullable.control<TripType>('one-way'),
    from: ['DEL', Validators.required],
    to: ['BOM', Validators.required],
    departureDate: ['2026-11-20', Validators.required],
    returnDate: ['2026-11-24', Validators.required],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]]
  });

  ngOnInit(): void {
    this.onTripTypeChange();

    combineLatest([
      this.flightsSubject,
      this.filtersSubject.pipe(debounceTime(100), startWith(this.filtersSubject.value))
    ]).pipe(
      map(([flights, filters]) => flights.filter(flight =>
        flight.price <= filters.maxPrice &&
        (filters.stops.length === 0 || filters.stops.includes(flight.stops)) &&
        (filters.airlines.length === 0 || filters.airlines.includes(flight.airline))
      )),
      takeUntil(this.destroy$)
    ).subscribe(results => this.filteredFlights = results);

    this.searchFlights();
  }

  searchFlights(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const criteria = this.form.getRawValue();
    if (criteria.from.trim().toUpperCase() === criteria.to.trim().toUpperCase()) {
      this.errorMessage = 'Departure and destination airports must be different.';
      return;
    }
    if (criteria.tripType === 'round-trip' && criteria.returnDate < criteria.departureDate) {
      this.errorMessage = 'Return date must be on or after the departure date.';
      return;
    }

    this.loading = true;
    this.searched = true;
    this.errorMessage = '';
    this.flightsSubject.next([]);
    this.flightService.getFlights().pipe(
      map(flights => flights.filter(flight =>
        flight.from.toLowerCase() === criteria.from.trim().toLowerCase() &&
        flight.to.toLowerCase() === criteria.to.trim().toLowerCase() &&
        flight.departureDate === criteria.departureDate &&
        (criteria.tripType === 'one-way' || flight.returnDate === criteria.returnDate)
      )),
      catchError(error => {
        this.errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        return of([]);
      }),
      finalize(() => this.loading = false),
      takeUntil(this.destroy$)
    ).subscribe(flights => {
      this.flights = flights;
      this.availableAirlines = [...new Set(flights.map(f => f.airline))];
      this.maxAvailablePrice = Math.max(500, ...flights.map(f => f.price));
      this.filtersSubject.next({ maxPrice: Math.max(1500, this.maxAvailablePrice), stops: [], airlines: [] });
      this.flightsSubject.next(flights);
    });
  }

  get isRoundTrip(): boolean {
    return this.form.controls.tripType.value === 'round-trip';
  }

  onTripTypeChange(): void {
    const returnDate = this.form.controls.returnDate;
    if (this.isRoundTrip) {
      returnDate.setValidators(Validators.required);
    } else {
      returnDate.clearValidators();
    }
    returnDate.updateValueAndValidity();
    this.errorMessage = '';
  }

  swapAirports(): void {
    const from = this.form.controls.from.value;
    this.form.controls.from.setValue(this.form.controls.to.value);
    this.form.controls.to.setValue(from);
  }

  updateMaxPrice(value: string): void {
    this.filtersSubject.next({ ...this.filtersSubject.value, maxPrice: Number(value) });
  }

  toggleStop(stops: number, checked: boolean): void {
    const current = this.filtersSubject.value.stops;
    const next = checked ? [...current, stops] : current.filter(value => value !== stops);
    this.filtersSubject.next({ ...this.filtersSubject.value, stops: next });
  }

  toggleAirline(airline: string, checked: boolean): void {
    const current = this.filtersSubject.value.airlines;
    const next = checked ? [...current, airline] : current.filter(value => value !== airline);
    this.filtersSubject.next({ ...this.filtersSubject.value, airlines: next });
  }

  isStopSelected(stops: number): boolean { return this.filtersSubject.value.stops.includes(stops); }
  isAirlineSelected(airline: string): boolean { return this.filtersSubject.value.airlines.includes(airline); }
  get maxPrice(): number { return this.filtersSubject.value.maxPrice; }

  resetFilters(): void {
    this.filtersSubject.next({ maxPrice: Math.max(1500, this.maxAvailablePrice), stops: [], airlines: [] });
  }

  viewDetails(flight: Flight): void { void this.router.navigate(['/flights', flight.id]); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.flightsSubject.complete();
    this.filtersSubject.complete();
  }
}
