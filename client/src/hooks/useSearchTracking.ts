import { useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface SearchTrackingOptions {
  searchQuery?: string;
  categoryId?: number;
  regionId?: number;
  priceRange?: { min: number; max: number };
  filters?: any;
  resultsCount: number;
  autoTrack?: boolean;
}

export function useSearchTracking(options: SearchTrackingOptions) {
  const trackedRef = useRef(false);

  const trackSearch = async (clickedVehicleIds: number[] = []) => {
    try {
      await apiRequest('POST', '/api/search/track', {
        searchQuery: options.searchQuery,
        categoryId: options.categoryId,
        regionId: options.regionId,
        priceRange: options.priceRange,
        filters: options.filters,
        resultsCount: options.resultsCount,
        clickedVehicleIds
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  const trackVehicleInteraction = async (
    vehicleId: number,
    interactionType: 'view' | 'click' | 'save' | 'share' | 'book',
    duration?: number,
    source: string = 'search'
  ) => {
    try {
      await apiRequest('POST', '/api/interactions/track', {
        vehicleId,
        interactionType,
        duration,
        source,
        metadata: {
          searchQuery: options.searchQuery,
          categoryId: options.categoryId,
          regionId: options.regionId,
          fromSearch: true
        }
      });
    } catch (error) {
      console.error('Failed to track vehicle interaction:', error);
    }
  };

  // تتبع البحث تلقائياً عند تغيير النتائج
  useEffect(() => {
    if (options.autoTrack && !trackedRef.current && options.resultsCount >= 0) {
      trackSearch();
      trackedRef.current = true;
    }
  }, [
    options.searchQuery,
    options.categoryId,
    options.regionId,
    options.resultsCount,
    options.autoTrack
  ]);

  // إعادة تعيين التتبع عند تغيير البحث
  useEffect(() => {
    trackedRef.current = false;
  }, [options.searchQuery, options.categoryId, options.regionId]);

  return {
    trackSearch,
    trackVehicleInteraction
  };
}

export default useSearchTracking;