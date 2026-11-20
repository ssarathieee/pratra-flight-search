export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  departureDate: string;
  returnDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  price: number;
  stops: number;
  cabinClass: string;
  aircraft: string;
  baggage: string;
  stopLabel: string;
  layover?: string;
}

export interface SearchCriteria {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
}
