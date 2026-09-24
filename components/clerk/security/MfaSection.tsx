"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useState } from "react"

export const MfaSection = () => {
  const { t } = useTranslation('clerk')
  
  // Estado para MFA
  const [mfaMethods, setMfaMethods] = useState([
    { id: "totp", name: t('security.mfa_section.methods.totp.name'), enabled: true },
    { id: "sms", name: t('security.mfa_section.methods.sms.name'), enabled: false },
    { id: "backup_code", name: t('security.mfa_section.methods.backup_code.name'), enabled: true }
  ])
  
  const [showQRCode, setShowQRCode] = useState(false)
  const [activeMfaMethod, setActiveMfaMethod] = useState<string | null>(null)

  const handleToggleMfa = (methodId: string) => {
    setMfaMethods(methods => methods.map(method => 
      method.id === methodId 
        ? { ...method, enabled: !method.enabled } 
        : method
    ))
  }

  const handleSetupMfa = (methodId: string) => {
    setActiveMfaMethod(methodId)
    if (methodId === "totp") {
      setShowQRCode(true)
    } else {
      // Mostrar configuración para el método específico
      console.log(`Configurando método MFA: ${methodId}`)
    }
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-sm font-medium">{t('security.mfa_section.title')}</h3>
      <p className="text-sm text-muted-foreground">
        {t('security.mfa_section.description')}
      </p>
      
      <div className="space-y-4">
        {mfaMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{method.name}</div>
              <div className="text-sm text-muted-foreground">
                {method.id === "totp" && t('security.mfa_section.methods.totp.description')}
                {method.id === "sms" && t('security.mfa_section.methods.sms.description')}
                {method.id === "backup_code" && t('security.mfa_section.methods.backup_code.description')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {method.enabled && <Badge label={t('security.mfa_section.status.enabled')} variant="defaultrounded"></Badge>}
              <Button 
                variant={method.enabled ? "outline" : "primary"}
                onClick={() => method.enabled 
                  ? handleToggleMfa(method.id) 
                  : handleSetupMfa(method.id)
                }
              >
                {method.enabled ? t('security.mfa_section.actions.disable') : t('security.mfa_section.actions.configure')}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Diálogo para configurar TOTP */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-light p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{t('security.mfa_section.setup.totp.title')}</h2>
            <div className="space-y-4">
              <p className="text-sm">{t('security.mfa_section.setup.totp.scan_instruction')}</p>
              {/* Aquí iría la imagen del código QR */}
              <div className="bg-gray-200 h-40 w-40 mx-auto flex items-center justify-center">
                <p className="text-sm text-text">{t('security.mfa_section.setup.totp.qr_example')}</p>
              </div>
              <p className="text-sm">{t('security.mfa_section.setup.totp.manual_instruction')}</p>
              <div className="bg-gray-100 p-2 rounded text-center font-mono">
                ABCD-EFGH-IJKL-MNOP
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('security.mfa_section.setup.totp.verification_label')}</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder={t('security.mfa_section.setup.totp.verification_placeholder')}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowQRCode(false)}>
                  {t('security.mfa_section.actions.cancel')}
                </Button>
                <Button onClick={() => {
                  // Aquí verificarías el código ingresado
                  // y activarías TOTP si es correcto
                  handleToggleMfa("totp");
                  setShowQRCode(false);
                }}>
                  {t('security.mfa_section.actions.verify')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MfaSection;
