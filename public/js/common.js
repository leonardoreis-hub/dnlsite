// Utilidades compartilhadas
const I = {
  wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.47-9.47 9.47zm8.06-17.53A11.34 11.34 0 0 0 12.04.63C5.76.63.65 5.74.65 12.02c0 2.01.52 3.97 1.52 5.7L.55 23.63l6.05-1.59a11.36 11.36 0 0 0 5.43 1.38h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  heart: '<svg viewBox="0 0 32 32"><path d="M16 28c7-4.7 14-10 14-17 0-3.9-3-7-6.7-7-2.6 0-4.9 1.5-6.1 3.7L16 9.3l-1.2-1.6C13.6 5.5 11.3 4 8.7 4 5 4 2 7.1 2 11c0 7 7 12.3 14 17z"/></svg>',
  left: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"/></svg>',
  right: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="4"><path d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"/></svg>',
  user: '<svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 .7a15.3 15.3 0 1 1 0 30.6A15.3 15.3 0 0 1 16 .7zm0 20c-3.4 0-6.5 1.3-8.8 3.6a12.3 12.3 0 0 0 17.6 0A12.3 12.3 0 0 0 16 20.7zm0-15a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>',
  menu: '<svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M2 16h28M2 24h28M2 8h28"/></svg>',
  grid: '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><rect x="1" y="1" width="4" height="4" rx="1"/><rect x="6" y="1" width="4" height="4" rx="1"/><rect x="11" y="1" width="4" height="4" rx="1"/><rect x="1" y="6" width="4" height="4" rx="1"/><rect x="6" y="6" width="4" height="4" rx="1"/><rect x="11" y="6" width="4" height="4" rx="1"/><rect x="1" y="11" width="4" height="4" rx="1"/><rect x="6" y="11" width="4" height="4" rx="1"/><rect x="11" y="11" width="4" height="4" rx="1"/></svg>',
  share: '<svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M27 18v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9M16 3v19M9 10l7-7 7 7"/></svg>',
  x: '<svg viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 6 20 20M26 6 6 26"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17 19 7"/></svg>',
  // categorias
  all: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/></svg>',
  beds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M2 19v-6h9v6M2 16h9M13 19v-6h9v6M13 16h9M4 13v-2.5h5V13M15 13v-2.5h5V13"/></svg>',
  apt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 21V3h10v18M15 9h4v12M3 21h18M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1"/></svg>',
  house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 11 12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6"/></svg>',
  studio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 13h8V8M15 9h3"/></svg>',
  // destaques
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  dot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
};

const AMENITIES = {
  'Wi-Fi': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/></svg>',
  'Cozinha': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M8 6h.01M12 6h.01"/><circle cx="12" cy="15" r="3"/></svg>',
  'Máquina de lavar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M8 5.5h.01M11 5.5h3"/></svg>',
  'Secadora': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M10 13a2 2 0 0 1 4 0"/></svg>',
  'Aquecimento': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M12 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M16 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M4 21h16"/></svg>',
  'Escrivaninha': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9h18M5 9v11M19 9v11M14 9v6h5"/><path d="M8 9V5h5v4"/></svg>',
  'Guarda-roupa': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="2" width="16" height="19" rx="1.5"/><path d="M12 2v19M10 11h.01M14 11h.01M6 21v1.5M18 21v1.5"/></svg>',
  'Banheiro privativo': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6zM6 12V5a2 2 0 0 1 4 0M8 20l-1 2M16 20l1 2"/></svg>',
  'Estacionamento': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/></svg>',
  'Jardim': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 22v-8M12 14c-4 0-6-3-6-7 4 0 6 3 6 7zM12 14c4 0 6-3 6-7-4 0-6 3-6 7zM5 22h14"/></svg>',
  'Ônibus perto': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v2.5M16 18v2.5M8 14.5h.01M16 14.5h.01"/></svg>',
  'Contas incluídas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2zM9 7h6M9 11h6M9 15h4"/></svg>',
  'Mobiliado': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2zM5 18v2M19 18v2"/></svg>',
  'Limpeza das áreas comuns': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M14 3 10 13M7 13h7l2 8H5zM9 17v4M12 17v4"/></svg>',
  'Smart TV': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  'Micro-ondas': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="5" width="20" height="14" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><path d="M18 9h.01M18 12h.01"/></svg>',
};
const TYPES = [
  { k: 'Todos', icon: 'all' },
  { k: 'Quarto privativo', icon: 'bed' },
  { k: 'Quarto compartilhado', icon: 'beds' },
  { k: 'Estúdio', icon: 'studio' },
  { k: 'Apartamento', icon: 'apt' },
  { k: 'Casa', icon: 'house' },
];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Idiomas (PT · EN · ES) ----------
const LANGS = { pt: 'PT', en: 'EN', es: 'ES' };
const LOCALE = { pt: 'pt-BR', en: 'en-IE', es: 'es-ES' };
const LANG = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  if (q && LANGS[q]) { try { localStorage.setItem('dnl-lang', q); } catch {} return q; }
  try { const s = localStorage.getItem('dnl-lang'); if (s && LANGS[s]) return s; } catch {}
  const n = (navigator.languages || [navigator.language || 'en']).map((x) => String(x).slice(0, 2).toLowerCase());
  return n.find((x) => LANGS[x]) || 'en';
})();
document.documentElement.lang = { pt: 'pt-BR', en: 'en', es: 'es' }[LANG];

const DICT = {
  where: ['Onde', 'Where', 'Dónde'], searchPh: ['Buscar bairro ou endereço', 'Search area or address', 'Buscar zona o dirección'],
  maxPrice: ['Preço máximo', 'Max price', 'Precio máximo'], anyPrice: ['Qualquer valor', 'Any price', 'Cualquier precio'],
  moveIn: ['Mudança', 'Move-in', 'Mudanza'], anyDate: ['Qualquer data', 'Any date', 'Cualquier fecha'],
  now: ['Agora', 'Now', 'Ahora'], next30: ['Próximos 30 dias', 'Next 30 days', 'Próximos 30 días'], next90: ['Próximos 3 meses', 'Next 3 months', 'Próximos 3 meses'],
  search: ['Buscar', 'Search', 'Buscar'], seeSpaces: ['Ver espaços', 'See rooms', 'Ver habitaciones'],
  ireland: ['Irlanda', 'Ireland', 'Irlanda'], seeAll: ['Ver todos os espaços', 'See all rooms', 'Ver todas las habitaciones'],
  all: ['Todos', 'All', 'Todos'], typeIn: ['{type} em {area}', '{type} in {area}', '{type} en {area}'],
  availNow: ['Disponível agora', 'Available now', 'Disponible ahora'], availFrom: ['Disponível a partir de {d}', 'Available from {d}', 'Disponible desde el {d}'],
  rentedLine: ['Já foi alugado', 'Already rented', 'Ya alquilada'], rented: ['Alugado', 'Rented', 'Alquilada'], isNew: ['Novo', 'New', 'Nuevo'],
  month: ['mês', 'month', 'mes'], billsInc: ['contas inclusas', 'bills included', 'gastos incluidos'], plusBills: ['+ contas', '+ bills', '+ gastos'],
  noneFound: ['Nenhum espaço encontrado', 'No rooms found', 'No se encontraron habitaciones'],
  tryFilters: ['Tente mudar os filtros ou remover alguns deles.', 'Try changing or removing some filters.', 'Prueba a cambiar o quitar algunos filtros.'],
  soon: ['Em breve, novos espaços', 'New rooms coming soon', 'Pronto, nuevas habitaciones'],
  preparing: ['Estamos preparando os anúncios. Volte em breve.', 'We are preparing the listings. Check back soon.', 'Estamos preparando los anuncios. Vuelve pronto.'],
  loadFail: ['Não foi possível carregar', 'Could not load', 'No se pudo cargar'], refresh: ['Atualize a página.', 'Please refresh the page.', 'Actualiza la página.'],
  favSaved: ['Salvo nos favoritos', 'Saved to favourites', 'Guardado en favoritos'], favRemoved: ['Removido dos favoritos', 'Removed from favourites', 'Eliminado de favoritos'],
  fav: ['Favoritar', 'Save', 'Guardar'], prev: ['Anterior', 'Previous', 'Anterior'], next: ['Próxima', 'Next', 'Siguiente'],
  share: ['Compartilhar', 'Share', 'Compartir'], save: ['Salvar', 'Save', 'Guardar'], linkCopied: ['Link copiado', 'Link copied', 'Enlace copiado'],
  showAll: ['Mostrar todas as fotos', 'Show all photos', 'Mostrar todas las fotos'], photo: ['Foto', 'Photo', 'Foto'], close: ['Fechar', 'Close', 'Cerrar'],
  hlRoom: ['Seu quarto com áreas comuns compartilhadas.', 'Your own room with shared common areas.', 'Tu propia habitación con zonas comunes compartidas.'],
  hlWhole: ['O espaço inteiro só para você.', 'The whole place just for you.', 'Todo el espacio solo para ti.'],
  minContract: ['Contrato mínimo de {m}.', 'Minimum contract of {m}.', 'Contrato mínimo de {m}.'], flexContract: ['Contrato flexível.', 'Flexible contract.', 'Contrato flexible.'],
  billsIncT: ['Contas incluídas', 'Bills included', 'Gastos incluidos'], billsIncD: ['Luz, gás e internet já estão no valor do aluguel.', 'Electricity, gas and internet are included in the rent.', 'Luz, gas e internet ya están incluidos en el alquiler.'],
  billsSepT: ['Contas à parte', 'Bills not included', 'Gastos aparte'], billsSepD: ['As contas são divididas entre os moradores.', 'Bills are split between housemates.', 'Los gastos se reparten entre los compañeros de casa.'],
  about: ['Sobre este espaço', 'About this place', 'Sobre este espacio'], offers: ['O que este lugar oferece', 'What this place offers', 'Qué ofrece este lugar'],
  rules: ['Regras da casa', 'House rules', 'Normas de la casa'], whereLive: ['Onde você vai morar', "Where you'll live", 'Dónde vivirás'],
  openMaps: ['Abrir no Google Maps', 'Open in Google Maps', 'Abrir en Google Maps'],
  book: ['Agendar visita', 'Book a viewing', 'Reservar una visita'], seeAvail: ['Ver disponíveis', 'See available', 'Ver disponibles'],
  rentedTitle: ['Este quarto já foi alugado', 'This room has been rented', 'Esta habitación ya está alquilada'],
  rentedSub: ['Temos outros quartos disponíveis esperando por você.', 'We have other rooms available for you.', 'Tenemos otras habitaciones disponibles para ti.'],
  seeAvailRooms: ['Ver quartos disponíveis', 'See available rooms', 'Ver habitaciones disponibles'],
  noSlots: ['No momento não há horários livres para visita.<br>Fale com a gente pelo WhatsApp para combinar outro dia.', 'There are no viewing slots available right now.<br>Message us on WhatsApp to arrange another day.', 'Ahora mismo no hay horarios libres para visitas.<br>Escríbenos por WhatsApp para acordar otro día.'],
  date: ['Data da visita', 'Viewing date', 'Fecha de la visita'], peopleL: ['Pessoas', 'People', 'Personas'], time: ['Horário', 'Time', 'Hora'],
  name: ['Nome completo', 'Full name', 'Nombre completo'], email: ['E-mail', 'Email', 'Correo electrónico'], phone: ['Telefone / WhatsApp', 'Phone / WhatsApp', 'Teléfono / WhatsApp'],
  msg: ['Mensagem (opcional)', 'Message (optional)', 'Mensaje (opcional)'], msgPh: ['Conte um pouco sobre você', 'Tell us a bit about yourself', 'Cuéntanos un poco sobre ti'],
  free: ['Visita gratuita e sem compromisso', 'Free viewing, no commitment', 'Visita gratuita y sin compromiso'],
  fillReq: ['Preencha nome, e-mail e telefone.', 'Please fill in your name, email and phone.', 'Rellena tu nombre, correo y teléfono.'],
  checkEmail: ['Confira o e-mail.', 'Please check the email address.', 'Revisa el correo electrónico.'], sending: ['Enviando…', 'Sending…', 'Enviando…'],
  sentTitle: ['Pedido enviado!', 'Request sent!', '¡Solicitud enviada!'],
  sentBody: ['Recebemos seu pedido de visita para {when} às {time}. Vamos confirmar pelo WhatsApp ou e-mail.', "We've received your viewing request for {when} at {time}. We'll confirm by WhatsApp or email.", 'Hemos recibido tu solicitud de visita para el {when} a las {time}. Te confirmaremos por WhatsApp o correo.'],
  slotTaken: ['Esse horário não está mais disponível. Escolha outro, por favor.', 'That time is no longer available. Please choose another one.', 'Ese horario ya no está disponible. Elige otro, por favor.'],
  genericErr: ['Não foi possível enviar. Tente de novo.', 'Could not send. Please try again.', 'No se pudo enviar. Inténtalo de nuevo.'],
  notFound: ['Anúncio não encontrado', 'Listing not found', 'Anuncio no encontrado'], removed: ['Ele pode ter sido removido.', 'It may have been removed.', 'Puede que se haya eliminado.'],
  language: ['Idioma', 'Language', 'Idioma'],
  sharedBath: ['Banheiro compartilhado', 'Shared bathroom', 'Baño compartido'],
  waChat: ['Chamar no WhatsApp', 'Chat on WhatsApp', 'Escribir por WhatsApp'],
  waMsg: ['Olá! Tenho interesse no anúncio "{title}": {url}', 'Hi! I\'m interested in the listing "{title}": {url}', '¡Hola! Me interesa el anuncio "{title}": {url}'],
};
// WhatsApp da DNL (botão nos anúncios)
const WA_NUMBER = '353834794791';
const waLink = (title) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t('waMsg', { title, url: location.origin + location.pathname }))}`;
const LI = { pt: 0, en: 1, es: 2 }[LANG];
const t = (k, v = {}) => String((DICT[k] || [k])[LI] ?? DICT[k][0]).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
const WORDS = {
  person: [['pessoa', 'pessoas'], ['person', 'people'], ['persona', 'personas']],
  bedroom: [['quarto', 'quartos'], ['bedroom', 'bedrooms'], ['habitación', 'habitaciones']],
  bathroom: [['banheiro', 'banheiros'], ['bathroom', 'bathrooms'], ['baño', 'baños']],
  privBath: [['banheiro privativo', 'banheiros privativos'], ['private bathroom', 'private bathrooms'], ['baño privado', 'baños privados']],
  month: [['mês', 'meses'], ['month', 'months'], ['mes', 'meses']],
};
const pl = (n, w) => `${n} ${WORDS[w][LI][n == 1 ? 0 : 1]}`;
const TYPE_T = { 'Quarto privativo': ['Quarto privativo', 'Private room', 'Habitación privada'], 'Quarto compartilhado': ['Quarto compartilhado', 'Shared room', 'Habitación compartida'], 'Estúdio': ['Estúdio', 'Studio', 'Estudio'], 'Apartamento': ['Apartamento', 'Apartment', 'Apartamento'], 'Casa': ['Casa', 'House', 'Casa'], 'Todos': ['Todos', 'All', 'Todos'] };
const AMEN_T = { 'Wi-Fi': ['Wi-Fi', 'Wi-Fi', 'Wi-Fi'], 'Cozinha': ['Cozinha', 'Kitchen', 'Cocina'], 'Máquina de lavar': ['Máquina de lavar', 'Washing machine', 'Lavadora'], 'Secadora': ['Secadora', 'Dryer', 'Secadora'], 'Aquecimento': ['Aquecimento', 'Heating', 'Calefacción'], 'Escrivaninha': ['Escrivaninha', 'Desk', 'Escritorio'], 'Guarda-roupa': ['Guarda-roupa', 'Wardrobe', 'Armario'], 'Banheiro privativo': ['Banheiro privativo', 'Private bathroom', 'Baño privado'], 'Estacionamento': ['Estacionamento', 'Parking', 'Aparcamiento'], 'Jardim': ['Jardim', 'Garden', 'Jardín'], 'Ônibus perto': ['Ônibus perto', 'Bus nearby', 'Autobús cerca'], 'Contas incluídas': ['Contas incluídas', 'Bills included', 'Gastos incluidos'], 'Mobiliado': ['Mobiliado', 'Furnished', 'Amueblado'], 'Limpeza das áreas comuns': ['Limpeza das áreas comuns', 'Common areas cleaned', 'Limpieza de zonas comunes'], 'Smart TV': ['Smart TV', 'Smart TV', 'Smart TV'], 'Micro-ondas': ['Micro-ondas', 'Microwave', 'Microondas'] };
const tType = (k) => (TYPE_T[k] || [k])[LI] || k;
const tAmen = (k) => (AMEN_T[k] || [k])[LI] || k;
// Texto do anúncio no idioma escolhido (cai para o português se não houver tradução)
const lt = (l, f) => (l.i18n && l.i18n[LANG] && String(l.i18n[LANG][f] || '').trim()) || l[f] || '';
const withLang = (url) => url + (url.includes('?') ? '&' : '?') + 'lang=' + LANG;

const eur = (n) => '€' + Number(n || 0).toLocaleString(LOCALE[LANG]);
const dShort = (iso, o = { day: 'numeric', month: 'short' }) => new Date(iso + 'T12:00:00').toLocaleDateString(LOCALE[LANG], o).replace(/ de /g, ' ').replace(/\./g, '');
const fmtDate = (iso) => (iso ? dShort(iso, { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const availText = (iso) => {
  if (!iso) return t('availNow');
  return new Date(iso + 'T12:00:00') <= new Date() ? t('availNow') : t('availFrom', { d: dShort(iso) });
};
const plural = (n, a, b) => `${n} ${n == 1 ? a : b}`;

const LOGO = `<img src="/img/dnl-icon.svg" alt="" width="40" height="40">`;

async function api(url, opts = {}) {
  const r = await fetch(url, { headers: opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}, ...opts,
    body: opts.body && !(opts.body instanceof FormData) ? JSON.stringify(opts.body) : opts.body });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'Erro'), { status: r.status });
  return j;
}

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show');
  clearTimeout(el._h); el._h = setTimeout(() => el.classList.remove('show'), 2600);
}

// Favoritos no navegador
const favs = {
  get() { try { return JSON.parse(localStorage.getItem('dnl-favs') || '[]'); } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const f = this.get(); const i = f.indexOf(id);
    i >= 0 ? f.splice(i, 1) : f.push(id);
    try { localStorage.setItem('dnl-favs', JSON.stringify(f)); } catch {}
    return i < 0;
  },
};

function setLang(l) {
  try { localStorage.setItem('dnl-lang', l); } catch {}
  const u = new URL(location.href); u.searchParams.set('lang', l); location.href = u.toString();
}
const langSwitch = () => `<div class="lang" role="group" aria-label="${t('language')}">${Object.entries(LANGS).map(([k, v]) =>
  `<button type="button" class="${k === LANG ? 'on' : ''}" onclick="setLang('${k}')" aria-pressed="${k === LANG}">${v}</button>`).join('')}</div>`;

function headerHTML({ search = false } = {}) {
  return `
  <header class="header"><div class="wrap">
    <a class="logo" href="${withLang('/')}" aria-label="DNL Management">${LOGO}<span>DNL Management</span></a>
    ${search ? `
    <form class="search" id="search" onsubmit="return false">
      <div class="seg" style="flex:1.4"><label for="q">${t('where')}</label><input id="q" placeholder="${t('searchPh')}" autocomplete="off"></div>
      <div class="seg" style="flex:1"><label for="qmax">${t('maxPrice')}</label><select id="qmax"><option value="">${t('anyPrice')}</option><option value="600">€600</option><option value="800">€800</option><option value="1000">€1.000</option><option value="1500">€1.500</option><option value="2000">€2.000</option></select></div>
      <div class="seg" style="flex:1"><label for="qwhen">${t('moveIn')}</label><select id="qwhen"><option value="">${t('anyDate')}</option><option value="0">${t('now')}</option><option value="30">${t('next30')}</option><option value="90">${t('next90')}</option></select></div>
      <button class="go" aria-label="${t('search')}">${I.search.replace('<svg', '<svg width="16" height="16"')}</button>
    </form>` : ''}
    <div class="header-right">
      <a class="pill-link" href="${withLang('/')}#anuncios">${t('seeSpaces')}</a>
      ${langSwitch()}
    </div>
  </div></header>`;
}
function footerHTML() {
  return `<footer class="footer"><div class="wrap">
    <div>© ${new Date().getFullYear()} DNL Management · Cork, ${t('ireland')}</div>
    <div style="display:flex;gap:16px;align-items:center"><a href="${withLang('/')}">${t('seeAll')}</a>${langSwitch()}</div>
  </div></footer>`;
}
