const answer = document.querySelector('#answer');
const gradeResult = document.querySelector('#grade-result');
const role = document.querySelector('#role');
const seats = document.querySelector('#seats');
const inviteResult = document.querySelector('#invite-result');
const languageButtons = document.querySelectorAll('[data-language]');

const messages = {
  en: {
    title: 'Minh Ngọc · Business Analyst Portfolio',
    description: 'Đặng Thị Minh Ngọc’s portfolio of business analysis, functional testing and AI-assisted prototyping.',
    gradePrompt: 'Enter a number to check the grading rule.',
    gradeEmpty: 'Enter a number before submitting.',
    gradeAccepted: 'Accepted. The answer is within the allowed range.',
    gradeOutside: 'Outside the allowed range of 2.75–3.25.',
    inviteAllowed: 'Invitation allowed.',
    inviteRole: 'Blocked. Only owners can invite in this example.',
    inviteSeats: 'Blocked. There are no available seats.',
  },
  vi: {
    title: 'Minh Ngọc · Portfolio Business Analyst',
    description: 'Portfolio của Đặng Thị Minh Ngọc về phân tích nghiệp vụ, kiểm thử chức năng và dựng bản mẫu với AI.',
    gradePrompt: 'Nhập một số để thử quy tắc chấm điểm.',
    gradeEmpty: 'Hãy nhập một số trước khi kiểm tra.',
    gradeAccepted: 'Chấp nhận. Đáp án nằm trong khoảng cho phép.',
    gradeOutside: 'Đáp án nằm ngoài khoảng 2.75–3.25.',
    inviteAllowed: 'Có thể gửi lời mời.',
    inviteRole: 'Chỉ chủ không gian làm việc có quyền mời trong ví dụ này.',
    inviteSeats: 'Không thể mời vì đã hết chỗ.',
  },
};

const translatable = Array.from(
  document.querySelectorAll('[data-vi], [data-vi-alt], [data-vi-aria-label], [data-vi-placeholder]'),
).flatMap((node) => [
  node.hasAttribute('data-vi') && { node, en: node.textContent, vi: node.dataset.vi },
  ...['alt', 'aria-label', 'placeholder'].map((attr) => {
    const key = 'data-vi-' + attr;
    return node.hasAttribute(key) && { node, attr, en: node.getAttribute(attr), vi: node.getAttribute(key) };
  }),
].filter(Boolean));

let language = 'en';
let gradeStatus = 'gradePrompt';

function renderDemoMessages() {
  const copy = messages[language];
  gradeResult.textContent = copy[gradeStatus];
  if (role.value === 'member') {
    inviteResult.textContent = copy.inviteRole;
  } else {
    inviteResult.textContent = seats.value === '0' ? copy.inviteSeats : copy.inviteAllowed;
  }
}

function setLanguage(next) {
  language = next === 'vi' ? 'vi' : 'en';
  document.documentElement.lang = language;
  document.title = messages[language].title;
  document.querySelector('meta[name="description"]').content = messages[language].description;
  translatable.forEach((entry) => {
    if (entry.attr) {
      entry.node.setAttribute(entry.attr, entry[language]);
    } else {
      entry.node.textContent = entry[language];
    }
  });
  languageButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  renderDemoMessages();
}

let savedLanguage;
try {
  savedLanguage = localStorage.getItem('portfolio-language');
} catch {
  // Language still works when browser storage is unavailable.
}
setLanguage(new URLSearchParams(location.search).get('lang') || savedLanguage || 'en');

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.language);
    try {
      localStorage.setItem('portfolio-language', language);
    } catch {
      // The language remains active until the visitor reloads.
    }
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    }
  });
});

document.querySelector('#grade').addEventListener('submit', (event) => {
  event.preventDefault();
  const value = answer.valueAsNumber;
  if (answer.value === '') {
    gradeStatus = 'gradeEmpty';
  } else {
    gradeStatus = value >= 2.75 && value <= 3.25 ? 'gradeAccepted' : 'gradeOutside';
  }
  renderDemoMessages();
});
role.addEventListener('change', renderDemoMessages);
seats.addEventListener('change', renderDemoMessages);

document.querySelectorAll('.flashcard').forEach((card) => {
  const front = card.querySelector('.flash-front');
  const back = card.querySelector('.flash-back');
  const backButton = card.querySelector('.flash-return');
  function showBack(open) {
    front.hidden = open;
    front.setAttribute('aria-expanded', String(open));
    back.hidden = !open;
    (open ? backButton : front).focus({ preventScroll: true });
  }
  front.addEventListener('click', () => showBack(true));
  backButton.addEventListener('click', () => showBack(false));
  back.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') showBack(false);
  });
});
