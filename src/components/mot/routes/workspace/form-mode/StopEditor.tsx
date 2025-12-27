'use client';

export default function StopEditor() {
    return (
        <div className="col-span-1 flex flex-col rounded-md px-4 py-2 bg-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="underline">StopEditor</span>
                <span>
                    {/* public/icons/Sidebar-Collapse--Streamline-Iconoir.svg */}
                    <button className="ml-2 text-white text-sm rounded  flex items-center justify-center">
                        <img src="/icons/Sidebar-Collapse--Streamline-Iconoir.svg" className="w-5 h-5" alt="Collapse" />
                    </button>
                </span>
            </div>
            <div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Name (English)</label>
                        <input type="text" className="w-full border border-gray-400 rounded px-2 py-1 bg-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Name (Sinhala)</label>
                        <input type="text" className="w-full border border-gray-400 rounded px-2 py-1 bg-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Name (Tamil)</label>
                        <input type="text" className="w-full border border-gray-400 rounded px-2 py-1 bg-white" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea className="w-full border border-gray-400 rounded px-2 py-1 bg-white" rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium">Latitude</label>
                            <input type="number" step="any" className="w-full border border-gray-400 rounded px-2 py-1 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Longitude</label>
                            <input type="number" step="any" className="w-full border border-gray-400 rounded px-2 py-1 bg-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Address (English)</label>
                        <input type="text" className="w-full border border-gray-400 rounded px-2 py-1 bg-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="City" className="border border-gray-400 rounded px-2 py-1 bg-white" />
                        <input type="text" placeholder="State" className="border border-gray-400 rounded px-2 py-1 bg-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Zip Code" className="border border-gray-400 rounded px-2 py-1 bg-white" />
                        <input type="text" placeholder="Country" className="border border-gray-400 rounded px-2 py-1 bg-white" />
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" id="accessible" />
                        <label htmlFor="accessible" className="ml-2 text-sm">Accessible</label>
                    </div>
                </form>
            </div>
        </div>

    )
}
