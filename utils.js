//// ================= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =================

// Защита от XSS — экранирует спецсимволы HTML
export const escapeHtml = (text) => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
};

// Переводит русский текст из формы → код для хранения
export const typeToCode = (ruText) => {
    if (ruText === "Доход") return "income";
    if (ruText === "Расход") return "expense";
    return "expense";
};

// Переводит код из хранилища → русский текст для отображения
export const typeToRu = (code) => {
    if (code === "income") return "Доход";
    if (code === "expense") return "Расход";
    return "[Неизвестно]";
};

// Получает имя категории или счета по ID
export const getNameById = (itemID, where) => {
    const foundItem = where.find(elem => elem.id === itemID);
    return foundItem ? foundItem.name : "[Неизвестно]";
};

// Форматирует число с пробелами — 1234567 → "1 234 567"
export const formatNumber = (number) => {
    return new Intl.NumberFormat('ru-RU').format(number);
};

// Превращает "2026-02" → "Февраль 2026"
export const formatMonthName = (monthString) => {
    const [year, month] = monthString.split('-');
    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Превращает "2026-02-15" → "15.02.2026"
export const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
};

// Кастомный плагин для отрисовки общей суммы по центру пончика
export const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        const { ctx, chartArea: { left, top, right, bottom } } = chart;
        
        // 1. Считаем сумму только активных (видимых) секторов
        const dataset = chart.data.datasets[0];
        const totalVisible = dataset.data.reduce((sum, value, index) => {
            return chart.getDataVisibility(index) ? sum + value : sum;
        }, 0);

        // Если сумма нулевая или все скрыто, ничего не пишем
        if (totalVisible === 0) return;

        ctx.save();
        
        // 2. Настройка шрифтов и цвета текста
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;

        // Вспомогательный текст сверху
        ctx.font = '500 11px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8'; // серый цвет (slate-400)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ВСЕГО', centerX, centerY - 12);

        // Основное число (сумма)
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillStyle = '#eeeeee'; // белый/светлый цвет текста
        
        // Форматируем число с разделением тысяч (например, "15 300 ₽")
        const formattedTotal = `${Math.round(totalVisible).toLocaleString('ru-RU')} ₽`;
        ctx.fillText(formattedTotal, centerX, centerY + 10);
        
        ctx.restore();
    }
};