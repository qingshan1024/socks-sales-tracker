let records = [];

function loadRecords() {
    const savedRecords = localStorage.getItem('sockSalesRecords');
    if (savedRecords) {
        records = JSON.parse(savedRecords);
    }
    updateDisplay();
}

function saveRecords() {
    localStorage.setItem('sockSalesRecords', JSON.stringify(records));
}

function updateDisplay() {
    updateStats();
    updateTable();
}

function updateStats() {
    const totalQuantity = records.reduce((sum, record) => sum + record.quantity, 0);
    const totalPrice = records.reduce((sum, record) => sum + record.price, 0);
    
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function updateTable() {
    const tbody = document.getElementById('recordsBody');
    tbody.innerHTML = '';
    
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-message">暂无销售记录</td></tr>';
        return;
    }
    
    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="日期">${record.date}</td>
            <td data-label="数量">${record.quantity} </td>
            <td data-label="价格">${record.price.toFixed(2)} </td>
            <td data-label="操作"><button class="btn-delete" onclick="deleteRecord(${index})">删除</button></td>
        `;
        tbody.appendChild(row);
    });
}

function addRecord(date, quantity, price) {
    records.push({
        date: date,
        quantity: quantity,
        price: price
    });
    saveRecords();
    updateDisplay();
}

function deleteRecord(index) {
    if (confirm('确定要删除这条记录吗？')) {
        records.splice(index, 1);
        saveRecords();
        updateDisplay();
    }
}

function clearAllRecords() {
    if (confirm('确定要清空所有记录吗？此操作不可恢复！')) {
        records = [];
        saveRecords();
        updateDisplay();
    }
}

function exportToJSON() {
    if (records.length === 0) {
        alert('没有记录可以导出！');
        return;
    }
    
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `袜子销售记录_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportToCSV() {
    if (records.length === 0) {
        alert('没有记录可以导出！');
        return;
    }
    
    const headers = ['日期', '数量（双）', '价格（元）'];
    const rows = records.map(record => [record.date, record.quantity, record.price.toFixed(2)]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `袜子销售记录_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('saleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    
    if (date && quantity > 0 && price >= 0) {
        addRecord(date, quantity, price);
        this.reset();
        
        document.getElementById('date').valueAsDate = new Date();
    }
});

document.getElementById('clearAll').addEventListener('click', clearAllRecords);

document.getElementById('exportJSON').addEventListener('click', exportToJSON);

document.getElementById('exportCSV').addEventListener('click', exportToCSV);

document.getElementById('quickAdd').addEventListener('click', function() {
    const today = new Date().toISOString().split('T')[0];
    const quantity = prompt('请输入销售数量（双）：', '1');
    const price = prompt('请输入价格（元）：', '10');
    
    if (quantity && price) {
        const qty = parseInt(quantity);
        const prc = parseFloat(price);
        
        if (qty > 0 && prc >= 0) {
            addRecord(today, qty, prc);
            alert('添加成功！');
        } else {
            alert('请输入有效的数量和价格！');
        }
    }
});

window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('date').valueAsDate = new Date();
    loadRecords();
});