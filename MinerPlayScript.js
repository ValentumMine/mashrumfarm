document.addEventListener('DOMContentLoaded', () => {
    const el = (id) => document.getElementById(id);
    const log = (msg) => {
        const p = document.createElement('p');
        p.textContent = msg;
        el('miningLog').appendChild(p);
        el('miningLog').scrollTop = el('miningLog').scrollHeight;
    };

    const state = {
        balance: 0, bonusClaimed: false, mushroomCount: 0, progress: 0,
        manaGelCount: 0, manaGelProgress: 0, etherCount: 0, etherProgress: 0,
        mushroomSpeed: 1, manaGelSpeed: 1, etherSpeed: 1,
        manaGelTimer: 0, etherTimer: 0, manaGelProducing: false, etherProducing: false,
        playerLevel: 1, playerExp: 0, expToNextLevel: 100, playerHealth: 100, playerDamage: 1,
        bossHealth: 0, bossDamage: 0, inventory: {}
    };

    const updateDisplay = () => el('balance').textContent = state.balance.toFixed(2);
    const updateBossStats = () => {
        el('bossHealth').textContent = state.bossHealth;
        el('playerHealth').textContent = state.playerHealth;
        el('playerDamage').textContent = state.playerDamage;
        el('playerLevel').textContent = state.playerLevel;
        el('playerExp').textContent = state.playerExp;
        el('expToNextLevel').textContent = state.expToNextLevel;
        updateInventoryDisplay();
    };
    const updateInventoryDisplay = () => {
        el('inventory').innerHTML = '';
        for (let item in state.inventory) {
            if (state.inventory[item] > 0) el('inventory').innerHTML += `<p>${item}: ${state.inventory[item]}</p>`;
        }
    };
    const setActive = (clickedLink) => {
        document.querySelectorAll('#mainNav li').forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    };

    const production = {
        mushroom: () => {
            state.progress += 10 * state.mushroomSpeed;
            if (state.progress >= 100) {
                state.progress = 0;
                state.mushroomCount++;
                el('mushroomCount').textContent = state.mushroomCount;
                log(`🍄 Мухоморы выросли + 1.`);
            }
            document.querySelector('.progress-bar').style.width = `${state.progress}%`;
        },
        manaGel: () => {
            if (state.manaGelProducing) {
                state.manaGelProgress += 10 * state.manaGelSpeed;
                if (state.manaGelProgress >= 100) {
                    state.manaGelProgress = 0;
                    state.manaGelCount++;
                    el('manaGelCount').textContent = state.manaGelCount;
                    log("⚗️ Мана-Гель произведен + 1.");
                    state.manaGelProducing = false;
                    state.manaGelTimer = 5;
                }
                document.querySelector('.mana-gel-progress-bar').style.width = `${state.manaGelProgress}%`;
            }
        },
        ether: () => {
             if (state.etherProducing) {
                 state.etherProgress += 10 * state.etherSpeed;
                 if (state.etherProgress >= 100) {
                    state.etherProgress = 0;
                     state.etherCount++;
                     el('etherCount').textContent = state.etherCount;
                     log("⚛️ Эфир произведен + 1.");
                    state.etherProducing = false;
                     state.etherTimer = 5;
                }
                document.querySelector('.ether-progress-bar').style.width = `${state.etherProgress}%`;
           }
        }
    };
    const sell = {
        mushroom: () => {
             if (state.mushroomCount > 0) {
                state.balance += state.mushroomCount * 2;
                log(`💰 Продано ${state.mushroomCount} мухоморов за ${state.mushroomCount * 2} монет.`);
                 state.mushroomCount = 0;
                el('mushroomCount').textContent = state.mushroomCount;
                updateDisplay();
            } else {
                 log("Нет мухоморов для продажи.");
            }
        },
        manaGel: () => {
             if (state.manaGelCount > 0) {
                state.balance += state.manaGelCount * 6;
                 log(`💰 Продано ${state.manaGelCount} мана-геля за ${state.manaGelCount * 6} монет.`);
                state.manaGelCount = 0;
                 el('manaGelCount').textContent = state.manaGelCount;
                 updateDisplay();
            } else {
                 log("Нет мана-геля для продажи.");
            }
        },
        ether: () => {
            if (state.etherCount > 0) {
                state.balance += state.etherCount * 15;
                log(`💰 Продано ${state.etherCount} эфира за ${state.etherCount * 15} монет.`);
                state.etherCount = 0;
                el('etherCount').textContent = state.etherCount;
                updateDisplay();
            } else {
                log("Нет эфиров для продажи.");
             }
        }
    };
    const startProduction = {
        manaGel: () => {
             if(!state.manaGelProducing && state.manaGelTimer <= 0){
                if(state.mushroomCount >= 2){
                    state.mushroomCount -= 2;
                   el('mushroomCount').textContent = state.mushroomCount;
                     state.manaGelProducing = true;
                     log("⚗️ Производство Мана-геля запущено");
                } else{
                     log("Недостаточно мухоморов для производства мана-геля.");
                }
             } else{
                if(state.manaGelTimer > 0){
                    log(`⚗️ Производство Мана-геля еще не готово, подождите ${state.manaGelTimer}с.`);
               }
                 if(state.manaGelProducing){
                     log("⚗️ Производство Мана-геля уже запущено.");
                 }
            }
       },
        ether: () => {
           if(!state.etherProducing && state.etherTimer <= 0){
                if(state.manaGelCount >= 2){
                    state.manaGelCount -= 2;
                    el('manaGelCount').textContent = state.manaGelCount;
                    state.etherProducing = true;
                    log("⚛️ Производство Эфира запущено");
               }else{
                   log("Недостаточно мана-геля для производства эфира.");
                }
            }else{
               if(state.etherTimer > 0){
                    log(`⚛️ Производство Эфира еще не готово, подождите ${state.etherTimer}с.`)
                }
                if(state.etherProducing){
                    log("⚛️ Производство Эфира уже запущено.");
               }
            }
       }
   };
   const switchTab = (tabId, tabContents, tabButtons ) => {
       tabContents.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(button => button.classList.remove('active'));
        el(tabId + '-tab').classList.add('active');
       document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
   };
    const buyUpgrade = (item) => {
         const upgrades = {
             mushroom: {cost: 100, apply: () => { state.mushroomSpeed += 0.1; el('mushroomSpeed').textContent = `${state.mushroomSpeed.toFixed(1)}x`; log("🍄 Улучшение Мухоморов куплено.")}},
            manaGel: {cost: 200, apply: () => { state.manaGelSpeed += 0.1; el('manaGelSpeed').textContent = `${state.manaGelSpeed.toFixed(1)}x`; log("🧪 Улучшение Мана-геля куплено.")}},
            ether: {cost: 300, apply: () => { state.etherSpeed += 0.1; el('etherSpeed').textContent = `${state.etherSpeed.toFixed(1)}x`; log("✨ Улучшение Эфира куплено.")}},
         };
         if (state.balance >= upgrades[item].cost) {
           state.balance -= upgrades[item].cost;
           upgrades[item].apply();
             updateDisplay();
        }else{
            log(`Недостаточно монет для покупки улучшения ${item}.`);
        }
    };

    const buyEquipment = (item) => {
         const equipment = {
            armor: {cost: 500, apply: () => { state.inventory.armor = (state.inventory.armor || 0) + 1; log("🛡️ Броня куплена")}},
            shield: {cost: 400, apply: () => {state.inventory.shield = (state.inventory.shield || 0) + 1; log("🛡️ Щит куплен")}},
            potion: {cost: 300, apply: () => {state.inventory.potion = (state.inventory.potion || 0) + 1; log("🧪 Зелье куплено")}},
            sword: {cost: 600, apply: () => {state.inventory.sword = (state.inventory.sword || 0) + 1; log("⚔️ Меч куплен")}},
            staff: {cost: 700, apply: () => {state.inventory.staff = (state.inventory.staff || 0) + 1; log(" staff Посох куплен")}}
        };
        if (state.balance >= equipment[item].cost) {
          state.balance -= equipment[item].cost;
           equipment[item].apply();
            updateDisplay();
         }else{
            log(`Недостаточно монет для покупки ${item}.`);
       }
         updateInventoryDisplay();
    };
    const startBossBattle = () => {
        const difficulty = el('bossDifficulty').value;
         const diffs = {
            easy: {bossHealth: 50, bossDamage: 5},
             medium: {bossHealth: 100, bossDamage: 10},
             hard: {bossHealth: 200, bossDamage: 15},
           insane: {bossHealth: 400, bossDamage: 25},
         };
         Object.assign(state, { ...diffs[difficulty], playerHealth: 100 });
        updateBossStats();
    };
    const attackBoss = () => {
         let damageDealt = state.playerDamage;
         let damageTaken = state.bossDamage;
       if(state.inventory.sword > 0) damageDealt += state.inventory.sword * 2;
         if(state.inventory.staff > 0)  damageDealt += state.inventory.staff * 3;
        if (state.inventory.shield > 0) {
            if (Math.random() < state.inventory.shield * 0.1) {
                 damageTaken = 0;
                log("🛡️ Вы заблокировали атаку босса!");
           }
        }
        state.bossHealth -= damageDealt;
        state.playerHealth -= damageTaken;
         if (state.inventory.potion > 0) {
           if (state.playerHealth < 100) {
               state.playerHealth += 20;
                if (state.playerHealth > 100) state.playerHealth = 100;
                state.inventory.potion--;
                log("🧪 Вы использовали зелье и восстановили здоровье!");
            } else {
                 log("🧪 Здоровье полное, зелье не используется");
            }
        }
         updateBossStats();
         if (state.bossHealth <= 0) {
            log("Вы победили босса!");
           const gains = {
                 easy: {expGain: 50, moneyGain: 50},
                medium: {expGain: 100, moneyGain: 100},
                 hard: {expGain: 200, moneyGain: 200},
                 insane: {expGain: 400, moneyGain: 400}
            };
           const {expGain, moneyGain} = gains[el('bossDifficulty').value];
          state.playerExp += expGain;
           state.balance += moneyGain;
            if (state.playerExp >= state.expToNextLevel) {
               state.playerLevel++;
                 state.playerExp -= state.expToNextLevel;
                 state.expToNextLevel *= 1.5;
                state.playerDamage++;
                 log("🎉 Вы достигли нового уровня!");
           }
           updateDisplay();
            updateBossStats();
       } else if (state.playerHealth <= 0) {
           log("Вы проиграли!");
            state.playerHealth = 0;
            updateBossStats();
        }
    };
    el('claimBonusButton').addEventListener('click', () => {
        if(!state.bonusClaimed) {
            state.balance += 10;
            state.bonusClaimed = true;
            updateDisplay();
             el('claimBonusButton').disabled = true;
             log("Получен начальный бонус: 10 монет!");
           }else{
               log("Начальный бонус уже получен.");
           }
    });
   el('mainNav').addEventListener('click', (event) => {
       if (event.target.tagName === 'A') {
           event.preventDefault();
           const clickedLink = event.target.parentNode;
           setActive(clickedLink);
           const sections = {
               homeLink: ['none', 'block', 'none', 'none'],
               marketLink: ['none', 'none', 'block', 'none'],
                bossLink: ['none', 'none', 'none', 'block'],
                default: ['block', 'none', 'none', 'none']
           };
           const sectionState = sections[clickedLink.id] || sections.default;

           el('featuresSection').style.display = sectionState[0];
           el('mapContainer').style.display = sectionState[1];
            el('marketContainer').style.display = sectionState[2];
             el('bossContainer').style.display = sectionState[3];
             clearInterval(growthInterval);
           clearInterval(manaGelGrowthInterval);
            clearInterval(etherGrowthInterval);
           growthInterval = null;
           manaGelGrowthInterval = null;
             etherGrowthInterval = null;
           if(clickedLink.id === 'homeLink'){
              growthInterval = setInterval(production.mushroom, 3000);
              manaGelGrowthInterval = setInterval(production.manaGel, 300);
              etherGrowthInterval = setInterval(production.ether, 300);
           }
       }
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab, document.querySelectorAll('.tab-content'),  document.querySelectorAll('.tab-button')));
    });
     document.querySelectorAll('.market-tabs .tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab, document.querySelectorAll('.market-container .tab-content'),  document.querySelectorAll('.market-tabs .tab-button')));
    });
    document.querySelectorAll('.buy-upgrade').forEach(button => button.addEventListener('click', () => buyUpgrade(button.dataset.item)));
   document.querySelectorAll('.buy-equipment').forEach(button => button.addEventListener('click', () => buyEquipment(button.dataset.item)));
    el('sellMushroomsButton').addEventListener('click', sell.mushroom);
    el('produceManaGelButton').addEventListener('click', startProduction.manaGel);
    el('sellManaGelButton').addEventListener('click', sell.manaGel);
    el('produceEtherButton').addEventListener('click', startProduction.ether);
    el('sellEtherButton').addEventListener('click', sell.ether);
    el('startBossBattle').addEventListener('click', startBossBattle);
    el('attackButton').addEventListener('click', attackBoss);
    setInterval(() => {
        if(state.manaGelTimer > 0) state.manaGelTimer--;
       el('manaGelTimer').textContent = state.manaGelTimer;
         if (state.etherTimer > 0) state.etherTimer--;
         el('etherTimer').textContent = state.etherTimer;
    }, 1000)
     updateDisplay();
});