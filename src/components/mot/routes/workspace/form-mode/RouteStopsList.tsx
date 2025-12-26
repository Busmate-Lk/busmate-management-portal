'use client';

export default function RouteStopsList() {
    return (
        <div className="col-span-2">
            <span className="underline">RouteStopsList</span>

            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-3">Start & End Stops</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-white border rounded">
                            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">S</span>
                            <span className="flex-1">Embilipitiya</span>
                            <span className="text-gray-600">0 km</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white border rounded">
                            <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">E</span>
                            <span className="flex-1">Colombo</span>
                            <span className="text-gray-600">160 km</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Intermediate Stops</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-white border rounded">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                            <span className="flex-1">Ratnapura</span>
                            <span className="text-gray-600">50 km</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white border rounded">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                            <span className="flex-1">Kuruwita</span>
                            <span className="text-gray-600">90 km</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white border rounded">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                            <span className="flex-1">Avissawella</span>
                            <span className="text-gray-600">120 km</span>
                        </div>
                        <button className="w-full p-3 text-blue-600 border border-dashed border-blue-600 rounded hover:bg-blue-50">
                            + Add Intermediate Stop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}