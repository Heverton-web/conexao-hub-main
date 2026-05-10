# 06 — Patentes e Níveis

## Sistema de Patentes

A plataforma utiliza um sistema de patentes que representa seu nível de experiência e engajamento. Cada patente possui critérios específicos de XP mínimo e benefícios únicos.

## Tabela de Patentes

| Patente | XP Mínimo | Cor no Sistema |
|---------|-----------|----------------|
| **Iniciante** | 0 XP | Padrão (dourado) |
| **Bronze** | 100 XP | #cd7f32 |
| **Prata** | 300 XP | #c0c0c0 |
| **Ouro** | 600 XP | #ffd700 |
| **Master** | 1000 XP | #b8860b |

## Critérios de Promoção

### Como Subir de Nível

1. accumulation XP através de atividades na plataforma
2. Quando atingir o XP mínimo da próxima patente, você será automaticamente promovido
3. Uma notificação comunicará sua promoção
4. Seu perfil e header serão atualizados com a nova patente

### Tempo Médio por Patente

| Patente | Tempo Médio para Conquistar |
|---------|----------------------------|
| Iniciante → Bronze | 1-2 semanas |
| Bronze → Prata | 2-4 semanas |
| Prata → Ouro | 1-2 meses |
| Ouro → Master | 3-6 meses |

## Benefícios por Nível

### Iniciante (0 XP)

- Acesso básico à biblioteca
- Participação em trilhas básicas
- Visualização de conquistas básicas

### Bronze (100 XP)

- Todos os benefícios do Iniciante
- Acesso a trilhas intermediárias
- Prioridade em eventos

### Prata (300 XP)

- Todos os benefícios do Bronze
- Acesso a trilhas avançadas
- Badge especial de identificação
- Suporte prioritário

### Ouro (600 XP)

- Todos os benefícios do Prata
- Acesso a conteúdo premium
- Badge dourado exclusivo
- Convite para grupos exclusivos

### Master (1000 XP)

- Todos os benefícios do Ouro
- Acesso a Masterclasses
- Badge Master especial
- Reconhecimento no hall de líderes

## Reflexo Visual no Header

O header adapta-se à sua patente:

### Elementos Afetados

- **Borda do header**: Cor da patente com 25% de opacidade
- **Fundo do header**: Cor da patente com 8% de opacidade
- **Sombra**: Glow sutil com a cor da patente
- **Ícone de nível**: Estrela colorida com a cor da patente

### Exemplo Visual

```
style={{
  border: '1px solid #cd7f3225',
  backgroundColor: '#cd7f3208',
  boxShadow: '0 0 20px #cd7f3208'
}}
```

## Como Acompanhar Evolução

### No Dashboard

O card de progresso mostra:

- Patente atual
- XP atual
- Progresso até próxima patente (%)
- XP necessário para próxima promoção

### No Perfil

Sua página de perfil exibe:

- Histórico de patentes conquistadas
- Data de promoção para cada patente
- Tempo total no nível atual

## Dicas para Evoluir Rápido

1. **Complete trilhas completas** — Maior fonte de XP
2. **Mantenha acesso diário** — Acúmulo de XP constante
3. **Busque trilhas do seu nível** — Otimize tempo e XP
4. **Aproveite bônus** — Fique atendo a promoções especiais

---

*Próximo: [07-Badges-Conquistas](file:///docs/manual_consultor/07-badges-conquistas.md)*