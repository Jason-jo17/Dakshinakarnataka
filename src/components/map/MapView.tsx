import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Institution } from '../../types/institution';
import type { Job } from '../../data/jobs';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    institutions: Institution[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    showHeatmap: boolean;
    showPopulationView?: boolean;
    showJobs?: boolean;
    jobs?: Job[];
    hideLegend?: boolean;
}

const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14);
    }, [center, map]);
    return null;
};

const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // @ts-ignore - leaflet.heat is not fully typed in all environments
        const heat = L.heatLayer(points, {
            radius: 30, // Increased radius for better coverage
            blur: 20,   // Increased blur for smoother gradient
            maxZoom: 12,
            gradient: {
                0.4: 'blue',
                0.6: 'cyan',
                0.7: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        });

        heat.addTo(map);

        return () => {
            try {
                map.removeLayer(heat);
            } catch (e) {
                console.error("Error removing heatmap layer:", e);
            }
        };
    }, [map, points]);

    return null;
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Engineering': return '#3b82f6'; // blue-500
        case 'Polytechnic': return '#f97316'; // orange-500
        case 'ITI': return '#eab308'; // yellow-500
        case 'Training': return '#22c55e'; // green-500
        case 'University': return '#a855f7'; // purple-500
        case 'Research': return '#14b8a6'; // teal-500
        case 'Hospital': return '#ef4444'; // red-500
        case 'PU College': return '#db2777'; // pink-600
        case 'Company': return '#6b7280'; // gray-500
        case 'Degree College': return '#8b5cf6'; // violet-500
        default: return '#3b82f6';
    }
};

const createCustomIcon = (category: string, isCoe?: boolean, size: number = 12) => {
    const color = getCategoryColor(category);
    const borderColor = isCoe ? '#FFD700' : 'white'; // Gold for COE
    const borderWidth = isCoe ? '3px' : '2px';

    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: ${borderWidth} solid ${borderColor};
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
            ${isCoe ? 'z-index: 1000;' : ''}
            transition: all 0.3s ease;
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
};

const createJobIcon = () => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: #16a34a;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="width: 6px; height: 6px; background-color: white; border-radius: 1px;"></div>
        </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -7]
    });
};

const calculateSeats = (inst: Institution) => {
    let seats = 0;
    inst.academic?.programs?.forEach(p => seats += (p.seats || 0));

    // Default for PU Colleges/Schools if no data or 0
    if (seats === 0 && (inst.category === 'PU College' || inst.category === 'ITI')) {
        return 200;
    }

    return seats || 50; // Default small size if no data
};

const getMarkerSize = (seats: number) => {
    // Scale seats to a reasonable pixel size
    // Min size 10, Max size 40
    // Assume max seats around 2000 for scaling
    const minSize = 10;
    const maxSize = 40;
    const maxSeats = 2000;

    const size = minSize + (Math.min(seats, maxSeats) / maxSeats) * (maxSize - minSize);
    return Math.round(size);
};

// Improved Polygon for Dakshina Kannada District
const dkBoundary: [number, number][] = [
    [13.12, 74.77], // Mulki (North Coast)
    [13.15, 75.00], // North East
    [13.05, 75.40], // Charmadi Ghat
    [12.70, 75.65], // Bisle Ghat / Subramanya
    [12.50, 75.55], // Sullia South
    [12.55, 75.35], // Kerala Border South
    [12.75, 74.88], // Talapady (South Coast)
    [12.85, 74.83], // Mangalore
    [13.00, 74.78], // Surathkal
    [13.12, 74.77]  // Close Loop
];

const JobMarker = ({ job }: { job: Job }) => {
    const markerRef = React.useRef<L.Marker>(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.openPopup();
        }
    }, []);

    if (!job.coordinates) return null;

    return (
        <Marker
            ref={markerRef}
            position={[job.coordinates.lat, job.coordinates.lng]}
            icon={createJobIcon()}
        >
            <Popup autoClose={false} closeOnClick={false}>
                <div className="p-2 min-w-[200px]">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm text-gray-800">{job.role}</h3>
                        <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded font-medium">JOB</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 mb-1">{job.company}</p>
                    <p className="text-xs text-gray-600 mb-2">{job.location}</p>

                    <div className="bg-gray-50 p-2 rounded border border-gray-100 mb-2">
                        <p className="text-xs font-medium text-gray-700">💰 {job.salary}</p>
                    </div>

                    <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{job.requirements}</p>

                    <div className="text-xs font-medium text-blue-600 border-t border-gray-100 pt-2">
                        {job.application_type}: {job.apply_link_or_contact.startsWith('http') ? 'Link' : job.apply_link_or_contact}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

const MapView: React.FC<MapViewProps> = ({
    institutions,
    selectedId,
    onSelect,
    showHeatmap,
    showPopulationView,
    showJobs,
    jobs,
    hideLegend
}) => {
    const selectedInstitution = institutions.find(i => i.id === selectedId);
    const initialCenter: [number, number] = [12.9141, 74.8560]; // Mangalore

    const heatPoints: [number, number, number][] = useMemo(() => institutions.map(inst => {
        let intensity = 0.5; // Default intensity
        if (inst.category === 'University') intensity = 1.0;
        else if (inst.category === 'Engineering' || inst.category === 'Hospital') intensity = 0.8;
        else if (inst.category === 'PU College') intensity = 0.6;
        else if (inst.category === 'Company') intensity = 0.4;

        return [
            inst.location.coordinates.lat,
            inst.location.coordinates.lng,
            intensity
        ];
    }), [institutions]);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={initialCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                className={`z-0 ${showHeatmap ? 'heatmap-active' : ''}`}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* District Boundary */}
                <Polygon
                    positions={dkBoundary}
                    pathOptions={{
                        color: '#4f46e5', // Indigo
                        weight: 2,
                        fillColor: '#4f46e5',
                        fillOpacity: 0.05,
                        dashArray: '5, 5'
                    }}
                />

                {!showHeatmap ? (
                    <>
                        {institutions.map((inst) => {
                            const seats = calculateSeats(inst);
                            const size = showPopulationView ? getMarkerSize(seats) : (inst.coe ? 16 : 12);

                            return (
                                <Marker
                                    key={inst.id}
                                    position={[inst.location.coordinates.lat, inst.location.coordinates.lng]}
                                    icon={createCustomIcon(inst.category, inst.coe, size)}
                                    eventHandlers={{
                                        click: () => onSelect(inst.id),
                                    }}
                                >
                                    <Popup>
                                        <div className="p-1">
                                            <h3 className="font-bold text-sm">{inst.name}</h3>
                                            <p className="text-xs font-semibold" style={{ color: getCategoryColor(inst.category) }}>
                                                {inst.category}
                                            </p>
                                            <p className="text-xs mt-1 text-gray-600">{inst.location.area}</p>
                                            {showPopulationView && (
                                                <p className="text-xs mt-1 font-medium text-blue-600">
                                                    Approx. Seats: {seats}
                                                </p>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* Job Markers */}
                        {showJobs && jobs?.map((job) => (
                            <JobMarker key={job.job_id} job={job} />
                        ))}
                    </>
                ) : (
                    <HeatmapLayer points={heatPoints} />
                )}

                {selectedInstitution && (
                    <MapController
                        center={[
                            selectedInstitution.location.coordinates.lat,
                            selectedInstitution.location.coordinates.lng
                        ]}
                    />
                )}
            </MapContainer>

            {/* Legend - Moved outside MapContainer for better interaction */}
            {!hideLegend && (
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg text-xs z-[1000] max-h-40 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
                    <h4 className="font-bold mb-1">Legend</h4>
                    {['Engineering', 'Polytechnic', 'ITI', 'Training', 'University', 'Research', 'Hospital', 'PU College', 'Company', 'Degree College'].map(cat => (
                        <div key={cat} className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: getCategoryColor(cat) }}></div>
                            <span>{cat}</span>
                        </div>
                    ))}
                    {showJobs && (
                        <div className="flex items-center gap-2 mb-1 mt-2 pt-2 border-t border-gray-100">
                            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm bg-green-600 flex items-center justify-center">
                                <div className="w-1 h-1 bg-white rounded-[1px]"></div>
                            </div>
                            <span>Active Job</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MapView;
