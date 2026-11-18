import { useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../CommonComponents/Button/Button';
import Modal from '../CommonComponents/Modal/Modal';
import Card from '../CommonComponents/Card/Card';
import CardContent from '../CommonComponents/Card/CardContent';
import CardActions from '../CommonComponents/Card/CardActions';
import CardHeader from '../CommonComponents/Card/CardHeader';
import Typography from '../CommonComponents/Typography/Typography';
import TextField from '../CommonComponents/TextField/TextField';
import { deepClone } from '../CommonScripts/utils';
import { validationRulesMethod, isEmpty } from '../CommonScripts/validationsService';
import fnolConfig from '../config/fnol.json';

/**
 * FNOL (First Notice of Loss) Page Component
 *
 * Purpose: Handles claim submission for insurance FNOL workflow using JSON-driven form configuration
 * Supports dynamic form fields (text, email, tel, date, textarea, select, checkbox) with validation
 *
 * Props: None
 *
 * Key Features:
 * - JSON-driven form configuration for easy maintenance
 * - Real-time form state management with error tracking
 * - Field-level validation with user-friendly error messages
 * - Success/error modal feedback
 * - Deep cloning of config to prevent mutations
 * - Accessible form with ARIA attributes
 * - Responsive card-based layout using CommonComponents
 *
 * Behavior:
 * - Initializes form data from JSON config inputs
 * - Validates form on submission
 * - Displays validation errors below each field
 * - Shows success modal on valid submission
 * - Clears errors when user starts typing (improves UX)
 * - Supports all standard input types
 */

type FormDataType = Record<string, string | boolean>;
type FormFieldError = Record<string, string>;

const FNOLPage = () => {
  // Deep clone the FNOL config to avoid mutating the original JSON
  const clonedFnolConfig = deepClone(fnolConfig);

  // Initialize form data from cloned fnol.json inputs
  const [formData, setFormData] = useState<FormDataType>(() => {
    const initialData: FormDataType = {};
    clonedFnolConfig.form.inputs.forEach((input) => {
      initialData[input.id] = input.type === 'checkbox' ? false : '';
    });
    return initialData;
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<FormFieldError>({});

  /**
   * Validate form using validation service rules
   * Checks required fields and format validations for specific types
   */
  const validateForm = (): boolean => {
    const newErrors: FormFieldError = {};

    clonedFnolConfig.form.inputs.forEach((input) => {
      const fieldValue = String(formData[input.id]).trim() || '';
      let fieldErrors: string[] = [];

      // Check required field
      const requiredValidation = validationRulesMethod.required(
        input.label,
        fieldValue,
        input.required
      );
      if (!requiredValidation.valid) {
        fieldErrors.push(requiredValidation.errorMessage);
      }

      // Additional pattern validation for email and phone
      if (!isEmpty(fieldValue)) {
        if (input.id === 'email') {
          const emailValidation = validationRulesMethod.pattern(
            input.label,
            fieldValue,
            'EMAIL'
          );
          if (!emailValidation.valid) {
            fieldErrors.push(emailValidation.errorMessage);
          }
        }

        if (input.id === 'phoneNumber') {
          const phoneValidation = validationRulesMethod.pattern(
            input.label,
            fieldValue,
            'MOBILE_NUMBER'
          );
          if (!phoneValidation.valid) {
            fieldErrors.push(phoneValidation.errorMessage);
          }
        }

        if (input.id === 'estimatedAmount') {
          const numberValue = parseFloat(fieldValue);
          if (isNaN(numberValue) || numberValue <= 0) {
            fieldErrors.push('Please enter a valid amount greater than zero');
          }
        }

        if (input.id === 'lossDate') {
          const selectedDate = new Date(fieldValue);
          const today = new Date();
          if (selectedDate > today) {
            fieldErrors.push('Loss date cannot be in the future');
          }
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[input.id] = fieldErrors[0];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input change and clear associated error
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('FNOL Form Submission:', formData);
      setShowSuccessModal(true);

      // Reset form after successful submission
      setTimeout(() => {
        const resetData: FormDataType = {};
        clonedFnolConfig.form.inputs.forEach((input) => {
          resetData[input.id] = input.type === 'checkbox' ? false : '';
        });
        setFormData(resetData);
        setShowSuccessModal(false);
      }, 2000);
    }
  };

  /**
   * Render form field based on input type
   */
  const renderFormField = (input: any) => {
    const commonProps = {
      id: input.id,
      name: input.name,
      placeholder: input.placeholder,
      label: input.label,
      required: input.required,
      error: errors[input.id] || '',
      helperText: errors[input.id] || '',
      onChange: handleInputChange,
      value: String(formData[input.id]),
    };

    switch (input.type) {
      case 'textarea':
        return (
          <textarea
            key={input.id}
            {...commonProps}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            key={input.id}
            {...commonProps}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{input.placeholder}</option>
            {input.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div key={input.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={input.id}
              name={input.name}
              checked={Boolean(formData[input.id])}
              onChange={handleInputChange}
              className="w-4 h-4 cursor-pointer"
              aria-required={input.required}
            />
            <label htmlFor={input.id} className="text-sm text-gray-700 cursor-pointer">
              {input.label}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      default:
        return (
          <TextField
            key={input.id}
            type={input.type}
            {...commonProps}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader
            title={
              <Typography variant="h3" className="font-bold text-gray-900">
                {clonedFnolConfig.form.title}
              </Typography>
            }
            subheader={
              clonedFnolConfig.form.description ? (
                <Typography variant="body2" className="mt-2 text-gray-600">
                  {clonedFnolConfig.form.description}
                </Typography>
              ) : undefined
            }
          />

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {clonedFnolConfig.form.inputs.map((input) => (
                <div key={input.id} className="form-group">
                  {renderFormField(input)}
                  {errors[input.id] && (
                    <p className="text-red-500 text-sm mt-1" role="alert">
                      {errors[input.id]}
                    </p>
                  )}
                </div>
              ))}

              <CardActions>
                <Button
                  type="submit"
                  variant={clonedFnolConfig.form.button.variant as 'text' | 'contained' | 'outlined'}
                  color={clonedFnolConfig.form.button.color as 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'inherit'}
                  fullWidth
                  id={clonedFnolConfig.form.button.id}
                >
                  {clonedFnolConfig.form.button.text}
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div className="p-6 text-center">
          <Typography variant="h4" className="font-bold text-green-600 mb-3">
            ✓ Claim Submitted Successfully!
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Your FNOL claim has been received and is being processed. You will receive a confirmation
            email shortly.
          </Typography>
        </div>
      </Modal>
    </div>
  );
};

export default FNOLPage;
