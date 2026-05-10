# Capítulo 04: Gestão Administrativa

## 4.1. O Gerenciador de Badges

O acesso ao gerenciamento de conquistas é feito através da aba **Badges** no Painel Administrativo. Esta interface permite total controle sobre as regras de gamificação sem a necessidade de intervenção técnica ou SQL.

---

## 4.2. Criando uma Nova Conquista

Ao clicar em **"Novo Badge"**, o modal de criação será aberto. Siga os passos:

1.  **Informações Básicas**: Defina o nome (curto e impactante) e a descrição (explicando claramente o desafio).
2.  **Configuração de Regras**:
    - Selecione o **Gatilho** (ex: `material_completed`).
    - Defina o **Valor Alvo** (ex: `5` para ganhar após 5 materiais).
3.  **Recompensa**: Insira a quantidade de XP que o usuário receberá ao conquistar este badge.
4.  **Estética**:
    - Escolha um **Ícone** que represente o tema.
    - Selecione uma **Cor** personalizada. O sistema aplicará um efeito de glow e gradiente baseado nesta cor automaticamente.

---

## 4.3. Edição com Live Preview

O `BadgeFormModal` possui um **Live Preview** na parte superior. Conforme você altera o nome, a cor ou o ícone, o card de visualização atualiza em tempo real, permitindo ver exatamente como o badge aparecerá para o usuário final.

---

## 4.4. Exclusão e Boas Práticas

- **Cuidado ao Excluir**: Ao excluir um badge, todos os usuários que o conquistaram perderão a medalha em seus álbuns. O XP já concedido, no entanto, não será removido.
- **Progressão**: Recomendamos criar badges em escada (Bronze, Prata, Ouro) para os mesmos gatilhos, aumentando a longevidade do engajamento.

---

## Próximo Passo

Avance para o **[Capítulo 05: Design e Branding](./05-design-visual.md)**.
