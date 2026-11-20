import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { FlightDetailsComponent } from './pages/flight-details/flight-details.component';

export const routes: Routes = [
  { path: '', component: SearchPageComponent },
  { path: 'flights/:id', component: FlightDetailsComponent },
  { path: '**', redirectTo: '' }
];
