"use client";
import { useState } from "react";
import { sendNotificationEmail } from "../services/sendNotificationEmail";

interface SendEmailParams {
  recipientEmail: string;
  subject: string;
  body: string;
  recipientId?: number;
}

export function useSendNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = async (params: SendEmailParams) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await sendNotificationEmail(params);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send email";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error, success };
}
