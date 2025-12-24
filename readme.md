# Nootiq 📚✨

**Transforma tus documentos en materiales de estudio inteligentes.**

Nootiq es una plataforma web potenciada con inteligencia artificial que convierte automáticamente PDFs, imágenes y enlaces en flashcards interactivas, quizzes personalizados y resúmenes, ayudándote a estudiar de forma más efectiva.

---

## 🌐 Demo

👉 [Ir a la aplicación](https://nootiq.vercel.app)

---

## 🚀 Características principales

### 📄 Importación de Documentos
* **PDFs**: Extrae texto automáticamente de archivos PDF
* **Enlaces**: Procesa contenido desde URLs
* **CSV**: Importa datos estructurados (Premium+)
* **Imágenes**: OCR para extraer texto de imágenes JPG/PNG (Ultimate)
* **Markdown**: Soporte para archivos MD

### 🤖 Generación con IA
* **Flashcards Interactivas**: Creadas automáticamente a partir de tus documentos
* **Quizzes Personalizados**: Preguntas de opción múltiple con niveles de dificultad
* **Resúmenes**: Genera resúmenes concisos de documentos largos
* **Chat con Documentos**: Conversa con tus documentos usando IA (Ultimate)

### 🗂️ Organización
* **Rooms**: Organiza tu material por temas, asignaturas o proyectos
* **Etiquetas**: Sistema de tags para categorización
* **Búsqueda**: Encuentra rápidamente tu material de estudio

### 📤 Exportación
* **PDF**: Exportación básica de flashcards
* **Markdown**: Exporta en formato MD
* **CSV**: Exportación de datos estructurados (Premium+)
* **Anki**: Exporta directamente a Anki para estudio con repetición espaciada (Ultimate)

### 📊 Seguimiento
* **Progreso de Flashcards**: Marca flashcards como aprendidas, en proceso o pendientes
* **Historial**: Mantiene registro de tu última revisión
* **Estadísticas**: Visualiza tu avance por Room

### 💎 Sistema de Planes
* **Free**: 5 Rooms, 25 generaciones IA/mes
* **Premium**: 20 Rooms, 100 generaciones IA/mes, importación CSV
* **Ultimate**: Rooms ilimitados, generaciones IA ilimitadas, importación de imágenes, chat con documentos

---

## 🧪 Stack Tecnológico

### Frontend
* **Next.js 15.2** con App Router
* **React 19** con Server Components
* **TypeScript** para type safety
* **Tailwind CSS** para estilos
* **Framer Motion** para animaciones
* **Radix UI** para componentes accesibles
* **shadcn/ui** para componentes de UI

### Backend & Servicios
* **Neon Database** (PostgreSQL serverless)
* **Clerk** para autenticación y gestión de usuarios
* **Cohere API** para generación de contenido con IA
* **Vercel Blob** para almacenamiento de archivos
* **PayPal** para procesamiento de pagos
* **OCR Space API** para reconocimiento óptico de caracteres

### Librerías Clave
* **pdf2json** para extracción de texto de PDFs
* **jsPDF** para generación de PDFs
* **react-markdown** y **rehype-katex** para renderizado de contenido
* **better-react-mathjax** para fórmulas matemáticas
* **recharts** para visualización de datos

---

## 📋 Requisitos Previos

* Node.js 18+ o Bun
* Una cuenta en [Clerk](https://clerk.dev)
* Una cuenta en [Neon](https://neon.tech)
* API key de [Cohere](https://cohere.ai)
* Vercel Blob Storage configurado
* PayPal credentials (para pagos)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArubikU/nootiq.git
cd nootiq
```

### 2. Instalar dependencias

```bash
npm install
# o
pnpm install
# o
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Cohere API
COHERE_API_KEY=your_cohere_api_key

# PayPal (opcional, para pagos)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox # o production

# OCR Space API (opcional, para procesamiento de imágenes)
OCR_SPACE_API_KEY=your_ocr_space_api_key
```

### 4. Configurar la base de datos

El proyecto usa Neon PostgreSQL. Asegúrate de tener las siguientes tablas creadas:

* `users` - Usuarios de la aplicación
* `rooms` - Espacios de estudio
* `documents` - Documentos subidos
* `flashcards` - Tarjetas de estudio
* `quizzes` - Cuestionarios
* `quiz_questions` - Preguntas de los quizzes
* `flashcard_progress` - Progreso del usuario
* `limits` - Límites de uso por plan
* `payments` - Registro de pagos
* `promo_codes` - Códigos promocionales
* `uploads` - Archivos subidos
* `chat_history` - Historial de conversaciones

### 5. Ejecutar en desarrollo

```bash
npm run dev
# o
pnpm dev
# o
bun dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 📦 Scripts Disponibles

* `npm run dev` - Inicia el servidor de desarrollo
* `npm run build` - Construye la aplicación para producción
* `npm run start` - Inicia el servidor de producción
* `npm run lint` - Ejecuta el linter

---

## 🏗️ Estructura del Proyecto

```
nootiq/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ai/           # Endpoints de IA
│   │   ├── payments/     # Procesamiento de pagos
│   │   └── ...
│   ├── dashboard/        # Dashboard de usuario
│   ├── rooms/            # Gestión de Rooms
│   ├── documents/        # Visualización de documentos
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI base
│   ├── flashcards/       # Componentes de flashcards
│   ├── quizzes/          # Componentes de quizzes
│   └── ...
├── lib/                   # Utilidades y lógica de negocio
│   ├── db.ts             # Funciones de base de datos
│   ├── cohere.ts         # Integración con Cohere
│   ├── getLimits.ts      # Lógica de planes y límites
│   └── ...
├── hooks/                 # Custom React hooks
├── types/                 # Definiciones de TypeScript
├── public/               # Archivos estáticos
└── styles/               # Estilos globales
```

---

## 🔒 Autenticación con Clerk

Nootiq utiliza [Clerk](https://clerk.dev) para gestionar la autenticación y autorización:

* **Autenticación**: Login/registro con email y redes sociales
* **Metadata de Usuario**: Almacena el plan actual (`free`, `premium`, `ultimate`)
* **Protección de Rutas**: Middleware para rutas protegidas
* **Webhooks**: Sincronización de usuarios con la base de datos

```typescript
// Ejemplo de metadata de usuario
{
  publicMetadata: {
    plan: "premium" // free, premium, ultimate, ultra
  }
}
```

---

## 💳 Planes y Límites

| Característica | Free | Premium | Ultimate |
|---|---|---|---|
| Rooms | 5 | 20 | ∞ |
| Generaciones IA/Room | 5 | 20 | ∞ |
| Generaciones IA/Mes | 25 | 100 | ∞ |
| Archivos por Room | 3 | 10 | ∞ |
| Importar CSV | ❌ | ✅ | ✅ |
| Importar Imágenes | ❌ | ❌ | ✅ |
| Exportar CSV | ❌ | ✅ | ✅ |
| Exportar Anki | ❌ | ❌ | ✅ |
| Chat con Documentos | ❌ | ❌ | ✅ |
| Soporte Prioritario | ❌ | ❌ | ✅ |

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar Nootiq:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y pertenece a [ArubikU](https://github.com/ArubikU).

---

## 📩 Contacto

Desarrollado con 💻 y ☕ por [Arubik](https://github.com/arubiku)

¿Preguntas o sugerencias? Abre un issue o contáctanos directamente.

---

## 🙏 Agradecimientos

* [Clerk](https://clerk.dev) por la autenticación
* [Cohere](https://cohere.ai) por la IA generativa
* [Neon](https://neon.tech) por la base de datos serverless
* [Vercel](https://vercel.com) por el hosting y blob storage
* La comunidad de Next.js y React
