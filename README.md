# Uber Helper (Drive_Helper)

Overlay flutuante que analisa ofertas de corrida da Uber Driver em tempo real e sugere ACEITAR ou NEGAR, com base em regras configuráveis (R$/km, R$/min, distância máxima, tempo máximo, destinos proibidos/favoritos, pedágio etc).

## Status do Projeto

### ✅ Implementado (Fase 1-4)

- Estrutura completa de pastas, types, hooks e componentes
- Tela de configurações com validação em tempo real e simulador de corridas
- Motor de análise com scoring ponderado (60% R$/km, 40% R$/min)
- Sistema de histórico local com estatísticas (taxa de aceitação, média R$/km, score médio)
- Persistência de configurações com serialização de escrita (anti-race-condition)
- Parser de moeda robusto (trata negativos, parênteses contábeis, múltiplos símbolos)
- Camada de abstração para overlay nativo (`OverlayService.ts`)
- Camada de abstração para accessibility service (`AccessibilityService.ts`)
- Hooks renomeados corretamente (.ts para arquivos sem JSX)

### ⏳ Pendente (Necessário para Funcionar em Produção)

1. **Módulo Nativo Android — Overlay (`SYSTEM_ALERT_WINDOW`)**
   - Criar `OverlayModule.kt` usando React Native Bridge ou Expo Module API
   - Implementar desenho do card flutuante sobre outros apps
   - Registrar permissão `SYSTEM_ALERT_WINDOW` no `AndroidManifest.xml`
   - Adicionar lógica de posicionamento (arrastável, canto da tela)

2. **Módulo Nativo Android — Accessibility Service**
   - Criar `UberAccessibilityService.kt` estendendo `AccessibilityService`
   - Implementar captura de texto da tela do app Uber Driver
   - Mapear IDs de view / estrutura do layout da Uber para extrair: preço, distância, duração, origem, destino
   - Registrar serviço no `AndroidManifest.xml` com `<accessibility-service>` meta-data
   - Implementar callback JS via EventEmitter para enviar dados ao React Native

3. **Parser Específico da Uber Driver**
   - Os IDs de view e estrutura do app Uber Driver mudam entre versões
   - Necessário mapear os elementos reais do app alvo (via `uiautomatorviewer` ou `adb shell dumpsys`)
   - Implementar fallbacks para quando a estrutura mudar após updates da Uber

4. **Testes em Dispositivo Real**
   - Validar consumo de bateria com Accessibility Service ativo em foreground
   - Testar performance do overlay em dispositivos low-end
   - Verificar comportamento com notificações, chamadas e multitarefa
   - Testar edge cases: corrida cancelada, mudança de preço, timeout

5. **Build de Produção**
   - Configurar `expo prebuild` ou bare workflow
   - Assinar APK/AAB com keystore de produção
   - Configurar ProGuard/R8 rules para não quebrar módulos nativos
   - Publicar na Play Store (requer declaração de uso de Accessibility Service)

## Por que Precisa de Development Build

Dois recursos **não existem no Expo Go / Managed Workflow**:

- **Accessibility Service** (ler conteúdo da tela de outro app)
- **`SYSTEM_ALERT_WINDOW`** (desenhar por cima de outro app)

Ambos exigem módulos nativos Android (Kotlin/Java) registrados no `AndroidManifest.xml`. Este projeto já está preparado com interfaces TypeScript (`OverlayService`, `AccessibilityService`) esperando esses módulos nativos — assim que forem criados, o resto do app funciona sem mudanças.

## Rodando o Projeto (Interface Apenas)

```bash
npm install
npx expo start
```

Para testar sem o módulo nativo, use o **Simulador de Corrida** na tela inicial.

## Arquitetura

```
app/            → telas (index = principal, settings = configurações, test = simulador)
components/     → componentes puros de UI, sem lógica de negócio
hooks/          → useAccessibility, useRideAnalyzer, useOverlay, usePermissions, useRideHistory
services/       → RideParser, RideAnalyzer, RideHistory, OverlayService, AccessibilityService
utils/          → currency, distance, time, math
context/        → SettingsContext (persistência via AsyncStorage com write queue)
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
   RideHistory (salva + calcula stats)
        ↓
     Overlay (nativo)
```

Nenhum `service` importa React. Nenhum `component` calcula nada. Cada `hook` tem uma única responsabilidade.

## Melhorias Implementadas nesta Versão

### Scoring Ponderado
O `RideAnalyzer` agora usa pesos configuráveis (padrão: 60% R$/km, 40% R$/min) com sistema de penalidades e bônus acumulativos, substituindo a média simples anterior.

### Validação de Configurações
A tela de settings exibe avisos em tempo real para valores irreais ou contraditórios, e inclui um simulador que mostra como 3 corridas hipotéticas seriam avaliadas com as configs atuais.

### Histórico e Estatísticas
Novo sistema `RideHistory` persiste as últimas 200 corridas analisadas e calcula: total de corridas, taxa de aceitação, média R$/km, score médio e distância média. Exibido na tela principal.

### Robustez
- `SettingsContext` serializa escritas via queue para evitar race conditions
- `parseCurrency` trata notação contábil negativa, múltiplos símbolos e edge cases
- Hooks sem JSX renomeados de `.tsx` para `.ts`

## Próximos Passos Sugeridos

1. Criar módulo nativo `OverlayModule` (Kotlin) com `SYSTEM_ALERT_WINDOW`
2. Criar `UberAccessibilityService` (Kotlin) + registrar no manifest
3. Mapear IDs de view do app Uber Driver atual (versão específica)
4. Implementar parser adaptativo com fallbacks para mudanças de layout
5. Testar consumo de bateria e performance em dispositivo real
6. Adicionar exportação de histórico (CSV/JSON)
7. Implementar auto-accept (com confirmação de segurança)
8. Adicionar modo noturno automático
9. Suporte a múltiplas plataformas (99, iFood Entregas)
10. Analytics avançados: heatmap de horários lucrativos, tendências semanais

## Licença

Projeto pessoal / educacional. O uso de Accessibility Service para ler dados de apps terceiros pode violar os Termos de Serviço da Uber. Use sob sua própria responsabilidade.