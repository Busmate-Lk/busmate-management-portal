'use client';

import { useRouteWorkspace } from "@/context/RouteWorkspace/useRouteWorkspace";
import { StopExistenceType, Location } from "@/types/RouteWorkspaceData";

interface StopEditorProps {
    onToggle: () => void;
    collapsed: boolean;
}

export default function StopEditor({ onToggle, collapsed }: StopEditorProps) {
    const { data, selectedRouteIndex, selectedStopIndex, updateRouteStop } = useRouteWorkspace();

    // Get selected stop data
    const selectedStop = 
        selectedRouteIndex !== null && 
        selectedStopIndex !== null && 
        data.routeGroup.routes[selectedRouteIndex]?.routeStops[selectedStopIndex]
            ? data.routeGroup.routes[selectedRouteIndex].routeStops[selectedStopIndex]
            : null;

    const handleFieldChange = (field: string, value: any) => {
        if (selectedRouteIndex === null || selectedStopIndex === null) return;

        const currentStop = selectedStop?.stop;
        if (!currentStop) return;

        // Helper to ensure location has required fields
        const ensureValidLocation = (partialLocation: Partial<Location>): Location => {
            const existingLocation = currentStop.location;
            return {
                latitude: partialLocation.latitude ?? existingLocation?.latitude ?? 0,
                longitude: partialLocation.longitude ?? existingLocation?.longitude ?? 0,
                address: partialLocation.address ?? existingLocation?.address,
                city: partialLocation.city ?? existingLocation?.city,
                state: partialLocation.state ?? existingLocation?.state,
                zipCode: partialLocation.zipCode ?? existingLocation?.zipCode,
                country: partialLocation.country ?? existingLocation?.country,
                addressSinhala: partialLocation.addressSinhala ?? existingLocation?.addressSinhala,
                citySinhala: partialLocation.citySinhala ?? existingLocation?.citySinhala,
                stateSinhala: partialLocation.stateSinhala ?? existingLocation?.stateSinhala,
                countrySinhala: partialLocation.countrySinhala ?? existingLocation?.countrySinhala,
                addressTamil: partialLocation.addressTamil ?? existingLocation?.addressTamil,
                cityTamil: partialLocation.cityTamil ?? existingLocation?.cityTamil,
                stateTamil: partialLocation.stateTamil ?? existingLocation?.stateTamil,
                countryTamil: partialLocation.countryTamil ?? existingLocation?.countryTamil,
            };
        };

        // Update specific fields in the context
        if (field === 'name') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { ...currentStop, name: value }
            });
        } else if (field === 'nameSinhala') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { ...currentStop, nameSinhala: value }
            });
        } else if (field === 'nameTamil') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { ...currentStop, nameTamil: value }
            });
        } else if (field === 'description') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { ...currentStop, description: value }
            });
        } else if (field === 'latitude') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ latitude: value })
                }
            });
        } else if (field === 'longitude') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ longitude: value })
                }
            });
        } else if (field === 'address') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ address: value })
                }
            });
        } else if (field === 'addressSinhala') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ addressSinhala: value })
                }
            });
        } else if (field === 'addressTamil') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ addressTamil: value })
                }
            });
        } else if (field === 'city') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ city: value })
                }
            });
        } else if (field === 'citySinhala') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ citySinhala: value })
                }
            });
        } else if (field === 'cityTamil') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ cityTamil: value })
                }
            });
        } else if (field === 'state') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ state: value })
                }
            });
        } else if (field === 'stateSinhala') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ stateSinhala: value })
                }
            });
        } else if (field === 'stateTamil') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ stateTamil: value })
                }
            });
        } else if (field === 'zipCode') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ zipCode: value })
                }
            });
        } else if (field === 'country') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ country: value })
                }
            });
        } else if (field === 'countrySinhala') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ countrySinhala: value })
                }
            });
        } else if (field === 'countryTamil') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { 
                    ...currentStop, 
                    location: ensureValidLocation({ countryTamil: value })
                }
            });
        } else if (field === 'isAccessible') {
            updateRouteStop(selectedRouteIndex, selectedStopIndex, {
                stop: { ...currentStop, isAccessible: value }
            });
        }
    };

    return (
        <div className={`flex flex-col rounded-md px-4 py-2 bg-gray-100 ${collapsed ? 'w-12 overflow-hidden' : ''}`}>
            <div className={`flex ${collapsed ? 'flex-col items-center' : 'justify-between items-center'} mb-2`}>
                {collapsed ? (
                    <div className="flex flex-col gap-8">
                        <button onClick={onToggle} className="text-white text-sm rounded flex items-center justify-center mb-2">
                            <img src="/icons/Sidebar-Collapse--Streamline-Iconoir.svg" className="w-5 h-5 rotate-180" alt="Expand" />
                        </button>
                        <span className="transform -rotate-90 origin-center whitespace-nowrap text-sm">StopEditor</span>
                    </div>
                ) : (
                    <>
                        <span className="underline">StopEditor</span>
                        <span>
                            <button onClick={onToggle} className="ml-2 text-white text-sm rounded flex items-center justify-center">
                                <img src="/icons/Sidebar-Collapse--Streamline-Iconoir.svg" className="w-5 h-5" alt="Collapse" />
                            </button>
                        </span>
                    </>
                )}
            </div>
            {!collapsed && (
                <div>
                    {!selectedStop ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>Select a route stop from the list to edit</p>
                        </div>
                    ) : (
                        <form className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <label className="block text-sm font-medium">Id :</label>
                                <span className={`text-sm px-2 py-1 rounded ${selectedStop.stop.type === StopExistenceType.EXISTING ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    {selectedStop.stop.id || 'new'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Name (Eng)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    value={selectedStop.stop.name || ''}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Name (Sin)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    value={selectedStop.stop.nameSinhala || ''}
                                    onChange={(e) => handleFieldChange('nameSinhala', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Name (Tam)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    value={selectedStop.stop.nameTamil || ''}
                                    onChange={(e) => handleFieldChange('nameTamil', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    rows={3}
                                    value={selectedStop.stop.description || ''}
                                    onChange={(e) => handleFieldChange('description', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium">Latitude</label>
                                    <input 
                                        type="number" 
                                        step="any" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.latitude || ''}
                                        onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Longitude</label>
                                    <input 
                                        type="number" 
                                        step="any" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.longitude || ''}
                                        onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Address (Eng)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    value={selectedStop.stop.location?.address || ''}
                                    onChange={(e) => handleFieldChange('address', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Address (Sin)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    value={selectedStop.stop.location?.addressSinhala || ''}
                                    onChange={(e) => handleFieldChange('addressSinhala', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Address (Tam)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                    value={selectedStop.stop.location?.addressTamil || ''}
                                    onChange={(e) => handleFieldChange('addressTamil', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City (Eng)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.city || ''}
                                        onChange={(e) => handleFieldChange('city', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City (Sin)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.citySinhala || ''}
                                        onChange={(e) => handleFieldChange('citySinhala', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City (Tam)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.cityTamil || ''}
                                        onChange={(e) => handleFieldChange('cityTamil', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">State (Eng)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.state || ''}
                                        onChange={(e) => handleFieldChange('state', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">State (Sin)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.stateSinhala || ''}
                                        onChange={(e) => handleFieldChange('stateSinhala', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">State (Tam)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.stateTamil || ''}
                                        onChange={(e) => handleFieldChange('stateTamil', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Zip Code</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.zipCode || ''}
                                        onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country (Eng)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.country || ''}
                                        onChange={(e) => handleFieldChange('country', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country (Sin)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.countrySinhala || ''}
                                        onChange={(e) => handleFieldChange('countrySinhala', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country (Tam)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-400 rounded px-2 py-1 bg-white" 
                                        value={selectedStop.stop.location?.countryTamil || ''}
                                        onChange={(e) => handleFieldChange('countryTamil', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="accessible" 
                                    checked={selectedStop.stop.isAccessible || false}
                                    onChange={(e) => handleFieldChange('isAccessible', e.target.checked)}
                                />
                                <label htmlFor="accessible" className="ml-2 text-sm">Accessible</label>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
