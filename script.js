const DATA_URL = "/DemiseMatrix/data.json";

const teamsWrapper = document.getElementById('teams-wrapper');
const poolContainer = document.getElementById('pool-container');
const descriptionBox = document.getElementById('description-box');
const GROUP_NAME = 'shared-image-app';

const INITIAL_TEAMS = 5;
let currentTeamCount = 0;
let lastClickTime = 0;

const newTeamZone = document.createElement('div');
newTeamZone.id = 'new-team-dropzone';
newTeamZone.className = 'new-team-zone';
newTeamZone.innerHTML = '<span>＋ ドロップで追加</span>'; 
teamsWrapper.appendChild(newTeamZone);

const attrButtons = document.querySelectorAll('.attr-btn');
const filterRole = document.getElementById('filter-role');
const filterType = document.getElementById('filter-type');
const filterBuff = document.getElementById('filter-buff');
const sortRankToggle = document.getElementById('sort-rank-toggle');
const globalResetBtn = document.getElementById('global-reset-btn');

function sortPoolElements() {
  const currentOrder = sortRankToggle.dataset.order || 'asc';
  const cards = Array.from(poolContainer.querySelectorAll('.img-card'));

  cards.sort((a, b) => {
    const idA = a.dataset.id || "";
    const idB = b.dataset.id || "";
    if (currentOrder === 'asc') {
      return idB.localeCompare(idA);
    } else {
      return idA.localeCompare(idB);
    }
  });

  cards.forEach(card => poolContainer.appendChild(card));
}

const DATA_URL = "/DemiseMatrix/data.json";

const teamsWrapper = document.getElementById('teams-wrapper');
const poolContainer = document.getElementById('pool-container');
const descriptionBox = document.getElementById('description-box');
const GROUP_NAME = 'shared-image-app';

const INITIAL_TEAMS = 5;
let currentTeamCount = 0;
let lastClickTime = 0;

const newTeamZone = document.createElement('div');
newTeamZone.id = 'new-team-dropzone';
newTeamZone.className = 'new-team-zone';
newTeamZone.innerHTML = '<span>＋ ドロップで追加</span>'; 
teamsWrapper.appendChild(newTeamZone);

const attrButtons = document.querySelectorAll('.attr-btn');
const filterRole = document.getElementById('filter-role');
const filterType = document.getElementById('filter-type');
const filterBuff = document.getElementById('filter-buff');
const sortRankToggle = document.getElementById('sort-rank-toggle');
const globalResetBtn = document.getElementById('global-reset-btn');

function sortPoolElements() {
  const currentOrder = sortRankToggle.dataset.order || 'asc';
  const cards = Array.from(poolContainer.querySelectorAll('.img-card'));

  cards.sort((a, b) => {
    const idA = a.dataset.id || "";
    const idB = b.dataset.id || "";
    if (currentOrder === 'asc') {
      return idB.localeCompare(idA);
    } else {
      return idA.localeCompare(idB);
    }
  });

  cards.forEach(card => poolContainer.appendChild(card));
}

function createTeam(index) {
  const teamBox = document.createElement('div');
  teamBox.className = 'team-box';
  teamBox.innerHTML = `
    <div class="team-header"><div class="team-title">チーム ${index}</div></div>
    <div id="team-grid-${index}" class="grid-layout sortable-team"></div>
  `;
  teamsWrapper.insertBefore(teamBox, newTeamZone);
  
  const gridEl = document.getElementById(`team-grid-${index}`);
  new Sortable(gridEl, {
    group: {
      name: GROUP_NAME,
      put: function (to, from, dragEl) {
        const dragName = dragEl.dataset.name;
        const hasDuplicate = Array.from(to.el.children).some(child => child.dataset.name === dragName && child !== dragEl);
        if (hasDuplicate) return false;
        if (from !== to && to.el.children.length >= 3) return false;
        return true;
      }
    },
    animation: 150,
    ghostClass: 'ghost',
    delay: 200, 
    delayOnTouchOnly: true
  });
  return gridEl;
}

function setupInitialTeams() {
  new Sortable(teamsWrapper, {
    animation: 150,
    draggable: '.team-box',   
    handle: '.team-header',  
    ghostClass: 'ghost',
    onStart: function () {
      document.querySelectorAll('.sortable-team, #new-team-dropzone, #pool-container').forEach(el => {
        el.style.pointerEvents = 'none';
      });
    },
    onEnd: function () {
      document.querySelectorAll('.sortable-team, #new-team-dropzone, #pool-container').forEach(el => {
        el.style.pointerEvents = 'auto';
      });
    }
  });

  for (let i = 1; i <= INITIAL_TEAMS; i++) {
    currentTeamCount++;
    createTeam(currentTeamCount);
  }

  new Sortable(newTeamZone, {
    group: { name: GROUP_NAME, put: true },
    animation: 150,
    ghostClass: 'ghost',
    onAdd: function (evt) {
      const itemEl = evt.item; 
      currentTeamCount++;
      const newTeamGrid = createTeam(currentTeamCount);
      newTeamGrid.appendChild(itemEl);
    }
  });
}

// 全リセットボタンの処理
globalResetBtn.addEventListener('click', () => {
  if (!confirm("配置した画像をすべて画像プールに戻し、チームの並び順も初期状態に戻しますか？")) return;

  // 1. 全ての画像を画像プール（元のエリア）に退避
  const allTeamGrids = document.querySelectorAll('.sortable-team');
  allTeamGrids.forEach(grid => {
    grid.querySelectorAll('.img-card').forEach(item => {
      poolContainer.appendChild(item);
    });
  });

  // 2. 配置エリアにあるチームボックス（.team-box）をすべて削除
  const allTeamBoxes = teamsWrapper.querySelectorAll('.team-box');
  allTeamBoxes.forEach(box => box.remove());

  // 3. チームカウントを巻き戻し、最初の5チームを順番通りに再生成
  currentTeamCount = 0;
  for (let i = 1; i <= INITIAL_TEAMS; i++) {
    currentTeamCount++;
    createTeam(currentTeamCount);
  }

  // 4. ソート状態やフィルターの表示を初期位置に戻す
  sortRankToggle.dataset.order = 'asc';
  sortRankToggle.textContent = '昇順 ▲';
  
  sortPoolElements(); 
  applyAllFilters();
});

function renderInfoImages(dataArray) {
  const container = document.getElementById('info-images-container');
  container.innerHTML = ''; 
  
  const limitData = dataArray.slice(0, 5);
  
  if(limitData.length === 0) {
     container.innerHTML = '<div style="font-size: 0.75rem; color: #94a3b8;">表示できる画像がありません</div>';
     return;
  }

  limitData.forEach(data => {
    const card = document.createElement('div');
    card.className = 'info-img-card';
    card.dataset.name = data.name || '名称未設定';
    card.dataset.description = data.description || '説明文が設定されていません。';
    
    card.innerHTML = `<img src="${data.url || ''}" alt="${data.name || ''}">`;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('.info-img-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const descBox = document.getElementById('info-description-box');
      descBox.innerHTML = `<strong>【${card.dataset.name}】</strong><br>${card.dataset.description}`;
    });
    
    container.appendChild(card);
  });
}

function renderImagesFromData(dataArray) {
  poolContainer.innerHTML = ''; 

  dataArray.forEach(data => {
    const limitCount = (String(data.count) === "2") ? 2 : 1;

    for (let i = 0; i < limitCount; i++) {
      const card = document.createElement('div');
      card.className = 'img-card';
      
      card.dataset.id = data.id || '';
      card.dataset.name = data.name || '';
      card.dataset.attribute = data.attribute || '';
      card.dataset.role = data.role || '';
      card.dataset.type = data.type || '';
      card.dataset.buffs = data.buffs || data.buff || '';
      card.dataset.description = data.description || '';

      card.innerHTML = `
        <div class="img-wrapper"><img src="${data.url || ''}" alt="${data.name || ''}"></div>
        <div class="img-info">${data.name || '名称未設定'}</div>
      `;
      poolContainer.appendChild(card);
    }
  });
}

document.addEventListener('click', (e) => {
  const clickedCard = e.target.closest('.img-card');
  
  if (clickedCard) {
    document.querySelectorAll('.img-card').forEach(card => card.classList.remove('selected-card'));
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300 && timeDiff > 0) {
      if (clickedCard.closest('.sortable-team')) {
        poolContainer.appendChild(clickedCard);
        sortPoolElements();
        applyAllFilters();
      } else if (clickedCard.closest('#pool-container')) {
        // タップ移動時の属性違い（同一人物）排他制限
        const dragId = clickedCard.dataset.id;
        const exclusiveIds = ['img_013', 'img_021', 'img_033'];
        
        if (exclusiveIds.includes(dragId)) {
          const allPlacedCards = teamsWrapper.querySelectorAll('.img-card');
          const hasConflict = Array.from(allPlacedCards).some(card => {
            return exclusiveIds.includes(card.dataset.id);
          });
          
          if (hasConflict) {
            lastClickTime = 0;
            return; 
          }
        }
        const allTeamGrids = document.querySelectorAll('.sortable-team');
        let targetTeam = null;

        for (const team of allTeamGrids) {
          if (team.children.length < 3) {
            const dragName = clickedCard.dataset.name;
            const hasDuplicate = Array.from(team.children).some(child => child.dataset.name === dragName);
            if (!hasDuplicate) {
              targetTeam = team;
              break; 
            }
          }
        }

        if (targetTeam) {
          targetTeam.appendChild(clickedCard);
        } else {
          currentTeamCount++;
          targetTeam = createTeam(currentTeamCount);
          targetTeam.appendChild(clickedCard);
        }
      }
      lastClickTime = 0; 
      return; 
    }
    
    lastClickTime = currentTime;
    clickedCard.classList.add('selected-card');

    const descText = clickedCard.dataset.description;
    const charName = clickedCard.dataset.name || '名称未設定';
    if (descText && descText.trim() !== '') {
      descriptionBox.innerHTML = `<strong>【${charName}】</strong><br>${descText}`;
      descriptionBox.classList.add('active');
    } else {
      descriptionBox.innerHTML = `<strong>【${charName}】</strong><br>説明文が設定されていません。`;
      descriptionBox.classList.remove('active');
    }
  } else if (!e.target.closest('.description-box') && !e.target.closest('.info-img-card')) {
    document.querySelectorAll('.img-card').forEach(card => card.classList.remove('selected-card'));
  }
});

function populateDropdowns(dataArray) {
  const roles = new Set();
  const types = new Set();
  const buffs = new Set();

  dataArray.forEach(data => {
    if (data.role) data.role.split(/[,\、]/).forEach(v => roles.add(v.trim()));
    if (data.type) data.type.split(/[,\、]/).forEach(v => types.add(v.trim()));
    
    const buffVal = data.buffs || data.buff;
    if (buffVal) buffVal.split(/[,\、]/).forEach(v => buffs.add(v.trim()));
  });

  const addOptions = (selectId, valueSet) => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="all">すべて</option>';
    
    Array.from(valueSet).sort().forEach(val => {
      if (val) { 
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
      }
    });
  };

  addOptions('filter-role', roles);
  addOptions('filter-type', types);
  addOptions('filter-buff', buffs);
}

function applyAllFilters() {
  const activeAttrBtn = document.querySelector('.attr-btn.active');
  const selectedAttr = activeAttrBtn ? activeAttrBtn.dataset.val : 'all';
  const selectedRole = filterRole.value;
  const selectedType = filterType.value;
  const selectedBuff = filterBuff.value;

  const hasValue = (dataStr, target) => {
    if (target === 'all') return true;
    if (!dataStr) return false;
    const arr = dataStr.split(/[,\、]/).map(s => s.trim());
    return arr.includes(target);
  };

  poolContainer.querySelectorAll('.img-card').forEach(card => {
    const cAttr = card.dataset.attribute;
    const cRole = card.dataset.role;
    const cType = card.dataset.type;
    const cBuffs = card.dataset.buffs || '';

    const matchAttr = (selectedAttr === 'all' || cAttr === selectedAttr);
    const matchRole = hasValue(cRole, selectedRole);
    const matchType = hasValue(cType, selectedType);
    const matchBuff = hasValue(cBuffs, selectedBuff);

    if (matchAttr && matchRole && matchType && matchBuff) {
      card.classList.remove('is-hidden');
    } else {
      card.classList.add('is-hidden');
    }
  });
}

attrButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    attrButtons.forEach(b => b.classList.remove('active'));
    e.target.closest('.attr-btn').classList.add('active');
    applyAllFilters();
  });
});

[filterRole, filterType, filterBuff].forEach(select => {
  select.addEventListener('change', applyAllFilters);
});

sortRankToggle.addEventListener('click', () => {
  const currentOrder = sortRankToggle.dataset.order;

  if (currentOrder === 'asc') {
    sortRankToggle.dataset.order = 'desc';
    sortRankToggle.textContent = '降順 ▼';
  } else {
    sortRankToggle.dataset.order = 'asc';
    sortRankToggle.textContent = '昇順 ▲';
  }
  sortPoolElements(); 
});

async function loadApp() {
  setupInitialTeams();

  try {
    // データ（JSON）を一括で取得
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('データファイルの読み込みに失敗しました');
    
    const allData = await response.json();
    
    // JSONのキー名に合わせてデータを分割
    const characterData = allData.character || [];
    const bossData = allData.boss_data || [];
    const titleData = allData.title || [];
    
    // 1. キャラクターデータの反映
    if (characterData.length > 0) {
      populateDropdowns(characterData);
      renderImagesFromData(characterData);
      sortRankToggle.dataset.order = 'asc';
      sortRankToggle.textContent = '昇順 ▲';
      sortPoolElements();
    }

    // 2. ボスデータの反映
    if (bossData.length > 0) {
      renderInfoImages(bossData);
    } else {
      document.getElementById('info-images-container').innerHTML = '<div style="font-size: 0.75rem; color: #94a3b8;">表示できる画像がありません</div>';
    }

    // 3. タイトルデータの反映
    if (titleData.length > 0) {
      const appTitle = titleData[0].title || '';
      const appVer = titleData[0].ver || '';
      const newTitleText = `${appTitle} ${appVer}`.trim();
      
      if (newTitleText) {
        document.getElementById('info-panel-title').textContent = newTitleText;
      }
    }

  } catch (error) {
    console.error("データの取得に失敗しました:", error);
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
      loadingMsg.innerHTML = "データの読み込みに失敗しました。<br>URL設定やネットワーク状況を確認してください。";
    }
  } finally {
    new Sortable(poolContainer, {
      group: { name: GROUP_NAME, put: true },
      sort: false, 
      animation: 150,
      ghostClass: 'ghost',
      delay: 200,
      delayOnTouchOnly: true,
      onAdd: function () {
        sortPoolElements(); 
      }
    });
  }
}

loadApp();

function setupInitialTeams() {
  new Sortable(teamsWrapper, {
    animation: 150,
    draggable: '.team-box',   
    handle: '.team-header',  
    ghostClass: 'ghost',
    onStart: function () {
      document.querySelectorAll('.sortable-team, #new-team-dropzone, #pool-container').forEach(el => {
        el.style.pointerEvents = 'none';
      });
    },
    onEnd: function () {
      document.querySelectorAll('.sortable-team, #new-team-dropzone, #pool-container').forEach(el => {
        el.style.pointerEvents = 'auto';
      });
    }
  });

  for (let i = 1; i <= INITIAL_TEAMS; i++) {
    currentTeamCount++;
    createTeam(currentTeamCount);
  }

  new Sortable(newTeamZone, {
    group: { name: GROUP_NAME, put: true },
    animation: 150,
    ghostClass: 'ghost',
    onAdd: function (evt) {
      const itemEl = evt.item; 
      currentTeamCount++;
      const newTeamGrid = createTeam(currentTeamCount);
      newTeamGrid.appendChild(itemEl);
    }
  });
}

// 全リセットボタンの処理
globalResetBtn.addEventListener('click', () => {
  if (!confirm("配置した画像をすべて画像プールに戻し、チームの並び順も初期状態に戻しますか？")) return;

  // 1. 全ての画像を画像プール（元のエリア）に退避
  const allTeamGrids = document.querySelectorAll('.sortable-team');
  allTeamGrids.forEach(grid => {
    grid.querySelectorAll('.img-card').forEach(item => {
      poolContainer.appendChild(item);
    });
  });

  // 2. 配置エリアにあるチームボックス（.team-box）をすべて削除
  const allTeamBoxes = teamsWrapper.querySelectorAll('.team-box');
  allTeamBoxes.forEach(box => box.remove());

  // 3. チームカウントを巻き戻し、最初の5チームを順番通りに再生成
  currentTeamCount = 0;
  for (let i = 1; i <= INITIAL_TEAMS; i++) {
    currentTeamCount++;
    createTeam(currentTeamCount);
  }

  // 4. ソート状態やフィルターの表示を初期位置に戻す
  sortRankToggle.dataset.order = 'asc';
  sortRankToggle.textContent = '昇順 ▲';
  
  sortPoolElements(); 
  applyAllFilters();
});

function renderInfoImages(dataArray) {
  const container = document.getElementById('info-images-container');
  container.innerHTML = ''; 
  
  const limitData = dataArray.slice(0, 5);
  
  if(limitData.length === 0) {
     container.innerHTML = '<div style="font-size: 0.75rem; color: #94a3b8;">表示できる画像がありません</div>';
     return;
  }

  limitData.forEach(data => {
    const card = document.createElement('div');
    card.className = 'info-img-card';
    card.dataset.name = data.name || '名称未設定';
    card.dataset.description = data.description || '説明文が設定されていません。';
    
    card.innerHTML = `<img src="${data.url || ''}" alt="${data.name || ''}">`;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('.info-img-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const descBox = document.getElementById('info-description-box');
      descBox.innerHTML = `<strong>【${card.dataset.name}】</strong><br>${card.dataset.description}`;
    });
    
    container.appendChild(card);
  });
}

function renderImagesFromData(dataArray) {
  poolContainer.innerHTML = ''; 

  dataArray.forEach(data => {
    const limitCount = (String(data.count) === "2") ? 2 : 1;

    for (let i = 0; i < limitCount; i++) {
      const card = document.createElement('div');
      card.className = 'img-card';
      
      card.dataset.id = data.id || '';
      card.dataset.name = data.name || '';
      card.dataset.attribute = data.attribute || '';
      card.dataset.role = data.role || '';
      card.dataset.type = data.type || '';
      card.dataset.buffs = data.buffs || data.buff || '';
      card.dataset.description = data.description || '';

      card.innerHTML = `
        <div class="img-wrapper"><img src="${data.url || ''}" alt="${data.name || ''}"></div>
        <div class="img-info">${data.name || '名称未設定'}</div>
      `;
      poolContainer.appendChild(card);
    }
  });
}

document.addEventListener('click', (e) => {
  const clickedCard = e.target.closest('.img-card');
  
  if (clickedCard) {
    document.querySelectorAll('.img-card').forEach(card => card.classList.remove('selected-card'));
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300 && timeDiff > 0) {
      if (clickedCard.closest('.sortable-team')) {
        poolContainer.appendChild(clickedCard);
        sortPoolElements();
        applyAllFilters();
      } else if (clickedCard.closest('#pool-container')) {
        const allTeamGrids = document.querySelectorAll('.sortable-team');
        let targetTeam = null;

        for (const team of allTeamGrids) {
          if (team.children.length < 3) {
            const dragName = clickedCard.dataset.name;
            const hasDuplicate = Array.from(team.children).some(child => child.dataset.name === dragName);
            if (!hasDuplicate) {
              targetTeam = team;
              break; 
            }
          }
        }

        if (targetTeam) {
          targetTeam.appendChild(clickedCard);
        } else {
          currentTeamCount++;
          targetTeam = createTeam(currentTeamCount);
          targetTeam.appendChild(clickedCard);
        }
      }
      lastClickTime = 0; 
      return; 
    }
    
    lastClickTime = currentTime;
    clickedCard.classList.add('selected-card');

    const descText = clickedCard.dataset.description;
    const charName = clickedCard.dataset.name || '名称未設定';
    if (descText && descText.trim() !== '') {
      descriptionBox.innerHTML = `<strong>【${charName}】</strong><br>${descText}`;
      descriptionBox.classList.add('active');
    } else {
      descriptionBox.innerHTML = `<strong>【${charName}】</strong><br>説明文が設定されていません。`;
      descriptionBox.classList.remove('active');
    }
  } else if (!e.target.closest('.description-box') && !e.target.closest('.info-img-card')) {
    document.querySelectorAll('.img-card').forEach(card => card.classList.remove('selected-card'));
  }
});

function populateDropdowns(dataArray) {
  const roles = new Set();
  const types = new Set();
  const buffs = new Set();

  dataArray.forEach(data => {
    if (data.role) data.role.split(/[,\、]/).forEach(v => roles.add(v.trim()));
    if (data.type) data.type.split(/[,\、]/).forEach(v => types.add(v.trim()));
    
    const buffVal = data.buffs || data.buff;
    if (buffVal) buffVal.split(/[,\、]/).forEach(v => buffs.add(v.trim()));
  });

  const addOptions = (selectId, valueSet) => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="all">すべて</option>';
    
    Array.from(valueSet).sort().forEach(val => {
      if (val) { 
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
      }
    });
  };

  addOptions('filter-role', roles);
  addOptions('filter-type', types);
  addOptions('filter-buff', buffs);
}

function applyAllFilters() {
  const activeAttrBtn = document.querySelector('.attr-btn.active');
  const selectedAttr = activeAttrBtn ? activeAttrBtn.dataset.val : 'all';
  const selectedRole = filterRole.value;
  const selectedType = filterType.value;
  const selectedBuff = filterBuff.value;

  const hasValue = (dataStr, target) => {
    if (target === 'all') return true;
    if (!dataStr) return false;
    const arr = dataStr.split(/[,\、]/).map(s => s.trim());
    return arr.includes(target);
  };

  poolContainer.querySelectorAll('.img-card').forEach(card => {
    const cAttr = card.dataset.attribute;
    const cRole = card.dataset.role;
    const cType = card.dataset.type;
    const cBuffs = card.dataset.buffs || '';

    const matchAttr = (selectedAttr === 'all' || cAttr === selectedAttr);
    const matchRole = hasValue(cRole, selectedRole);
    const matchType = hasValue(cType, selectedType);
    const matchBuff = hasValue(cBuffs, selectedBuff);

    if (matchAttr && matchRole && matchType && matchBuff) {
      card.classList.remove('is-hidden');
    } else {
      card.classList.add('is-hidden');
    }
  });
}

attrButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    attrButtons.forEach(b => b.classList.remove('active'));
    e.target.closest('.attr-btn').classList.add('active');
    applyAllFilters();
  });
});

[filterRole, filterType, filterBuff].forEach(select => {
  select.addEventListener('change', applyAllFilters);
});

sortRankToggle.addEventListener('click', () => {
  const currentOrder = sortRankToggle.dataset.order;

  if (currentOrder === 'asc') {
    sortRankToggle.dataset.order = 'desc';
    sortRankToggle.textContent = '降順 ▼';
  } else {
    sortRankToggle.dataset.order = 'asc';
    sortRankToggle.textContent = '昇順 ▲';
  }
  sortPoolElements(); 
});

async function loadApp() {
  setupInitialTeams();

  try {
    // データ（JSON）を一括で取得
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('データファイルの読み込みに失敗しました');
    
    const allData = await response.json();
    
    // JSONのキー名に合わせてデータを分割
    const characterData = allData.character || [];
    const bossData = allData.boss_data || [];
    const titleData = allData.title || [];
    
    // 1. キャラクターデータの反映
    if (characterData.length > 0) {
      populateDropdowns(characterData);
      renderImagesFromData(characterData);
      sortRankToggle.dataset.order = 'asc';
      sortRankToggle.textContent = '昇順 ▲';
      sortPoolElements();
    }

    // 2. ボスデータの反映
    if (bossData.length > 0) {
      renderInfoImages(bossData);
    } else {
      document.getElementById('info-images-container').innerHTML = '<div style="font-size: 0.75rem; color: #94a3b8;">表示できる画像がありません</div>';
    }

    // 3. タイトルデータの反映
    if (titleData.length > 0) {
      const appTitle = titleData[0].title || '';
      const appVer = titleData[0].ver || '';
      const newTitleText = `${appTitle} ${appVer}`.trim();
      
      if (newTitleText) {
        document.getElementById('info-panel-title').textContent = newTitleText;
      }
    }

  } catch (error) {
    console.error("データの取得に失敗しました:", error);
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
      loadingMsg.innerHTML = "データの読み込みに失敗しました。<br>URL設定やネットワーク状況を確認してください。";
    }
  } finally {
    new Sortable(poolContainer, {
      group: { name: GROUP_NAME, put: true },
      sort: false, 
      animation: 150,
      ghostClass: 'ghost',
      delay: 200,
      delayOnTouchOnly: true,
      onAdd: function () {
        sortPoolElements(); 
      }
    });
  }
}

document.getElementById('export-btn').addEventListener('click', async function() {
  const newTab = window.open('', '_blank');
  newTab.document.write('<html><body style="background:#121212; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh;">画像生成中...</body></html>');

  const container = document.querySelector('.main-container');
  const leftSide = document.querySelector('.left-side');
  const rightSide = document.querySelector('.right-side');
  const exportBtn = document.getElementById('export-btn');
  
  window.scrollTo(0, 0);

  // === 撮影前の準備 ===
  const isMobile = window.innerWidth <= 1000;
  rightSide.style.display = 'none';
  exportBtn.style.display = 'none';
  
  if (isMobile) {
    leftSide.style.gridColumn = '1 / 3';
  } else {
    container.style.width = '50%'; 
  }

  // ★重要：ページ内のすべての画像の「遅延読み込み」を解除する
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    if (img.getAttribute('loading') === 'lazy') {
      img.setAttribute('loading', 'eager');
    }
  });

  // スマホが画像を読み込むための猶予を少し（0.5秒）与える
  await new Promise(resolve => setTimeout(resolve, 500));

  // 2. html2canvasを実行
  html2canvas(container, {
    backgroundColor: '#121212',
    scale: 2,
    useCORS: true, // CORS設定は残す
    onclone: (clonedDoc) => {
      // 今回は setAttribute('crossOrigin', 'anonymous') は使いません
      const cards = clonedDoc.querySelectorAll('.img-card');
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.backgroundColor = '#2a2a2a';
      });
    }
  }).then(canvas => {
    // レイアウトを元に戻す
    rightSide.style.display = '';
    exportBtn.style.display = '';
    if (isMobile) {
      leftSide.style.gridColumn = '';
    } else {
      container.style.width = ''; 
    }

    const imageURL = canvas.toDataURL("image/png");

    if (!newTab) {
      alert("ポップアップがブロックされました。");
      return;
    }

    newTab.document.write(`
      <html>
        <body style="margin:0; background:#121212; display:flex; justify-content:center; align-items:center; min-height:100vh;">
          <img src="${imageURL}" style="max-width:100%; border:1px solid #444;">
        </body>
      </html>
    `);
    newTab.document.close();
  }).catch(err => {
    newTab.close();
    alert("画像の生成に失敗しました。");
    console.error(err);
  });
});

loadApp();