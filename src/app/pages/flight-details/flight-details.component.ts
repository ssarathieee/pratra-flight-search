import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Flight } from '../../models/flight.model';
import { FlightService } from '../../core/flight.service';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly flightService = inject(FlightService);
  private readonly destroy$ = new Subject<void>();
  flight?: Flight;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.flightService.getFlightById(params.get('id') ?? '')),
      takeUntil(this.destroy$)
    ).subscribe({
      next: flight => { this.flight = flight; this.loading = false; },
      error: () => { this.errorMessage = 'Unable to load flight details. Please try again.'; this.loading = false; }
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
