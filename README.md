# Uber Helper

Overlay flutuante que analisa ofertas de corrida da Uber Driver em tempo real
e sugere ACEITAR ou NEGAR, com base em regras configuráveis (R$/km, R$/min,
distância máxima, tempo máximo, destinos proibidos/favoritos, pedágio etc).

## Status desta entrega (Fase 1-3)

✅ Estrutura completa de pastas, types, hooks e componentes
✅ Tela de configurações (`app/settings.tsx`)
✅ Motor de análise / regras (`services/RideAnalyzer.ts`)
⏳ Sistema de overlay nativo — camada de abstração pronta (`services/OverlayService.ts`), aguardando módulo nativo Android
⏳ Accessibility Service — camada de abstração pronta (`services/AccessibilityService.ts`), aguardando módulo nativo Android
⏳ Extração real dos dados da tela da Uber
⏳ Otimização de bateria/performance

## Por que precisa de Development Build

Dois recursos aqui **não existem no Expo Go / Managed Workflow**:

- **Accessibility Service** (ler o conteúdo da tela de outro app)
- **`SYSTEM_ALERT_WINDOW`** (desenhar por cima de outro app)

Ambos exigem módulos nativos Android (Kotlin/Java) registrados no
`AndroidManifest.xml`. Este projeto já está preparado com a interface em
TypeScript (`OverlayService`, `AccessibilityService`) esperando por esses
módulos nativos — assim que forem criados (via `expo prebuild` + código
nativo, ou um plugin de config do Expo), o resto do app já funciona sem
mudanças.

## Rodando o projeto (interface, sem overlay nativo ainda)

```bash
npm install
npx expo start
```

## Arquitetura

```
app/            → telas (index = principal, settings = configurações)
components/     → componentes puros de UI, sem lógica de negócio
hooks/          → useAccessibility, useRideAnalyzer, useOverlay, usePermissions
services/       → RideParser, RideAnalyzer, OverlayService, AccessibilityService
utils/          → currency, distance, time, math
context/        → SettingsContext (persistência via AsyncStorage)
types/          → Ride, RideAnalysis, Config
```

Fluxo de dados:

```
Accessibility Service (nativo)
        ↓ texto bruto
   RideParser  →  Ride
        ↓
  RideAnalyzer (+ Config)  →  RideAnalysis
        ↓
     Overlay (nativo)
```

Nenhum `service` importa React. Nenhum `component` calcula nada. Cada `hook`
tem uma única responsabilidade.

## Próximos passos sugeridos

1. Criar o módulo nativo Android `OverlayModule` (SYSTEM_ALERT_WINDOW).
2. Criar o `AccessibilityService` nativo (Kotlin) + registrar no manifest.
3. Mapear os IDs de view do app da Uber Driver para extrair preço/distância/tempo.
4. Testar consumo de bateria com o serviço em foreground.
