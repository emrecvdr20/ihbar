import {useEffect, useState} from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

export const useGeolocation = () => {
    const [location, setLocation] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                error: 'Konum servisi desteklenmiyor',
                loading: false,
            }));
            return;
        }

        const success = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
            });
        };

        const error = (err: GeolocationPositionError) => {
            setLocation(prev => ({
                ...prev,
                error: `Konum alınamadı: ${err.message}`,
                loading: false,
            }));
        };

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 dakika cache
        });
    }, []);

    const refreshLocation = () => {
        setLocation(prev => ({...prev, loading: true}));
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false,
                });
            },
            (err) => {
                setLocation(prev => ({
                    ...prev,
                    error: `Konum alınamadı: ${err.message}`,
                    loading: false,
                }));
            }
        );
    };

    return {...location, refreshLocation};
};