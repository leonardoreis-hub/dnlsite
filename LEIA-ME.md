# DNL Management — site de quartos com agendamento de visitas

Site público no estilo dos grandes marketplaces de hospedagem (grade de fotos, galeria em mosaico, mapa, caixa lateral fixa), só que no lugar de "Reservar" o interessado **agenda uma visita**. O pedido chega no seu e-mail e fica salvo no painel.

## O que tem

**Site público** (`/`)
- Grade de anúncios com carrossel de fotos, favoritos, selo "Novo"
- Filtro por tipo (quarto privativo, compartilhado, estúdio, apartamento, casa), bairro, preço máximo e data de mudança
- Página do anúncio (`/anuncio/1`): galeria, "Mostrar todas as fotos", destaques, descrição, comodidades, regras, mapa com área aproximada (o endereço exato não aparece)
- Caixa "Agendar visita": data (próximos 21 dias, sem domingos), horário, nome, e-mail, WhatsApp, mensagem
- No celular: barra fixa embaixo com o preço e o botão de agendar

**Admin** (`/admin`) — um único usuário e senha
- Criar, editar, despublicar e excluir anúncios
- Upload de várias fotos de uma vez (arrastar e soltar); fotos são reduzidas automaticamente para carregar rápido; reordenar e escolher a capa
- Localizar o endereço no mapa (ou clicar no mapa)
- Aba **Visitas**: todos os pedidos, com status (novo, confirmado, realizado, cancelado), link direto para WhatsApp e e-mail
- Botão "Enviar e-mail de teste"

## Rodar no seu computador

Precisa do Node.js 20 ou mais novo.

```bash
npm install
cp .env.example .env     # e edite usuário, senha e e-mail
npm start
```

Abra http://localhost:3000 e http://localhost:3000/admin

## Configurar o e-mail (Gmail ou Google Workspace)

1. Na conta Google que vai **enviar** os avisos, ative a verificação em 2 etapas.
2. Crie uma **senha de app** em https://myaccount.google.com/apppasswords
3. No `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=sua-conta@gmail.com
SMTP_PASS=a-senha-de-app-de-16-letras
MAIL_FROM=DNL Management <sua-conta@gmail.com>
NOTIFY_EMAIL=email-que-recebe-as-visitas@exemplo.com
```

Para Outlook/Microsoft 365 use `smtp.office365.com`, porta `587`. Sem e-mail configurado o site funciona normalmente e os pedidos ficam só no admin.

Quando você clicar em "Responder" no e-mail, a resposta vai direto para a pessoa que pediu a visita.

## Colocar no ar (recomendado: Railway)

O site guarda o banco e as fotos numa pasta, então o servidor precisa de **disco persistente**.

1. Suba esta pasta para um repositório no GitHub (sem `node_modules`, `data` e `.env` — o `.gitignore` já cuida disso).
2. Em https://railway.app → New Project → Deploy from GitHub → escolha o repositório.
3. Em **Variables**, cole as variáveis do `.env` e adicione `DATA_DIR=/data`, `NODE_ENV=production` e um `SESSION_SECRET` longo e aleatório.
4. Em **Volumes**, crie um volume montado em `/data`.
5. Em **Settings → Networking**, gere o domínio ou ligue o seu (ex.: `quartos.dnl.ie`).

Também funciona no Render (com "Persistent Disk" em `/data`) ou em qualquer VPS. **Não use** planos sem disco persistente: as fotos sumiriam a cada atualização.

## Personalizar

- **Cor da marca**: `public/css/style.css`, variáveis `--brand`, `--brand-dark`, `--brand-grad` no topo.
- **Logo**: constante `LOGO` em `public/js/common.js` (troque pelo SVG ou por `<img src="/logo.png">` e coloque o arquivo em `public/`).
- **Horários de visita**: `SLOTS` em `public/listing.html`. Domingos estão bloqueados na função `nextDays`.
- **Comodidades** disponíveis: objeto `AMENITIES` em `public/js/common.js`.

## Backup

Tudo fica em `data/` (ou no volume `/data`): `dnl.db` (anúncios e visitas) e `uploads/` (fotos). Copiar essa pasta é o backup completo.

## Segurança

- Senha do admin comparada de forma segura e limite de 10 tentativas a cada 15 minutos.
- Formulário de visita com anti-spam (campo oculto + limite por IP).
- Use sempre HTTPS em produção (Railway e Render já dão).
