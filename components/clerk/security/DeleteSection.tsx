"use client"

import { Button } from "@/components/ui/button"
import { useReverification, useUser } from "@clerk/nextjs"
import { useTranslation } from "react-i18next"
import { useState } from "react"

export const DeleteSection = () => {
  const { user } = useUser()
  const { t } = useTranslation('clerk')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDeleteAccount = useReverification(async () => {
      setIsDeleting(true)
      await user?.delete()
        setIsDeleting(false)
  });

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-sm font-medium">{t('security.delete_account.title')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('security.delete_account.description')}
        {' '}
        {t('security.delete_account.warning')}
      </p>
      
      {!showConfirmation ? (
        <Button
          variant="destructive"
          className="rounded-xl"
          onClick={() => setShowConfirmation(true)}
        >
          {t('security.delete_account.delete_button')}
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-destructive">
            {t('security.delete_account.question')}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={() => setShowConfirmation(false)}
            >
              {t('security.password_section.cancel')}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? t('security.delete_account.deleting') : t('security.delete_account.confirm_deletion')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeleteSection;
