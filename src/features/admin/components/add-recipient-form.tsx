"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addRecipient } from "@/actions/dbActions" //TODO Change this
// import { toast } from "@/hooks/use-toast"
import { Loader2, X } from "lucide-react"
import { supabase } from "@/lib/supabaseClient" //TODO Change this
import { useTranslations } from "next-intl"

interface Recipient {
  id: string
  email: string
  created_at?: string
}

interface AddRecipientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRecipientForm({ open, onOpenChange }: AddRecipientFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [fetchingRecipients, setFetchingRecipients] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const t = useTranslations('addNewRecipient')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await addRecipient(formData)

      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "Email recipient added successfully",
        // })
        resetForm()
        // Refresh the recipients list
      } else {
        // toast({
        //   title: "Error",
        //   description: result.error || "Failed to add recipient",
        //   variant: "destructive",
        // })
      }
    } catch (error) {
      console.error("Error adding recipient:", error)
      // toast({
      //   title: "Error",
      //   description: "An unexpected error occurred",
      //   variant: "destructive",
      // })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('header')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('email')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('addingState')}
                </>
              ) : (
                t('button')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

