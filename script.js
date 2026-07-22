

import { testTransactions } from "./TT.js";

import {
    escapeHtml,
    typeToCode,
    typeToRu,
    getNameById,
    formatNumber,
    formatMonthName,
    formatDate,
    centerTextPlugin,
} from './utils.js';

//// ================= ХРАНИЛИЩЕ =================

// Начальные (дефолтные) данные
const DEFAULT_ACCOUNTS = [
        { id: 0, name: "Удалено", isArchived: true },
        { id: 1, name: "Основной счет", type: "Карта", currency: "RUB", visible: true, isArchived: false }
    ];

const DEFAULT_CATEGORIES = [
        { id: 0, name: "Удалено", type: "expense" },
        // --- РАСХОДЫ ---
        { id: 1, name: "Аренда жилья", type: "expense" },
        { id: 2, name: "Продукты", type: "expense" },
        { id: 3, name: "Интернет и связь", type: "expense" },
        { id: 4, name: "Квартплата", type: "expense" },
        { id: 5, name: "Здоровье", type: "expense" },
        { id: 6, name: "Развлечения", type: "expense" },
        { id: 7, name: "Бытовые и хоз товары", type: "expense" },
        { id: 8, name: "Потребление", type: "expense" },
        { id: 9, name: "Рестораны", type: "expense" },
        { id: 10, name: "Одежда и обувь", type: "expense" },
        { id: 11, name: "Передвижение", type: "expense" },
        { id: 12, name: "Подарки", type: "expense" },
        { id: 13, name: "Налоги", type: "expense" },
        { id: 14, name: "Рабочие расходы", type: "expense" },
        { id: 15, name: "Путешествия", type: "expense" },
        { id: 16, name: "Крупные траты", type: "expense" },
        { id: 17, name: "Другое", type: "expense" },
        // --- ДОХОДЫ ---
        { id: 18, name: "Работа", type: "income" },
        { id: 19, name: "Подработка", type: "income" },
        { id: 20, name: "Проценты и бонусы", type: "income" },
        { id: 21, name: "Другое", type: "income" },
    ];

const DEFAULT_TRANSACTIONS = [];

// 1. Загружаем транзакции. Если в памяти пусто (null) — создаем пустой массив []
let transactions = localStorage.getItem('kaban_transactions')
    ? JSON.parse(localStorage.getItem('kaban_transactions'))
    : [];

// 2. Загружаем счета. Если в памяти пусто — создаем три твоих базовых счета
let accounts = localStorage.getItem('kaban_accounts')
    ? JSON.parse(localStorage.getItem('kaban_accounts'))
    : [
        { id: 0, name: "Удалено", isArchived: true },
        { id: 1, name: "Основной счет", type: "Карта", currency: "RUB", visible: true, isArchived: false }
    ];

let categories = localStorage.getItem("kaban_categories")
    ? JSON.parse(localStorage.getItem("kaban_categories"))
    : [
        { id: 0, name: "Удалено", type: "expense" },
        // --- РАСХОДЫ ---
        { id: 1, name: "Аренда жилья", type: "expense" },
        { id: 2, name: "Продукты", type: "expense" },
        { id: 3, name: "Интернет и связь", type: "expense" },
        { id: 4, name: "Квартплата", type: "expense" },
        { id: 5, name: "Здоровье", type: "expense" },
        { id: 6, name: "Развлечения", type: "expense" },
        { id: 7, name: "Бытовые и хоз товары", type: "expense" },
        { id: 8, name: "Потребление", type: "expense" },
        { id: 9, name: "Рестораны", type: "expense" },
        { id: 10, name: "Одежда и обувь", type: "expense" },
        { id: 11, name: "Передвижение", type: "expense" },
        { id: 12, name: "Подарки", type: "expense" },
        { id: 13, name: "Налоги", type: "expense" },
        { id: 14, name: "Рабочие расходы", type: "expense" },
        { id: 15, name: "Путешествия", type: "expense" },
        { id: 16, name: "Крупные траты", type: "expense" },
        { id: 17, name: "Другое", type: "expense" },
        // --- ДОХОДЫ ---
        { id: 18, name: "Работа", type: "income" },
        { id: 19, name: "Подработка", type: "income" },
        { id: 20, name: "Проценты и бонусы", type: "income" },
        { id: 21, name: "Другое", type: "income" },
    ];


//// ================= ПЕРЕМЕННЫЕ =================

console.log(transactions)

const WinWord = document.getElementById("win-word")
const totalBalance = document.getElementById("total_balance");
const navButtons = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tabs');
const popup = document.getElementById('myPopup');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');

const openBtnMain = document.getElementById('openBtnMain');

const transactionForm = document.getElementById('transactionForm');
const inpAmount = document.getElementById('inp_amount');
const inpType = document.getElementById('inp_type');
const inpCategory = document.getElementById('inp_category');
const inpAccount = document.getElementById('inp_account');
const inpDate = document.getElementById('inp_date');
const inpDescription = document.getElementById('inp_description');
const inpHidden = document.getElementById('inp_hidden');



const historyContainer = document.getElementById("history_container");
const monthTabsContainer = document.getElementById("month_tabs_container");
const typeFilterContainer = document.getElementById("type-filter-container");

const incomeContainer = document.getElementById("Income_Cont")
const expenseContainer = document.getElementById("Expense_Cont")

const scorePopup = document.getElementById('scorePopup');
const openScoreBtn = document.getElementById('openScoreBtn');
const closeScoreBtn = document.getElementById('closeScoreBtn');
const scoreForm = document.getElementById('scoreForm');

const accountsContainer = document.getElementById("accounts_container");
const accountCards = document.getElementsByClassName('account-card');
const accountPopup = document.getElementById('accountPopup');

let currentMonth = "all";
let currentTypeFilter = "all";
let currentSort = "date-a" // date-a, date-z, acc-a, acc-z, category-a, category-z, type-a, type-z, amount-a, amount-z 
let currentHidden = false // true - прячем скрытые транзакции, false - покаызваем, 

const accPopupDeleteBtn = document.getElementById("accPopup_delete");
const buttonArchive = document.getElementById('buttonArchive');
const showArchiveBtn = document.getElementById('showArchiveBtn'); // кнопки не существует в html
let displayArchivedMode = true; // по умолчанию false - архив скрыт


let accountsChartInstance = null; // Хранит ссылку на график, чтобы уничтожать старый перед обновлением
let categoriesChartInstance = null; // Хранит ссылку на график категорий
let capitalChartInstance = null

// Наша переменная
let userName = localStorage.getItem('kaban_username')
    ? JSON.parse(localStorage.getItem('kaban_username'))
    : "Ваше имя";

const pElement = document.querySelector('#usernameedit');
const helloWord = document.querySelector('#hello_word');

// 1. Записываем начальное значение в HTML
pElement.textContent = userName;
helloWord.textContent = `Приветствую, ${userName}`;

let lang = "ru"

//// ==============================================
//// ================= КОНСОЛЬ ====================
//// ==============================================

// Добавляет в список транзакций заготовленный список операций
window.getTT = () => {
    transactions.push(...testTransactions);
    updateAppUI();
    console.log("Тестовые данные успешно загружены!");
};

window.getAcc = () => {
    console.log(accounts)
}

window.showT = () => {
    console.log(transactions)
};

//// ==============================================
//// ================= ЛОГИКА ====================
//// ==============================================

const azMode = (thSort) => {
    if (currentSort.startsWith(thSort)) {
        if (currentSort.endsWith("-a")) {
            return `a-z`
        } else {
            return `z-a`
        }
    } else {
        return ``
    }
}

// Считает сумму транзакций или сумму транзакций для конкретного счета с учетом видимости
const calcSumTransactions = (accID = null, ignoreVisibility = false) => {
    let clacSum = 0;
    transactions.forEach(trans => {
        if (accID !== null && trans.accountID !== accID) {
            return;
        }

        // Если считаем общий баланс (accID === null), проверяем, виден ли счет для общего баланса
        if (accID === null && !ignoreVisibility) {
            const acc = accounts.find(a => a.id === trans.accountID);
            if (acc && acc.visible === false) {
                return; // Пропускаем транзакции скрытых счетов
            }
        }

        if (trans.type === "income") {
            clacSum += trans.amount;
        } else {
            clacSum -= trans.amount;
        }
    });
    return clacSum;
};

// Сортирует транзакции согласно режиму
const getSortedTransactions = (sort_transactions_massive) => {
    let mode = (a, b) => new Date(a.date) - new Date(b.date)

    switch (currentSort) {
        case "date-a":
            mode = (a, b) => new Date(a.date) - new Date(b.date)
            break
        case "date-z":
            mode = (a, b) => new Date(b.date) - new Date(a.date)
            break
        case "acc-a":
            mode = (a, b) => {
                const nameA = getNameById(a.accountID, accounts)
                const nameB = getNameById(b.accountID, accounts)
                return nameA.localeCompare(nameB, 'ru')
            }
            break
        case "acc-z":
            mode = (a, b) => {
                const nameA = getNameById(a.accountID, accounts)
                const nameB = getNameById(b.accountID, accounts)
                return nameB.localeCompare(nameA, 'ru')
            }
            break
        case "category-a":
            mode = (a, b) => {
                const nameA = getNameById(a.categoryID, categories)
                const nameB = getNameById(b.categoryID, categories)
                return nameA.localeCompare(nameB, 'ru')
            }
            break
        case "category-z":
            mode = (a, b) => {
                const nameA = getNameById(a.categoryID, categories)
                const nameB = getNameById(b.categoryID, categories)
                return nameB.localeCompare(nameA, 'ru')
            }
            break
        case "type-a":
            mode = (a, b) => String(a.type).localeCompare(String(b.type), 'ru')
            break
        case "type-z":
            mode = (a, b) => String(b.type).localeCompare(String(a.type), 'ru')
            break
        case "amount-a":
            mode = (a, b) => Number(a.amount) - Number(b.amount)
            break
        case "amount-z":
            mode = (a, b) => Number(b.amount) - Number(a.amount)
            break
        default:
            mode = (a, b) => new Date(a.date) - new Date(b.date)
            break
    }

    return sort_transactions_massive.slice().sort(mode)
}

const saveAll = () => {
    localStorage.setItem('kaban_transactions', JSON.stringify(transactions));
    localStorage.setItem('kaban_accounts', JSON.stringify(accounts));
    localStorage.setItem('kaban_categories', JSON.stringify(categories));
};

//// ===============================================
//// =================== РЕНДЕР ====================
//// ===============================================

// Кастомные Легенды для диаграмм
const createCustomLegend = (chartInstance, legendContainerId) => {
    const container = document.getElementById(legendContainerId);
    if (!container) return;

    container.innerHTML = ""; // Сброс

    const dataset = chartInstance.data.datasets[0];
    const rawData = dataset.data;
    const labels = chartInstance.data.labels;

    // 1. Считаем сумму только видимых элементов для корректного пересчета процентов
    const totalVisibleSum = rawData.reduce((sum, value, index) => {
        return chartInstance.getDataVisibility(index) ? sum + value : sum;
    }, 0);

    labels.forEach((label, i) => {
        const val = rawData[i];
        const color = dataset.backgroundColor[i % dataset.backgroundColor.length];
        const isVisible = chartInstance.getDataVisibility(i);

        // Расчет процента от текущей видимой суммы
        const percent = totalVisibleSum > 0 && isVisible
            ? Math.round((val / totalVisibleSum) * 100)
            : 0;

        // Создаем DOM-структуру элемента легенды
        const legendItem = document.createElement("div");
        legendItem.className = `legend-item ${isVisible ? '' : 'hidden-segment'}`;

        // Левая часть (Маркер + Название)
        const leftDiv = document.createElement("div");
        leftDiv.className = "legend-left";

        const colorBox = document.createElement("span");
        colorBox.className = "legend-color-box";
        colorBox.style.backgroundColor = color;

        const labelText = document.createElement("span");
        labelText.textContent = label;

        leftDiv.appendChild(colorBox);
        leftDiv.appendChild(labelText);

        // Правая часть (Сумма + Процент)
        const rightDiv = document.createElement("div");
        rightDiv.className = "legend-right";

        const valSpan = document.createElement("span");
        valSpan.className = "legend-value";
        // Форматируем число (например: 15 300 ₽)
        valSpan.textContent = `${val.toLocaleString('ru-RU')} ₽`;

        const percentSpan = document.createElement("span");
        percentSpan.className = "legend-percent";
        percentSpan.textContent = `${percent}%`;

        rightDiv.appendChild(valSpan);
        rightDiv.appendChild(percentSpan);

        legendItem.appendChild(leftDiv);
        legendItem.appendChild(rightDiv);

        // --- ИНТЕРАКТИВНОСТЬ ---

        // Клик: Скрыть / Показать сектор
        legendItem.addEventListener("click", () => {
            chartInstance.toggleDataVisibility(i);
            chartInstance.update();
            // Перерисовываем легенду, чтобы пересчитать проценты для оставшихся категорий
            createCustomLegend(chartInstance, legendContainerId);
        });

        // Ховер мыши: Подсветить сектор на диаграмме
        legendItem.addEventListener("mouseenter", () => {
            if (!chartInstance.getDataVisibility(i)) return; // Игнорируем скрытые

            chartInstance.setActiveElements([{
                datasetIndex: 0,
                index: i,
            }]);
            chartInstance.tooltip.setActiveElements([{
                datasetIndex: 0,
                index: i,
            }], {
                x: chartInstance.chartArea.left + (chartInstance.chartArea.right - chartInstance.chartArea.left) / 2,
                y: chartInstance.chartArea.top + (chartInstance.chartArea.bottom - chartInstance.chartArea.top) / 2,
            });
            chartInstance.update();
        });

        // Уход мыши: Снять подсветку
        legendItem.addEventListener("mouseleave", () => {
            chartInstance.setActiveElements([]);
            chartInstance.tooltip.setActiveElements([], { x: 0, y: 0 });
            chartInstance.update();
        });

        container.appendChild(legendItem);
    });
};

// Функция отрисовки кольцевой диаграммы трат по категориям
const renderCategoriesChart = () => {
    const ctx = document.getElementById('categoriesChart');
    const legendContainer = document.getElementById('categoriesLegend');
    if (!ctx) return;

    // Сброс контейнера легенды
    if (legendContainer) legendContainer.innerHTML = "";

    const periodExpenses = transactions.filter(trans => {
        if (trans.type !== "expense") return false;
        if (trans.hidden) return false;

        if (currentMonth === "all") {
            return true;
        } else if (currentMonth.startsWith("year_")) {
            const selectedYear = currentMonth.replace("year_", "");
            return trans.date.startsWith(selectedYear);
        } else {
            return trans.date.startsWith(currentMonth);
        }
    });

    const categoryTotals = {};
    periodExpenses.forEach(trans => {
        const catName = getNameById(trans.categoryID, categories);
        categoryTotals[catName] = (categoryTotals[catName] || 0) + trans.amount;
    });

    const chartLabels = Object.keys(categoryTotals);
    const chartData = Object.values(categoryTotals);

    if (categoriesChartInstance) {
        categoriesChartInstance.destroy();
    }

    if (chartData.length === 0) {
        return;
    }

    const expenseColors = [
        '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1',
        '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#06b6d4',
        '#84cc16', '#a855f7', '#64748b'
    ];

    categoriesChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: expenseColors,
                borderWidth: 0,
                borderRadius: 4,
                spacing: 4,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // позволяет гибко настраивать размеры в CSS
            cutout: '80%',
            layout: {
                padding: 8 // Резервирует место по краям холста, чтобы hoverOffset не выходил за границы
            },
            plugins: {
                legend: {
                    display: false // 🔴 Выключаем стандартную легенду
                }
            }
        }, plugins: [centerTextPlugin]
    });

    // Генерация нашей кастомной внешней легенды
    createCustomLegend(categoriesChartInstance, 'categoriesLegend');
};

// Функция отрисовки кольцевой диаграммы структуры счетов с историческим балансом и обработкой минуса
const renderAccountsChart = () => {
    const ctx = document.getElementById('accountsChart');
    const legendContainer = document.getElementById('accountsLegend');
    if (!ctx) return;

    // Сброс контейнера легенды
    if (legendContainer) legendContainer.innerHTML = "";

    // 1. ОПРЕДЕЛЯЕМ КОНЕЧНУЮ ДАТУ ВЫБРАННОГО ПЕРИОДА
    let periodEndDate = null;
    if (currentMonth !== "all") {
        if (currentMonth.startsWith("year_")) {
            const year = currentMonth.replace("year_", "");
            periodEndDate = new Date(`${year}-12-31T23:59:59`);
        } else {
            // Формат currentMonth обычно "YYYY-MM" (например, "2026-07")
            const [year, month] = currentMonth.split("-").map(Number);
            // Получаем последний день выбранного месяца
            periodEndDate = new Date(year, month, 0, 23, 59, 59);
        }
    }

    // 2. РАССЧИТЫВАЕМ БАЛАНСЫ СЧЕТОВ НА КОНЕЦ ПЕРИОДА
    const accountsAtPeriod = accounts
        .filter(acc => acc.id !== 0 && !acc.isArchived) // Исключаем удаленный (0) и архивные
        .map(acc => {
            // Берем текущий реальный баланс счета за все время
            let historicalBalance = calcSumTransactions(acc.id, true);

            // Если выбран конкретный период, "откатываем" транзакции, совершенные ПОЗЖЕ этого периода
            if (periodEndDate && typeof transactions !== 'undefined' && Array.isArray(transactions)) {
                const postPeriodTransactions = transactions.filter(trans => {
                    const transDate = new Date(trans.date);
                    return trans.accountID === acc.id && transDate > periodEndDate;
                });

                postPeriodTransactions.forEach(trans => {
                    if (trans.type === "income") {
                        historicalBalance -= trans.amount; // Откатываем доход (вычитаем)
                    } else if (trans.type === "expense") {
                        historicalBalance += trans.amount; // Откатываем расход (прибавляем)
                    }
                });
            }

            return {
                id: acc.id,
                name: acc.name,
                balance: historicalBalance
            };
        });

    // Фильтруем счета с нулевым балансом, чтобы не перегружать диаграмму
    const activeAccounts = accountsAtPeriod.filter(acc => acc.balance !== 0);

    if (accountsChartInstance) {
        accountsChartInstance.destroy();
        accountsChartInstance = null;
    }

    if (activeAccounts.length === 0) {
        if (legendContainer) {
            legendContainer.innerHTML = "<p style='text-align:center; color:#94a3b8; padding: 10px;'>Нет активных счетов за этот период</p>";
        }
        return;
    }

    // 3. ПОДГОТОВКА ДАННЫХ С УЧЕТОМ ОТРИЦАТЕЛЬНЫХ ЗНАЧЕНИЙ
    const chartLabels = activeAccounts.map(acc => acc.name);

    // Передаем модули чисел (Math.abs) для построения пропорций секторов
    const chartData = activeAccounts.map(acc => Math.abs(acc.balance));

    // Набор цветов по умолчанию
    const defaultColors = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

    // Если баланс отрицательный, принудительно красим сектор в предупреждающий красный цвет (#ff6b6b)
    const backgroundColors = activeAccounts.map((acc, index) => {
        return acc.balance < 0 ? '#ff6b6b' : defaultColors[index % defaultColors.length];
    });

    // 4. ИНИЦИАЛИЗАЦИЯ CHART.JS
    accountsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: backgroundColors,
                borderWidth: 0,
                borderRadius: 4,
                spacing: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            layout: {
                padding: 8 // Резервирует место по краям холста, чтобы hoverOffset не выходил за границы
            },
            plugins: {
                legend: {
                    display: false // Выключаем стандартную легенду Chart.js
                },
                tooltip: {
                    callbacks: {
                        // Кастомный тултип: выводим оригинальное число с правильным знаком (+/-)
                        label: function (context) {
                            const index = context.dataIndex;
                            const account = activeAccounts[index];
                            const formatted = formatNumber(account.balance);
                            return ` ${account.name}: ${formatted} ₽`;
                        }
                    }
                }
            }
        }, plugins: [centerTextPlugin]
    });
    createCustomLegend(accountsChartInstance, 'accountsLegend');
};

// Отрисовка 10 последних транзакций для конкретного счета в попапе
const renderMinifiedAccountTransactions = (accId) => {
    const quickTableCont = document.getElementById("quickTableCont");
    if (!quickTableCont) return;

    // Фильтруем транзакции по ID счета и исключаем скрытые (hidden: true)
    const accountTrans = transactions.filter(trans => trans.accountID === accId && !trans.hidden);
    // 2. Если транзакций нет
    if (accountTrans.length === 0) {
        quickTableCont.innerHTML = "<p style='text-align: center; color: #94a3b8; padding-top: 40px;'>По этому счету еще нет транзакций</p>";
        return;
    }

    // 3. Сортируем по дате (от самых свежих к старым) и берем только первые 10
    const lastTenTrans = accountTrans
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    // 4. Генерируем компактную HTML-таблицу
    let miniTableHtml = `
        <table class="mini-history-table">
            <thead>
                <tr>
                    <th>Сумма</th>
                    <th>Категория</th>
                    <th>Дата</th>
                </tr>
            </thead>
            <tbody>
    `;

    lastTenTrans.forEach(trans => {
        // Подсвечиваем сумму в зависимости от типа (доход/расход)
        const amountClass = trans.type === "income" ? "acc-positive" : "acc-negative";
        const sign = trans.type === "income" ? "+" : "-";

        miniTableHtml += `
            <tr>
                <td class="${amountClass}" style="font-weight: bold;">
                    ${sign}${formatNumber(trans.amount)} ₽
                </td>
                <td style="color: #eeeeee;">${getNameById(trans.categoryID, categories)}</td>
                <td style="color: #94a3b8; font-size: 11px;">${formatDate(trans.date)}</td>
            </tr>
        `;
    });

    miniTableHtml += `
            </tbody>
        </table>
    `;

    quickTableCont.innerHTML = miniTableHtml;
};

// Отрисовка категорий в выпадающем меню формы — фильтруем по типу транзакции
const renderCategorySelectOptions = (filterType = "expense") => {
    const categorySelect = document.getElementById("inp_category");
    if (!categorySelect) return;

    let optionsHtml = "";

    categories
        .filter(cat => cat.id !== 0 && cat.type === filterType)
        .forEach(cat => {
            optionsHtml += `<option value="${cat.id}">${cat.name}</option>`;
        });

    categorySelect.innerHTML = optionsHtml;
};

// Функция отрисовки линейного графика капитала нарастающим итогом по месяцам
const renderCapitalChart = () => {
    const ctx = document.getElementById('capitalChart');
    if (!ctx) return;

    if (capitalChartInstance) {
        capitalChartInstance.destroy();
        capitalChartInstance = null;
    }

    if (transactions.length === 0) return;

    // 1. Собираем все уникальные месяцы, где были транзакции, и сортируем их
    const allMonths = transactions.map(trans => trans.date.slice(0, 7));
    const uniqueMonths = [...new Set(allMonths)].sort().slice(-12);

    if (uniqueMonths.length === 0) return;

    // 2. Рассчитываем капитал нарастающим итогом для каждого месяца
    // Баланс на конец конкретного месяца — это сумма ВСЕХ транзакций, которые произошли до конца этого месяца включительно.
    const capitalData = uniqueMonths.map(month => {
        let totalLimitDate = new Date(`${month}-31T23:59:59`); // приблизительный конец месяца для фильтрации
        if (isNaN(totalLimitDate.getTime())) {
            // подстраховка для месяцев с < 31 днями
            const [year, m] = month.split("-").map(Number);
            totalLimitDate = new Date(year, m, 0, 23, 59, 59);
        }

        let totalForMonth = 0;
        transactions.forEach(trans => {
            const transDate = new Date(trans.date);
            if (transDate <= totalLimitDate) {
                // Проверяем видимость счета, как в calcSumTransactions
                const acc = accounts.find(a => a.id === trans.accountID);
                if (acc && acc.visible !== false) {
                    if (trans.type === "income") {
                        totalForMonth += trans.amount;
                    } else {
                        totalForMonth -= trans.amount;
                    }
                }
            }
        });
        return Math.round(totalForMonth);
    });

    // Красивые названия месяцев для подписей (например, "Янв 2026")
    const chartLabels = uniqueMonths.map(month => formatMonthName(month));

    // 3. Создаем линейный график Chart.js
    capitalChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Капитал',
                data: capitalData,
                borderColor: '#00adb5',
                backgroundColor: 'rgba(0, 173, 181, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3, // Сглаживание линии
                pointBackgroundColor: '#00adb5',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Скрываем легенду, так как у нас один показатель
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ` Капитал: ${formatNumber(context.raw)} ₽`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { size: 10 }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: { size: 10 },
                        callback: function (value) {
                            return formatNumber(value) + ' ₽';
                        }
                    }
                }
            }
        }
    });
};

// Отрисовка счетов в выпадающем меню
const renderAccountSelectOptions = () => {
    const accountSelect = document.getElementById("inp_account");
    if (!accountSelect) return;

    let optionsHtml = "";
    accounts.forEach(acc => {
        if (acc.id === 0 || acc.isArchived) return; // ✅ Пропускаем "Удалено" и архивные
        optionsHtml += `<option value="${acc.id}">${acc.name} (${acc.type || 'Карта'})</option>`;
    });
    accountSelect.innerHTML = optionsHtml;
};

// Отрисовка таблицы с транзакциями
const renderHistoryTable = () => {
    if (!historyContainer) return;

    if (transactions.length === 0) {
        historyContainer.innerHTML = "<p id=transaction-non>У вас ещё нет транзакций</p>";
    } else {
        const startfilteredTransactions = transactions.filter(trans => {
            let matchesMonth = false;

            if (currentMonth === "all") {
                matchesMonth = true;
            } else if (currentMonth.startsWith("year_")) {
                const selectedYear = currentMonth.replace("year_", "");
                matchesMonth = trans.date.startsWith(selectedYear);
            } else {
                matchesMonth = trans.date.startsWith(currentMonth);
            }

            const matchesType = currentTypeFilter === "all" || trans.type === currentTypeFilter;
            return matchesMonth && matchesType;
        });

        const finalTrans = getSortedTransactions(startfilteredTransactions)

        let filteredTransactions = [];


        if (currentHidden) {
            filteredTransactions = finalTrans.filter(trans => !trans.hidden)
        } else {
            filteredTransactions = finalTrans
        }

        let tableHtml = `
        <table>
            <tr>
                <th data-sort="amount">Сумма ${azMode("amount")}</th>
                <th data-sort="type">Тип ${azMode("type")}</th>
                <th data-sort="category">Категория ${azMode("category")}</th>
                <th data-sort="acc">Счет ${azMode("acc")}</th>
                <th data-sort="date">Дата ${azMode("date")}</th>
                <th>Описание</th>
                <th></th>
            </tr>
        `;

        filteredTransactions.forEach(trans => {
            const hiddenClass = trans.hidden ? "hidden-transaction" : "";
            tableHtml += `
            <tr class="${hiddenClass}">
                <td contenteditable="true" data-id="${trans.id}" data-field="amount">${trans.amount}</td>
                <td contenteditable="false" data-id="${trans.id}" data-field="type">${typeToRu(trans.type)}</td>
                <td contenteditable="false" data-id="${trans.id}" data-field="category">${getNameById(trans.categoryID, categories)}</td>
                <td contenteditable="false" data-id="${trans.id}" data-field="account">${getNameById(trans.accountID, accounts)}</td>                
                <td contenteditable="false" data-id="${trans.id}" data-field="date">${formatDate(trans.date)}</td>
                <td contenteditable="true" data-id="${trans.id}" data-field="description">${escapeHtml(trans.description)}</td>
                <td data-id="${trans.id}" data-field="remove_btn" class="remove_btn">×</td>
            </tr>
            `;
        });

        tableHtml += "</table>";
        historyContainer.innerHTML = tableHtml;
    }
};

// Считает всю сумму транзакций и показывает
const renderTotalBalance = () => {
    if (transactions.length === 0) {
        totalBalance.textContent = 0;
    } else {
        let calcSum = calcSumTransactions();
        totalBalance.textContent = formatNumber(Math.floor(calcSum));
        if (calcSum > 0) {
            WinWord.textContent = ("Так держать!")
        } else {
            WinWord.textContent = ("Не вешай нос!")
        }
    }
};

// Функция отрисовки карточек счетов на вкладке "Счета"
const renderAccounts = () => {
    if (!accountsContainer) return;

    let accountsHtml = "";

    accounts.forEach(acc => {
        if (acc.id === 0) return; // Системный "Удалено" пропускаем всегда
        // Если режим архива выключен, пропускаем архивные счета
        if (!displayArchivedMode && acc.isArchived) return;

        let accountBalance = 0;
        if (typeof transactions !== 'undefined' && Array.isArray(transactions)) {
            accountBalance = calcSumTransactions(acc.id);
        }

        const archiveClass = acc.isArchived ? "archived-card" : "";
        const balanceClass = accountBalance >= 0 ? "acc-positive" : "acc-negative";

        accountsHtml += `
            <div class="account-card ${archiveClass}" data-id="${acc.id}">
                <div class="account-card-top">
                    <div class="account-type">${acc.type || "Карта"}</div>
                </div>
                <div class="account-card-middle">
                    <div class="account-name">${acc.name}</div>
                </div>
                <div class="account-card-bottom">
                    <div class="account-balance ${balanceClass}">${formatNumber(accountBalance)} ₽</div>
                </div>
            </div>
        `;
    });

    accountsContainer.innerHTML = accountsHtml;
};

// Отрисовка вкладок с месяцами
const renderMonthTabs = () => {
    const monthContainer = document.getElementById("month_tabs_container");
    const monthMainContainer = document.getElementById("month_tabs_main");

    // Если ни одного контейнера нет на странице, выходим
    if (!monthContainer && !monthMainContainer) return;

    let monthsHtml = "";

    if (transactions.length > 0) {
        const allMonths = transactions.map(trans => trans.date.slice(0, 7));
        const uniqueMonths = [...new Set(allMonths)].sort();

        const TargetGroup = {};
        uniqueMonths.forEach(month => {
            const year = month.slice(0, 4);
            if (!TargetGroup[year]) {
                TargetGroup[year] = [];
            }
            TargetGroup[year].push(month);
        });

        const sortedYears = Object.keys(TargetGroup).sort();

        sortedYears.forEach(year => {
            TargetGroup[year].forEach(month => {
                const activeClass = month === currentMonth ? "months-active" : "";
                monthsHtml += `<div class="months-element ${activeClass}" data-month="${month}">${formatMonthName(month)}</div>`;
            });

            const yearId = `year_${year}`;
            const activeYearClass = currentMonth === yearId ? "months-active" : "";
            monthsHtml += `<div class="months-element ${activeYearClass}" data-month="${yearId}">${year} год</div>`;
        });
    }

    const activeAll = currentMonth === "all" ? "months-active" : "";
    monthsHtml += `<div class="months-element ${activeAll}" data-month="all">За все время</div>`;

    // Записываем результат в оба контейнера, если они существуют
    if (monthContainer) monthContainer.innerHTML = monthsHtml;
    if (monthMainContainer) monthMainContainer.innerHTML = monthsHtml;
};

// считает и рендерит доходы и расходы в выбранном периоде
const renderIncomeExpense = () => {
    const finalTrans = transactions.filter(trans => {
        let matchesMonth = false;

        if (currentMonth === "all") {
            matchesMonth = true;
        } else if (currentMonth.startsWith("year_")) {
            const selectedYear = currentMonth.replace("year_", "");
            matchesMonth = trans.date.startsWith(selectedYear);
        } else {
            matchesMonth = trans.date.startsWith(currentMonth);
        }

        const matchesType = currentTypeFilter === "all" || trans.type === currentTypeFilter;
        return matchesMonth && matchesType;
    });

    let sumIncome = 0;
    let sumExpense = 0;

    // Фильтруем скрытые транзакции
    let filteredTransactions = finalTrans.filter(trans => !trans.hidden);

    filteredTransactions.forEach(trans => {
        if (trans.type === "income") {
            sumIncome += trans.amount;
        } else {
            sumExpense += trans.amount;
        }
    });

    // 1. Отрендерим на вкладке "История" (если элементы существуют)
    if (expenseContainer) {
        expenseContainer.innerHTML = `${formatNumber(sumExpense)} ₽`;
    }
    if (incomeContainer) {
        incomeContainer.innerHTML = `${formatNumber(sumIncome)} ₽`;
    }

    // 2. Отрендерим в новом виджете на "Главной" вкладке
    const mainIncomeVal = document.getElementById("main_income_val");
    const mainExpenseVal = document.getElementById("main_expense_val");

    if (mainIncomeVal) {
        mainIncomeVal.textContent = `${formatNumber(sumIncome)} ₽`;
    }
    if (mainExpenseVal) {
        mainExpenseVal.textContent = `${formatNumber(sumExpense)} ₽`;
    }
};



// Отрисовка всего
const updateAppUI = () => {
    renderTotalBalance();
    renderAccounts();
    renderHistoryTable();
    renderMonthTabs();
    renderAccountSelectOptions();
    // ✅ Передаём текущий тип из формы, чтобы категории отфильтровались правильно
    renderCategorySelectOptions(typeToCode(inpType.value));
    renderIncomeExpense();

    renderAccountsChart();
    renderCategoriesChart();
    renderCapitalChart();

    saveAll();
};

//// ===============================================
//// ================= ОБРАБОТЧИКИ =================
//// ==================== ОБЩЕЕ ====================

// Переключение вкладок
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navButtons.forEach(btn => btn.classList.remove('nav-active'));
        button.classList.add('nav-active');

        tabs.forEach(tab => tab.classList.remove('tab-active'));

        const targetTabId = button.getAttribute('data-tab');
        const targetTab = document.getElementById(targetTabId);

        if (targetTab) {
            targetTab.classList.add('tab-active');

            if (targetTabId === "tab_score") {
                renderAccounts();
            }
        }
        updateAppUI();
    });
});


//// ===============================================
//// ================= ОБРАБОТЧИКИ =================
//// =================== ИСТОРИЯ ===================

// Кнопка "Новая транзакция" на главной вкладке
if (openBtnMain) {
    openBtnMain.addEventListener('click', () => {
        popup.showModal();
        // Находим кнопку навигации, которая отвечает за историю
        const historyButton = Array.from(navButtons).find(btn => btn.getAttribute('data-tab') === 'tab_history');
        if (historyButton) {
            // Имитируем клик по ней, запускающий переключение вкладки
            historyButton.click();
        }
    });
}

// Открываем попап "Новая транзакция"
openBtn.addEventListener('click', () => {
    popup.showModal();
});

// Закрываем попап "Новая транзакция"
closeBtn.addEventListener('click', () => {
    popup.close();
});

// Отправка формы новой транзакции
transactionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const today = new Date().toISOString().split('T')[0];
    const selectedDate = inpDate.value ? inpDate.value : today;

    const foundCID = categories.find(elem => elem.id === Number(inpCategory.value));
    const foundAID = accounts.find(elem => elem.id === Number(inpAccount.value));

    const chosenCategoryId = foundCID ? foundCID.id : categories[0].id;
    const chosenAccountId = foundAID ? foundAID.id : accounts[0].id;

    const newTransaction = {
        id: Date.now(),
        amount: Number(inpAmount.value),
        type: typeToCode(inpType.value),
        categoryID: chosenCategoryId,
        accountID: chosenAccountId,
        date: selectedDate || Date.now(),
        description: inpDescription.value.trim() || "Без описания",
        hidden: inpHidden.checked
    };

    transactions.push(newTransaction);
    transactionForm.reset();
    popup.close();
    updateAppUI();
});

// ✅ При смене типа в форме — обновляем список категорий под нужный тип
inpType.addEventListener("change", () => {
    const selectedType = typeToCode(inpType.value);
    renderCategorySelectOptions(selectedType);
});

// Инлайн-редактирование текстовых ячеек таблицы
if (historyContainer) {
    historyContainer.addEventListener("blur", (event) => {
        if (event.target.tagName === 'TD') {
            const cell = event.target;
            const transId = Number(cell.getAttribute('data-id'));
            const fieldName = cell.getAttribute('data-field');
            let newValue = cell.textContent.trim();
            let oldTD = transactions.find(user => user.id === transId);

            // ✅ Защита — если транзакция не найдена, выходим
            if (!oldTD) return;

            if (fieldName === "amount") {
                const parsedAmount = Number(newValue);
                if (isNaN(parsedAmount)) {
                    cell.textContent = oldTD.amount;
                    updateAppUI();
                } else {
                    oldTD[fieldName] = Number(newValue);
                    updateAppUI();
                }
            } else {
                if (fieldName === "description" && newValue === "") {
                    oldTD[fieldName] = "Без описания";
                } else {
                    oldTD[fieldName] = newValue;
                }
                updateAppUI();
            }
        }
    }, true);
}

// Инлайн-редактирование категорий, счетов, типа и дат через <select> и <input>
if (historyContainer) {
    historyContainer.addEventListener("click", (event) => {

        const cell = event.target;
        // Ловил клик на шапку таблицы для изменнеия режима сортировки
        if (cell.tagName === 'TH') {
            const newSortMode = cell.getAttribute('data-sort');
            if (!newSortMode) return;

            if (!currentSort.startsWith(newSortMode)) {
                currentSort = newSortMode + "-a";
            } else if (currentSort.endsWith("-a")) {
                currentSort = newSortMode + "-z";
            } else {
                currentSort = newSortMode + "-a";
            }

            updateAppUI();
            return; // ← выходим, дальше не идём
        }

        if (cell.tagName === "TD") {
            const fieldName = cell.getAttribute("data-field");
            const transId = Number(cell.getAttribute("data-id"));

            // --- ДАТА ---
            // --- ДАТА ---
            if (fieldName === "date") {
                if (cell.querySelector("input")) return;

                const foundTrans = transactions.find(t => t.id === transId);
                if (!foundTrans) return;

                const input = document.createElement("input");
                input.type = "date";
                input.className = "table-edit-input";
                input.value = foundTrans.date;

                cell.innerHTML = "";
                cell.appendChild(input);
                input.focus();
                input.showPicker();

                input.addEventListener("change", () => {
                    if (input.value) {
                        foundTrans.date = input.value;
                    }
                    updateAppUI(); // ✅ перерисовка уберёт инпут
                });

                // ✅ Если кликнул мимо — просто перерисовываем, инпут пропадает
                input.addEventListener("blur", () => {
                    updateAppUI();
                });

                input.addEventListener("keydown", (e) => e.preventDefault());
                return;
            }

            // --- ТИП ---
            if (fieldName === "type") {
                if (cell.querySelector("select")) return;

                const foundTrans = transactions.find(t => t.id === transId);
                const currentType = foundTrans?.type;

                const select = document.createElement("select");
                select.className = "table-edit-select";

                select.innerHTML = `
                    <option value="income" ${currentType === "income" ? "selected" : ""}>Доход</option>
                    <option value="expense" ${currentType === "expense" ? "selected" : ""}>Расход</option>
                `;

                cell.innerHTML = "";
                cell.appendChild(select);
                select.focus();

                let changed = false; // ✅ Флаг — пользователь реально что-то выбрал

                select.addEventListener("change", () => {
                    changed = true;
                    select.blur(); // Закрываем после выбора
                });

                select.addEventListener("blur", () => {
                    if (changed && foundTrans) {
                        foundTrans.type = select.value;

                        const currentCategory = categories.find(cat => cat.id === foundTrans.categoryID);
                        const categoryMatchesNewType = currentCategory && currentCategory.type === select.value;

                        if (!categoryMatchesNewType) {
                            const firstMatchingCategory = categories.find(
                                cat => cat.id !== 0 && cat.type === select.value
                            );
                            foundTrans.categoryID = firstMatchingCategory ? firstMatchingCategory.id : 0;
                        }
                    }

                    updateAppUI(); // ✅ В любом случае перерисовываем — чтобы селект пропал
                });

                return;
            }

            // --- КАТЕГОРИЯ И СЧЁТ ---
            if (fieldName === "category" || fieldName === "account") {
                if (cell.querySelector("select")) return;

                const foundTrans = transactions.find(t => t.id === transId);

                const select = document.createElement("select");
                select.className = "table-edit-select";

                const optionsArray = fieldName === "category"
                    ? categories.filter(cat => cat.id !== 0 && cat.type === foundTrans?.type)
                    : accounts.filter(acc => acc.id !== 0);

                let optionsHtml = "";
                optionsArray.forEach(opt => {
                    const currentSavedId = fieldName === "category" ? foundTrans?.categoryID : foundTrans?.accountID;
                    const isSelected = opt.id === Number(currentSavedId) ? "selected" : "";
                    const displayName = fieldName === "account" && opt.type
                        ? `${opt.name} (${opt.type})`
                        : opt.name;
                    optionsHtml += `<option value="${opt.id}" ${isSelected}>${displayName}</option>`;
                });

                select.innerHTML = optionsHtml;

                cell.innerHTML = "";
                cell.appendChild(select);
                select.focus();

                let changed = false; // ✅ Флаг

                select.addEventListener("change", () => {
                    changed = true;
                    select.blur();
                });

                select.addEventListener("blur", () => {
                    if (changed && foundTrans) {
                        const newValue = Number(select.value);
                        const correctKey = fieldName === "category" ? "categoryID" : "accountID";
                        foundTrans[correctKey] = newValue;
                    }

                    updateAppUI(); // ✅ В любом случае перерисовываем — чтобы селект пропал
                });

                return;
            }
        }
    });
}

// Фильтр по месяцам (Вкладка История)
if (monthTabsContainer) {
    monthTabsContainer.addEventListener("click", (event) => {
        const clickedMethodBtn = event.target.closest('.months-element');
        if (!clickedMethodBtn) return;

        currentMonth = clickedMethodBtn.getAttribute('data-month');
        updateAppUI();
    });
}

// Фильтр по месяцам (Главная вкладка)
const monthTabsMain = document.getElementById("month_tabs_main");
if (monthTabsMain) {
    monthTabsMain.addEventListener("click", (event) => {
        const clickedMethodBtn = event.target.closest('.months-element');
        if (!clickedMethodBtn) return;

        currentMonth = clickedMethodBtn.getAttribute('data-month');
        updateAppUI();
    });
}

// Фильтр по типу транзакции
if (typeFilterContainer) {
    typeFilterContainer.addEventListener("click", (event) => {
        const clickedBtn = event.target.closest('.filter-btn');
        if (!clickedBtn) return;

        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('filter-active'));
        clickedBtn.classList.add('filter-active');

        currentTypeFilter = clickedBtn.getAttribute('data-type');
        renderHistoryTable();
    });
}

//// ===============================================
//// ================= ОБРАБОТЧИКИ =================
//// ==================== СЧЕТА ====================



let currentEditingAccountId = null;
// Открытие попапа счета по клику на карточку
if (accountsContainer && accountPopup) {
    accountsContainer.addEventListener('click', (event) => {
        const accountCard = event.target.closest('.account-card');

        if (accountCard) {
            const accId = Number(accountCard.dataset.id);
            currentEditingAccountId = accId; // Запоминаем, какой счет открыли

            // Находим данные этого счета из массива accounts
            const accountData = accounts.find(acc => acc.id === accId);

            if (accountData) {
                // 1. Считаем реальный текущий баланс счета
                let accountBalance = 0;
                if (typeof transactions !== 'undefined' && Array.isArray(transactions)) {
                    accountBalance = calcSumTransactions(accId, true); // игнорируем visible при подсчете баланса конкретного счета
                }

                // 2. Находим элементы внутри поп-апа счета
                const popName = document.getElementById('accPopup_name');
                const popBalance = document.getElementById('accPopup_balance');
                const popCurrency = document.getElementById('accPopup_currency');
                const popVisible = document.getElementById('accPopup_visible');

                // 3. Заполняем поп-ап данными
                if (popName) popName.textContent = accountData.name;

                // Для редактирования баланса лучше выводить чистое число (без пробелов-разделителей)
                if (popBalance) popBalance.textContent = accountBalance;

                if (popCurrency) popCurrency.value = accountData.currency || "RUB";

                if (popVisible) {
                    popVisible.checked = accountData.visible !== false;
                }

                if (accPopupDeleteBtn) {
                    accPopupDeleteBtn.textContent = accountData.isArchived
                        ? "Вернуть из архива"
                        : "Удалить счет";        // ✅ теперь текст меняется динамически
                }

                const transferTargetSelect = document.getElementById('accPopup_transfer_target');
                if (transferTargetSelect) {
                    let transferOptionsHtml = '<option value="" disabled selected>Куда...</option>';

                    accounts.forEach(acc => {
                        // Исключаем системный (0), архивные и тот счет, который сейчас редактируем (accId)
                        if (acc.id !== 0 && !acc.isArchived && acc.id !== accId) {
                            transferOptionsHtml += `<option value="${acc.id}">${acc.name}</option>`;
                        }
                    });

                    transferTargetSelect.innerHTML = transferOptionsHtml;
                }
                // Очищаем поле ввода суммы перевода от прошлых открытий
                const transferAmountInput = document.getElementById('accPopup_transfer_amount');
                if (transferAmountInput) transferAmountInput.value = "";

                renderMinifiedAccountTransactions(accId);
                // Открываем попап
                accountPopup.showModal();
            }
        }
    });
}

// Закрытие попапа счета
const accCloseBtn = document.getElementById("accCloseBtn");
if (accCloseBtn) {
    accCloseBtn.addEventListener('click', () => {
        accountPopup.close();
        currentEditingAccountId = null;
    });
}

// Обработчик кнопки совершения перевода внутри попапа счета
const accPopupTransferBtn = document.getElementById("accPopup_transfer_btn");
if (accPopupTransferBtn) {
    accPopupTransferBtn.addEventListener('click', () => {
        if (currentEditingAccountId === null) return;

        const amountInput = document.getElementById('accPopup_transfer_amount');
        const targetSelect = document.getElementById('accPopup_transfer_target');

        const amount = Number(amountInput.value);
        const targetAccountId = Number(targetSelect.value);

        // Валидация входных данных
        if (!amount || amount <= 0) {
            alert("Пожалуйста, введите корректную сумму перевода.");
            return;
        }
        if (!targetAccountId) {
            alert("Пожалуйста, выберите счет для получения перевода.");
            return;
        }

        const sourceAccount = accounts.find(acc => acc.id === currentEditingAccountId);
        const targetAccount = accounts.find(acc => acc.id === targetAccountId);

        if (!sourceAccount || !targetAccount) return;

        const today = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();

        // 1. Создаем транзакцию списания со счета-отправителя
        const expenseTransaction = {
            id: timestamp,
            amount: amount,
            type: "expense",
            categoryID: 0, // Системная заглушка "Удалено"
            accountID: currentEditingAccountId,
            date: today,
            description: `Перевод на счет: ${targetAccount.name}`,
            hidden: true // Скрываем из общей таблицы
        };

        // 2. Создаем транзакцию зачисления на счет-получатель
        const incomeTransaction = {
            id: timestamp + 1, // Гарантируем уникальный ID
            amount: amount,
            type: "income",
            categoryID: 0,
            accountID: targetAccountId,
            date: today,
            description: `Перевод со счета: ${sourceAccount.name}`,
            hidden: true // Скрываем из общей таблицы
        };

        // Добавляем обе транзакции в базу данных
        transactions.push(expenseTransaction, incomeTransaction);

        // Обновляем UI приложения (балансы пересчитаются автоматически)
        updateAppUI();

        // Очищаем поля формы перевода после успешного выполнения
        amountInput.value = "";
        targetSelect.value = "";

        // Обновляем мини-таблицу в текущем попапе, чтобы сразу увидеть изменение
        renderMinifiedAccountTransactions(currentEditingAccountId);

        // Динамически обновляем поле редактирования текущего баланса в попапе
        const popBalance = document.getElementById('accPopup_balance');
        if (popBalance) {
            popBalance.textContent = calcSumTransactions(currentEditingAccountId, true);
        }

        console.log(`Успешный перевод: ${amount} руб. из "${sourceAccount.name}" в "${targetAccount.name}"`);
    });
}

// Кнопка "Сохранить" изменения в счете
const accPopupSaveBtn = document.getElementById("accPopup_save");
if (accPopupSaveBtn) {
    accPopupSaveBtn.addEventListener('click', () => {
        if (currentEditingAccountId === null) return;

        const accountData = accounts.find(acc => acc.id === currentEditingAccountId);
        if (!accountData) return;

        const popName = document.getElementById('accPopup_name');
        const popBalance = document.getElementById('accPopup_balance');
        const popCurrency = document.getElementById('accPopup_currency');
        const popVisible = document.getElementById('accPopup_visible');

        // 1. Обновляем текстовые свойства
        if (popName) accountData.name = popName.textContent.trim() || accountData.name;
        if (popCurrency) accountData.currency = popCurrency.value;
        if (popVisible) accountData.visible = popVisible.checked;

        // 2. Обновляем баланс (через создание корректирующей транзакции)
        if (popBalance) {
            const enteredBalance = Number(popBalance.textContent.replace(/\s/g, '').replace(',', '.')); // убираем пробелы
            if (!isNaN(enteredBalance)) {
                const currentBalance = calcSumTransactions(currentEditingAccountId, true);
                const difference = enteredBalance - currentBalance;

                // Если баланс изменился, создаем техническую транзакцию
                if (difference !== 0) {
                    const today = new Date().toISOString().split('T')[0];
                    const adjustmentTransaction = {
                        id: Date.now(),
                        amount: Math.abs(difference),
                        type: difference > 0 ? "income" : "expense",
                        categoryID: 0, // Категория "Удалено" / системная
                        accountID: currentEditingAccountId,
                        date: today,
                        description: `Корректировка баланса счета: ${accountData.name}`,
                        hidden: true // Скрываем из общей таблицы транзакций
                    };
                    transactions.push(adjustmentTransaction);
                }
            }
        }

        updateAppUI();
        accountPopup.close();
        currentEditingAccountId = null;
        console.log("Данные счета сохранены:", accountData);
    });
}

// Кнопка "Удалить/Восстановить счет"
if (accPopupDeleteBtn) {
    // Меняем текст кнопки динамически при открытии поп-апа (это делается в обработчике клика на карточку):
    // Находим место открытия поп-апа (accountsContainer.addEventListener('click', ...))
    // И перед accountPopup.showModal() пишем:
    // accPopupDeleteBtn.textContent = accountData.isArchived ? "Вернуть из архива" : "Удалить счет";

    accPopupDeleteBtn.addEventListener('click', () => {
        if (currentEditingAccountId === null) return;

        const accountData = accounts.find(acc => acc.id === currentEditingAccountId);
        if (!accountData) return;

        if (accountData.isArchived) {
            // Если он в архиве — достаем
            accountData.isArchived = false;
            console.log("Счет восстановлен из архива:", accountData);
        } else {
            // Если активен — отправляем в архив
            if (confirm(`Вы уверены, что хотите перенести счет "${accountData.name}" в архив?`)) {
                accountData.isArchived = true;
                console.log("Счет отправлен в архив:", accountData);
            }
        }

        updateAppUI();
        accountPopup.close();
        currentEditingAccountId = null;
    });
}

// Открытие попапа нового счета
if (openScoreBtn && scorePopup) {
    openScoreBtn.addEventListener('click', () => {
        scorePopup.showModal();
    });
}

// Закрытие попапа нового счета
if (closeScoreBtn && scorePopup) {
    closeScoreBtn.addEventListener('click', () => {
        scorePopup.close();
    });
}

// Отправка формы нового счета
if (scoreForm) {
    scoreForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameInput = document.getElementById('inp_score_name');
        const typeSelect = document.getElementById('inp_score_type');
        const balanceInput = document.getElementById('inp_score_balance');

        const accountId = Date.now();
        const accountName = nameInput.value.trim();
        const initialBalance = Number(balanceInput.value) || 0;

        const newAccount = {
            id: accountId,
            name: accountName,
            type: typeSelect.value,
            currency: "RUB",
            visible: true,
            isArchived: false
        };

        // 1. Добавляем счет в массив счетов
        accounts.push(newAccount);

        // 2. Если пользователь ввел начальный баланс, создаем скрытую транзакцию
        if (initialBalance !== 0) {
            const today = new Date().toISOString().split('T')[0]; // Текущая дата в формате YYYY-MM-DD

            const systemTransaction = {
                id: Date.now() + 1, // Гарантируем уникальность ID транзакции
                amount: Math.abs(initialBalance),
                // Если баланс положительный — это доход, если отрицательный — расход
                type: initialBalance >= 0 ? "income" : "expense",
                categoryID: 0, // Без категории (заглушка "Удалено")
                accountID: accountId, // Привязываем к новосозданному счету
                date: today,
                description: `Создание счета ${accountName}`,
                hidden: true // Скрытая транзакция
            };

            transactions.push(systemTransaction);
        }

        // Обновляем интерфейс и локальное хранилище
        updateAppUI();

        // Сбрасываем форму и закрываем поп-ап
        scoreForm.reset();
        scorePopup.close();
        console.log("Новый счет успешно добавлен:", newAccount);
    });
}

// Удаление транзакции по клику на крестик
if (historyContainer) {
    historyContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove_btn")) {
            const transId = Number(event.target.getAttribute("data-id"));

            if (confirm("Вы уверены, что хотите удалить эту транзакцию?")) {
                const index = transactions.findIndex(item => item.id === transId);

                if (index !== -1) {
                    transactions.splice(index, 1);
                    updateAppUI();
                    console.log(`Транзакция ${transId} успешно удалена.`);
                }
            }
        }
    });
}

// кнопка, нужно доделать
if (showArchiveBtn) {
    showArchiveBtn.addEventListener('click', () => {
        displayArchivedMode = !displayArchivedMode;

        if (displayArchivedMode) {
            showArchiveBtn.textContent = "Скрыть архив";
            showArchiveBtn.style.backgroundColor = "#ff6b6b";
        } else {
            showArchiveBtn.textContent = "Архив счетов";
            showArchiveBtn.style.backgroundColor = "#393e46";
        }
        renderAccounts(); // Перерисовываем сетку карточек
    });
}

//// ===============================================
//// ================= ОБРАБОТЧИКИ =================
//// ================== НАСТРОЙКИ ==================

const accChoice = document.getElementById("acc-choice")
const transChoice = document.getElementById("trans-choice")
const langChoice = document.getElementById("lang-choice")


// Показывать или прятать архивные счета, в настройках
accChoice.addEventListener("change", (event) => {
    const optionValue = event.target.value

    if (optionValue === "show") {
        displayArchivedMode = true
    } else {
        displayArchivedMode = false
    }
    console.log(displayArchivedMode)
    updateAppUI();
})

// Показывать или прятать скрытые транзакции, в настройках
transChoice.addEventListener("change", (event) => {
    const optionValue = event.target.value

    if (optionValue === "show") {
        currentHidden = false
    } else {
        currentHidden = true
    }
    console.log(currentHidden)
    updateAppUI();
})

// Выбор языка, в настройках
langChoice.addEventListener("change", (event) => {
    const optionValue = event.target.value

    if (optionValue === "ru") {
        lang = "ru"
    } else {
        lang = "eng"
    }
    console.log(lang)
    updateAppUI();
})


// 2. Обновляем переменную при каждом вводе
pElement.addEventListener('blur', () => {
    userName = pElement.textContent;
    helloWord.textContent = `Приветствую, ${userName}`;
    localStorage.setItem('kaban_username', JSON.stringify(userName));
});

// 3. (Опционально) Обработка Enter — чтобы не создавались новые строки <br>
pElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Запрещаем перенос строки
        pElement.blur();    // Снимаем фокус (завершаем редактирование)
    }
});

//// ================= МЕНЕДЖЕР КАТЕГОРИЙ =================

const categoryPopup = document.getElementById('categoryPopup');
const openCategoryBtn = document.getElementById('openCategoryBtn');
const closeCategoryBtn = document.getElementById('closeCategoryBtn');
const addCategoryForm = document.getElementById('addCategoryForm');
const categoryListContainer = document.getElementById('category_list_container');
const categoryTypeTabs = document.getElementById('category-type-tabs');

let currentCategoryType = "expense"; // По умолчанию редактируем расходы

// 1. Функция отрисовки списка категорий в попапе
const renderCategoryManagerList = () => {
    if (!categoryListContainer) return;

    // Фильтруем категории (исключаем системную с id === 0)
    const activeCategories = categories.filter(cat => cat.id !== 0 && cat.type === currentCategoryType);

    if (activeCategories.length === 0) {
        categoryListContainer.innerHTML = `<p style="text-align:center; color:#94a3b8; padding:10px;">Категорий пока нет</p>`;
        return;
    }

    let html = "";
    activeCategories.forEach(cat => {
        html += `
            <div class="category-item" data-id="${cat.id}">
                <input type="text" class="category-name-input" value="${escapeHtml(cat.name)}" data-id="${cat.id}">
                <div class="category-actions">
                    <span class="cat-del-btn" data-id="${cat.id}" title="Удалить">×</span>
                </div>
            </div>
        `;
    });

    categoryListContainer.innerHTML = html;
};

// 2. Открытие / Закрытие попапа
if (openCategoryBtn && categoryPopup) {
    openCategoryBtn.addEventListener('click', () => {
        renderCategoryManagerList();
        categoryPopup.showModal();
    });
}

if (closeCategoryBtn && categoryPopup) {
    closeCategoryBtn.addEventListener('click', () => {
        categoryPopup.close();
    });
}

// 3. Переключение табов "Расходы / Доходы" внутри попапа
if (categoryTypeTabs) {
    categoryTypeTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat-type]');
        if (!btn) return;

        categoryTypeTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
        btn.classList.add('filter-active');

        currentCategoryType = btn.getAttribute('data-cat-type');
        renderCategoryManagerList();
    });
}

// 4. Добавление новой категории
if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('inp_category_name');
        const name = input.value.trim();

        if (!name) return;

        const newCategory = {
            id: Date.now(), // Уникальный ID
            name: name,
            type: currentCategoryType
        };

        categories.push(newCategory);
        input.value = "";

        renderCategoryManagerList();
        updateAppUI(); // Обновляем селекты и интерфейс приложения
    });
}

// 5. Редактирование названия и Удаление категории (через делегирование событий)
if (categoryListContainer) {
    // Сохранение переименования при потере фокуса (blur)
    categoryListContainer.addEventListener('focusout', (e) => {
        if (e.target.classList.contains('category-name-input')) {
            const catId = Number(e.target.getAttribute('data-id'));
            const newName = e.target.value.trim();
            const cat = categories.find(c => c.id === catId);

            if (cat && newName && cat.name !== newName) {
                cat.name = newName;
                updateAppUI(); // Перерисовываем графики, таблицы и легенды
            }
        }
    });

    // Удаление категории
    categoryListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cat-del-btn')) {
            const catId = Number(e.target.getAttribute('data-id'));
            const cat = categories.find(c => c.id === catId);

            if (!cat) return;

            if (confirm(`Удалить категорию "${cat.name}"?\nВсе транзакции с этой категорией получат статус "Удалено".`)) {
                // Перевязываем транзакции этой категории на системную категорию 0 ("Удалено")
                transactions.forEach(t => {
                    if (t.categoryID === catId) {
                        t.categoryID = 0;
                    }
                });

                // Удаляем саму категорию из массива
                const index = categories.findIndex(c => c.id === catId);
                if (index !== -1) {
                    categories.splice(index, 1);
                }

                renderCategoryManagerList();
                updateAppUI();
            }
        }
    });
}

// -------- удаление данных

// Находим кнопку сброса данных
const resetAllDataBtn = document.getElementById('button_delete');

if (resetAllDataBtn) {
    resetAllDataBtn.addEventListener('click', () => {
        // 1. Показываем предупреждающее окно подтверждения
        const isConfirmed = confirm(
            "⚠️ ВНИМАНИЕ!\n\nВы действительно хотите удалить все данные?\nЭто действие сбросит все счета, транзакции и категории к исходным настройкам и очистит память браузера. Отменить это действие невозможно."
        );

        // 2. Если пользователь подтвердил действие
        if (isConfirmed) {
            // Очищаем локальное хранилище браузера (localStorage)
            localStorage.clear(); 
            // Или, если в localStorage есть другие ключи приложения, которые нельзя удалять, 
            // удаляй точечно:
            // localStorage.removeItem('transactions');
            // localStorage.removeItem('categories');
            // localStorage.removeItem('accounts');

            // 3. Откатываем рабочие массивы к дефолтным значениям (глубокое копирование)
            accounts = JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
            categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
            transactions = JSON.parse(JSON.stringify(DEFAULT_TRANSACTIONS));

            // 4. Сохраняем дефолтные данные в localStorage (если твое приложение оттуда их читает)
            localStorage.setItem('accounts', JSON.stringify(accounts));
            localStorage.setItem('categories', JSON.stringify(categories));
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // 5. Перерисовываем интерфейс приложения
            updateAppUI(); // Перерисовка графиков, балансов, списков
            
            // Если менеджер категорий сейчас открыт — обновляем и его список
            if (typeof renderCategoryManagerList === 'function') {
                renderCategoryManagerList();
            }

            // Уведомление об успешном сбросе
            alert("Все данные успешно сброшены к начальным настройкам.");
        }
    });
}

//// ================= ЗАПУСК ПРИ СТАРТЕ =================

updateAppUI();
