"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface Passkey {
  id: string
  name: string
  createdAt: string
  lastUsed: string | null
}

export const PasskeySection = () => {
  const { t } = useTranslation()
  
  // Estado para las PassKeys
  const [passkeys, setPasskeys] = useState<Passkey[]>([
    {
      id: "passkey-1",
      name: "Windows Hello",
      createdAt: "12 de mayo, 2025",
      lastUsed: "Hace 2 días"
    },
    {
      id: "passkey-2",
      name: "iPhone Touch ID",
      createdAt: "10 de abril, 2025",
      lastUsed: "Hace 1 semana"
    }
  ])

  const [isAddingPasskey, setIsAddingPasskey] = useState(false)
  const [newPasskeyName, setNewPasskeyName] = useState("")

  const handleAddPasskey = () => {
    setIsAddingPasskey(true)
    // En un caso real, aquí solicitarías al navegador iniciar el proceso de WebAuthn
    // Por ahora, simulamos el proceso
    setTimeout(() => {
      if (newPasskeyName) {
        const newPasskey: Passkey = {
          id: `passkey-${Date.now()}`,
          name: newPasskeyName,
          createdAt: new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          lastUsed: null
        }
        setPasskeys([...passkeys, newPasskey])
        setNewPasskeyName("")
      }
      setIsAddingPasskey(false)
    }, 1500)
  }

  const handleDeletePasskey = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta passkey?")) {
      setPasskeys(passkeys.filter(pk => pk.id !== id))
    }
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-sm font-medium">{t('clerk.security.passkey_section.title')}</h3>
      <p className="text-sm text-muted-foreground">
        Las passkeys te permiten iniciar sesión de forma segura sin necesidad de contraseña, utilizando
        la biometría de tu dispositivo (huella digital, reconocimiento facial) o un PIN de sistema.
      </p>
      
      <div className="space-y-4">
        {passkeys.map((passkey) => (
          <div key={passkey.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{passkey.name}</div>
              <div className="text-sm text-muted-foreground">
                {t('clerk.security.passkey_section.created')}: {passkey.createdAt}
              </div>
              {passkey.lastUsed && (
                <div className="text-sm text-muted-foreground">
                  {t('clerk.security.passkey_section.last_used')}: {passkey.lastUsed}
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDeletePasskey(passkey.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {!isAddingPasskey ? (
        <Button onClick={() => setIsAddingPasskey(true)}>
          {t('clerk.security.passkey_section.add_passkey')}
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la passkey</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              placeholder="Ej. Laptop del trabajo"
              value={newPasskeyName}
              onChange={(e) => setNewPasskeyName(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingPasskey(false)
                setNewPasskeyName("")
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddPasskey}
              disabled={!newPasskeyName}
            >
              Registrar passkey
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PasskeySection;
