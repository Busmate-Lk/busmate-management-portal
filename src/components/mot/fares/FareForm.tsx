'use client';

import { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { FareFormData } from '@/data/mot/fares';

interface FareFormProps {
    initialData?: Partial<FareFormData>;
    onSubmit: (data: FareFormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    submitButtonText?: string;
    mode: 'create' | 'edit';
}

const sriLankanRoutes = [
    'Colombo - Kandy',
    'Colombo - Galle',
    'Colombo - Matara',
    'Colombo - Jaffna',
    'Colombo - Negombo',
    'Colombo - Chilaw',
    'Colombo - Ratnapura',
    'Kandy - Nuwara Eliya',
    'Kandy - Badulla',
    'Kurunegala - Anuradhapura',
    'Anuradhapura - Trincomalee',
    'Galle - Matara',
    'Batticaloa - Trincomalee',
    'Colombo - Kurunegala',
    'Colombo - Anuradhapura',
];

const sriLankanOperators = [
    'Sri Lanka Transport Board (SLTB)',
    'SLTB Central',
    'Colombo City Transport',
    'Southern Transport',
    'Hill Country Express',
    'Coastal Express',
    'North Western Transport',
    'Sabaragamuwa Transport Board',
    'Uva Province Transport Board',
    'North Central Province Transport Board',
];

const emptyFormData: FareFormData = {
    busType: '',
    facilityType: '',
    route: '',
    operator: '',
    operatorType: '',
    province: '',
    baseFare: '',
    perKmRate: '',
    effectiveFrom: '',
    effectiveTo: '',
    notes: '',
};

export function FareForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitButtonText = 'Save',
    mode,
}: FareFormProps) {
    const [formData, setFormData] = useState<FareFormData>(() => ({
        ...emptyFormData,
        ...initialData,
    }));
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showValidation, setShowValidation] = useState(false);

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (showValidation) {
            setValidationErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    }, [showValidation]);

    const handleNumberInput = useCallback((field: string, value: string) => {
        // Allow empty, digits, and single decimal
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            handleInputChange(field, value);
        }
    }, [handleInputChange]);

    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.busType) errors.busType = 'Bus type is required';
        if (!formData.facilityType) errors.facilityType = 'Facility type is required';
        if (!formData.route) errors.route = 'Route is required';
        if (!formData.operator) errors.operator = 'Operator is required';
        if (!formData.operatorType) errors.operatorType = 'Operator type is required';
        if (!formData.province) errors.province = 'Province is required';
        if (!formData.baseFare) errors.baseFare = 'Base fare is required';
        else if (parseFloat(formData.baseFare) <= 0) errors.baseFare = 'Base fare must be positive';
        if (!formData.perKmRate) errors.perKmRate = 'Per km rate is required';
        else if (parseFloat(formData.perKmRate) <= 0) errors.perKmRate = 'Per km rate must be positive';
        if (!formData.effectiveFrom) errors.effectiveFrom = 'Effective date is required';

        setValidationErrors(errors);
        setShowValidation(true);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;
        await onSubmit(formData);
    }, [validateForm, onSubmit, formData]);

    const getFieldError = (field: string) => (showValidation ? validationErrors[field] : '');

    const getFieldClasses = (field: string, color: string = 'blue') => {
        const hasError = showValidation && validationErrors[field];
        return `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${hasError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : `border-gray-300 focus:ring-${color}-500 focus:border-${color}-500`
            }`;
    };

    return (
        <div className="space-y-6">
            {/* Section 1: Basic Information */}
            <div className="border-l-4 border-l-blue-500 pl-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bus Type <span className="text-red-500">*</span>
                        </label>
                        <select value={formData.busType} onChange={(e) => handleInputChange('busType', e.target.value)} className={getFieldClasses('busType')}>
                            <option value="">Select bus type</option>
                            <option value="AC">AC Bus</option>
                            <option value="Non-AC">Non-AC Bus</option>
                            <option value="Semi-Luxury">Semi-Luxury</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Express">Express Service</option>
                        </select>
                        {getFieldError('busType') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('busType')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facility Type <span className="text-red-500">*</span>
                        </label>
                        <select value={formData.facilityType} onChange={(e) => handleInputChange('facilityType', e.target.value)} className={getFieldClasses('facilityType')}>
                            <option value="">Select facility</option>
                            <option value="Normal">Normal Service</option>
                            <option value="Semi-Luxury">Semi-Luxury</option>
                            <option value="Luxury">Luxury Service</option>
                            <option value="Express">Express Service</option>
                            <option value="Intercity">Intercity Express</option>
                        </select>
                        {getFieldError('facilityType') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('facilityType')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Route <span className="text-red-500">*</span>
                        </label>
                        <select value={formData.route} onChange={(e) => handleInputChange('route', e.target.value)} className={getFieldClasses('route')}>
                            <option value="">Select route</option>
                            {sriLankanRoutes.map((route) => (
                                <option key={route} value={route}>{route}</option>
                            ))}
                        </select>
                        {getFieldError('route') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('route')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Province <span className="text-red-500">*</span>
                        </label>
                        <select value={formData.province} onChange={(e) => handleInputChange('province', e.target.value)} className={getFieldClasses('province')}>
                            <option value="">Select province</option>
                            <option value="Western">Western Province</option>
                            <option value="Central">Central Province</option>
                            <option value="Southern">Southern Province</option>
                            <option value="Northern">Northern Province</option>
                            <option value="Eastern">Eastern Province</option>
                            <option value="North Western">North Western Province</option>
                            <option value="North Central">North Central Province</option>
                            <option value="Uva">Uva Province</option>
                            <option value="Sabaragamuwa">Sabaragamuwa Province</option>
                        </select>
                        {getFieldError('province') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('province')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: Operator Information */}
            <div className="border-l-4 border-l-green-500 pl-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">2</div>
                    <h3 className="text-lg font-semibold text-gray-900">Operator Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Operator <span className="text-red-500">*</span>
                        </label>
                        <select value={formData.operator} onChange={(e) => handleInputChange('operator', e.target.value)} className={getFieldClasses('operator', 'green')}>
                            <option value="">Select operator</option>
                            {sriLankanOperators.map((op) => (
                                <option key={op} value={op}>{op}</option>
                            ))}
                        </select>
                        {getFieldError('operator') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('operator')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Operator Type <span className="text-red-500">*</span>
                        </label>
                        <select value={formData.operatorType} onChange={(e) => handleInputChange('operatorType', e.target.value)} className={getFieldClasses('operatorType', 'green')}>
                            <option value="">Select type</option>
                            <option value="SLTB">SLTB (Government)</option>
                            <option value="Provincial">Provincial Transport Board</option>
                            <option value="Private">Private Operator</option>
                        </select>
                        {getFieldError('operatorType') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('operatorType')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 3: Fare Structure */}
            <div className="border-l-4 border-l-purple-500 pl-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</div>
                    <h3 className="text-lg font-semibold text-gray-900">Fare Structure</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base Fare (Rs.) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={formData.baseFare}
                            onChange={(e) => handleNumberInput('baseFare', e.target.value)}
                            placeholder="e.g. 50.00"
                            className={getFieldClasses('baseFare', 'purple')}
                        />
                        {getFieldError('baseFare') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('baseFare')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Per KM Rate (Rs.) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={formData.perKmRate}
                            onChange={(e) => handleNumberInput('perKmRate', e.target.value)}
                            placeholder="e.g. 3.50"
                            className={getFieldClasses('perKmRate', 'purple')}
                        />
                        {getFieldError('perKmRate') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('perKmRate')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Effective From <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.effectiveFrom}
                            onChange={(e) => handleInputChange('effectiveFrom', e.target.value)}
                            className={getFieldClasses('effectiveFrom', 'purple')}
                        />
                        {getFieldError('effectiveFrom') && (
                            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />{getFieldError('effectiveFrom')}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Effective To
                        </label>
                        <input
                            type="date"
                            value={formData.effectiveTo}
                            onChange={(e) => handleInputChange('effectiveTo', e.target.value)}
                            className={getFieldClasses('effectiveTo', 'purple')}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={3}
                            placeholder="Additional notes about this fare structure..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting && (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    {submitButtonText}
                </button>
            </div>
        </div>
    );
}
