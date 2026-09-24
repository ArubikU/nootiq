"use client"

import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useTranslation } from "@/hooks/use-translation"
import { useState } from "react"

export default function PasswordSection() {
  const { user, isLoaded } = useUser()
  const { t } = useTranslation()

  const [password, setPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [updatingPassword, setUpdatingPassword] = useState(false)

  if (!isLoaded) return null
  if (!user) return null

  const content = () => {
    if (updatingPassword) {
      return (
        <div className=" rounded-xl p-6 shadow-sm bg-primary">
          <h3 className="text-sm font-medium mb-4 text-primary">
            {t('clerk.security.password_section.update_password')}
          </h3>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="password"
              placeholder={t('clerk.security.password_section.new_password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />
            <input
              type="password"
              placeholder={t('clerk.security.password_section.current_password')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4 flex-wrap">
            <Button
              variant="ghost"
              className="hover:bg-gray-100 rounded-xl"
              onClick={() => setUpdatingPassword(false)}
            >
              {t('clerk.security.password_section.cancel')}
            </Button>
            <Button
              className="bg-gray-800 rounded-xl text-white hover:bg-text"
              disabled={password === ""}
              onClick={async () => {
                await user.updatePassword({
                  currentPassword,
                  newPassword: password,
                })
                setUpdatingPassword(false)
              }}
            >
              {t('clerk.security.password_section.save')}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full">
        <input
          type="password"
          value={"•".repeat(10)}
          disabled
          className="rounded-xl px-4 py-2 w-full md:w-auto text-gray-900"
        />
        <Button onClick={() => setUpdatingPassword(true)}>
          {t('clerk.security.password_section.set_password')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-start py-4 gap-2 md:gap-4">
      <p className="text-sm font-medium w-full md:w-32 shrtext-0 mt-1">
        {t('clerk.security.password_section.title')}
      </p>
      <div className="flex-grow w-full">{content()}</div>
    </div>
  )
}
