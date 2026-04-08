// ===== LANGUAGE STATE =====
let currentLang = 'zh';

// ===== GAME STATE =====
const state = {
  completed: new Set(),
  xp: 0,
  totalLevels: 6
};

const XP_PER_LEVEL = [150, 200, 200, 150, 200, 300];

const LEVEL_MSGS = {
  zh: [
    ['🎮 WorkBuddy 掌握！', '你知道怎么使用 AI 工具了！'],
    ['🔍 项目分析完成！', '你会像工程师一样分析需求了！'],
    ['⚡ 交互级别选定！', '你知道做什么类型的网站了！'],
    ['📁 文件管理通关！', '你的项目文件夹会超级整洁！'],
    ['🌐 发布技能解锁！', '你可以把网站发布给全世界了！'],
    ['🚀 完整项目启动！', '恭喜！你已经是 AI 项目设计师了！']
  ],
  en: [
    ['🎮 WorkBuddy Mastered!', 'You know how to use your AI tool!'],
    ['🔍 Project Analysis Done!', 'You can analyze requirements like an engineer!'],
    ['⚡ Interaction Level Set!', 'You know what type of site to build!'],
    ['📁 File Management Complete!', 'Your project folder will be super organized!'],
    ['🌐 Publishing Skills Unlocked!', 'You can launch a website for the world to see!'],
    ['🚀 Full Project Launched!', 'Congrats! You are now an AI Project Designer!']
  ]
};

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  generateStars();
  updateHUD();
  updatePathProgress();
  animateOnScroll();
  applyLang('zh');
});

// ===== LANGUAGE TOGGLE =====
function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  applyLang(currentLang);
}

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);

  // Update all elements with data-zh / data-en
  document.querySelectorAll('[data-zh]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;

    // For inputs / buttons that show text as value
    if (el.tagName === 'INPUT' && el.type === 'submit') {
      el.value = text;
    } else if (el.tagName === 'BUTTON' || el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'H4' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'STRONG' || el.tagName === 'DIV' || el.tagName === 'LABEL') {
      // Only update if the element doesn't contain other data-zh elements (prevent overwriting children)
      const hasChildrenWithData = el.querySelector('[data-zh]');
      if (!hasChildrenWithData) {
        el.innerHTML = text;
      }
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // Update lang button label
  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'zh' ? 'EN' : '中文';

  // Update HUD label
  updateHUD();

  // Update title
  const titleEl = document.querySelector('title');
  if (titleEl) {
    titleEl.textContent = lang === 'zh' ? 'AI 项目任务簿 · 无人机送货系统' : 'AI Project Quest · Drone Delivery';
  }

  // Update placeholders
  const placeholders = {
    zh: {
      bProjectName: 'DFW 无人机配送追踪网站',
      bOrgName: 'Walmart DroneExpress DFW 团队',
      bAudience: 'DFW 地区 Walmart 顾客，18-45岁，手机为主',
      bColor: 'Walmart 蓝 #0071CE + 黄色 #FFC220',
      bRef: '例：https://xxx.com 我喜欢这个地图风格',
      bExtra: '例：需要支持中英文切换；地图要显示 DFW 机场周边30英里范围...',
      np1Name: '例：学校篮球俱乐部官网 / 社区宠物领养平台',
      np1Problem: '例：让同学们更容易找到篮球训练时间表和场地预约',
      np2Users: '例：10-18岁青少年，学校同学，家长',
      np2Goal1: '第一件事',
      np2Goal2: '第二件事',
      np2Goal3: '第三件事（可选）',
      np4Notes: '例：需要中英文双语；参考某个网站的风格...',
    },
    en: {
      bProjectName: 'DFW Drone Delivery Tracking Site',
      bOrgName: 'Walmart DroneExpress DFW Team',
      bAudience: 'DFW-area Walmart customers, ages 18-45, primarily mobile',
      bColor: 'Walmart Blue #0071CE + Yellow #FFC220',
      bRef: 'e.g. https://xxx.com — I like this map style',
      bExtra: 'e.g. support bilingual (EN/CN); show 30-mile radius around DFW airport...',
      np1Name: 'e.g. School Basketball Club Site / Community Pet Adoption Platform',
      np1Problem: 'e.g. Help students easily find basketball practice schedules and book courts',
      np2Users: 'e.g. Teens ages 10-18, classmates, parents',
      np2Goal1: 'Goal #1',
      np2Goal2: 'Goal #2',
      np2Goal3: 'Goal #3 (optional)',
      np4Notes: 'e.g. bilingual support needed; budget limited to free tools...',
    }
  };

  const ph = placeholders[lang];
  Object.entries(ph).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = text;
  });
}

// ===== STARS =====
function generateStars() {
  const container = document.getElementById('starsBg');
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --dur:${2 + Math.random()*4}s;
      --delay:${Math.random()*4}s;
      --min-op:${0.05 + Math.random()*0.1};
      --max-op:${0.3 + Math.random()*0.5};
    `;
    container.appendChild(star);
  }
}

function scrollToMap() {
  document.getElementById('missionMap').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== LEVEL INTERACTION =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
  @keyframes xp-pop {0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
  .xp-pop { animation: xp-pop 0.4s ease !important; }
`;
document.head.appendChild(shakeStyle);

function openLevel(num) {
  const node = document.getElementById('node' + num);
  if (node.classList.contains('locked')) {
    node.style.animation = 'shake 0.4s ease';
    setTimeout(() => node.style.animation = '', 500);
    return;
  }
  const card = document.getElementById('card' + num);
  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function completeLevel(num) {
  if (state.completed.has(num)) {
    if (num < 6) scrollToCard(num + 1);
    return;
  }
  state.completed.add(num);
  state.xp += XP_PER_LEVEL[num - 1];

  const node = document.getElementById('node' + num);
  node.classList.remove('unlocked', 'locked', 'boss-node');
  node.classList.add('completed');
  node.innerHTML = `<div class="node-icon">✅</div>`;

  if (num < 6) {
    const nextNode = document.getElementById('node' + (num + 1));
    nextNode.classList.remove('locked');
    nextNode.classList.add('unlocked');
    if (num + 1 === 6) nextNode.classList.add('boss-node');
    const nextCard = document.getElementById('card' + (num + 1));
    nextCard.classList.remove('locked-card');
  }

  showModal(num);
  updateHUD();
  updatePathProgress();

  if (state.completed.size === 6) {
    setTimeout(() => {
      const cert = document.getElementById('completionCert');
      if (cert) {
        cert.style.display = 'block';
        cert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1000);
  }
}

function scrollToCard(num) {
  const card = document.getElementById('card' + num);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== MODAL =====
function showModal(num) {
  const modal = document.getElementById('completeModal');
  const msgs = LEVEL_MSGS[currentLang][num - 1];
  const xp = XP_PER_LEVEL[num - 1];

  document.getElementById('modalTitle').textContent = msgs[0];
  document.getElementById('modalSubtitle').textContent = msgs[1];
  document.getElementById('modalXP').textContent = `+${xp} ⭐ XP`;
  modal.dataset.level = num;
  modal.classList.add('active');
  createConfetti();
}

function closeModal() {
  const modal = document.getElementById('completeModal');
  const num = parseInt(modal.dataset.level);
  modal.classList.remove('active');
  if (num < 6) setTimeout(() => scrollToCard(num + 1), 300);
}

// ===== CONFETTI =====
function createConfetti() {
  const colors = ['#3fb950', '#58a6ff', '#bc8cff', '#f78166', '#e3b341', '#ff6b9d'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.style.cssText = `
      position:fixed; z-index:999; pointer-events:none;
      width:${4 + Math.random()*10}px; height:${4 + Math.random()*10}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?'50%':'3px'};
      left:${15 + Math.random()*70}%; top:30%;
      animation: confetti-fall ${1.2 + Math.random()*1.5}s ease forwards;
      animation-delay:${Math.random()*0.6}s;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
  const cfStyle = document.createElement('style');
  cfStyle.textContent = `@keyframes confetti-fall {0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(${window.innerHeight * 0.7}px) rotate(${360+Math.random()*720}deg);opacity:0}}`;
  document.head.appendChild(cfStyle);
}

// ===== HUD =====
function updateHUD() {
  const count = state.completed.size;
  const pct = (count / state.totalLevels) * 100;
  document.getElementById('globalFill').style.width = pct + '%';
  const label = currentLang === 'zh' ? `任务进度 ${count} / ${state.totalLevels}` : `Progress ${count} / ${state.totalLevels}`;
  document.getElementById('globalLabel').textContent = label;
  const xpBadge = document.getElementById('xpBadge');
  xpBadge.textContent = `⭐ ${state.xp} XP`;
  xpBadge.classList.add('xp-pop');
  setTimeout(() => xpBadge.classList.remove('xp-pop'), 400);
}

function updatePathProgress() {
  const pct = state.completed.size / state.totalLevels;
  const path = document.getElementById('progressPath');
  if (path) {
    const totalLength = 1200;
    path.style.transition = 'stroke-dashoffset 1s ease';
    path.setAttribute('stroke-dashoffset', totalLength - totalLength * pct);
  }
}

// ===== CHECKLIST =====
function checkProgress(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const checks = container.querySelectorAll('input[type="checkbox"]');
  const checked = Array.from(checks).filter(c => c.checked).length;
  if (checked === checks.length) {
    const btn = container.closest('.card-body').querySelector('.complete-btn');
    if (btn) {
      btn.style.animation = 'pulse-node 1s ease 3';
      setTimeout(() => btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 500);
    }
  }
}

function selectLevel(el, num) {
  document.querySelectorAll('.lsel-card').forEach(c => c.classList.remove('selected-level'));
  el.classList.add('selected-level');
}

function selectBriefLevel(el) {
  document.querySelectorAll('.blevel').forEach(b => b.classList.remove('selected-blevel'));
  el.classList.add('selected-blevel');
}

// ===== GENERATE MISSION BRIEF =====
function generateMission() {
  const projectName = document.getElementById('bProjectName').value.trim() || (currentLang === 'zh' ? 'DFW 无人机配送追踪网站' : 'DFW Drone Delivery Tracking Site');
  const orgName = document.getElementById('bOrgName').value.trim() || 'Walmart DroneExpress';
  const lang = document.getElementById('bLang').value;
  const audience = document.getElementById('bAudience').value.trim() || (currentLang === 'zh' ? 'DFW 地区顾客，手机为主' : 'DFW-area customers, mobile-first');
  const color = document.getElementById('bColor').value.trim() || 'Walmart Blue #0071CE';
  const ref = document.getElementById('bRef').value.trim();
  const extra = document.getElementById('bExtra').value.trim();
  const level = document.querySelector('input[name="blevel"]:checked')?.value || 'Level 3';
  const goals = Array.from(document.querySelectorAll('.bcheck input:checked')).map(c => c.value);

  let prompt;
  if (currentLang === 'zh') {
    prompt = `# 🚁 项目任务简报 — ${projectName}

## 📋 项目信息
- **项目名称**：${projectName}
- **团队/组织**：${orgName}
- **界面语言**：${lang}

## 👥 用户与目标
- **目标用户**：${audience}
- **用户核心操作**：
${goals.length > 0 ? goals.map(g => `  - ${g}`).join('\n') : '  - 了解服务信息'}

## ⚡ 技术规格
- **交互级别**：${level}
- **品牌色彩**：${color}
${ref ? `- **参考网站**：${ref}` : ''}

## 🎨 设计要求
- 响应式设计，手机优先
- 科技感、现代感的 UI
- 配合无人机送货的视觉主题
${extra ? `- ${extra}` : ''}

## 🛠️ 请帮我：
1. 规划完整页面结构和各版块内容
2. 构建 HTML + CSS + JavaScript 完整代码
3. ${level.includes('3') || level.includes('4') ? '集成 Leaflet.js 动态地图，显示配送区域和模拟无人机飞行路径' : '创建配送区域展示版块'}
4. 添加订单状态进度条（已接单 → 起飞 → 飞行中 → 即将到达 → 已送达）
5. 优化移动端体验
6. 告诉我还需要准备哪些图片和素材

立即开始构建！🚀`;
  } else {
    prompt = `# 🚁 Project Mission Brief — ${projectName}

## 📋 Project Info
- **Project Name**: ${projectName}
- **Team/Organization**: ${orgName}
- **Website Language**: ${lang}

## 👥 Users & Goals
- **Target Users**: ${audience}
- **Core User Actions**:
${goals.length > 0 ? goals.map(g => `  - ${g}`).join('\n') : '  - Learn about the service'}

## ⚡ Technical Specs
- **Interaction Level**: ${level}
- **Brand Colors**: ${color}
${ref ? `- **Reference Site**: ${ref}` : ''}

## 🎨 Design Requirements
- Responsive design, mobile-first
- Tech-forward, modern UI
- Drone delivery visual theme
${extra ? `- ${extra}` : ''}

## 🛠️ Please help me:
1. Plan the full page structure and content sections
2. Build complete HTML + CSS + JavaScript code
3. ${level.includes('3') || level.includes('4') ? 'Integrate Leaflet.js dynamic map showing delivery zone and simulated drone flight path' : 'Create a delivery zone display section'}
4. Add order status progress bar (Received → Taking off → In-flight → Almost there → Delivered)
5. Optimize mobile experience
6. Tell me what images and assets I still need to prepare

Start building now! 🚀`;
  }

  const outputBox = document.getElementById('missionOutput');
  outputBox.innerHTML = `<div class="output-text">${escapeHtml(prompt)}</div>`;
  const copyBtn = document.getElementById('copyMissionBtn');
  copyBtn.style.display = 'block';
  copyBtn.textContent = currentLang === 'zh' ? '📋 复制指令，去 WorkBuddy 粘贴！' : '📋 Copy brief and paste into WorkBuddy!';
  outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function copyMission() {
  const text = document.getElementById('missionOutput').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyMissionBtn');
    const orig = btn.textContent;
    btn.textContent = currentLang === 'zh' ? '✅ 复制成功！去 WorkBuddy 粘贴吧！' : '✅ Copied! Paste into WorkBuddy!';
    btn.style.background = 'rgba(63,185,80,.15)';
    btn.style.borderColor = 'rgba(63,185,80,.4)';
    btn.style.color = '#3fb950';
    setTimeout(() => { btn.textContent = orig; btn.style = ''; btn.style.display = 'block'; }, 3000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = document.getElementById('missionOutput').textContent;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  });
}

// ===== SHOW NEW PROJECT SECTION =====
function showNewProject() {
  const section = document.getElementById('newProjectSection');
  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Reset to step 1
  npGoToStep(1);
}

// ===== NEW PROJECT PLANNER =====
let npCurrentStep = 1;
let selectedTypes = [];
let selectedStyles = [];

function npNext(currentStep) {
  if (currentStep === 4) {
    generateNpPlan();
  }
  npGoToStep(currentStep + 1);
}

function npBack(currentStep) {
  npGoToStep(currentStep - 1);
}

function npGoToStep(step) {
  npCurrentStep = step;
  // Hide all steps
  document.querySelectorAll('.np-step-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.np-step-dot').forEach(d => d.classList.remove('active', 'done'));

  // Show current
  const currentCard = document.getElementById('npStep' + step);
  if (currentCard) currentCard.classList.add('active');

  // Update step nav
  document.querySelectorAll('.np-step-dot').forEach(dot => {
    const dotStep = parseInt(dot.dataset.step);
    if (dotStep < step) dot.classList.add('done');
    else if (dotStep === step) dot.classList.add('active');
  });

  // Scroll to top of section
  document.getElementById('newProjectSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleType(el) {
  el.classList.toggle('selected');
  const val = el.getAttribute('data-zh');
  const idx = selectedTypes.indexOf(val);
  if (idx > -1) selectedTypes.splice(idx, 1);
  else selectedTypes.push(val);
  document.getElementById('np1Type').value = selectedTypes.join(', ');
}

function toggleStyle(el) {
  el.classList.toggle('selected');
  const val = el.getAttribute('data-zh');
  const idx = selectedStyles.indexOf(val);
  if (idx > -1) selectedStyles.splice(idx, 1);
  else selectedStyles.push(val);
  document.getElementById('np3Style').value = selectedStyles.join(', ');
}

function selectNpLevel(el, num) {
  document.querySelectorAll('.np-level-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('np3Level').value = num;
}

function selectTimeline(el) {
  document.querySelectorAll('.np-tl-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  const val = el.getAttribute('data-' + currentLang) || el.textContent.trim();
  document.getElementById('np4Timeline').value = val;
}

// ===== GENERATE NP PLAN =====
function generateNpPlan() {
  const name = document.getElementById('np1Name').value.trim() || (currentLang === 'zh' ? '我的新项目' : 'My New Project');
  const problem = document.getElementById('np1Problem').value.trim();
  const type = selectedTypes.join(currentLang === 'zh' ? '、' : ' / ') || (currentLang === 'zh' ? '未分类' : 'General');
  const style = selectedStyles.join(currentLang === 'zh' ? '、' : ' / ') || (currentLang === 'zh' ? '现代感' : 'Modern');
  const users = document.getElementById('np2Users').value.trim() || (currentLang === 'zh' ? '目标用户' : 'Target users');
  const device = document.querySelector('input[name="np2device"]:checked')?.value || (currentLang === 'zh' ? '手机为主' : 'Mobile first');
  const goal1 = document.getElementById('np2Goal1').value.trim();
  const goal2 = document.getElementById('np2Goal2').value.trim();
  const goal3 = document.getElementById('np2Goal3').value.trim();
  const level = document.getElementById('np3Level').value || '3';
  const levelLabels = { zh: { '1': 'Level 1 静态展示', '2': 'Level 2 表单交互', '3': 'Level 3 动态交互', '4': 'Level 4 数据驱动' }, en: { '1': 'Level 1 Static Display', '2': 'Level 2 Forms', '3': 'Level 3 Dynamic/Maps', '4': 'Level 4 Database' } };
  const levelLabel = levelLabels[currentLang][level];
  const features = Array.from(document.querySelectorAll('.np-feature-grid input:checked')).map(c => c.value);
  const timeline = document.getElementById('np4Timeline').value || (currentLang === 'zh' ? '2-4周' : '2-4 weeks');
  const publish = document.querySelector('input[name="np4publish"]:checked')?.value || 'GitHub Pages';
  const assets = Array.from(document.querySelectorAll('.np-feat-check-row input:checked')).map(c => c.value);
  const notes = document.getElementById('np4Notes').value.trim();

  let plan;
  const goals = [goal1, goal2, goal3].filter(Boolean);

  if (currentLang === 'zh') {
    plan = `# 🚀 新项目计划书 — ${name}

## 📋 项目概述
- **项目名称**：${name}
- **项目类型**：${type}
- **要解决的问题**：${problem || '提升用户体验，简化操作流程'}
- **设计风格**：${style}

## 👥 用户分析
- **目标用户**：${users}
- **主要访问设备**：${device}
- **用户核心需求**：
${goals.map(g => `  - ${g}`).join('\n') || '  - 获取信息\n  - 完成核心操作'}

## ⚡ 技术规格
- **交互级别**：${levelLabel}
- **核心功能模块**：${features.join('、') || '首页介绍、联系方式'}
- **现有素材**：${assets.join('、') || '待准备'}

## 📅 项目计划
- **完成时间**：${timeline}
- **发布方式**：${publish}
${notes ? `- **备注**：${notes}` : ''}

## 🛠️ 请 AI 帮我：
1. 根据以上信息规划完整的页面结构（页面数量、各页内容分区）
2. 构建完整的 HTML + CSS + JavaScript 代码
3. ${level >= '3' ? '实现动态交互效果（地图、动画、实时数据等）' : '创建清晰易用的界面布局'}
4. 响应式设计，确保手机和电脑都好用
5. 推荐还需要准备哪些图片/视频素材
6. 提供 GitHub Pages 发布步骤

请开始规划，先给我看整体结构设计！🎯`;
  } else {
    plan = `# 🚀 New Project Plan — ${name}

## 📋 Project Overview
- **Project Name**: ${name}
- **Project Type**: ${type}
- **Problem to Solve**: ${problem || 'Improve user experience and simplify key workflows'}
- **Design Style**: ${style}

## 👥 User Analysis
- **Target Users**: ${users}
- **Primary Device**: ${device}
- **Core User Needs**:
${goals.map(g => `  - ${g}`).join('\n') || '  - Access information\n  - Complete core actions'}

## ⚡ Technical Specs
- **Interaction Level**: ${levelLabel}
- **Core Feature Modules**: ${features.join(', ') || 'Homepage intro, contact info'}
- **Available Assets**: ${assets.join(', ') || 'To be prepared'}

## 📅 Project Timeline
- **Target Completion**: ${timeline}
- **Publishing Method**: ${publish}
${notes ? `- **Notes**: ${notes}` : ''}

## 🛠️ Please help me:
1. Plan the complete page structure based on the info above (pages, sections)
2. Build complete HTML + CSS + JavaScript code
3. ${level >= '3' ? 'Implement dynamic interactions (maps, animations, live data, etc.)' : 'Create a clean, user-friendly layout'}
4. Responsive design for both mobile and desktop
5. Recommend what images/video assets I still need to prepare
6. Provide GitHub Pages deployment steps

Start planning — show me the overall structure design first! 🎯`;
  }

  const preview = document.getElementById('npPlanPreview');
  preview.innerHTML = `<pre class="plan-output-text">${escapeHtml(plan)}</pre>`;
  preview.dataset.rawPlan = plan;
}

function copyNpPlan() {
  const plan = document.getElementById('npPlanPreview').dataset.rawPlan;
  if (!plan) {
    alert(currentLang === 'zh' ? '请先填写表单！' : 'Please fill in the form first!');
    return;
  }
  navigator.clipboard.writeText(plan).then(() => {
    const btn = document.getElementById('npCopyBtn');
    const orig = btn.textContent;
    btn.textContent = currentLang === 'zh' ? '✅ 已复制！去 WorkBuddy 粘贴开始！' : '✅ Copied! Go paste into WorkBuddy!';
    btn.style.background = 'rgba(63,185,80,.15)';
    setTimeout(() => { btn.textContent = orig; btn.style = ''; }, 3000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = plan;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  });
}

function restartNp() {
  // Reset all fields
  ['np1Name','np1Problem','np2Users','np2Goal1','np2Goal2','np2Goal3','np4Notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  selectedTypes = [];
  selectedStyles = [];
  document.querySelectorAll('.np-type-btn, .np-style-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.np-feature-grid input, .np-feat-check-row input').forEach(c => c.checked = false);
  npGoToStep(1);
}

// ===== SCROLL ANIMATIONS =====
function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.mini-card, .ui-feature-card, .chain-step, .lsel-card, .dsv-step, .cgc-item, .media-rule-card, .ftc-item').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
}
