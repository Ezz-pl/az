export interface SearchFilters {
  category?: string;
  tripType?: string;
  vehicleType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface BookingFormData {
  vehicleId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  notes?: string;
}
