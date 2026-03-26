"use client";
import { useState, useCallback } from "react";

interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Record<keyof T, ValidationRule[]>
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as any);

  const validateField = useCallback(
    (field: keyof T, value: any): string | null => {
      if (!validationRules?.[field]) return null;

      for (const rule of validationRules[field]) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return null;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (func: (values: T) => T) => {
      const newValues = func(values);
      setValues(newValues);
    },
    [values]
  );

  const handleFieldChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<keyof T, string | null> = {} as any;
    let isValid = true;

    Object.keys(values).forEach((field) => {
      const error = validateField(field as keyof T, values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      } else {
        newErrors[field as keyof T] = null;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as any);
  }, [initialValues]);

  return {
    values,
    errors,
    setValues,
    handleChange,
    handleFieldChange,
    validateForm,
    resetForm,
    isValid: Object.values(errors).every((err) => err === null),
  };
}
