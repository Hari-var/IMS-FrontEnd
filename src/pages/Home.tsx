import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../CommonComponents/Button/Button';
import Card from '../CommonComponents/Card/Card';
import CardContent from '../CommonComponents/Card/CardContent';
import CardActions from '../CommonComponents/Card/CardActions';
import Typography from '../CommonComponents/Typography/Typography';
import { deepClone } from '../CommonScripts/utils';
import { validationRulesMethod, isEmpty } from '../CommonScripts/validationsService';
import loginConfig from '../config/login.json';
import TextField from '../CommonComponents/TextField/TextField';

type FormDataType = Record<string, string>;
type FormFieldError = Record<string, string>;

const Home = () => {
  const navigate = useNavigate();
  // Deep clone the login config to avoid mutating the original JSON
  const clonedLoginConfig = deepClone(loginConfig);

  // Initialize form data from cloned login.json inputs
  const [formData, setFormData] = useState<FormDataType>(() => {
    const initialData: FormDataType = {};
    clonedLoginConfig.form.inputs.forEach((input) => {
      initialData[input.id] = '';
    });
    return initialData;
  });

  const [errors, setErrors] = useState<FormFieldError>({});

  /**
   * Validate form using validation service rules
   */
  const validateForm = (): boolean => {
    const newErrors: FormFieldError = {};

    clonedLoginConfig.form.inputs.forEach((input) => {
      const fieldValue = formData[input.id]?.trim() || '';
      let fieldErrors: string[] = [];

      // Check required field
      const requiredValidation = validationRulesMethod.required(input.label, fieldValue, input.required);
      if (!requiredValidation.valid) {
        fieldErrors.push(requiredValidation.errorMessage);
      }

      // Additional pattern validation for email and password
      if (!isEmpty(fieldValue)) {
        if (input.id === 'email') {
          const emailValidation = validationRulesMethod.pattern(input.label, fieldValue, 'EMAIL');
          if (!emailValidation.valid) {
            fieldErrors.push(emailValidation.errorMessage);
          }
        }

        if (input.id === 'password') {
          const passwordValidation = validationRulesMethod.minLength(input.label, fieldValue, 6);
          if (!passwordValidation.valid) {
            fieldErrors.push(passwordValidation.errorMessage);
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
   * Handle input field changes with real-time error clearing
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

      // Redirect to FNOL page after 2 seconds
      setTimeout(() => {
        navigate('/fnol');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-auto">
        {/* Login Form Card */}
        <Card variant="outlined" className="bg-white rounded-xl shadow-2xl overflow-hidden w-[420px]">
          {/* Card Header */}
          <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Typography variant="h2" className="text-center text-gray-900">
              {clonedLoginConfig.form.title}
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Card Content - Form Inputs */}
            <CardContent className="p-8">
              <div className="space-y-6">
                {clonedLoginConfig.form.inputs.map((input) => (
                  <TextField
                    key={input.id}
                    id={input.id}
                    type={input.type}
                    name={input.id}
                    label={input.label}
                    placeholder={input.placeholder}
                    value={formData[input.id] || ''}
                    onChange={handleInputChange}
                    error={errors[input.id] || ''}
                    required={input.required}
                    size="medium"
                    variant="outlined"
                  />
                ))}
              </div>
            </CardContent>

            {/* Card Actions - Submit Button */}
            <CardActions className="border-t border-gray-200 px-8 py-6 bg-gray-50">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full py-3 text-base font-semibold"
              >
                {clonedLoginConfig.form.button.text}
              </Button>
            </CardActions>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Home;