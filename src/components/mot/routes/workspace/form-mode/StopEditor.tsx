'use client';

interface StopEditorProps {
    onToggle: () => void;
    collapsed: boolean;
}

export default function StopEditor({ onToggle, collapsed }: StopEditorProps) {
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
            )}
        </div>
    )
}
